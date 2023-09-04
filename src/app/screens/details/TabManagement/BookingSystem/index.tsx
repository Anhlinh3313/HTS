import React, { useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { TabManageParamList } from "../../../../types";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import PickerModel from "../../../../components/picker/PickerModel";

export interface Props {
  route: RouteProp<TabManageParamList, "BookingSystem">;
  navigation: StackNavigationProp<TabManageParamList>;
}
export default function BookingSystem(props: Props) {
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const toDate = new Date();
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
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
      <ScrollView>
        <View style={{ flex: 1 }}>
          <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => {
              props.navigation.navigate("BookingSystemScreen", {
                title: "OPERATION - BOOKING SYSTEM",
              });
            }}
          >
            <View style={[styles.expansionPanel]}>
              <Text style={styles.title}>BOOKING SYSTEM</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => {
              props.navigation.navigate("ReportBookingSystem", {
                title: "OPERATION - BOOKING SYSTEM",
              });
            }}
          >
            <View style={[styles.expansionPanel]}>
              <Text style={styles.title}>REPORT BOOKING SYSTEM</Text>
            </View>
          </TouchableHighlight>
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
});
