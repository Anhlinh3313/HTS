import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../../assets";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Table, Row, TableWrapper, Cell } from "react-native-table-component";
import SvgUri from "react-native-svg-uri";
import ModalSendEmail from "../../../../../components/ModalSendEmail";
import ModalCancel from "../../../../../components/management/items/modalCancel";
import SendSuccess from "../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../components/modalNotification/SendFail";
import ModalReason from "../../../../../components/modalNotification/ModalReason";
import { ReportStaffService, MailStaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
import { IPicker, IOverTimeOTRecord, IOverTimeOTRecordInfo } from "../../../../../models/staffModel";
import { getDayInWeekArray } from "../../../../../components/management/utils";
import moment from "moment";
const widthArr = [150, 100, 200, 30, 30, 30, 30, 30, 30, 30, 30, 150, 150];
const OvertimeRecord = () => {
  const reports = useSelector((state: RootState) => state.reports);
  const { record_area } = useSelector((state: RootState) => state.staff);
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;

  const dataTable = {
    tableHead: ["ID", "FULL NAME", "Hours OT", "MANAGER", "EXTRA"],
    tableHead1: ["FULL NAME", "E.Code", "Role"],
    tableHead2: getDayInWeekArray(
      new Date(moment(reports.fromDate).format("YYYY-MM-DD")),
      new Date(new Date().setDate(new Date(moment(reports.endDate).format("YYYY-MM-DD")).getDate() + 1))
    ),
    tableHead3: ["TOT OT BY HOUR", "TOT OT BY DAYS"],
    tableHead0: ["", "", "", "Mon", "", "", "", "", "", "", "Mon", "", ""],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [pickerValue, setPickerValue] = useState(record_area[0]);
  const [isDone, setDone] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [modalCancel, setModalCancel] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  const [modalReason, setModalReason] = useState(false);
  const [valueModalReason, setValueModalReason] = useState("");
  const [staffsTable, setStaffsTable] = useState([]);
  const [staffsTableDone, setStaffsTableDone] = useState([]);
  const [idScheduleNotExtra, setIdScheduleNotExtra] = useState(0);
  const [currentDate, setCurrentDate] = useState(reports.fromDate);

  const handleSendMail = async (description: string, email: string) => {
    setModalSendMail(!modalSendMail);
    setIsLoading(true);
    const res = await MailStaffService.sendMailOverTimeOTRecord(description, email, reports.fromDate, reports.endDate);
    setIsLoading(false);
    if (res.isSuccess == 1 && res.data) {
      setSent("success");
      setStatusSent("Email sent successfully!");
    } else {
      setSent("fail");
      setStatusSent("Email sent failed!");
    }
  };

  const showCell = (data: any, id: number) => {
    switch (data) {
      case true:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={[styles.iconChecked, { backgroundColor: "#76D146" }]}>
              <Ionicons name={"checkmark"} size={14} color="#fff"></Ionicons>
            </View>
          </View>
        );
      case false:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={[styles.iconChecked, { backgroundColor: "#FF3232" }]}>
              <Ionicons name={"close"} size={14} color="#fff"></Ionicons>
            </View>
          </View>
        );
      case null:
        return (
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => updateOverTimeOTRecordByDay(id, null, true)}
              style={[styles.iconChecked, { backgroundColor: "#76D146", marginRight: 8 }]}
            >
              <Ionicons name={"checkmark"} size={14} color="#fff"></Ionicons>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalCancel(!modalCancel);
                setIdScheduleNotExtra(id);
              }}
              style={[styles.iconChecked, { backgroundColor: "#FF3232" }]}
            >
              <Ionicons name={"close"} size={14} color="#fff"></Ionicons>
            </TouchableOpacity>
          </View>
        );

      default:
        return data;
    }
  };
  const showCellDone = (data: any, index: number) => {
    if (index > 2 && index < 11) {
      if (typeof data === "object") {
        return (
          <TouchableOpacity
            onPress={() => {
              data.checkNotExtra === false ? setModalReason(true) : undefined;
              setValueModalReason(data.notExtra);
            }}
            style={{}}
          >
            <View style={[styles.iconChecked, { backgroundColor: !data.checkNotExtra ? "#FF3232" : "#76D146" }]}>
              <Text style={styles.textTitleHeader400}>{data.hoursOTRank}</Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return data;
      }
    }
    return data;
  };
  const widthCellDone = (index: number) => {
    switch (index) {
      case 0:
        return 150;
      case 1:
        return 100;
      case 2:
        return 200;
      case 11:
        return 150;
      case 12:
        return 150;

      default:
        return 30;
    }
  };
  const onPick = (value: IPicker) => {
    setPickerValue(value);
    setModalVisible(false);
  };
  const onConfirm = () => {
    if (isDone) {
      setModalSendMail(!modalSendMail);
    } else {
      if (new Date(moment(currentDate).format("YYYY-MM-DD")).getDay() === 0) {
        setDone(!isDone);
      } else {
        let _date = new Date(moment(currentDate).format("YYYY-MM-DD"))
        setCurrentDate(moment(_date.setDate(_date.getDate() + 1)).format("YYYY-MM-DD 00:00"))
      }
    }
  };
  const handleDayInfo = (data: any[]) => {
    const listDays = getDayInWeekArray(
      new Date(moment(reports.fromDate).format("YYYY-MM-DD")),
      new Date(moment(reports.endDate).format("YYYY-MM-DD")),
      "dddd"
    );
    const result: any[] = ["", "", "", "", "", "", "", ""];
    data.map(item => {
      let index = listDays.findIndex(day => day === item.rank);
      if (item.checkNotExtra !== null) {
        result[index] = { checkNotExtra: item.checkNotExtra, hoursOTRank: item.hoursOTRank, notExtra: item.notExtra };
      }
    });
    return result;
  };
  const loadOverTimeOTRecordInfo = async () => {
    setIsLoading(true);
    const res = await ReportStaffService.getOverTimeOTRecordInfo(reports.fromDate, reports.endDate, pickerValue.id);
    if (res.isSuccess == 1 && res.data) {
      let _data = [];
      if (res.data.length > 0) {
        res.data.map(item => {
          _data.push({
            info: item,
            headChart: [item.staffName, item.staffCode ?? item.staffId, item.dutyName],
            bodyChart: handleDayInfo(item.dayInfo),
            footChart: [item.hoursOT, item.dayNumber],
          });
        });
      }
      setStaffsTableDone(_data);
    }
    setIsLoading(false);
  };
  const loadOverTimeOTRecord = async () => {
    setIsLoading(true);
    const res = await ReportStaffService.getOverTimeOTRecord(moment(currentDate).format("YYYY-MM-DD 00:00"), pickerValue.id);
    if (res.isSuccess == 1 && res.data) {
      let _data = [];
      if (res.data.length > 0) {
        res.data.map(item => {
          _data.push({
            workingScheduleId: item.workingScheduleId,
            charts: [item.staffId, item.staffName, item.hoursOT, !!item.manager, item.checkNotExtra],
          });
        });
      }
      setStaffsTable(_data);
    }
    setIsLoading(false);
  };
  const updateOverTimeOTRecordByDay = async (id: number, reason: string, check: boolean) => {
    const res = await ReportStaffService.updateOverTimeOTRecordByDay([
      { WorkingScheduleId: id, NotExtra: reason, CheckNotExtra: +check },
    ]);
    if (res.isSuccess == 1 && res.data) {
      loadOverTimeOTRecord();
    }
  };
  useEffect(() => {
    loadOverTimeOTRecord();
  }, [pickerValue, currentDate]);
  useEffect(() => {
    if (isDone) {
      loadOverTimeOTRecordInfo();
    }
  }, [pickerValue, reports.fromDate, reports.endDate, isDone]);
  useEffect(() => {
    setCurrentDate(reports.fromDate)
  }, [reports.fromDate]);
  return (
    <View style={styles.container}>
      <View style={styles.titleHeader}>
        <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>OVERTIME (OT) RECORD</Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={[styles.pickerModal, styles.row_between]}>
          <Text style={styles.textTitleHeader}>{pickerValue.name}</Text>
          <Ionicons name="caret-down" size={20} color="#fff" />
        </View>
      </TouchableWithoutFeedback>
      {modalVisible && (
        <View
          style={[
            styles.styleModalPicker,
            {
              width: windowWidth - 30,
            },
          ]}
        >
          {record_area.map(item => {
            return (
              <TouchableOpacity key={`${item.id}${item.code}`} style={{ marginBottom: 15 }} onPress={() => onPick(item)}>
                <Text style={styles.textTitleHeader}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {/* ------------------------ */}
      {isDone ? (
        <ScrollView horizontal style={{ borderRadius: 4 }}>
          <View style={{ backgroundColor: "#414141", borderRadius: 4 }}>
            <Table style={{}}>
              <Row
                data={dataTable.tableHead0}
                style={{
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  height: 36,
                  backgroundColor: "#878787",
                }}
                widthArr={widthArr}
                textStyle={styles.textTitleHeader400}
              />
              <Row
                data={dataTable.tableHead1.concat(dataTable.tableHead2, dataTable.tableHead3)}
                style={{
                  height: 45,
                  paddingLeft: 10,
                }}
                widthArr={widthArr}
                textStyle={styles.textGray}
              />
              {staffsTableDone.map((item, index) => {
                return (
                  <TableWrapper
                    key={index}
                    style={{
                      flexDirection: "row",
                      height: 36,
                      backgroundColor: index % 2 === 0 ? "#8D7550" : "transparent",
                    }}
                  >
                    {item.headChart.concat(item.bodyChart, item.footChart).map((cellData, cellIndex) => (
                      <Cell
                        key={cellIndex}
                        data={showCellDone(cellData, cellIndex)}
                        textStyle={[
                          styles.textTitleHeader400,
                          {
                            marginLeft: cellIndex === 0 || cellIndex === 1 || cellIndex === 2 ? 10 : 0,
                          },
                          {
                            textAlign: cellIndex === 11 || cellIndex === 12 ? "center" : undefined,
                          },
                        ]}
                        width={widthCellDone(cellIndex)}
                      />
                    ))}
                  </TableWrapper>
                  // <Row
                  //   key={index}
                  //   data={item}
                  //   style={[
                  //     styles.styleRowTable,
                  //     index % 2 === 0 && { backgroundColor: "#8D7550" },
                  //     { paddingLeft: 10 },
                  //   ]}
                  //   widthArr={widthArr}
                  //   textStyle={[styles.textTitleHeader400, {backgroundColor:'#ff0', alignSelf: 'flex-start'}]}
                  // />
                );
              })}
            </Table>
          </View>
        </ScrollView>
      ) : (
        <View style={{ backgroundColor: "#414141", borderRadius: 4 }}>
          <View
            style={[
              styles.center,
              {
                backgroundColor: "#878787",
              },
              styles.radius_top,
            ]}
          >
            <Text style={styles.textTitleHeader}>THE LIST OF EMPLOYEE</Text>
          </View>
          <Text style={[styles.textTitleHeader400, styles.textDate]}>{moment(currentDate).format("dddd, DD/MM/YYYY")}</Text>
          <ScrollView horizontal>
            <Table borderStyle={{ borderColor: "transparent" }}>
              <Row
                data={dataTable.tableHead}
                style={{ height: 40 }}
                textStyle={[styles.textGray, { textAlign: "center" }]}
                widthArr={[30, 150, 75, 75, 75]}
              />
              {staffsTable.map((rowData, index) => (
                <TableWrapper
                  key={index}
                  style={{
                    flexDirection: "row",
                    height: 40,
                    backgroundColor: index % 2 === 0 ? "#8D7550" : "transparent",
                  }}
                >
                  {rowData.charts.map((cellData, cellIndex) => (
                    <Cell
                      key={cellIndex}
                      data={showCell(cellData, rowData.workingScheduleId)}
                      textStyle={[styles.textTitleHeader400, { textAlign: "center" }]}
                      width={cellIndex === 0 ? 30 : cellIndex === 1 ? 150 : 75}
                    />
                  ))}
                </TableWrapper>
              ))}
            </Table>
          </ScrollView>
        </View>
      )}

      {/* ------------------------ */}
      <TouchableOpacity
        onPress={() => {
          onConfirm();
        }}
        style={{ marginVertical: 32, width: 150, alignSelf: "center" }}
      >
        <LinearGradient style={styles.buttonSend} colors={["#DAB451", "#988050"]}>
          <Text style={styles.textButton}>{isDone ? "Confirm" : "Next"}</Text>
        </LinearGradient>
      </TouchableOpacity>
      <ModalSendEmail
        title={"OVERTIME (OT) RECORD"}
        visible={modalSendMail}
        onRequestClose={() => {
          setModalSendMail(!modalSendMail);
        }}
        onRequestSend={(description, email) => {
          handleSendMail(description, email);
        }}
      ></ModalSendEmail>
      <ModalCancel
        visible={modalCancel}
        onRequestClose={() => {
          setModalCancel(!modalCancel);
        }}
        onRequestSend={reason => {
          updateOverTimeOTRecordByDay(idScheduleNotExtra, reason, false);
        }}
      ></ModalCancel>
      {/* ------------------------------------------------------ */}
      <SendSuccess visible={sent === "success"} onRequestClose={() => setSent("")}></SendSuccess>
      <SendFail visible={sent === "fail"} onRequestClose={() => setSent("")}></SendFail>
      <ModalReason
        content={valueModalReason}
        visible={modalReason}
        onRequestClose={() => {
          setModalReason(false);
        }}
      ></ModalReason>
      {isLoading && <Loading />}
    </View>
  );
};

export default OvertimeRecord;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  center: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
  },
  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 14,
  },
  row_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerPicker: {
    marginTop: 10,
    backgroundColor: colors.backgroundApp,
    paddingBottom: 15,
  },
  pickerModal: {
    borderRadius: 4,
    padding: 12,
    marginVertical: 16,
    backgroundColor: colors.grayLight,
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
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

  radius_top: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  textTitleHeader400: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 14,
  },
  textDate: {
    marginTop: 13,
    marginLeft: 8,
    marginBottom: 20,
  },
  textGray: {
    color: colors.gray,
    fontWeight: "400",
    fontSize: 14,
  },

  iconChecked: {
    borderRadius: 4,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  styleRowTable: {
    height: 36,
  },
  /// modal
  containerModal: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#414141",
    borderRadius: 4,
    padding: 15,
    width: "90%",
  },
  headerModal: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
    paddingBottom: 15,
    alignItems: "center",
  },
  textMain: {
    color: "#DAB451",
    fontWeight: "500",
    alignItems: "center",
  },
  bodyInputModal: {
    marginTop: 15,
  },
  textTitleModal: {
    fontWeight: "600",
    color: colors.gray,
    fontSize: 12,
    marginBottom: 4,
  },
  inputModal: {
    borderRadius: 4,
    backgroundColor: "#303030",
    paddingHorizontal: 10,
    color: colors.colorText,
    paddingVertical: 8,
  },
  styleModalPicker: {
    position: "absolute",
    backgroundColor: "#636363",
    top: 115,
    right: 15,
    zIndex: 9,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
