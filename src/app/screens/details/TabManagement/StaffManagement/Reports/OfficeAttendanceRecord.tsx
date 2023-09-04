import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ItemServiceTeam from "./items/itemServiceTeam";
import ItemAttendanceRecord from "./items/itemAttendanceRecord";
import ModalSendEmail from "../../../../../components/ModalSendEmail";
import SendSuccess from "../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../components/modalNotification/SendFail";
import { ReportStaffService, MailStaffService, StaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
import { IOfficeAttendanceRecord } from "../../../../../models/staffModel";
const OfficeAttendanceRecord = () => {
  interface IPicker {
    id: number;
    code: string;
    name: string;
  }
  const initDataPicker = { id: 0, code: "", name: "" };
  const reports = useSelector((state: RootState) => state.reports);
  const legends = useSelector((state: RootState) => state.staff.legends);
  const dimensions = Dimensions.get("window");
  const [isLoading, setIsLoading] = useState(false);
  const [showLegendNote, setShowLegendNote] = useState(false);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  const [prepared, setPrepared] = useState("");
  const [verified, setVerified] = useState("");

  const [listStaff, setListStaff] = useState<IOfficeAttendanceRecord[]>([]);

  const [visibleModalPicker, setVisibleModalPicker] = useState(false);
  const [pickerValuePosition, setPickerValuePosition] = useState<IPicker>(initDataPicker);
  const [positions, setPositions] = useState<IPicker[]>([]);

  const getDaysInMonth = function () {
    return new Date(
      new Date(moment(reports.fromDate).format("YYYY-MM-DD")).getFullYear(),
      new Date(moment(reports.fromDate).format("YYYY-MM-DD")).getMonth() + 1,
      0
    ).getDate();
  };
  const handleSendMail = async (description: string, email: string) => {
    setModalSendMail(!modalSendMail);
    setIsLoading(true);
    const res = await MailStaffService.sendMailOfficeAttendanceRecord(
      description,
      email,
      prepared,
      verified,
      reports.fromDate,
      reports.endDate,
      pickerValuePosition.id
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
  const handleConfirm = () => {
    if (prepared.length < 2) {
      alert("Prepared by minimum 2 characters!");
      return;
    }
    if (verified.length < 2) {
      alert("Verified by minimum 2 characters!");
      return;
    }
    setModalSendMail(!modalSendMail);
  };

  const LoadListOfficeAttendanceRecord = async () => {
    setIsLoading(true);
    const res = await ReportStaffService.getListOfficeAttendanceRecord(reports.fromDate, reports.endDate, pickerValuePosition.id);
    setIsLoading(false);
    if (res.isSuccess == 1 && res.data) {
      setListStaff(res.data);
    }
  };
  const loadAllPosition = async () => {
    const res = await StaffService.getAllPosition();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push({ id: item.id, code: item.code, name: item.name });
        }
      });
      setPickerValuePosition(listData[0]);
      setPositions(listData);
    }
  };
  const onPickerPosition = (value: IPicker) => {
    setPickerValuePosition(value);
    setVisibleModalPicker(false);
  };
  useEffect(() => {
    loadAllPosition();
  }, []);
  useEffect(() => {
    LoadListOfficeAttendanceRecord();
  }, [reports.fromDate, reports.endDate, pickerValuePosition.id]);
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>OFFICE ATTENDANCE RECORD</Text>
        </View>
        <View
          style={{
            zIndex: Platform.OS === "ios" ? 3 : undefined,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setVisibleModalPicker(true);
            }}
          >
            <View style={styles.picker}>
              <Text style={styles.text}>{pickerValuePosition?.name ?? ""}</Text>
              <Ionicons
                style={styles.iconDownPicker}
                name="caret-down"
                size={20}
                color={colors.colorText}
                onPress={() => {
                  setVisibleModalPicker(true);
                }}
              />
            </View>
          </TouchableWithoutFeedback>
          {visibleModalPicker && (
            <View style={styles.listPicker}>
              {positions.map(item => {
                return (
                  <TouchableOpacity key={item.id} style={styles.itemPicker} onPress={() => onPickerPosition(item)}>
                    <Text style={styles.textItemPicker}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
        <View style={[styles.row_between, { paddingVertical: 10 }]}>
          <Text style={styles.textGray}>Month - Year</Text>
          <Text style={styles.textTitleHeader}>{moment(reports.fromDate).format("MMM - YY")}</Text>
        </View>
        <View style={[styles.row_between, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Full month</Text>
          <Text style={styles.textTitleHeader}>{getDaysInMonth()} days</Text>
        </View>
      </View>

      {/* ---------------------------------- */}
      {listStaff.map((item, index) => {
        return (
          <View key={index}>
            <ItemServiceTeam item={item}>
              <ItemAttendanceRecord data={item} position={pickerValuePosition}></ItemAttendanceRecord>
            </ItemServiceTeam>
          </View>
        );
      })}

      {/* ---------------------------------- */}
      <View style={[styles.itemInputBy, { marginTop: 10 }]}>
        <Text style={styles.textGray}>Prepared by: </Text>
        <TextInput
          style={{ flex: 1, color: colors.colorText }}
          value={prepared}
          onChangeText={text => setPrepared(text)}
          maxLength={20}
        ></TextInput>
      </View>
      <View style={styles.itemInputBy}>
        <Text style={styles.textGray}>Verified by: </Text>
        <TextInput
          style={{ flex: 1, color: colors.colorText }}
          value={verified}
          onChangeText={text => setVerified(text)}
          maxLength={20}
        ></TextInput>
      </View>

      {/* ---------------------------------- */}
      <View
        style={[
          styles.row_between,
          {
            backgroundColor: "#878787",
            paddingHorizontal: 16,
            paddingVertical: 10,
          },
        ]}
      >
        <Text style={styles.textTitleHeader}>Legend:</Text>
        <TouchableOpacity onPress={() => setShowLegendNote(!showLegendNote)}>
          <Ionicons name={showLegendNote ? "caret-up" : "caret-down"} size={20} color="#fff"></Ionicons>
        </TouchableOpacity>
      </View>
      {showLegendNote && (
        <View
          style={{
            backgroundColor: "#414141",
            paddingVertical: 10,
            borderBottomRightRadius: 4,
            borderBottomLeftRadius: 4,
          }}
        >
          {legends.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.row_between,
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  },
                ]}
              >
                <Text style={styles.textGray}>{item.code}</Text>
                <Text style={styles.textTitleHeader400}>{item.name}</Text>
              </View>
            );
          })}
        </View>
      )}
      {/* ---------------------------------- */}
      <TouchableOpacity
        onPress={() => {
          handleConfirm();
        }}
        style={{ marginVertical: 32, width: 150, alignSelf: "center" }}
      >
        <LinearGradient style={styles.buttonSend} colors={["#DAB451", "#988050"]}>
          <Text style={styles.textButton}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
      <ModalSendEmail
        title={"OFFICE ATTENDANCE RECORD"}
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

export default OfficeAttendanceRecord;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
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
  center: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
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
  itemInputBy: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#414141",
    borderRadius: 4,
    marginBottom: 10,
    alignItems: "center",
  },
  textTableTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 8,
  },
  textTable: {
    textAlign: "center",
    color: "#fff",
    fontSize: 10,
  },
  styleRowTableOdd: {
    height: 30,
    backgroundColor: "#414141",
  },
  styleRowTableEven: {
    height: 30,
    backgroundColor: "#8D7550",
  },
  iconChecked: {
    borderRadius: 4,
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconUnCheck: {
    borderRadius: 4,
    backgroundColor: "transparent",
    width: 18,
    height: 18,
    borderColor: "#fff",
    borderWidth: 1,
  },
  pickerWeek: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
    width: 91,
    paddingBottom: 8,
  },

  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "600",
  },
  viewPicker: {
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
  },
  iconDown: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 12,
    zIndex: 4,
  },
  iconDownPicker: {
    zIndex: 4,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },

  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
    borderBottomColor: colors.colorLine,
    borderBottomWidth: 1,
  },
  listPicker: {
    zIndex: 5,
    position: "absolute",
    backgroundColor: "#414141",
    borderRadius: 4,
    top: 42,
    right: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemPicker: {
    height: 30,
    justifyContent: "center",
  },
  textItemPicker: {
    color: colors.colorText,
  },
});
