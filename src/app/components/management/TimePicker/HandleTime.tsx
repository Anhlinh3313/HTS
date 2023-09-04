import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import moment from "moment";
import { colors } from "../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
interface Props {
  title?: string; // "From" || "To"
  value?: string; // HH:MM
  onChange?: (time: string) => void;
  onChangeOBJ?: (time: { hour: number; minute: number; period: string }) => void;
}
const HandleTime = ({ title = "", value = "", onChange, onChangeOBJ }: Props) => {
  const dateValue = new Date(new Date(`2021-08-02T${value}:00.000Z`).getTime() - 25200000);
  const toDate = new Date();
  const [hour, setHour] = useState(+moment(dateValue).format("h"));
  const [minute, setMinute] = useState(+moment(dateValue).format("mm"));
  const [period, setPeriod] = useState(moment(dateValue).format("a"));
  const increaseHour = () => {
    if (hour < 12) {
      setHour(hour + 1);
    } else setHour(1);
  };
  const decreaseHour = () => {
    if (hour > 1) {
      setHour(hour - 1);
    } else setHour(12);
  };
  const increaseMinute = () => {
    if (minute === 0) {
      setMinute(30);
    } else setMinute(0);
  };
  useEffect(() => {
    const time = `${hour}:${minute} ${period}`;
    onChange(time);
    let dataTime = { hour: 0, minute: 0, period: "am" };
    if (period == "am") {
      dataTime = { hour: hour == 12 ? 0 : hour, minute: minute, period: period };
    } else {
      dataTime = { hour: hour == 12 ? 12 : hour + 12, minute: minute, period: period };
    }
    onChangeOBJ(dataTime);
  }, [hour, minute, period]);
  useEffect(() => {
    if (value === "") {
      if (title == "From") {
        setHour(8);
        setMinute(0);
        setPeriod("am");
      }
      if (title == "To") {
        setHour(5);
        setMinute(0);
        setPeriod("pm");
      }
    }
  }, []);
  return (
    <View
      style={{
        paddingHorizontal: 30,
        paddingBottom: 30,
      }}
    >
      <Text style={[styles.text4, { marginBottom: 4 }]}>{title}</Text>
      <View style={styles.timeContainer}>
        <View style={styles.timeHourView}>
          <TouchableOpacity style={styles.timeArrow} onPress={increaseHour}>
            <Ionicons name="caret-up" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.timeText}>{`${hour}h`}</Text>
          <TouchableOpacity onPress={decreaseHour} style={styles.timeArrow}>
            <Ionicons name="caret-down" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Text
            style={[
              styles.timeText,
              {
                fontWeight: "700",
              },
            ]}
          >
            :
          </Text>
        </View>
        <View style={styles.timeHourView}>
          <TouchableOpacity style={styles.timeArrow} onPress={increaseMinute}>
            <Ionicons name="caret-up" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.timeText}>{`${minute}m`}</Text>
          <TouchableOpacity style={styles.timeArrow} onPress={increaseMinute}>
            <Ionicons name="caret-down" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}></View>
        <View style={styles.timePeriod}>
          <TouchableOpacity onPress={() => setPeriod("am")}>
            <Text
              style={{
                color: period === "am" ? "#DAB451" : "#A4A4A4",
                fontSize: 18,
              }}
            >
              AM
            </Text>
          </TouchableOpacity>
          <View style={styles.timePeriodDivide}></View>
          <TouchableOpacity onPress={() => setPeriod("pm")}>
            <Text
              style={{
                color: period === "pm" ? "#DAB451" : "#A4A4A4",
                fontSize: 18,
              }}
            >
              PM
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HandleTime;

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingRight: 15,
    paddingLeft: 15,
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
});
