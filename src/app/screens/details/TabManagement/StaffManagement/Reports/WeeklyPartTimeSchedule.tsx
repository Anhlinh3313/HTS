import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../../assets";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ItemServiceTeam from "./items/itemServiceTeam";
import { Table, Row } from "react-native-table-component";
import ModalSendEmail from "../../../../../components/ModalSendEmail";
import ItemPartTimeAvailability from "./items/itemPartTimeAvailability";
import SendSuccess from "../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../components/modalNotification/SendFail";
import { dataTeam } from "../../../../../components/management/contants";
import { StaffService, ReportStaffService, MailStaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";

const dataTable = {
  tableHead: ["FULL NAME", "CONTACT", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
};

const widthArr = [120, 120, 150, 150, 150, 150, 150, 150, 150];
const WeeklyPartTimeSchedule = () => {
  const reports = useSelector((state: RootState) => state.reports);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [sent, setSent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listStaff, setListStaff] = useState([]);

  const handleSendMail = async (description: string, email: string) => {
    setModalSendMail(!modalSendMail);
    setIsLoading(true);
    const res = await MailStaffService.sendMailStaffPartTime(description, email, reports.fromDate, reports.endDate);
    setIsLoading(false);
    if (res.isSuccess == 1 && res.data) {
      setSent("success");
    } else {
      setIsLoading(false);
      setSent("fail");
    }
  };
  const loadStaffInfo = async () => {
    setIsLoading(true);
    const res = await ReportStaffService.GetWeeklyPartTimeSchedule(reports.fromDate, reports.endDate);
    if (res.isSuccess == 1 && res.data) {
      var WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      let staffs = [];
      res.data.map(staff => {
        let dataDay = ["", "", "", "", "", "", ""];
        staff.dateFree.map(item => {
          let index = WEEKDAYS.indexOf(item.rank);
          if (item.staffFreeTimeByManagementAgreeInfo[0].timeStart !== null) {
            dataDay[index] = `${item.staffFreeTimeByManagementAgreeInfo[0].timeStart} To ${
              item.staffFreeTimeByManagementAgreeInfo[item.staffFreeTimeByManagementAgreeInfo.length - 1].timeEnd
            }`;
          }else{
            dataDay[index]='NO AVAILABILITY'
          }
        });
        staffs.push([staff.staffName, staff.staffPhone].concat(dataDay));
      });

      setListStaff(staffs);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadStaffInfo();
  }, [reports.fromDate, reports.endDate]);
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>WEEKLY PART - TIME SCHEDULE</Text>
        </View>
      </View>

      <ScrollView horizontal style={{ borderRadius: 4 }}>
        <View style={{ backgroundColor: "#414141", borderRadius: 4 }}>
          <Table style={{}}>
            <Row
              data={dataTable.tableHead}
              style={{
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                height: 36,
                backgroundColor: "#878787",
                paddingLeft: 10,
              }}
              widthArr={widthArr}
              textStyle={styles.textTitleHeader400}
            />
            {listStaff.map((item, index) => {
              return (
                <Row
                  key={index}
                  data={item}
                  style={[styles.styleRowTable, index % 2 === 0 && { backgroundColor: "#8D7550" }, { paddingLeft: 10 }]}
                  widthArr={widthArr}
                  textStyle={[styles.textTitleHeader400, { backgroundColor: "#ff0", alignSelf: "flex-start" }]}
                />
              );
            })}
          </Table>
        </View>
      </ScrollView>
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
        title={"Weekly Part - time Schedule"}
        visible={modalSendMail}
        onRequestClose={() => {
          setModalSendMail(!modalSendMail);
        }}
        onRequestSend={(description, email) => {
          handleSendMail(description, email);
        }}
      ></ModalSendEmail>
      <SendSuccess visible={sent === "success"} onRequestClose={() => setSent("")}></SendSuccess>
      <SendFail visible={sent === "fail"} onRequestClose={() => setSent("")}></SendFail>
      {isLoading && <Loading />}
    </View>
  );
};

export default WeeklyPartTimeSchedule;

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
    padding: 10,
    marginBottom: 12,
  },

  styleRowTable: {
    height: 36,
  },
});
