import React, { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  Modal,
} from "react-native";
import { TabManageParamList } from "../../../../types";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "../../../../components/datetimepicker";
import PickerModel from "../../../../components/picker/PickerModel";
import { StaffService } from "../../../../netWorking/staffService";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../redux/reducers";

import { checkRole } from "../../../../components/generalConvert/roles";
export interface Props {
  route: RouteProp<TabManageParamList, "StaffManagementScreen">;
  navigation: StackNavigationProp<TabManageParamList>;
}
export default function StaffManagementScreen(props: Props) {
  const dispatch = useDispatch();
  const { access } = useSelector((state: RootState) => state.accesses);
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD 00:00"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD 23:59"));
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };

  const loadAllWorkingTime = async () => {
    const res = await StaffService.getAllWorkingTime();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push(item);
        }
      });
      dispatch({ type: "GET_ALL_WORKING_TIME", payload: listData });
    }
  };
  const loadAllWorkingTimeFreeStaff = async () => {
    const res = await StaffService.getAllWorkingTimeFreeStaff();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push(item);
        }
      });
      dispatch({ type: "GET_ALL_WORKING_PART_TIME", payload: listData });
    }
  };
  const loadAllLegend = async () => {
    const res = await StaffService.getAllLegend();
    if (res.isSuccess == 1 && res.data) {
      let _res = [];
      res.data.map(item => {
        _res.push({ id: item.id, code: item.code, name: item.name });
      });
      dispatch({ type: "GET_ALL_LEGEND", payload: _res });
    }
  };
  const loadAllRecordArea = async () => {
    const res = await StaffService.getAllRecordArea();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push({ id: item.id, code: item.code, name: item.name });
        }
      });
      dispatch({ type: "GET_ALL_RECORD_AREA", payload: listData });
    }
  };
  useEffect(() => {
    loadAllWorkingTime();
    loadAllRecordArea();
    loadAllLegend();
    loadAllWorkingTimeFreeStaff();
  }, []);
  const ViewItemReports = (title: string, id: number) => {
    return (
      <TouchableHighlight
        underlayColor={colors.yellowishbrown}
        onPress={() => {
          props.navigation.navigate("Reports", {
            title: "BACK OFFICE - STAFF MANAGEMENT",
            id: id,
          });
        }}
        style={{
          paddingHorizontal: 15,
        }}
      >
        <View style={[styles.itemReport, { borderBottomWidth: id === 6 ? 0 : 0.5 }]}>
          <Text style={styles.textItemReport}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <View style={styles.container}>
      <PickerModel
        data={outletModel}
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>
      <View style={styles.line}></View>
      {/* <DateTimePicker
        onSubmitFromDate={date => setFromDateTime(date)}
        onSubmitEndDate={date => setEndDateTime(date)}
      ></DateTimePicker> */}
      <ScrollView>
        <View style={{ flex: 1 }}>
          <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => {
              props.navigation.navigate("ListOfStaff", {
                title: "BACK OFFICE - STAFF MANAGEMENT",
              });
            }}
          >
            <View style={[styles.expansionPanel]}>
              <Text style={styles.title}>LIST OF STAFF</Text>
              <Ionicons style={styles.text} name={"chevron-forward-outline"} size={20} color="#fff" onPress={() => {}} />
            </View>
          </TouchableHighlight>
          {checkRole(access, "Detail Report") ? (
            <View>
              <TouchableHighlight underlayColor={colors.mainColor}>
                <View style={[styles.expansionPanel, styles.boderLeft7]}>
                  <Text style={styles.title}>REPORT</Text>
                </View>
              </TouchableHighlight>
              <View style={{ backgroundColor: colors.grayLight }}>
                {ViewItemReports("Weekly Crew Schedule & OT Forecast Sample", 1)}
                {ViewItemReports("Weekly Dynamic Crew Schedule", 2)}
                {ViewItemReports("Office Attendance Record", 3)}
                {ViewItemReports("Overtime Record", 4)}
                {ViewItemReports("Part - time availability", 5)}
                {ViewItemReports("Weekly Part - time Schedule", 6)}
              </View>
            </View>
          ) : (
            <View>
              {checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") ? (
                <View></View>
              ) : (
                <View>
                  <TouchableHighlight underlayColor={colors.mainColor}>
                    <View style={[styles.expansionPanel, styles.boderLeft7]}>
                      <Text style={styles.title}>REPORT</Text>
                    </View>
                  </TouchableHighlight>
                  <View style={{ backgroundColor: colors.grayLight }}>
                    {checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)") &&
                      ViewItemReports("Office Attendance Record", 3)}
                    {checkRole(access, "Approve Overtime") && ViewItemReports("Overtime Record", 4)}
                    {checkRole(access, "Part TIme Roster/Schedule (Management)") &&
                      ViewItemReports("Part - time availability", 5)}
                    {checkRole(access, "Part TIme Roster/Schedule (Management)") &&
                      ViewItemReports("Weekly Part - time Schedule", 6)}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
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
    color: colors.white,
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
});
