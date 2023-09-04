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
  route: RouteProp<TabManageParamList, "OnlineSystemScreen">;
  navigation: StackNavigationProp<TabManageParamList>;
}
export default function OnlineSystem(props: Props) {
  const dataReports = {
    screenName: "PAYMENT METHOD",
    reports: [
      {
        id: 1,
        title: "CASH",
        data: [
          ["12", "06:00 AM - 10:00 AM", "10"],
          ["12", "10:00 AM - 02:00 PM", "5"],
          ["12", "02:00 PM - 05:00 PM", "2"],
          ["12", "05:00 PM - 00:00 AM", "4"],
        ],
        child: [],
      },
      {
        id: 2,
        title: "E-WALLET",
        data: [
          ["12", "06:00 AM - 10:00 AM", "10"],
          ["12", "10:00 AM - 02:00 PM", "5"],
          ["12", "02:00 PM - 05:00 PM", "2"],
          ["12", "05:00 PM - 00:00 AM", "4"],
        ],
        child: [
          {
            id: 1,
            title: "MOMO",
            data: [
              ["12", "06:00 AM - 10:00 AM", "10"],
              ["12", "10:00 AM - 02:00 PM", "5"],
              ["12", "02:00 PM - 05:00 PM", "2"],
              ["12", "05:00 PM - 00:00 AM", "4"],
            ],
            child: [],
          },
          {
            id: 2,
            title: "SHOPEE PAY",
            data: [
              ["12", "06:00 AM - 10:00 AM", "10"],
              ["12", "10:00 AM - 02:00 PM", "5"],
              ["12", "02:00 PM - 05:00 PM", "2"],
              ["12", "05:00 PM - 00:00 AM", "4"],
            ],
            child: [],
          },
          {
            id: 3,
            title: "ZALO",
            data: [
              ["12", "06:00 AM - 10:00 AM", "10"],
              ["12", "10:00 AM - 02:00 PM", "5"],
              ["12", "02:00 PM - 05:00 PM", "2"],
              ["12", "05:00 PM - 00:00 AM", "4"],
            ],
            child: [],
          },
        ],
      },
      {
        id: 3,
        title: "CREDIT CARD",
        data: [
          ["12", "06:00 AM - 10:00 AM", "10"],
          ["12", "10:00 AM - 02:00 PM", "5"],
          ["12", "02:00 PM - 05:00 PM", "2"],
          ["12", "05:00 PM - 00:00 AM", "4"],
        ],
        child: [
          {
            id: 1,
            title: "VISA",
            data: [
              ["12", "06:00 AM - 10:00 AM", "10"],
              ["12", "10:00 AM - 02:00 PM", "5"],
              ["12", "02:00 PM - 05:00 PM", "2"],
              ["12", "05:00 PM - 00:00 AM", "4"],
            ],
            child: [],
          },
          {
            id: 2,
            title: "MASTER DATA",
            data: [
              ["12", "06:00 AM - 10:00 AM", "10"],
              ["12", "10:00 AM - 02:00 PM", "5"],
              ["12", "02:00 PM - 05:00 PM", "2"],
              ["12", "05:00 PM - 00:00 AM", "4"],
            ],
            child: [],
          },
          {
            id: 3,
            title: "AMEX",
            data: [
              ["12", "06:00 AM - 10:00 AM", "10"],
              ["12", "10:00 AM - 02:00 PM", "5"],
              ["12", "02:00 PM - 05:00 PM", "2"],
              ["12", "05:00 PM - 00:00 AM", "4"],
            ],
            child: [],
          },
        ],
      },
    ],
  };
  const dataReportsFood = {
    screenName: "FOOD DELIVERY",
    reports: [
      {
        id: 1,
        title: "GRAB FOOD",
        data: [
          ["12", "06:00 AM - 10:00 AM"],
          ["12", "10:00 AM - 02:00 PM"],
          ["12", "02:00 PM - 05:00 PM"],
          ["12", "05:00 PM - 00:00 AM"],
        ],
        child: [],
      },
      {
        id: 2,
        title: "SHOPEE FOOD",
        data: [
          ["12", "06:00 AM - 10:00 AM"],
          ["12", "10:00 AM - 02:00 PM"],
          ["12", "02:00 PM - 05:00 PM"],
          ["12", "05:00 PM - 00:00 AM"],
        ],
        child: [],
      },
      {
        id: 3,
        title: "BAEMIN",
        data: [
          ["12", "06:00 AM - 10:00 AM"],
          ["12", "10:00 AM - 02:00 PM"],
          ["12", "02:00 PM - 05:00 PM"],
          ["12", "05:00 PM - 00:00 AM"],
        ],
        child: [],
      },
    ],
  };
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const toDate = new Date();

  const [openReport, setOpenReport] = useState(false);

  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  const ViewItemReports = (title: string, id: number, data?: any) => {
    return (
      <TouchableHighlight
        underlayColor={colors.yellowishbrown}
        onPress={() => {
          props.navigation.navigate("ReportOnlineSystem", {
            title: "OPERATION - ONLINE SYSTEM",
            data: data,
          });
        }}
        style={{
          paddingHorizontal: 15,
        }}
      >
        <View
          style={[styles.itemReport, { borderBottomWidth: id === 2 ? 0 : 0.5 }]}
        >
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
      <ScrollView>
        <View style={{ flex: 1 }}>
          {/* <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => {
              props.navigation.navigate("OnlineFoodDeliveryRevenue", {
                title: "OPERATION - ONLINE SYSTEM",
              });
            }}
          >
            <View style={[styles.expansionPanel]}>
              <Text style={styles.title}>ONLINE FOOD DELIVERY REVENUE</Text>
            </View>
          </TouchableHighlight> */}
          <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => {
              props.navigation.navigate("OnlinePaymentMethod", {
                title: "OPERATION - ONLINE SYSTEM",
              });
            }}
          >
            <View style={[styles.expansionPanel]}>
              <Text style={styles.title}>PAYMENT METHOD</Text>
            </View>
          </TouchableHighlight>

          {/* <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => setOpenReport(!openReport)}
          >
            <View
              style={[
                styles.expansionPanel,
                styles.boderLeft7,
                { borderLeftWidth: openReport ? 7 : 0 },
              ]}
            >
              <Text style={styles.title}>REPORT</Text>
              <Ionicons
                style={styles.text}
                name={!openReport ? "chevron-forward" : "chevron-down"}
                size={20}
                color="#fff"
              />
            </View>
          </TouchableHighlight> */}
          {openReport && (
            <View style={{ backgroundColor: colors.grayLight }}>
              {ViewItemReports("Payment method", 1, dataReports)}
              {ViewItemReports("Food Delivery", 2, dataReportsFood)}
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
