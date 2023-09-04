import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { colors } from "../../utils/Colors";
import { useState } from "react";
import moment from "moment";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabReportParamList } from "../../types";
import { _getToken } from "../../netWorking/authService";
import DateTimePicker from "../../components/datetimepicker";
import PickerModel from "../../components/picker/PickerModel";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { checkRole } from "../../components/generalConvert/roles";
interface Props {
  navigation: StackNavigationProp<TabReportParamList>;
}

export default function TabReportScreen(props: Props) {
  const { access } = useSelector((state: RootState) => state.accesses);
  const dataModel = [
    { label: "Outlet 1", value: 1 },
    { label: "Outlet 2", value: 2 },
    { label: "Outlet 3", value: 3 },
    { label: "Outlet 4", value: 4 },
    { label: "Outlet 5", value: 5 },
  ];
  const [pickerValue, setPickerValue] = useState(dataModel[0].label);

  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(
    moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD")
  );
  const itemNavigate = (
    title: string,
    screenName: keyof TabReportParamList
  ) => {
    return (
      <TouchableHighlight
        underlayColor={colors.mainColor}
        onPress={() => {
          props.navigation.navigate(screenName);
        }}
      >
        <View style={[styles.expansionPanel]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <View style={styles.container}>
      <PickerModel
        data={dataModel}
        defaultValue="Outlet"
        onSelectedValue={value => {
          
        }}
      ></PickerModel>
      {/* <DateTimePicker
        onSubmitFromDate={date => setFromDateTime(date)}
        onSubmitEndDate={date => setEndDateTime(date)}
        isShowTime={false}
      ></DateTimePicker> */}
      <View style={styles.line}></View>

      <ScrollView>
        <View style={{ flex: 1 }}>
          {checkRole(access,'Sales & TC - Hourly Screen') && itemNavigate("SALES & TC - HOURLY", "SaleTCHourly")}
          {checkRole(access,'Management Awareness Screen') && itemNavigate("MANAGEMENT AWARENESS", "Awareness")}
          {checkRole(access,'Revenue Management (Item) Screen') && itemNavigate("REVENUE MANAGEMENT (ITEM)", "Revenue")}
          {checkRole(access,'Reveneue Summary') && itemNavigate("Revenue Summary", "RevenueSummary")}
          {/* {itemNavigate("Revenue Item Sold By Category", "RevenueItemSoldByCategory")} */}
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
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
    textTransform: 'uppercase'
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
});
