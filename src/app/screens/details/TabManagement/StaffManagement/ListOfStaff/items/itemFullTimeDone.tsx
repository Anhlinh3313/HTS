import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, ImageProps } from "react-native";
import { ITimeAndLegendModel } from "../../../../../../components/management/contants";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { IStaff, IPicker, IWorkingScheduleRequest } from "../../../../../../models/staffModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/reducers";
import moment from "moment";
import { get12HourTime } from "../../../../../../components/generalConvert/conVertMonDay";
export interface IModal {
  isShow?: boolean;
  type?: string;
}
export interface IStaffModel {
  id: number;
  avatar: ImageProps;
  fullName: string;
  title: string;
  position: string;
  email: string;
  phone: string;
  isConfirm: false;
  timeAndLegend: ITimeAndLegendModel[];
}
interface Props {
  data?: IWorkingScheduleRequest;
}
const FullTimeDone = (props: Props) => {
  const initTimes = {
    from: '',
    to: ''
  }
  const workingTimes = useSelector((state: RootState) => state.staff.workingTimes);
  const legends = useSelector((state: RootState) => state.staff.legends);
  const { data } = props;

  const [times, setTimes] = useState(initTimes);
  const [timesSplit, settimesSplit] = useState(initTimes);
  const [valueTimeSelected, setValueTimeSelected] = useState([]);

  const handleTime = () => {
    // if (data.WorkingWeekTime[0].timeId.length > 0) {
    //   let from = workingTimes.find(item => item.id === data.WorkingWeekTime[0].timeId[0]).timeRange.slice(0, 5)
    //   let to = workingTimes.find(item => item.id === data.WorkingWeekTime[0].timeId[data.WorkingWeekTime[0].timeId.length - 1]).timeRange.slice(8, 13)
    //   setTimes({ from: from, to: to })
    // }
    // if (data.WorkingWeekTime[0].timeSplitId.length > 0) {
    //   let from2 = workingTimes.find(item => item.id === data.WorkingWeekTime[0].timeSplitId[0]).timeRange.slice(0, 5)
    //   let to2 = workingTimes.find(item => item.id === data.WorkingWeekTime[0].timeSplitId[data.WorkingWeekTime[0].timeSplitId.length - 1]).timeRange.slice(8, 13)

    //   settimesSplit({ from: from2, to: to2 })
    // }


    // let timesPick = [];
    // let selected = [...data.WorkingWeekTime[0].WorkingWeekTimeId];

    // selected.sort(function (a, b) {
    //   return a - b;
    // });
    // selected.map(item => {
    //   timesPick.push(workingTimes.find(time => time.id === item));
    // });
    // let arr = [];
    // let temp = 0;
    // for (let i = 0; i < timesPick.length; i++) {
    //   if (selected[i] + 1 !== selected[i + 1]) {
    //     arr.push(timesPick.slice(temp, i + 1));
    //     temp = i + 1;
    //   }
    //   if (selected[i] === selected[selected.length - 1]) {
    //     arr.push(timesPick.slice(temp, i));
    //   }
    // }
    // let result = [];
    // arr.map(item => {
    //   if (item.length > 0) {
    //     result.push({ from: item[0].timeRange.split(" ")[0], to: item[item.length - 1].timeRange.split(" ")[2] });
    //   }
    // });
    // setValueTimeSelected(result);
    let timesPick = [];
    let selected = [...data.WorkingWeekTime[0].timeId];
    let selectedSplit = [...data.WorkingWeekTime[0].timeSplitId];
    if (selectedSplit.length == 0) {
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
    } else {
      let result = []
      if (selected.length > 0) {
        let from = workingTimes.find(item => item.id === selected[0]).timeRange.slice(0, 5)
        let to = workingTimes.find(item => item.id === selected[selected.length - 1]).timeRange.slice(8, 13)
        result.push({ from: from, to: to })
      }
      if (selectedSplit.length > 0) {
        let from2 = workingTimes.find(item => item.id === selectedSplit[0]).timeRange.slice(0, 5)
        let to2 = workingTimes.find(item => item.id === selectedSplit[selectedSplit.length - 1]).timeRange.slice(8, 13)
        result.push({ from: from2, to: to2 })
      }

      setValueTimeSelected(result);
    }

  };

  useEffect(() => {
    if (data.WorkingWeekTime) {
      handleTime();
    }
  }, [data]);
  return (
    <View>
      {data.WorkingWeekTime !== null && (
        <View style={[styles.staff, { padding: 0 }]}>
          <View style={styles.viewTitleFromTo}>
            <Text style={styles.textInfoStaff}>{moment(data?.WorkingDate).format("DD - MMM - YY")}</Text>
            <Text style={styles.textInfoStaff}>{moment(data?.WorkingDate).format("dddd").toUpperCase()}</Text>
          </View>
          <View style={styles.viewFromTo}>
            <Text style={styles.textInfoStaff}>FROM</Text>
            <Text style={styles.textInfoStaff}>TO</Text>
            <Text style={styles.textInfoStaff}>FROM</Text>
            <Text style={styles.textInfoStaff}>TO</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#8D7550",
              paddingVertical: 10,
            }}
          >
            <Text style={styles.textInfoStaff}>Straight Shift or Split Shift</Text>
          </View>
          <View style={styles.viewFromTo}>
            <Text style={styles.textInfoStaff}>
              {/* {times.from.length > 0 ? get12HourTime(times.from) : "- -"} */}
              {valueTimeSelected.length > 0 ? get12HourTime(valueTimeSelected[0].from) : "--"}
            </Text>
            <Text style={styles.textInfoStaff}>
              {/* {times.to.length > 0 ? get12HourTime(times.to) : "- -"} */}
              {valueTimeSelected.length > 0 ? get12HourTime(valueTimeSelected[0].to) : "--"}
            </Text>
            <Text style={styles.textInfoStaff}>
              {/* {timesSplit.from.length > 0 ? get12HourTime(timesSplit.from) : "- -"}         */}
              {valueTimeSelected.length > 1 ? get12HourTime(valueTimeSelected[valueTimeSelected.length - 1].from) : ""}
            </Text>
            <Text style={styles.textInfoStaff}>
              {/* {timesSplit.to.length > 0 ? get12HourTime(timesSplit.to) : "- -"} */}
              {valueTimeSelected.length > 1 ? get12HourTime(valueTimeSelected[valueTimeSelected.length - 1].to) : ""}
            </Text>
          </View>
        </View>
      )}
      {data.WorkingWeekTime === null && data.LegendId !== null && (
        <View style={[styles.staff, { padding: 0 }]}>
          <View style={styles.viewTitleFromTo}>
            <Text style={styles.textInfoStaff}>{moment(data?.WorkingDate).format("DD - MMM - YY")}</Text>
            <Text style={styles.textInfoStaff}>{moment(data?.WorkingDate).format("dddd").toUpperCase()}</Text>
          </View>
          <View style={styles.viewFromTo}>
            <Text style={styles.textInfoStaff}>FROM</Text>
            <Text style={styles.textInfoStaff}>TO</Text>
            <Text style={styles.textInfoStaff}>FROM</Text>
            <Text style={styles.textInfoStaff}>TO</Text>
          </View>
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#8D7550",
              paddingVertical: 10,
            }}
          >
            <Text style={styles.textInfoStaff}>Legend</Text>
          </View>
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 10,
            }}
          >
            <Text style={styles.textInfoStaff}>{`Legend: ${data.LegendId ? legends.find(item => item.id == data.LegendId).name : "-"
              }`}</Text>
            <Text style={styles.textInfoStaff}>{`Remark: ${data.Remark ? data.Remark : "-"}`}</Text>
          </View>
        </View>
      )}
    </View>
  );
};
export default FullTimeDone;

const styles = StyleSheet.create({
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
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
    padding: 10,
    marginBottom: 12,
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
