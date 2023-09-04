import React, { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, StyleSheet, ScrollView } from "react-native";
import { TabManageParamList } from "../../../../../types";
import { colors } from "../../../../../utils/Colors";
import moment from "moment";
import DateTimePicker from "../../../../../components/datetimepicker";
import WeeklyCrewSchedule from "./WeeklyCrewSchedule";
import WeeklyDynamicCrewSchedule from "./WeeklyDynamicCrewSchedule";
import OvertimeRecord from "./OvertimeRecord";
import OfficeAttendanceRecord from "./OfficeAttendanceRecord";
import PartTimeAvailability from "./PartTimeAvailability";
import WeeklyPartTimeSchedule from "./WeeklyPartTimeSchedule";

import PickerModel from "../../../../../components/picker/PickerModel";
import { useSelector, useDispatch } from "react-redux";
import { getMonday } from "../../../../../components/generalConvert/conVertMonDay";
import { RootState } from "../../../../../redux/reducers";
export interface Props {
  route: RouteProp<TabManageParamList, "Reports">;
  navigation: StackNavigationProp<TabManageParamList>;
}
const outletModel = [
  { label: "Spa", value: 1 },
  { label: "Ola Restaurant", value: 2 },
];
export default function Reports(props: Props) {
  const reports = useSelector((state: RootState) => state.reports);
  const dispatch = useDispatch();
  const [outlet, setOutlet] = useState(2);
  const handleChangeDateTime = (date: string) => {
    const _date = new Date(moment(date).format("YYYY-MM-DD"));
    let endWeekDay = new Date(_date).setDate(getMonday(_date).getDate() + 6);
    if (getMonday(_date).getMonth() < new Date(endWeekDay).getMonth()) {
      //check ngày đầu tuần và ngày hiện tại khác tháng
      if(new Date(endWeekDay).getMonth() - getMonday(_date).getMonth() ===2){
        endWeekDay = new Date(new Date().setMonth(_date.getMonth() - 1)).setDate(getMonday(_date).getDate() + 6);
      }
    }
    dispatch({
      type: "CHANGE_DATE",
      payload: {
        fromDate: moment(getMonday(_date)).format("YYYY-MM-DD 00:00"),
        endDate: moment(endWeekDay).format("YYYY-MM-DD 23:59"),
      },
    });
  };
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };

  const ViewBody = () => {
    switch (props.route.params.id) {
      case 1:
        return <WeeklyCrewSchedule props={props}></WeeklyCrewSchedule>;
      case 2:
        return <WeeklyDynamicCrewSchedule></WeeklyDynamicCrewSchedule>;
      case 3:
        return <OfficeAttendanceRecord></OfficeAttendanceRecord>;
      case 4:
        return <OvertimeRecord></OvertimeRecord>;
      case 5:
        return <PartTimeAvailability props={props}></PartTimeAvailability>;
      case 6:
        return <WeeklyPartTimeSchedule></WeeklyPartTimeSchedule>;

      default:
        break;
    }
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <PickerModel
          data={outletModel}
          defaultValue="Ola Restaurant"
          onSelectedValue={value => {
            onchangeOutlet(value.value);
          }}
        ></PickerModel>
        <View style={styles.line}></View>
        {!props.route.params.data &&
          <DateTimePicker
            onSubmitFromDate={date => handleChangeDateTime(date)}
            onSubmitEndDate={date => handleChangeDateTime(date)}
            fromDate={reports.fromDate}
            endDate={reports.endDate}
            pickWeek={true}
          ></DateTimePicker>
        }

        <View>{ViewBody()}</View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "600",
  },
  textTime: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 8,
  },
  containerPicker: {
    marginTop: 10,
    backgroundColor: colors.backgroundApp,
    paddingBottom: 15,
  },
  viewPicker: {
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
  },
  pickerModal: {
    height: 46,
    borderRadius: 4,
    justifyContent: "center",
    backgroundColor: colors.grayLight,
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
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

  expansionPanel: {
    flex: 1,
    height: 60,
    paddingLeft: 8,
    paddingRight: 25,
    paddingTop: 18,
    paddingBottom: 15,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundApp,
  },
  boderLeft7: {
    borderLeftColor: colors.mainColor,
    borderLeftWidth: 7,
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
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },

  modalView: {
    backgroundColor: colors.white,
    width: 354,
    height: 200,
    padding: 15,
    borderRadius: 4,
    paddingBottom: 20,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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
    borderColor: colors.backgroundApp,
    borderWidth: 2,
    top: 42,
    right: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  itemPicker: {
    height: 30,
    justifyContent: "center",
  },
  textItemPicker: {
    color: colors.colorText,
  },
});
