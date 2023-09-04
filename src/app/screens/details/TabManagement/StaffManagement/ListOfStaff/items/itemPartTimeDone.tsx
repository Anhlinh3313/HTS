import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, ImageProps } from "react-native";
import { colors } from "../../../../../../utils/Colors";
import {
  IWorkingSchedulePartTime,
  IWorkingScheduleRequest,
  NO_RESTRICTION,
  NO_AVAILABILITY,
} from "../../../../../../models/staffModel";
import moment from "moment";
import { get12HourTime } from "../../../../../../components/generalConvert/conVertMonDay";
interface Props {
  data: IWorkingSchedulePartTime[] | IWorkingScheduleRequest[];
}
const PartTimeDone = (props: Props) => {
  const { data } = props;
  return (
    <View style={[styles.staff]}>
      <View style={{ flexDirection: "row", marginBottom: 24 }}>
        <Text style={styles.textGray}>Date</Text>
        <Text style={styles.textGray}>Timeline</Text>
      </View>
      {data.map((item, index) => {
        return (
          <View key={index} style={{ flexDirection: "row", height: 50 }}>
            <View style={[{ flex: 1 }]}>
              <View style={[styles.row_between, { width: 80, justifyContent: "space-between" }]}>
                <Text style={styles.textWeekDays}>{moment(item.freeDate).format("ddd")}</Text>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor:
                      item.staffFreeTimeList !== null && item.staffFreeTimeList.length > 0
                        ? item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_AVAILABILITY
                          ? "#8D7550"
                          : item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_RESTRICTION
                          ? "#76D146"
                          : "#FDB441"
                        : "#FDB441",
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
            {item.staffFreeTimeList !== null && item.staffFreeTimeList.length > 0 && (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={[styles.textInfoStaff, {}]}>
                  {item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_AVAILABILITY ||
                  item.staffFreeTimeList[item.staffFreeTimeList.length - 1].workingTimeId === NO_RESTRICTION
                    ? item.staffFreeTimeList[item.staffFreeTimeList.length - 1].timeRange.toUpperCase()
                    : item.staffFreeTimeList[0].workingTimeId !== null
                    ? `${get12HourTime(item.staffFreeTimeList[0].timeStart)} to ${get12HourTime(
                        item.staffFreeTimeList[item.staffFreeTimeList.length - 1].timeEnd
                      )}`
                    : ""}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};
export default PartTimeDone;

const styles = StyleSheet.create({
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  row_between: {
    flexDirection: "row",
    alignItems: "center",
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
  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "600",
  },
  itemReport: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
  },
  textInfoStaff: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "400",
  },
  textGray: {
    flex: 1,
    color: colors.gray,
    fontSize: 14,
    fontWeight: "400",
  },
  buttonForm: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  textButtonForm: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "400",
  },

  buttonConfirmSchedule: {
    width: 150,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  staff: {
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    padding: 16,
    paddingLeft: 25,
    marginBottom: 10,
  },
  headerStaff: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarStaff: {
    width: 44,
    height: 44,
    borderRadius: 30,
    backgroundColor: "#c4c4c4",
    marginRight: 15,
  },
  textNameStaff: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "500",
  },
  bodyStaff: {},
  itemInfo: {
    marginVertical: 1,
  },
  itemInfoDone: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  },
});
