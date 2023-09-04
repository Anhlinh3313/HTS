import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { ITimeAndLegendModel } from "../../../../../../components/management/contants";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import MultiSelect from "../../../../../../components/MultiSelect";
import Select from "../../../../../../components/select";
import Dash from "react-native-dash";
import {
  initDataPicker,
  IPicker,
  IWorkingSchedulePartTime,
  NO_RESTRICTION,
  NO_AVAILABILITY,
} from "../../../../../../models/staffModel";
import { StaffService } from "../../../../../../netWorking/staffService";
import Loading from "../../../../../../components/dialogs/Loading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/reducers";
import moment from "moment";
import TimePickerStaffParttime from "../../../../../../components/TimePickerStaffParttime";
interface Props {
  data: IWorkingSchedulePartTime;
  onChangeTime: (data: number[], id: string) => void;
  onChangeIsNo: (data: number[], id: string) => void;
}
const itemStaffPartTime = (props: Props) => {
  const { workingPartTimes } = useSelector((state: RootState) => state.staff);
  const { data, onChangeTime, onChangeIsNo } = props;
  const [isLoading, setIsLoading] = useState(false);

  const [isLimit, setLimit] = useState(initDataPicker); // no availability or no restriction

  const [visibleBookingTime, setVisibleBookingTime] = useState(false);
  const [selectedTime, setSelectedTime] = useState<number[]>([]);
  const [timeModel, setTimeModel] = useState([]);
  const [noTimeModel, setNoTimeModel] = useState([]);

  const onSelectionsChangeTime = (data: any) => {
    setLimit(initDataPicker);
    setSelectedTime(data);
  };
  const onSelectionsChangeNo = (data: IPicker) => {
    setSelectedTime([]);
    setLimit(data);
  };
  useEffect(() => {
    if (selectedTime.length > 0) {
      onChangeTime(selectedTime, data.freeDate);
    }
    if (isLimit.id) {
      if (isLimit.id === NO_RESTRICTION) {
        let arrAll = [];
        workingPartTimes.forEach(item => {
          if (item.checkFreeTime) {
            arrAll.push(item.id);
          }
          if (item.id === NO_RESTRICTION) {
            arrAll.push(item.id);
          }
        });
        onChangeIsNo(arrAll, data.freeDate);
      } else {
        onChangeIsNo([isLimit.id], data.freeDate);
      }
    }
  }, [isLimit, selectedTime]);

  useEffect(() => {
    if (workingPartTimes.length > 0) {
      let items = [];
      let noItems = [];
      workingPartTimes.map(item => {
        if (!item.checkFreeTime) {
          noItems.push({ id: item.id, code: item.note, name: item.timeRange });
        } else {
          items.push({ label: item.timeRange, value: item.id });
        }
      });
      setNoTimeModel(noItems);
      setTimeModel(items);
    }
  }, [workingPartTimes]);

  const groupBy = function (time) {
    let timesPick = [];
    let selected = [...time];
    selected.sort((a, b) => a - b);
    selected.map(item => {
      timesPick.push(workingPartTimes.find(time => time.id === item));
    });
    let arr = [];
    const arr_soft = timesPick.reduce(function (rv, x) {
      if (!rv.length || x.value - rv[rv.length - 1].slice(-1)[0].value !== 1) {
        arr = [x];
        rv.push(arr);
      } else {
        arr = rv[rv.length - 1];
        arr.push(x);
      }
      return rv;
    }, []);
    if (arr_soft.length > 0) {
      return { from: arr_soft[0][0].timeRange.slice(0, 5), to: arr_soft[arr_soft.length - 1][0].timeRange.slice(-5) };
    } else return { from: "", to: "" };
  };
  return (
    <View style={{ marginTop: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Text style={{ color: colors.colorText, marginRight: 10 }}>{moment(data.freeDate).format("dddd, DD MMMM yyyy")}</Text>
      </View>
      <View style={styles.containerSchedule}>
        <View style={[styles.itemSchedule, { marginBottom: 0 }]}>
          <Text style={styles.textItemReport}>Time</Text>
          <TouchableOpacity
            onPress={() => {
              setVisibleBookingTime(!visibleBookingTime);
            }}
            style={{ position: "absolute", right: 0, top: 9 }}
          >
            <Ionicons name="caret-down" size={20} color={colors.colorLine} />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 5 }}>
          {visibleBookingTime ? (
            <View>
              <View style={{ }}>
                {/* <MultiSelect
                  items={timeModel}
                  value={selectedTime}
                  onChecked={items => onSelectionsChangeTime(items)}
                ></MultiSelect> */}
                <TimePickerStaffParttime data={selectedTime} onChangeTime={(times)=>onSelectionsChangeTime(times)}></TimePickerStaffParttime>
              </View>
              {noTimeModel.map((item, index) => {
                return (
                  <View key={index}>
                    <Dash dashStyle={{ height: 0.5 }} dashColor={colors.colorLine} />
                    <Select item={item} isCheck={isLimit.id === item.id} onChecked={() => onSelectionsChangeNo(item)}></Select>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={{ marginBottom: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: 15,
                  paddingBottom: 15,
                }}
              >
                <Text style={styles.textInfoStaff}>From</Text>
                <Text style={styles.textInfoStaff}>To</Text>
              </View>
              {isLimit.id ? (
                <View style={{ paddingHorizontal: 15 }}>
                  <Text style={styles.textInfoStaff}>{isLimit.name}</Text>
                </View>
              ) : (
                <View
                  style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 15 }}
                >
                  <Text style={styles.textInfoStaff}>{groupBy(selectedTime).from}</Text>
                  <Text style={styles.textInfoStaff}>{groupBy(selectedTime).to}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
      {isLoading && <Loading />}
    </View>
  );
};
export default itemStaffPartTime;

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

  iconUnCheck: {
    borderRadius: 4,
    backgroundColor: "transparent",
    width: 18,
    height: 18,
    borderColor: "#fff",
    borderWidth: 1,
  },
  style0: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
});
