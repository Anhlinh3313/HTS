import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";

import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import TimePicker from "../../../../../../components/management/TimePicker";
import TimePickerVer2 from "../../../../../../components/TimePickerVer2";
import moment from "moment";
import { get12HourTime } from "../../../../../../components/generalConvert/conVertMonDay";
import {
  IUpdateStaffPartTime,
  IWorkingSchedulePartTime,
  NO_RESTRICTION,
  NO_AVAILABILITY,
} from "../../../../../../models/staffModel";
import { useDispatch } from "react-redux";
export default function ItemPartTimeAvailability(props: any) {
  const dispatch = useDispatch();
  const dimensions = Dimensions.get("window");
  const [isSchedule, setIsSchedule] = useState(false);
  const [isShowPickerTime, setIsShowPickerTime] = useState(false);
  const [itemChangeTime, setItemChangeTime] = useState<IWorkingSchedulePartTime>();
  const [dataReqPart, setDataReqPart] = useState<{ FreeDate: string; Rank: string; WorkingTimeId: number[] }[]>([]);

  const [dataStaff, setDataStaff] = useState([]);

  const onShowPickerTime = (item: IWorkingSchedulePartTime) => {
    if (item.staffFreeTimeList[0].workingTimeId !== NO_AVAILABILITY && item.staffFreeTimeList[0].workingTimeId !== null) {
      setItemChangeTime(item);
      setIsShowPickerTime(!isShowPickerTime);
    }
  };
  const HandleSend = (data: IUpdateStaffPartTime) => {
    dispatch({ type: "UPDATE_STAFF_PART_TIME", payload: { StaffId: props.data.staffId, dataUpdate: data } });
  };

  const checkManagementAgree = (item: IWorkingSchedulePartTime) => {
    let index = item.staffFreeTimeList.findIndex(element => element.managementAgree == true);
    if (index !== -1) {
      if (item.staffFreeTimeList[index].workingTimeId === NO_AVAILABILITY) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  };
  const handleViewTime = (item: IWorkingSchedulePartTime) => {
    let times = item.staffFreeTimeList;
    if (times.length === 0) {
      return "NO AVAILABILITY";
    }
    if (checkManagementAgree(item)) {
      // if đã update time
      let _arrTimeDone = [];
      times.forEach(item => {
        if (item.managementAgree) {
          _arrTimeDone.push(item);
        }
      });
      if (_arrTimeDone[0].workingTimeId === NO_RESTRICTION) {
        return _arrTimeDone[0].timeRange.toUpperCase();
      }
      return `${get12HourTime(_arrTimeDone[0].timeStart)} to ${get12HourTime(_arrTimeDone[_arrTimeDone.length - 1].timeEnd)}`;
    } else {
      if (times[times.length - 1].workingTimeId === NO_AVAILABILITY || times[times.length - 1].workingTimeId === NO_RESTRICTION) {
        return times[times.length - 1].timeRange.toUpperCase();
      }
      if (times[0].workingTimeId === null) {
        return "NO AVAILABILITY";
      }
      return `${get12HourTime(times[0].timeStart)} to ${get12HourTime(times[times.length - 1].timeEnd)}`;
    }
  };

  useEffect(() => {
    setDataStaff(props.data.staffFreeTimeInfo);
  }, [props.data.staffFreeTimeInfo]);
  return (
    <View style={{ backgroundColor: "#414141" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
        <View style={[styles.row_between, {}]}>
          <Text style={styles.textGray}>Position</Text>
          <Text style={styles.textTitleHeader400}>{props.data?.roster ?? "-"}</Text>
        </View>
        <View style={[styles.row_between, { paddingVertical: 10 }]}>
          <Text style={styles.textGray}>Schedule</Text>
          <CheckBox
            containerStyle={{
              margin: 0,
              marginLeft: 0,
              marginRight: 0,
              padding: 0,
            }}
            checkedIcon={
              <View style={styles.iconChecked}>
                <Ionicons name={"checkmark"} size={14} color="#DAB451"></Ionicons>
              </View>
            }
            uncheckedIcon={<View style={styles.iconUnCheck}></View>}
            checked={isSchedule}
            onPress={() => setIsSchedule(!isSchedule)}
          />
        </View>
        {isSchedule && (
          <View style={[styles.staff]}>
            <View
              style={{
                flexDirection: "row",
                height: 41,
                alignItems: "center",
                backgroundColor: "#878787",
                paddingLeft: 24,
                marginBottom: 16,
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <Text style={[styles.textTitleHeader400, { flex: 3 }]}>Date</Text>
              <Text style={[styles.textTitleHeader400, { flex: 4 }]}>Timeline</Text>
            </View>
            {dataStaff.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    height: 50,
                    paddingLeft: 24,
                    alignItems: "center",
                  }}
                >
                  <View style={[{ width: dimensions.width / 3 }]}>
                    <View style={[styles.row_between, { width: 80, justifyContent: "space-between" }]}>
                      <Text style={styles.textWeekDays}>{moment(item.freeDate).format("ddd")}</Text>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor:
                            item.staffFreeTimeList.length > 0
                              ? !checkManagementAgree(item)
                                ? item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_AVAILABILITY
                                  ? "#8D7550"
                                  : item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_RESTRICTION
                                  ? "#76D146"
                                  : "#FDB441"
                                : "#FDB441"
                              : "#8D7550",
                          padding: 8,
                          borderRadius: 99,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text style={styles.textNumber}>{item.day}</Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      paddingRight: 15,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        borderColor: "#DAB451",
                        borderWidth: checkManagementAgree(item) ? 1 : 0,
                        borderRadius: 8,
                        paddingHorizontal: 8,
                        paddingVertical: 5,
                      }}
                      onPress={() => (!checkManagementAgree(item) ? onShowPickerTime(item) : undefined)}
                    >
                      <Text
                        style={[
                          styles.textTitleHeader400,
                          {
                            color:
                              item.staffFreeTimeList.length > 0
                                ? !checkManagementAgree(item)
                                  ? item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_AVAILABILITY
                                    ? "#8D7550"
                                    : item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_RESTRICTION
                                    ? "#76D146"
                                    : "#FDB441"
                                  : "#FDB441"
                                : "#8D7550",
                          },
                        ]}
                      >
                        {handleViewTime(item)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
      <TimePicker
        title={itemChangeTime?.freeDate}
        data={itemChangeTime}
        visible={isShowPickerTime}
        onRequestClose={() => {
          setIsShowPickerTime(!isShowPickerTime);
        }}
        onRequestSend={data => {
          HandleSend(data);
        }}
      ></TimePicker>
    </View>
  );
}

const styles = StyleSheet.create({
  row_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 13,
  },
  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 14,
  },
  textWeekDays: {
    color: colors.colorText,
    fontSize: 12,
  },
  textNumber: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "600",
  },
  containerLegend: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  legend: {
    backgroundColor: "#414141",
    borderRadius: 4,
    padding: 10,
    width: "80%",
  },

  staff: {
    backgroundColor: "#675E50",
    borderRadius: 4,
    marginBottom: 10,
    paddingBottom: 10,
  },
});
