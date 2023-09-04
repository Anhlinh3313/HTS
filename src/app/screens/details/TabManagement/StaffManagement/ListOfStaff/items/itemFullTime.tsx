import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, ToastAndroid, Platform, Alert } from "react-native";
import { CheckBox } from "react-native-elements";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import MultiSelect from "../../../../../../components/MultiSelect";
import Select from "../../../../../../components/select";
import { IPicker, IWorkingScheduleRequest } from "../../../../../../models/staffModel";
import Loading from "../../../../../../components/dialogs/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/reducers";
import moment from "moment";
import { get12HourTime } from "../../../../../../components/generalConvert/conVertMonDay";
interface Props {
  isSaved: boolean;
  data: IWorkingScheduleRequest;
  index: number;
  onChangeTime: any;
}

const emptyPicker = {
  id: 0,
  code: "",
  name: "",
};
const itemStaffFullTime = (props: Props) => {
  const workingTimes = useSelector((state: RootState) => state.staff.workingTimes);
  const legends = useSelector((state: RootState) => state.staff.legends);
  const { isSaved, data, index, onChangeTime } = props;

  const [isLoading, setIsLoading] = useState(false);

  const [isOT, setIsOT] = useState(false);
  const [visibleBookingTime, setVisibleBookingTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState([]);
  const [visibleBookingLegend, setVisibleBookingLegend] = useState(false);
  const [dataLegend, setDataLegend] = useState<IPicker[]>([]);
  const [valueCheckedLegend, setValueCheckedLegend] = useState<IPicker>(emptyPicker);
  const [valueRemark, setValueRemark] = useState("");
  const [timeModel, setTimeModel] = useState([]);

  const [valueTimeSelected, setValueTimeSelected] = useState([]);

  const onSelectionsChange = (data: any) => {
    setValueCheckedLegend(emptyPicker);
    setValueRemark("");
    setSelectedTime(data);
  };
  const onSelectionsChangeLegend = (data: IPicker) => {
    setSelectedTime([]);
    if (valueCheckedLegend.id === data.id) {
      setValueCheckedLegend(emptyPicker);
    } else setValueCheckedLegend(data);
  };
  const checkOT = () => {
    setIsOT(!isOT);
    if (!isOT) {
      setVisibleBookingTime(true);
    }
  };
  useEffect(() => {
    if (data.WorkingWeekTime !== null) {
      setSelectedTime(data.WorkingWeekTime[0].WorkingWeekTimeId);
      setIsOT(!!data.WorkingWeekTime[0].OT);
    }
    if (data.LegendId !== null) {
      setValueCheckedLegend(legends.find(item => item.id == data.LegendId));
      if (data.Remark !== null) {
        setValueRemark(data.Remark);
      }
    }
  }, []);
  useEffect(() => {
    if (legends.length > 0) {
      setDataLegend(legends);
    }
  }, [legends]);
  useEffect(() => {
    onChangeTime(data.WorkingDate, {
      time: selectedTime,
      legend: valueCheckedLegend.id,
      remark: valueRemark,
      isOT,
    });
  }, [valueCheckedLegend, selectedTime, valueRemark, isOT]);
  useEffect(() => {
    if (workingTimes.length > 0) {
      let items = [];
      workingTimes.map(item => {
        if (isSaved && data.WorkingWeekTime !== null) {
          if (!data.WorkingWeekTime[0].WorkingWeekTimeId.includes(item.id)) {
            items.push({ label: item.timeRange, value: item.id });
          }
        } else {
          items.push({ label: item.timeRange, value: item.id });
        }
      });
      setTimeModel(items);
    }
  }, [workingTimes]);

  const handleTime = () => {
    let timesPick = [];
    let selected = [...selectedTime];

    selected.sort(function (a, b) {
      return a - b;
    });
    selected.map(item => {
      timesPick.push(workingTimes.find(time => time.id === item));
    });
    let arr = [];
    let temp = 0;
    for (let i = 0; i < timesPick.length; i++) {
      if (selected[i] + 1 !== selected[i + 1]) {
        arr.push(timesPick.slice(temp, i + 1));
        temp = i + 1;
      }
      if (selected[i] === selected[selected.length - 1]) {
        arr.push(timesPick.slice(temp, i));
      }
    }
    let result = [];
    arr.map(item => {
      if (item.length > 0) {
        result.push({ from: item[0].timeRange.split(" ")[0], to: item[item.length - 1].timeRange.split(" ")[2] });
      }
    });
    setValueTimeSelected(result);
  };

  useEffect(() => {
    handleTime();
  }, [selectedTime]);

  function notifyMessage(msg: string) {
    if (Platform.OS === "android") {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert(msg)
      return;
    }
  }
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ color: colors.colorText, marginRight: 10 }}>{moment(data.WorkingDate).format("dddd, DD MMMM yyyy")}</Text>
        <CheckBox
          onPress={() =>
            isSaved && data.LegendId !== null
              ? notifyMessage("Legend has been selected, time cannot be changed at this time!")
              : checkOT()
          }
          title="OT"
          checked={isOT}
          checkedColor={"#988050"}
          uncheckedColor={colors.colorText}
          containerStyle={{
            backgroundColor: "transparent",
            borderWidth: 0,
          }}
          textStyle={{ color: colors.colorText, fontWeight: "500" }}
        />
      </View>
      <View style={styles.containerSchedule}>
        <View style={[styles.itemSchedule, { marginBottom: 0 }]}>
          <Text style={styles.textItemReport}>Time</Text>
          <TouchableOpacity
            onPress={() => {
              isSaved && data.LegendId !== null
                ? notifyMessage("Legend has been selected, time cannot be changed at this time!")
                : setVisibleBookingTime(!visibleBookingTime);
            }}
            style={{ position: "absolute", right: 0, top: 9 }}
          >
            <Ionicons name="caret-down" size={20} color={colors.colorLine} />
          </TouchableOpacity>
        </View>

        {visibleBookingTime ? (
          <View style={{ marginTop: 5, height: 150 }}>
            <MultiSelect items={timeModel} onChecked={items => onSelectionsChange(items)} value={selectedTime}></MultiSelect>
          </View>
        ) : (
          <View>
            <View style={[styles.itemSchedule]}>
              <Text style={styles.textInfoStaff}>Straight shift and Split shift</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                }}
              >
                <Text style={[styles.textInfoStaff, { marginRight: 15 }]}>
                  {valueTimeSelected.length > 0 ? get12HourTime(valueTimeSelected[0].from) : ""}
                </Text>
                <Text style={styles.textInfoStaff}>
                  {valueTimeSelected.length > 0 ? get12HourTime(valueTimeSelected[0].to) : ""}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                <Text style={[styles.textInfoStaff, { marginRight: 15 }]}>
                  {valueTimeSelected.length > 1 ? get12HourTime(valueTimeSelected[valueTimeSelected.length - 1].from) : ""}
                </Text>
                <Text style={styles.textInfoStaff}>
                  {valueTimeSelected.length > 1 ? get12HourTime(valueTimeSelected[valueTimeSelected.length - 1].to) : ""}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View style={styles.containerSchedule}>
        <View style={styles.itemSchedule}>
          <Text style={styles.textItemReport}>Legend</Text>
          <TouchableOpacity
            onPress={() => {
              isSaved ? notifyMessage("Legend cannot be changed at this time!") : setVisibleBookingLegend(!visibleBookingLegend);
            }}
            style={{ position: "absolute", right: 0, top: 9 }}
          >
            <Ionicons name="caret-down" size={20} color={colors.colorLine} />
          </TouchableOpacity>
        </View>

        {visibleBookingLegend ? (
          <View>
            <ScrollView style={{ height: 128 }} persistentScrollbar={true} nestedScrollEnabled={true}>
              {dataLegend.map((item, index) => {
                return (
                  <View key={index}>
                    <Select
                      item={item}
                      isCheck={valueCheckedLegend.id === item.id}
                      onChecked={value => onSelectionsChangeLegend(value)}
                    ></Select>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View>
            {valueCheckedLegend.id !== 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 7,
                }}
              >
                <View style={styles.dot}></View>
                <Text style={styles.textInfoStaff}>{`${valueCheckedLegend.code} - ${valueCheckedLegend.name}`}</Text>
              </View>
            )}

            {valueRemark !== "" && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={styles.dot}></View>
                <Text style={styles.textInfoStaff}>Remark: {valueRemark}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      {valueCheckedLegend && visibleBookingLegend && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Text style={[styles.textItemReport, { flex: 1 }]}>Remark</Text>
          <TextInput
            onChangeText={text => setValueRemark(text)}
            value={valueRemark}
            style={{
              backgroundColor: colors.grayLight,
              flex: 4,
              height: 40,
              borderRadius: 4,
              paddingHorizontal: 10,
              color: colors.colorText,
            }}
          ></TextInput>
        </View>
      )}

      <View style={{ backgroundColor: colors.backgroundTab, height: 10 }}></View>
      {isLoading && <Loading />}
    </View>
  );
};
export default itemStaffFullTime;

const styles = StyleSheet.create({
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  itemReport: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
  },
  textItemReport: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "500",
  },
  textInfoStaff: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "400",
  },
  itemInput: {
    height: 40,
    borderRadius: 4,
    backgroundColor: "#303030",
    paddingHorizontal: 11,
    color: colors.colorText,
  },
  buttonForm: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  containerSchedule: {
    height: 200,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  itemSchedule: {
    alignItems: "center",
    justifyContent: "center",
    height: 41,
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: colors.colorText,
    marginHorizontal: 9,
  },
});
