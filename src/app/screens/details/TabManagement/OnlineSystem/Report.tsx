import React, { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabManageParamList } from "../../../../types";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardTypeOptions,
  ImageProps,
  Platform,
  Dimensions,
} from "react-native";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "../../../../components/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../assets";
import PickerModel from "../../../../components/picker/PickerModel";
import { Table, Row } from "react-native-table-component";
export interface Props {
  route: RouteProp<TabManageParamList, "ReportOnlineSystem">;
  navigation: StackNavigationProp<TabManageParamList>;
}
const outletModel = [
  { label: "Spa", value: 1 },
  { label: "Ola Restaurant", value: 2 },
];
const dataTable = {
  tableHead: ["Number of uses", "Time", "Promotion"],
  tableData: [
    ["12", "06:00 AM - 10:00 AM", "10"],
    ["12", "06:00 AM - 10:00 AM", "10"],
    ["12", "06:00 AM - 10:00 AM", "10"],
    ["12", "06:00 AM - 10:00 AM", "10"],
  ],
};
const Report = (props: Props) => {
  const dataReports = props.route.params;
  const [outlet, setOutlet] = useState(2);
  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(
    moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD 00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD 23:59")
  );

  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };

  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;
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
        <DateTimePicker
          onSubmitFromDate={date => setFromDateTime(date)}
          onSubmitEndDate={date => setEndDateTime(date)}
        ></DateTimePicker>

        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ paddingHorizontal: 17, marginBottom: 10 }}>
            <View style={styles.titleHeader}>
              <Text style={[styles.text, { textAlign: "center" }]}>
                {dataReports.data.screenName}
              </Text>
            </View>
          </View>
          {dataReports.data.reports.map(item => {
            return (
              <ScrollView
                horizontal
                style={{ borderRadius: 4, marginBottom: 15 }}
              >
                {item.child.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("ReportOnlineSystem", {
                        title: "OPERATION - ONLINE SYSTEM",
                        data: {
                          screenName: item.title,
                          reports: item.child,
                        },
                      });
                    }}
                    style={{
                      position: "absolute",
                      zIndex: 10,
                      right: 10,
                      top: 8,
                    }}
                  >
                    <Ionicons name="caret-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                )}

                <View style={{ backgroundColor: "#414141", borderRadius: 4 }}>
                  <Table style={{ width: windowWidth - 30 }}>
                    <Row
                      data={[item.title]}
                      style={{
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        height: 36,
                        backgroundColor: "#878787",
                      }}
                      flexArr={[1]}
                      textStyle={[styles.text, { alignSelf: "center" }]}
                    />
                    <Row
                      data={
                        item.data[0].length === 2
                          ? ["Number of uses", "Time"]
                          : ["Number of uses", "Time", "Promotion"]
                      }
                      style={{
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: 4,
                        height: 36,
                        backgroundColor: "#414141",
                        paddingLeft: 10,
                        alignItems: "center",
                      }}
                      // flexArr={item.data[0].length === 2 ? [1, 2] : [1, 2, 1]}
                      flexArr={[1, 2, 1]}
                      textStyle={[styles.text12, { alignSelf: "center" }]}
                    />
                    {item.data.map((report, index) => {
                      return (
                        <Row
                          key={index}
                          data={report}
                          style={[
                            styles.styleRowTable,
                            index % 2 === 0 && { backgroundColor: "#8D7550" },
                            { paddingLeft: 10 },
                          ]}
                          flexArr={[1, 2, 1]}
                          textStyle={[
                            styles.textTitleHeader400,
                            {  alignSelf: "center" },
                          ]}
                        />
                      );
                    })}
                  </Table>
                </View>
              </ScrollView>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "500",
  },
  titleHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
  },
  textTitleHeader400: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 14,
  },
  text12: {
    color: colors.gray,
    fontWeight: "400",
    fontSize: 12,
  },
  styleRowTable: {
    height: 36,
    alignItems: "center",
  },
});
