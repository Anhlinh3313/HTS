import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../../assets";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ItemServiceTeam from "./items/itemServiceTeam";
import { Table, Row } from "react-native-table-component";
import ModalSendEmail from "../../../../../components/ModalSendEmail";
import SendSuccess from "../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../components/modalNotification/SendFail";
import ModalPicker from "../../../../../components/management/ModalPicker";
import { dataTeam } from "../../../../../components/management/contants";
import Dash from "react-native-dash";
import { StaffService, ReportStaffService, MailStaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import { IPicker, initDataPicker, IStaffInfoByRecordArea } from "../../../../../models/staffModel";
import { get12HourTime } from "../../../../../components/generalConvert/conVertMonDay";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
const WeeklyDynamicCrewSchedule = () => {
  const dimensions = Dimensions.get("window");
  const reports = useSelector((state: RootState) => state.reports);
  const record_area = useSelector((state: RootState) => state.staff.record_area);
  const [isLoading, setIsLoading] = useState(false);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");

  const [listStaff, setListStaff] = useState<IStaffInfoByRecordArea[]>([]);
  const [showPickerTeam, setShowPickerTeam] = useState(false);
  const [valueTeam, setValueTeam] = useState<IPicker>(initDataPicker);

  const [recordAreas, setRecordAreas] = useState<IPicker[]>([]);

  const handleSendMail = async (description: string, email: string) => {
    setModalSendMail(!modalSendMail);
    setIsLoading(true);
    const res = await MailStaffService.sendMailWeeklyDynamicCrewSchedule(
      description,
      email,
      reports.fromDate,
      reports.endDate
    );
    setIsLoading(false);
    if (res.isSuccess == 1 && res.data) {
      setSent("success");
      setStatusSent("Email sent successfully!");
    } else {
      setSent("fail");
      setStatusSent("Email sent failed!");
    }
  };

  const loadStaffByRecordArea = async () => {
    setIsLoading(true);
    const res = await ReportStaffService.getListStaffWeeklyDynamicCrewSchedule(valueTeam.id, reports.fromDate, reports.endDate);
    if (res.isSuccess == 1 && res.data) {
      if (res.data.length > 0) {
        setListStaff(res.data);
      } else {
        setListStaff([]);
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    if (valueTeam.id !== 0) loadStaffByRecordArea();
  }, [valueTeam, reports.fromDate, reports.endDate]);
  useEffect(() => {
    setRecordAreas(record_area);
    setValueTeam(record_area[0]);
  }, []);

  const groupBy = function (xs) {
    let _xs = xs.filter((v, i, a) => a.findIndex(v2 => (v2.workingTimeId === v.workingTimeId)) === i)
    _xs = _xs.filter(item => item.workingTimeId !== null)
    _xs.sort((a, b) => a.workingTimeId - b.workingTimeId);
    let arr = [];
    let result = [];
    const arr_soft = _xs.reduce(function (rv, x) {
      if (!rv.length || x.workingTimeId - rv[rv.length - 1].slice(-1)[0].workingTimeId !== 1) {
        arr = [x];
        rv.push(arr);
      } else {
        arr = rv[rv.length - 1];
        arr.push(x);
      }
      return rv;
    }, []);

    if (arr_soft.length > 0) {
      result.push({ from: arr_soft[0][0]?.timeRange?.slice(0, 5), to: arr_soft[0][arr_soft[0].length - 1]?.timeRange?.slice(-5) });
      if (arr_soft.length > 1) {
        result.push({
          from: arr_soft[arr_soft.length - 1][0]?.timeRange?.slice(0, 5),
          to: arr_soft[arr_soft.length - 1][arr_soft[arr_soft.length - 1].length - 1]?.timeRange?.slice(-5),
        });
      }
    }
    return result;
  };

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>Weekly Dynamic Crew Schedule</Text>
        </View>
      </View>
      <View style={[styles.row_between, { paddingVertical: 10 }]}>
        <Text style={styles.textGray}>Start Time and End Time:</Text>
        <Text style={styles.textTitleHeader}>{moment(reports.fromDate).format("MMMM DD,YYYY")}</Text>
      </View>

      <View
        style={{
          borderRadius: 4,
          marginTop: 6,
          backgroundColor: colors.grayLight,
        }}
      >
        <View
          style={[
            styles.radius_top,
            {
              backgroundColor: "#878787",
              padding: 15,
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.textTitleHeader, { alignSelf: "center" }]}>{`${valueTeam.name.toUpperCase()} TEAM`}</Text>
          <TouchableOpacity
            style={{ position: "absolute", alignSelf: "flex-end", right: 15 }}
            onPress={() => {
              setShowPickerTeam(!showPickerTeam);
            }}
          >
            <Ionicons name="caret-down" size={20} color="#fff"></Ionicons>
          </TouchableOpacity>
        </View>
        {listStaff.map((item, index) => {
          return (
            <View key={index}>
              <ItemServiceTeam item={item}>
                <View style={{ paddingVertical: 10, paddingHorizontal: 16 }}>
                  <View>
                    <View style={[styles.row_between, { marginBottom: 10 }]}>
                      <Text style={[styles.textTitleHeader400, { color: colors.gray }]}>Roster</Text>
                      <Text style={[styles.textTitleHeader400]}>{item.dutyName}</Text>
                    </View>
                    <View style={[styles.row_between, { marginBottom: 10 }]}>
                      <Text style={[styles.textTitleHeader400, { color: colors.gray }]}>FT/PT</Text>
                      <Text style={[styles.textTitleHeader400]}>{item.positionCode ?? "-"}</Text>
                    </View>

                    <Dash dashStyle={{ height: 0.5 }} dashColor={colors.colorLine} />
                  </View>
                </View>
                <ScrollView horizontal indicatorStyle={"white"} pagingEnabled>
                  {item.staffWorkingDay.map((day, indexDay) => {
                    return (
                      <View
                        key={`${day.workingDate}  ${indexDay}`}
                        style={[styles.staff, { padding: 0, marginHorizontal: 8, width: dimensions.width - 46 }]}
                      >
                        <View style={styles.viewTitleFromTo}>
                          <Text style={styles.textTitleHeader400}>{moment(day.workingDate).format("MMM - DD")}</Text>
                          <Text style={styles.textTitleHeader400}>{day.workingDateDay.toUpperCase()}</Text>
                        </View>
                        <View style={styles.viewFromTo}>
                          <Text style={styles.textTitleHeader400}>FROM</Text>
                          <Text style={styles.textTitleHeader400}>TO</Text>
                          <Text style={styles.textTitleHeader400}>FROM</Text>
                          <Text style={styles.textTitleHeader400}>TO</Text>
                        </View>
                        {day.legendId == null ? (
                          <View>
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor: "#8D7550",
                                paddingVertical: 10,
                              }}
                            >
                              <Text style={styles.textTitleHeader400}>Straight Shift or Split Shift</Text>
                            </View>
                            <View style={[styles.viewFromTo, { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }]}>
                              <Text style={styles.textTitleHeader400}>
                                {get12HourTime(groupBy(day.staffWorkingDayTimeData)[0]?.from)}
                              </Text>
                              <Text style={styles.textTitleHeader400}>
                                {get12HourTime(groupBy(day.staffWorkingDayTimeData)[0]?.to)}
                              </Text>
                              <Text style={styles.textTitleHeader400}>
                                {groupBy(day.staffWorkingDayTimeData).length > 1
                                  ? get12HourTime(groupBy(day.staffWorkingDayTimeData)[1]?.from)
                                  : "-"}
                              </Text>
                              <Text style={styles.textTitleHeader400}>
                                {groupBy(day.staffWorkingDayTimeData).length > 1
                                  ? get12HourTime(groupBy(day.staffWorkingDayTimeData)[1]?.to)
                                  : "-"}
                              </Text>
                            </View>
                          </View>
                        ) : (
                          <View>
                            <View
                              style={{
                                alignItems: "center",
                                backgroundColor: "#8D7550",
                                paddingVertical: 10,
                              }}
                            >
                              <Text style={styles.textTitleHeader400}>Legend</Text>
                            </View>
                            <View style={[styles.viewFromTo, { borderBottomLeftRadius: 4, borderBottomRightRadius: 4 }]}>
                              <Text numberOfLines={1} style={[styles.textTitleHeader400, { width: "45%" }]}>{`Legend: ${day.legendName ? day.legendName : "-"
                                }`}</Text>
                              <Text numberOfLines={1} style={[styles.textTitleHeader400, { width: "55%" }]}>{`Remark: ${day.remark ? day.remark : "-"
                                }`}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </ScrollView>
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
        title={"Weekly Dynamic Crew Schedule"}
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

export default WeeklyDynamicCrewSchedule;

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
  textGray: {
    color: colors.gray,
    fontWeight: "400",
    fontSize: 14,
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

  viewTitleFromTo: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    backgroundColor: "#878787",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  viewFromTo: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingVertical: 10,
    backgroundColor: "#3C3B3B",
  },
  staff: {
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    marginBottom: 12,
  },
});
