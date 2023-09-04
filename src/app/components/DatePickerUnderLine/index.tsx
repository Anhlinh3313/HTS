import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableHighlight,
  Modal,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";

import { colors } from "../../utils/Colors";
import { Calendar } from "react-native-calendars";
import { Icons } from "../../assets";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SvgUri from "react-native-svg-uri";
import moment from "moment";
interface Props {
  onSubmit?: (date: string) => void;
  limitMonth?: number;
  isShowLable?: boolean;
  isShowTime?: boolean;
  disablePickPast?: boolean;
}
const DatePickerUnderLine = ({ onSubmit}: Props) => {
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(moment(new Date()).format("YYYY-MM-DD HH:mm:ss"));
  const [dataMarkedDatesState, setDataMarkedDatesState] = useState({});
  const [disableChangeMonth, setDisableChangeMonth] = useState(false);
  const [disableChangePastMonth, setDisableChangePastMonth] = useState(false);

  const showDatePicker = () => {
    let dateTime = date;
    let dataMarked: any = {};
    let datePresent = dateTime.slice(0, 10);
    dataMarked[datePresent] = {
      selected: true,
    };
    setDate(datePresent);
    setDataMarkedDatesState(dataMarked);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    return setDatePickerVisibility(false);
  };

  const handleConfirm = () => {
    const pickDate = new Date(date);
    setDate(moment(pickDate).format("YYYY-MM-DD"));
    onSubmit(moment(pickDate).format("YYYY-MM-DD 00:00:00"));
    hideDatePicker();
  };

  const onDayPress = (day: any) => {
    // Tạo date từ ngày nhấn vào
    const date = new Date(new Date().setFullYear(day.year, Number(day.month - 1), day.day));
    setDate(moment(date).format("YYYY-MM-DD"));
    let dataMarked: any = {};
    dataMarked[day.dateString] = {
      selected: true,
    };
    setDataMarkedDatesState(dataMarked);
  };

  return (
    <View style={[{}]}>
      <View
        style={[
          styles.titleHeader,
          {
            borderBottomWidth: 0.5,
            paddingVertical: 10,
          },
        ]}
      >
        <TouchableOpacity style={styles.row_between} onPress={() => showDatePicker()}>
          <Text style={[styles.textTitleHeader, { fontWeight: "400" }]}>{moment(date).format("dddd (DD/MM/YYYY)")}</Text>
          <Ionicons name="caret-down" size={20} color="#fff"></Ionicons>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isDatePickerVisible}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setDatePickerVisibility(!isDatePickerVisible);
        }}
      >
        <View
          style={[styles.dateTimeModal, { height: "100%", justifyContent: "center" }]}
          //   showsVerticalScrollIndicator={false}
        >
          <View style={[styles.dateTimeContainer, {}]}>
            <View style={styles.dateTimeHeader}>
              <Text style={styles.dateTimeHeaderText}>DATE & TIME</Text>
            </View>
            <Calendar
              style={{ backgroundColor: "transparent" }}
              monthFormat={"MMM yyyy"}
              renderHeader={(date: string) => {
                return (
                  <View>
                    <Text style={{ color: "#fff" }}>{moment(date.toString()).format("MMM yyyy")}</Text>
                  </View>
                );
              }}
              firstDay={1}
              onDayPress={onDayPress}
              onDayLongPress={onDayPress}
              markedDates={dataMarkedDatesState}
              disableArrowLeft={disableChangePastMonth}
              disableArrowRight={disableChangeMonth}
              theme={{
                arrowColor: "white",
                textSectionTitleColor: "#fff",
                calendarBackground: "transparent",
                dayTextColor: "#fff",
                selectedDayBackgroundColor: "#DAB451",
                selectedDayTextColor: "#ff0",
                textDisabledColor: "transparent",
                todayTextColor: "#fff",
                "stylesheet.calendar.header": {
                  header: {
                    backgroundColor: "#595959",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingLeft: 10,
                    paddingRight: 10,
                    marginTop: 6,
                    alignItems: "center",
                  },
                },
                "stylesheet.calendar.main": {
                  container: {
                    padding: 0,
                  },
                },
              }}
            />
            <LinearGradient style={styles.dateTimeButton} colors={["#DAB451", "#988050"]}>
              <TouchableOpacity onPress={handleConfirm}>
                <Text style={styles.dateTimeText}>Done</Text>
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity style={[styles.dateTimeButton, { marginBottom: 10 }]} onPress={hideDatePicker}>
              <Text style={styles.dateTimeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerUnderLine;

const styles = StyleSheet.create({
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
  titleHeader: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
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
  rowFromDate: {
    flex: 1,
    height: 65,
    backgroundColor: colors.backgroundApp,
    paddingRight: 5,
  },
  textFromDate: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18,
    color: "#A4A4A4",
  },
  endDate: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18,
    color: "#A4A4A4",
  },
  rowEndDate: {
    flex: 1,
    height: 65,
    backgroundColor: colors.backgroundApp,
    paddingLeft: 5,
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
    marginTop: 14,
  },
  dateTimeHeaderText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
  },
  timeContainer: {
    flexDirection: "row",
    padding: 30,
    height: 150,
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
