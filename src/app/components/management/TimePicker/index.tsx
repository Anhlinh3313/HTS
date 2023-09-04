import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, Alert } from "react-native";

import moment from "moment";
import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import HandleTime from "./HandleTime";
import { IUpdateStaffPartTime, NO_RESTRICTION, NO_AVAILABILITY } from "../../../models/staffModel";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers";
const index = ({
  title = "",
  data,
  visible,
  onRequestClose,
  onRequestSend,
}: {
  title?: string;
  data: any;
  visible: boolean;
  onRequestClose: () => void;
  onRequestSend?: (data: IUpdateStaffPartTime) => void;
}) => {
  const workingPartTimes = useSelector((state: RootState) => state.staff.workingPartTimes);
  interface ITime {
    hour: number;
    minute: number;
    period: string;
  }

  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [timeFromObj, setTimeFromObj] = useState<ITime>();
  const [timeToObj, setTimeToObj] = useState<ITime>();
  const onDone = () => {
    const idFromTime = timeFromObj.hour * 2 + (timeFromObj.minute === 0 ? 1 : 2);
    const idToTime = timeToObj.hour * 2 + (timeToObj.minute === 0 ? 0 : 1);
    const workingTimeId = Array.from({ length: idToTime - idFromTime + 1 }, (_, i) => idFromTime + i);

    if (idToTime === idFromTime - 1) {
      Alert.alert("Note", `Time From cannot equal to Time To!`);
      return;
    }
    if (idToTime < idFromTime) {
      Alert.alert("Note", `Time From cannot than more Time To!`);
      return;
    }

    if (data.staffFreeTimeList[data.staffFreeTimeList.length - 1].workingTimeId === NO_RESTRICTION) {
      onRequestSend({
        FreeDate: data.freeDate,
        Rank: data.rank,
        WorkingTimeId: workingTimeId,
      });
      onRequestClose();
      return;
    }

    const idFromTimeOld = data.staffFreeTimeList[0].timeOrder;
    const idToTimeOld = data.staffFreeTimeList[data.staffFreeTimeList.length - 1].timeOrder;
    if (idFromTimeOld > idFromTime || idFromTimeOld > idToTime || idToTimeOld < idToTime || idToTimeOld < idFromTime) {
      Alert.alert(
        "Note",
        `Can only choose the time between ${data.staffFreeTimeList[0].timeStart} and  ${
          data.staffFreeTimeList[data.staffFreeTimeList.length - 1].timeEnd
        }`
      );
      return;
    }
    onRequestSend({ FreeDate: data.freeDate, Rank: data.rank, WorkingTimeId: workingTimeId });
    onRequestClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        onRequestClose;
      }}
    >
      <View style={[styles.dateTimeModal, { height: "100%", justifyContent: "center" }]}>
        <View style={[styles.dateTimeContainer, {}]}>
          <View style={{ paddingHorizontal: 32, marginBottom: 30 }}>
            <View style={styles.dateTimeHeader}>
              <Text style={{}}>
                <Text style={styles.dateTimeHeaderText}>{moment(title).format("dddd ").toUpperCase()}</Text>
                <Text style={styles.dateTimeHeaderText}>{moment(title).format("(DD/MM/yyyy)")}</Text>
              </Text>
            </View>
          </View>
          {/* -------------------------------------- */}
          <HandleTime
            value={data?.staffFreeTimeList[0]?.timeStart ?? ""}
            title="From"
            onChange={time => {
              setTimeFrom(time);
            }}
            onChangeOBJ={time => {
              setTimeFromObj(time);
            }}
          ></HandleTime>
          <HandleTime
            value={data?.staffFreeTimeList[data?.staffFreeTimeList.length - 1]?.timeEnd ?? ""}
            title="To"
            onChange={time => {
              setTimeTo(time);
            }}
            onChangeOBJ={time => {
              setTimeToObj(time);
            }}
          ></HandleTime>

          {/* -------------Button Confirm------------------------- */}
          <LinearGradient style={styles.dateTimeButton} colors={["#DAB451", "#988050"]}>
            <TouchableOpacity onPress={onDone}>
              <Text style={styles.dateTimeText}>Done</Text>
            </TouchableOpacity>
          </LinearGradient>
          <TouchableOpacity style={[styles.dateTimeButton, { marginBottom: 10 }]} onPress={onRequestClose}>
            <Text style={styles.dateTimeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default index;

const styles = StyleSheet.create({
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  text4: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "400",
  },
  textTime: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingRight: 15,
    paddingLeft: 15,
  },
  dateTimeModal: {
    flex: 1,
    width: "100%",
    position: "absolute",
    backgroundColor: " rgba(0, 0, 0, 0.5)",
  },
  dateTimeContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#414141",
    borderRadius: 5,
  },
  dateTimeHeader: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    borderBottomColor: colors.colorLine,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  dateTimeHeaderText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
  },
  timeContainer: {
    flexDirection: "row",
    height: 100,
  },
  timeHourView: {
    flex: 4,
    backgroundColor: "#595959",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  timeArrow: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    color: "#fff",
    fontSize: 18,
  },
  timePeriod: {
    flex: 2,
    backgroundColor: "#595959",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  timePeriodDivide: {
    width: "33%",
    height: 1,
    backgroundColor: "#A4A4A4",
  },
  dateTimeButton: {
    width: "90%",
    height: 40,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 4,
  },
  dateTimeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
  },
});
