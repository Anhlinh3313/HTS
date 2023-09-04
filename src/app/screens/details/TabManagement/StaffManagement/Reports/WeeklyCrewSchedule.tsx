import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../../assets";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ItemServiceTeam from "./items/itemServiceTeam";
import { Table, Row } from "react-native-table-component";
import ModalSendEmail from "../../../../../components/ModalSendEmail";
import ModalPicker from "../../../../../components/management/ModalPicker";
import SendSuccess from "../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../components/modalNotification/SendFail";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Dash from "react-native-dash";
import { StaffService, ReportStaffService, MailStaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import { IStaff, IHourService, InitHourService, IPicker, initDataPicker, IStaffInfoByRecordArea } from "../../../../../models/staffModel";
import DatePickerUnderLine from "../../../../../components/DatePickerUnderLine";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
import { getMonday } from "../../../../../components/generalConvert/conVertMonDay";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabManageParamList } from "../../../../../types";
import DropDown from "../../../../../components/dropDown/DropDown";
import { Imodel } from "../../../../../models/Imodel";
export interface Props {
  route: RouteProp<TabManageParamList, "Reports">;
  navigation: StackNavigationProp<TabManageParamList>;
}
const WeeklyCrewSchedule = (props: { props: Props }) => {
  const { params } = props.props.route
  const workingTimes = useSelector((state: RootState) => state.staff.workingTimes);
  const record_area = useSelector((state: RootState) => state.staff.record_area);
  const staffs = useSelector((state: RootState) => state.staff.staffs);
  const reports = useSelector((state: RootState) => state.reports);
  const toDate = new Date();

  const [isLoading, setIsLoading] = useState(false);

  const tableHead = [];
  const tableRow = [];
  const widthArr = [];
  workingTimes.map(item => {
    tableHead.push(item.timeRange.slice(0, 5));
    tableRow.push("-");
    widthArr.push(50);
  });

  const [modalSendMail, setModalSendMail] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD 00:00:00"));

  const [showPickerStore, setShowPickerStore] = useState(false);
  const [valueStore, setValueStore] = useState<IPicker>(initDataPicker);
  const [showPickerTeam, setShowPickerTeam] = useState(false);
  const [valueTeam, setValueTeam] = useState<IPicker>(initDataPicker);

  const [dataHourService, setDataHourService] = useState<IHourService>(InitHourService);
  const [dataHourServiceInWeek, setDataHourServiceInWeek] = useState<IHourService[]>([]);
  const [listStaff, setListStaff] = useState<IStaffInfoByRecordArea[]>([]);

  const [recordAreas, setRecordAreas] = useState<IPicker[]>([]);
  const [tempStaffs, setTempStaffs] = useState<IStaff[]>([]);


  const [daySelect, setDaySelect] = useState<Imodel>({
    label: moment(getMonday(toDate)).format("dddd (DD-MM-YYYY)"),
    value: +getMonday(toDate)
  });
  function getDaysArray(start: Date, end: Date) {
    let arr = [];
    for (let dt = start; new Date(dt) <= end; dt.setDate(dt.getDate() + 1)) {
      arr.push({ value: +new Date(dt), label: moment(new Date(dt)).format("dddd (DD-MM-YYYY)") });
    }
    return arr;
  }
  const [weekDays, setWeekDays] = useState<Imodel[]>([]);

  const handleSubmitWorking = async () => {
    let req = [];
    tempStaffs.map(staff => {
      if (staff.edited) {
        let listWorking = [];
        staff.workingScheduleData.map(item => {
          if (item.WorkingWeekTime !== null || item.LegendId !== null) {
            listWorking.push(item);
          }
        });
        req.push({ StaffId: staff.id, WorkingScheduleData: listWorking });
      }
    });
    const res = await StaffService.createWorking(req);
    if (res.isSuccess == 1 && res.data) {
      return true;
    } else {
      return false;
    }
  };
  const handleSendMail = async (description: string, email: string) => {
    let submit = false;
    if (params?.data) {
      submit = await handleSubmitWorking();
    } else {
      submit = true;
    }
    if (submit) {
      setModalSendMail(!modalSendMail);
      setIsLoading(true);
      const res = await MailStaffService.sendMailWeeklyCrewsCheduleAndOTForecastSample(
        moment(getMonday(new Date())).format("YYYY-MM-DD HH:mm:ss"),
        description,
        email
      );
      setIsLoading(false);
      if (res.isSuccess == 1 && res.data) {
        setSent("success");
        setStatusSent("Email sent successfully!");
      } else {
        setSent("fail");
        setStatusSent("Email sent failed!");
      }
    } else {
      setSent("fail");
      setStatusSent("Schedule work failed!");
    }
  };
  const loadHourStore = async () => {
    const res = await ReportStaffService.getHourStoreService(moment(daySelect.value).format("YYYY-MM-DD 00:00:00"), valueStore.id);
    if (res.isSuccess == 1 && res.data.length > 0) {
      setDataHourService(res.data[0]);
    }
  };
  const loadStaffByRecordArea = async () => {
    setIsLoading(true);
    const res = await ReportStaffService.getStaffByRecordArea(valueTeam.id);
    if (res.isSuccess == 1 && res.data) {
      if (res.data.length > 0) {
        setListStaff(res.data);
        const memberInfos = res.data.map(async t => await loadWeeklyDynamicCrewScheduleByStaff(t.staffId, res.data));
        const result: IStaffInfoByRecordArea[] = await Promise.all(memberInfos);
        setListStaff(result);
      } else {
        setListStaff([]);
      }
    }
    setIsLoading(false);
  };

  const loadWeeklyDynamicCrewScheduleByStaff = async (staffId: number, data: IStaffInfoByRecordArea[]) => {
    const res = await ReportStaffService.getWeeklyDynamicCrewScheduleByStaff(staffId, moment(daySelect.value).format("YYYY-MM-DD 00:00:00"), valueTeam.id);
    if (res.isSuccess == 1 && res.data) {
      let index = data.findIndex(i => i.staffId == staffId);
      if (res.data.length > 0) {
        let list = [...data];
        if (index !== -1) {
          let dataTable = [...tableRow];
          list[index] = res.data[0];
          let datahandle = list[index].staffWorkingDay[0].staffWorkingDayTimeData;
          let tempCheckSplitTime = 0;
          datahandle.map((item, index) => {
            if (item.isOT) {
              dataTable[item.workingTimeId - 1] = "OT";
            } else {
              dataTable[item.workingTimeId - 1] = "N";
            }

            // ui hiển thị thiếu giờ cuối cùng của mảng
            if (index == datahandle.length - 1) {
              dataTable[datahandle[index].workingTimeId] = dataTable[datahandle[index].workingTimeId - 1];
            }
            if (index == 0) {
              tempCheckSplitTime = item.workingTimeId + 2
            } else {
              if (item.workingTimeId + 1 !== tempCheckSplitTime) {
                dataTable[tempCheckSplitTime - 2] = dataTable[tempCheckSplitTime - 3];
              } else {
                tempCheckSplitTime = item.workingTimeId + 2
              }
            }
          });
          list[index].dataTable = dataTable;
          return list[index];
        }
      } else {
        return data[index];
      }
    }
  };



  useEffect(() => {
    if (params.data === undefined) { loadHourStore(); }
  }, [valueStore, daySelect.value]);
  useEffect(() => {
    if (params.data === undefined) { loadStaffByRecordArea(); }
  }, [valueTeam, daySelect.value]);
  useEffect(() => {
    if (params.data === undefined) {
      let _arrDays = getDaysArray(new Date(moment(reports.fromDate).format("YYYY-MM-DD")), new Date(moment(reports.endDate).format("YYYY-MM-DD")))
      setWeekDays(_arrDays);
      setDaySelect(_arrDays[0]);
    }
  }, [reports]);
  useEffect(() => {
    setRecordAreas(record_area);
    setValueStore(record_area[0]);
    setValueTeam(record_area[0]);
    if (params?.data) {
      setTempStaffs(staffs) // lưu lại staffs để comfirm
      setValueStore(params.data.valueRecordArea);
      setValueTeam(params.data.valueRecordArea);
      let _arrDays = getDaysArray(new Date(moment(params.data.fromDateTime).format("YYYY-MM-DD")), new Date(moment(params.data.endDateTime).format("YYYY-MM-DD")))
      setWeekDays(_arrDays);
      setDaySelect(_arrDays[0]);
      let listStaffParam = []

      let _dataHour: IHourService[] = Array.from({ length: 7 }).map(_ => ({
        totalHoureWorking: 0,
        totalHoureWorkingOT: 0,
        totalHoure: 0,
      }));
      staffs.map(item => {
        let _staffWorkingDay = []
        let _dataTable = []
        // item.workingScheduleData.forEach(i => {
        //   let _totalHoureWorking = 0
        //   let _totalHoureWorkingOT = 0
        //   let _totalHoure = 0
        //   let _dataRow = [...tableRow]
        //   let _index = new Date(moment(i.WorkingDate).format('YYYY-MM-DD')).getDay() - 1
        //   if (_index === -1) {
        //     _index = 6
        //   }

        //   if (i.WorkingWeekTime !== null && i.WorkingWeekTime.length > 0) {
        //     _totalHoureWorking = i.WorkingWeekTime[0].WorkingWeekTimeId.length / 2;
        //     _totalHoure = i.WorkingWeekTime[0].WorkingWeekTimeId.length / 2;


        //     if (i.WorkingWeekTime[0].OT == 1) {
        //       let tempCheckSplitTime = 0;
        //       i.WorkingWeekTime[0].WorkingWeekTimeId.map((id, index) => {
        //         if (index == 0) {
        //           tempCheckSplitTime = id + 2
        //         } else {
        //           if (id + 1 !== tempCheckSplitTime) {
        //             _dataRow[tempCheckSplitTime - 2] = "OT";
        //           } else {
        //             tempCheckSplitTime = id + 2
        //           }
        //         }
        //         _dataRow[id - 1] = "OT";
        //       })
        //       _dataRow[i.WorkingWeekTime[0].WorkingWeekTimeId[i.WorkingWeekTime[0].WorkingWeekTimeId.length - 1]] = "OT";
        //       _totalHoureWorkingOT = i.WorkingWeekTime[0].WorkingWeekTimeId.length / 2
        //       _totalHoure += i.WorkingWeekTime[0].WorkingWeekTimeId.length / 2
        //     } else {
        //       let tempCheckSplitTime = 0; // check xem có ca gãy hay không
        //       i.WorkingWeekTime[0].WorkingWeekTimeId.map((id, index) => {
        //         if (index == 0) {
        //           tempCheckSplitTime = id + 2
        //         } else {
        //           if (id + 1 !== tempCheckSplitTime) {
        //             _dataRow[tempCheckSplitTime - 2] = "N";
        //           } else {
        //             tempCheckSplitTime = id + 2
        //           }
        //         }
        //         _dataRow[id - 1] = "N";
        //       })
        //       _dataRow[i.WorkingWeekTime[0].WorkingWeekTimeId[i.WorkingWeekTime[0].WorkingWeekTimeId.length - 1]] = "N";
        //     }
        //   }
        //   _dataTable.push({
        //     date: i.WorkingDate, data: _dataRow,
        //     dataHour: { totalHoureWorking: _totalHoureWorking, totalHoureWorkingOT: _totalHoureWorkingOT, totalHoure: _totalHoure }
        //   });
        //   _dataHour[_index].totalHoure += _totalHoure
        //   _dataHour[_index].totalHoureWorkingOT += _totalHoureWorkingOT
        //   _dataHour[_index].totalHoureWorking += _totalHoureWorking
        // })

        item.staffWorkingDayTimeData.forEach(i => {
          let _totalHoureWorking = 0
          let _totalHoureWorkingOT = 0
          let _totalHoure = 0
          let _dataRow = [...tableRow]
          let __index = new Date(moment(i.WorkingDate).format('YYYY-MM-DD')).getDay() - 1
          if (__index === -1) {
            __index = 6
          }
          let datahandle = i.staffWorkingDayTimeData;
          let tempCheckSplitTime = 0;
          datahandle.map((item, index) => {
            if (item.isOT) {
              _dataRow[item.workingTimeId - 1] = "OT";
              _totalHoureWorkingOT = _totalHoureWorkingOT + 1;
            } else {
              _totalHoureWorking += 1;
              _dataRow[item.workingTimeId - 1] = "N";
            }

            // ui hiển thị thiếu giờ cuối cùng của mảng
            if (index == datahandle.length - 1) {
              _dataRow[datahandle[index].workingTimeId] = _dataRow[datahandle[index].workingTimeId - 1];
            }
            if (index == 0) {
              tempCheckSplitTime = item.workingTimeId + 2
            } else {
              if (item.workingTimeId + 1 !== tempCheckSplitTime) {
                _dataRow[tempCheckSplitTime - 2] = _dataRow[tempCheckSplitTime - 3];
              } else {
                tempCheckSplitTime = item.workingTimeId + 2
              }
            }
          });
          let _index = _dataTable.findIndex(e => e.date == i.WorkingDate)
          if (_index !== -1) {
            _dataTable[_index].data = _dataRow
          }
          _totalHoure = _totalHoureWorking + _totalHoureWorkingOT;
          _dataTable.push({
            date: i.WorkingDate, data: _dataRow,
            dataHour: { totalHoureWorking: _totalHoureWorking / 2, totalHoureWorkingOT: _totalHoureWorkingOT / 2, totalHoure: _totalHoure / 2 }
          });
          _dataHour[__index].totalHoure += _totalHoure / 2
          _dataHour[__index].totalHoureWorkingOT += _totalHoureWorkingOT / 2
          _dataHour[__index].totalHoureWorking += _totalHoureWorking / 2
        })


        let infoStaff = {
          staffId: item.id,
          staffName: `${item.firstName}${item.lastName}`,
          positionName: item.positionName,
          positionCode: item.positionId,
          dutyName: item.dutyName,
          dutyId: item.dutyId,
          dataTable: [],
          dataTableInWeek: _dataTable,
        }
        listStaffParam.push(infoStaff)
      })
      setDataHourServiceInWeek(_dataHour)
      setListStaff(listStaffParam)
    }
  }, []);
  const handleDataTableStaff = (item: IStaffInfoByRecordArea) => {
    if (params?.data) {
      let index = item.dataTableInWeek.findIndex(item => +new Date(moment(item.date).format("YYYY-MM-DD")) === +new Date(daySelect.value))
      if (index !== -1) {
        return item.dataTableInWeek[index].data
      }
    } else {
      return item ? item.dataTable ?? tableRow : tableRow
    }
  }
  const handleDataHourTableStaff = (item: IStaffInfoByRecordArea, type: string) => {
    if (params?.data) {
      let index = item.dataTableInWeek.findIndex(item => +new Date(moment(item.date).format("YYYY-MM-DD")) === +new Date(daySelect.value))
      if (index !== -1) {
        return item.dataTableInWeek[index].dataHour[type]
      }
    } else {
      return item[type]
    }
  }
  const handleDataHourStore = (type: string) => {
    if (params?.data) {
      let index = new Date(daySelect.value).getDay() - 1
      if (index !== -1 && dataHourServiceInWeek.length > 0) {
        return dataHourServiceInWeek[index][type]
      }
    } else {
      return dataHourService[type] ? dataHourService[type].toFixed(1) : "-"
    }
  }
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15, zIndex: 2 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>Weekly crew schedule & OT Forecast Sample</Text>
        </View>
        {/* <DatePickerUnderLine
          onSubmit={date => {
            setDate(date);
          }}
        ></DatePickerUnderLine> */}
        <View style={{ zIndex: 2 }}>
          <DropDown
            data={weekDays}
            onSelected={value => {
              setDaySelect(value);
            }}
            backgroundColor={{ backgroundColor: "transparent" }}
            value={daySelect}
          ></DropDown>
        </View>

        <View style={{ backgroundColor: colors.colorLine, height: .5 }}></View>

        <View style={[styles.row_between, { paddingVertical: 10 }]}>
          <Text style={{ color: colors.gray }}>Start time of day:</Text>
          <Text style={styles.textTitleHeader}>00:00</Text>
        </View>
      </View>
      <View
        style={{
          borderRadius: 4,
          marginTop: 6,
          backgroundColor: colors.grayLight,
        }}
      >
        <View style={[styles.center, styles.radius_top, { backgroundColor: "#878787" }]}>
          <Text style={styles.textTitleHeader}>{`STORE_${valueStore.name.toUpperCase()}`}</Text>
          {params.data === undefined && <TouchableOpacity
            onPress={() => {
              setShowPickerStore(!showPickerStore);
            }}
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              right: 15,
              padding: 10,
            }}
          >
            <Ionicons style={{}} name="caret-down" size={20} color="#fff"></Ionicons>
          </TouchableOpacity>}

        </View>

        <View style={{ padding: 15 }}>
          <View>
            <View style={[styles.row_between, { marginVertical: 10 }]}>
              <Text style={{ color: colors.gray }}>Actual working hours</Text>
              <Text style={styles.textTitleHeader}>
                {handleDataHourStore('totalHoureWorking')}
              </Text>
            </View>
            <View style={styles.row_between}>
              <Text style={{ color: colors.gray }}>OT</Text>
              <Text style={styles.textTitleHeader}>
                {handleDataHourStore('totalHoureWorkingOT')}
              </Text>
            </View>
            <View style={[styles.row_between, { marginVertical: 10 }]}>
              <Text style={{ color: colors.gray }}>Total</Text>
              <Text style={styles.textTitleHeader}>
                {handleDataHourStore('totalHoure')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          borderRadius: 4,
          marginTop: 6,
          backgroundColor: colors.grayLight,
        }}
      >
        <View style={[styles.row_between, styles.radius_top, { padding: 15 }]}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textTitleHeader}>N: </Text>
            <Text style={[styles.textTitleHeader, { color: colors.gray }]}>Normal Working Hour</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textTitleHeader}>OT: </Text>
            <Text style={[styles.textTitleHeader, { color: colors.gray }]}>Overtime</Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#878787",
            padding: 15,
            justifyContent: "center",
          }}
        >
          <Text style={[styles.textTitleHeader, { alignSelf: "center" }]}>{`${valueTeam.name.toUpperCase()} TEAM`}</Text>
          {params.data === undefined && <TouchableOpacity
            onPress={() => {
              setShowPickerTeam(!showPickerTeam);
            }}
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              right: 15,
              padding: 10,
            }}
          >
            <Ionicons style={{}} name="caret-down" size={20} color="#fff"></Ionicons>
          </TouchableOpacity>}

        </View>
        {listStaff.map((item, index) => {
          return (
            <View key={index}>
              <ItemServiceTeam item={item}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                  <View>
                    <View style={[styles.row_between, { marginBottom: 16 }]}>
                      <Text style={[styles.textTitleHeader400, { color: colors.gray }]}>Roster</Text>
                      <Text style={[styles.textTitleHeader400]}>{item ? item.dutyName : "-"}</Text>
                    </View>
                  </View>
                  <Dash dashStyle={{ height: 0.5 }} dashColor={colors.colorLine} />
                </View>

                <ScrollView horizontal={true}>
                  <Table style={{}}>
                    <Row
                      data={tableHead}
                      widthArr={widthArr}
                      style={{
                        height: 50,
                      }}
                      textStyle={{
                        textAlign: "center",
                        color: "#fff",
                      }}
                    />
                    <Row
                      data={handleDataTableStaff(item)}
                      widthArr={widthArr}
                      style={{
                        height: 50,
                        backgroundColor: "#675E50",
                      }}
                      textStyle={{
                        textAlign: "center",
                        color: "#fff",
                      }}
                    />
                  </Table>
                </ScrollView>
                <View style={{ paddingHorizontal: 16 }}>
                  <View style={[styles.row_between, { marginVertical: 10 }]}>
                    <Text style={{ color: colors.gray }}>Actual working hours</Text>
                    <Text style={styles.textTitleHeader}>{item ? handleDataHourTableStaff(item, 'totalHoureWorking') ?? "-" : "-"}</Text>
                  </View>
                  <View style={styles.row_between}>
                    <Text style={{ color: colors.gray }}>OT</Text>
                    <Text style={styles.textTitleHeader}>{item ? handleDataHourTableStaff(item, 'totalHoureWorkingOT') ?? "-" : "-"}</Text>
                  </View>
                  <View style={[styles.row_between, { marginVertical: 10 }]}>
                    <Text style={{ color: colors.gray }}>Total</Text>
                    <Text style={styles.textTitleHeader}>{item ? handleDataHourTableStaff(item, 'totalHoure') ?? "-" : "-"}</Text>
                  </View>
                </View>
              </ItemServiceTeam>
            </View>
          );
        })}
      </View>

      <View style={{ padding: 30 }}>
        <TouchableOpacity
          onPress={() => {
            setModalSendMail(!modalSendMail);
          }}
          style={{ width: 130, alignSelf: "center" }}
        >
          <LinearGradient style={styles.buttonSend} colors={["#DAB451", "#988050"]}>
            <Text style={styles.textButton}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <ModalSendEmail
        visible={modalSendMail}
        onRequestClose={() => {
          setModalSendMail(!modalSendMail);
        }}
        onRequestSend={(description, email) => {
          handleSendMail(description, email);
        }}
      ></ModalSendEmail>
      <SendSuccess title={statusSent} visible={sent === "success"} onRequestClose={() => setSent("")}></SendSuccess>
      <SendFail title={statusSent} visible={sent === "fail"} onRequestClose={() => setSent("")}></SendFail>
      <ModalPicker
        visible={showPickerStore}
        data={recordAreas}
        onRequestClose={() => setShowPickerStore(false)}
        onChange={item => {
          setValueStore(item);
        }}
      ></ModalPicker>
      <ModalPicker
        visible={showPickerTeam}
        data={recordAreas}
        onRequestClose={() => setShowPickerTeam(false)}
        onChange={item => {
          setValueTeam(item);
        }}
      ></ModalPicker>

      {isLoading && <Loading />}
    </View>
  );
};

export default WeeklyCrewSchedule;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  row_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radius_top: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  titleHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
  },
  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 14,
  },
  textTitleHeader400: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 14,
  },
  blockColor: {
    width: 12,
    height: 12,
    marginRight: 8,
  },
  textButton: {
    fontSize: 16,
    color: colors.colorText,
  },
  buttonSend: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});
