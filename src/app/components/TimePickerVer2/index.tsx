import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView } from "react-native";

import moment from "moment";
import { colors } from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { IUpdateStaffPartTime, NO_RESTRICTION, NO_AVAILABILITY } from "../../models/staffModel";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import MultiSelect from "../../components/MultiSelect";
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
  const [selectedTime, setSelectedTime] = useState([]);
  //   const workingPartTimes = useSelector((state: RootState) => state.staff.workingPartTimes);
  const onDone = () => {
    onRequestSend({ FreeDate: data.freeDate, Rank: data.rank, WorkingTimeId: selectedTime });
    setSelectedTime([]);
    onRequestClose();
  };
  const handlePropTime = () => {
    let result = [];
    if (data) {
      data.staffFreeTimeList.map(item => {
        if (item.workingTimeId !== NO_RESTRICTION) {
          result.push({ label: item.timeRange, value: item.workingTimeId });
        }
      });
    }

    return result;
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
          <View style={{ height: 150, alignSelf: "center", marginBottom: 30 }}>
            <MultiSelect items={handlePropTime()} onChecked={items => setSelectedTime(items)} value={selectedTime}></MultiSelect>
          </View>

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
