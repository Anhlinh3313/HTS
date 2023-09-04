
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from "react";
import TabProfileScreen from "../screens/bottomTabs/TabProfileScreen";
import TabHomeScreen from "../screens/bottomTabs/TabHomeScreen";
import TabManageScreen from "../screens/bottomTabs/TabManageScreen";
import TabReportScreen from "../screens/bottomTabs/TabReportScreen";
import TabOwnerHighLVScreen from "../screens/bottomTabs/TabOwnerHighLVScreen";
import {
  StyleSheet,
  Image,
  ColorValue,
  ImageProps,
  View,
  TouchableOpacity,
  Dimensions,
  Text,
} from 'react-native';
import {
  BottomTabParamList,
  TabHomeParamList,
  TabManageParamList,
  TabOwnerHighLVParamList,
  TabProfileParamList,
  TabReportParamList
} from "../types";
import useColorScheme from "../hooks/useColorScheme";
import Colors from '../constants/Colors';
import { colors } from "../utils/Colors";
import { Icons } from "../assets";
import SvgUri from "react-native-svg-uri";
import { useState, useEffect } from 'react';
import { StackActions } from "@react-navigation/native";

import EmployeeEditProfile from "../screens/details/TabProfile/employeeEditProfile";
import Setting from "../screens/details/TabProfile/setting";
import ChangePassword from "../screens/details/login/ChangePassword";
import RevenueBySubCategory from "../screens/details/TabHome/RevenueBySubCategory";

//Management screen imp
import ManagementDetail from "../screens/details/TabManagement/managementDetail";
import ManagementProductItem from "../screens/details/TabManagement/managementProductItem";
import StockInventoryScreen from "../screens/details/TabManagement/stockInventoryScreen";
import ProductItemListScreen from "../screens/details/TabManagement/productItemListScreen";
import RecipeManagementScreen from "../screens/details/TabManagement/recipeManagementScreen";
import StaffManagementScreen from "../screens/details/TabManagement/StaffManagement/staffManagement";
import listOfStaff from "../screens/details/TabManagement/StaffManagement/ListOfStaff/listOfStaff";
import Reports from "../screens/details/TabManagement/StaffManagement/Reports/report";
import StockInventoryListScreen from "../screens/details/TabManagement/stockInventoryListScreen";
import OnlineSystemScreen from "../screens/details/TabManagement/OnlineSystem";
import OnlineFoodDeliveryRevenue from "../screens/details/TabManagement/OnlineSystem/OnlineFoodDeliveryRevenue";
import OnlinePaymentMethod from "../screens/details/TabManagement/OnlineSystem/OnlinePaymentMethod";
import ReportOnlineSystem from "../screens/details/TabManagement/OnlineSystem/Report";
import BookingSystem from "../screens/details/TabManagement/BookingSystem";
import BookingSystemScreen from "../screens/details/TabManagement/BookingSystem/BookingSystem";
import ReportBookingSystem from "../screens/details/TabManagement/BookingSystem/ReportBookingSystem";
import TableManagement from "../screens/details/TabManagement/TableManagement";

import { LoyaltyScreen } from "../screens/details/TabManagement/Loyalty";
import { MemberShipScreen } from "../screens/details/TabManagement/Loyalty/Membership";
import { LisOfPromotion } from "../screens/details/TabManagement/Loyalty/ListOfPromotion";
import { ListOfOlaMember } from "../screens/details/TabManagement/Loyalty/ListOfOlaMember";
import { PromotionReport } from "../screens/details/TabManagement/Loyalty/PromotionReport";
import { OlaMemberReport } from "../screens/details/TabManagement/Loyalty/OlaMemberReport";

import { HTSStack } from "../screens/details/TabManagement/IOTManagement/HTSStack";


import ReportDetail from "../screens/details/Tabreport/reportDetail";
import SaleTCHourly from "../screens/details/Tabreport/saleTCHourly";
import Awareness from "../screens/details/Tabreport/awareness";
import Revenue from "../screens/details/Tabreport/revenue";
import NumberOfTc from "../screens/details/Tabreport/numberOfTc";
import revenueSummary from "../screens/details/Tabreport/revenueSummary";
import revenueItemSold from "../screens/details/Tabreport/revenueItemSold";

import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { useNavigation } from "@react-navigation/native";
import { checkRole } from "../components/generalConvert/roles";

import UserInactivity from "react-native-user-inactivity";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const { access } = useSelector((state: RootState) => state.accesses);
  const colorScheme = useColorScheme();
  const [active, setActive] = useState(true);
  const navigation = useNavigation();
  useEffect(() => {
    if (!active) {
      navigation.replace("Author");
    }
  }, [active])
  return (
    <UserInactivity
      isActive={active}
      timeForInactivity={300000}
      onAction={isActive => {
        setActive(isActive);
      }}
    >
      <BottomTab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          keyboardHidesTabBar: true,
          activeTintColor: Colors[colorScheme].tint,
          labelStyle: { fontSize: 14 },
          style: {
            backgroundColor: colors.grayLight,
            paddingBottom: 10,
            paddingTop: 15,
            height: 71,
          }
        }}>
        <BottomTab.Screen
          name="Home"
          component={TabHomeNavigator}
          listeners={resetStacksOnTabClicks}
          options={{
            tabBarIcon: ({ color }) => <TabBarIconSvg url={Icons.iconTabHome} color={color} />
          }}
        />
        {checkRole(access, 'Owner High Level Screen') && <BottomTab.Screen
          name="OwnerHighLV"
          component={TabOwnerHighLVNavigator}
          listeners={resetStacksOnTabClicks}
          options={{
            tabBarIcon: ({ color }) => <TabBarIconSvg url={Icons.iconOwnerHighLV} color={color} />
          }}
        />}

        <BottomTab.Screen
          name="Manager"
          component={TabManageNavigator}
          listeners={resetStacksOnTabClicks}
          options={{
            tabBarIcon: ({ color }) => <TabBarIconSvg url={Icons.iconTabManage} color={color} />
          }}
        />
        {checkRole(access, 'REPORT') && <BottomTab.Screen
          name="Report"
          component={TabReportNavigator}
          listeners={resetStacksOnTabClicks}
          options={{
            tabBarIcon: ({ color }) => <TabBarIconSvg url={Icons.iconTabReport} color={color} />
          }}
        />}

        <BottomTab.Screen
          name="Profile"
          component={TabAccountNavigator}
          listeners={resetStacksOnTabClicks}
          options={{
            tabBarIcon: ({ color }) => <TabBarIconSvg url={Icons.iconTabProfile} color={color} />
          }}
        />
      </BottomTab.Navigator>

    </UserInactivity>
  );
}

export const resetStacksOnTabClicks = ({ navigation }: any) => ({
  tabPress: (e: any) => {
    const state = navigation.dangerouslyGetState();
    if (state) {
      const nonTargetTabs = state.routes.filter((r: any) => r.key !== e.target);
      nonTargetTabs.forEach((tab: any) => {
        if (tab?.state?.key) {
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: tab?.state?.key,
          });
        }
      });
    }
  },
});

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
const ViewSwitch = (title: string, image: ImageProps) => {
  const [on, setOn] = useState(false);
  return (
    <View style={styles.viewModalItem}>
      <View style={styles.iconSettingModal}>
        <SvgUri source={image} />
      </View>
      <View style={styles.headerModalItem}>
        <Text style={styles.textModalItem}>{title}</Text>
      </View>
      <TouchableOpacity onPress={() => setOn(!on)} style={styles.checkBox}>
        <SvgUri source={on ? Icons.iconCheckBoxTrue : Icons.checkBox} />
      </TouchableOpacity>
    </View>
  )
}
const ModalNotify = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  return (
    <TouchableOpacity
      onPress={
        () => {
          // tắt theo redmine http://redmine.rnt.vn/issues/8388
          // setModalVisible(true);
        }
      }
    >
      {/* <View style={styles.iconBell}>
        <SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBell} />
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            ></View>
          </TouchableWithoutFeedback>
          <View style={[styles.centeredView, { height: 250 }]}>
            <View style={styles.modalView}>
              <View style={styles.viewModal}>
                <View style={styles.iconSettingModal}>
                  <SvgUri source={Icons.iconSettingModal} />
                </View>
                <View style={styles.headerModal}>
                  <Text style={styles.textModal}>Notification Setting</Text>
                </View>
              </View>
              <View style={styles.line}></View>
              {ViewSwitch('Send SMS', Icons.phone)}
              {ViewSwitch('Send In - App Notification', Icons.iconBellItem)}
              {ViewSwitch('Send E-Mail', Icons.iconMailItem)}
            </View>
          </View>
        </Modal>
      </View> */}
    </TouchableOpacity>
  );
};


function TabBarIconPng(props: { url: any, color: ColorValue }) {
  return <Image style={[styles.icon, { tintColor: props.color }]} source={props.url} />;
}
function TabBarIconSvg(props: { url: ImageProps, color?: string }) {
  return <SvgUri width="20" height="20" fill={props.color} source={props.url} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const TabHomeStack = createStackNavigator<TabHomeParamList>();

function TabHomeNavigator() {
  return (
    <TabHomeStack.Navigator initialRouteName="TabHomeScreen" screenOptions={{ headerStyle: styles.tabHeader }}>
      <TabHomeStack.Screen
        name="TabHomeScreen"
        component={TabHomeScreen}
        options={
          {
            headerTitle: 'HIGH MANAGEMENT', headerTitleStyle: styles.title, headerTitleAlign: 'center',
            headerRight: () => <ModalNotify></ModalNotify>
          }
        }
      />
      <TabHomeStack.Screen
        name="RevenueBySubCategory"
        component={RevenueBySubCategory}
        options={
          {
            headerTitle: 'HIGH MANAGEMENT', headerTitleStyle: styles.title, headerTitleAlign: 'center',
            headerRight: () => <ModalNotify></ModalNotify>,
            headerBackTitleVisible: false,
            headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
            headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          }
        }
      />
    </TabHomeStack.Navigator>
  );
}

const TabOwnerHighLVStack = createStackNavigator<TabOwnerHighLVParamList>();

function TabOwnerHighLVNavigator() {
  const dimensions = Dimensions.get('window');
  return (
    <TabOwnerHighLVStack.Navigator initialRouteName="TabOwnerHighLVScreen" screenOptions={{ headerStyle: styles.tabHeader }}>
      <TabOwnerHighLVStack.Screen
        name="TabOwnerHighLVScreen"
        component={TabOwnerHighLVScreen}
        options={
          {
            headerTitle: 'OWNER HIGH LEVEL', headerTitleStyle: styles.title, headerTitleAlign: 'center',
            headerRight: () => <ModalNotify></ModalNotify>
          }
        }

      />
    </TabOwnerHighLVStack.Navigator>
  );
}

const TabManageStack = createStackNavigator<TabManageParamList>();

function TabManageNavigator() {
  return (
    <TabManageStack.Navigator initialRouteName="TabManageScreen" screenOptions={{ headerStyle: styles.tabHeader }}>
      <TabManageStack.Screen
        name="TabManageScreen"
        component={TabManageScreen}
        options={{
          headerTitle: 'MANAGEMENT',
          headerTitleAlign: 'center',
          headerTitleStyle: styles.title,
          headerRight: () => <ModalNotify></ModalNotify>
        }}
      />
      <TabManageStack.Screen
        name="ManagementProductItem"
        component={ManagementProductItem}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>

        })}
      />
      <TabManageStack.Screen
        name="ManagementDetail"
        component={ManagementDetail}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })}
      />

      <TabManageStack.Screen
        name="StockInventoryScreen"
        component={StockInventoryScreen}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (
            <SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />
          ),
          headerRight: () => <ModalNotify></ModalNotify>
        })}
      />
      <TabManageStack.Screen
        name="StockInventoryListScreen"
        component={StockInventoryListScreen}
        options={({ route }) => ({
          headerTitle: "BACK OFFICE - STOCK INVENTORY LIST", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })}
      />

      <TabManageStack.Screen
        name="ProductItemListScreen"
        component={ProductItemListScreen}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="RecipeManagementScreen"
        component={RecipeManagementScreen}
        options={({ route }) => ({
          headerTitle: 'BACK OFFICE - RECIPE MANAGEMENT', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="StaffManagementScreen"
        component={StaffManagementScreen}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="ListOfStaff"
        component={listOfStaff}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="Reports"
        component={Reports}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="OnlineSystemScreen"
        component={OnlineSystemScreen}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="OnlineFoodDeliveryRevenue"
        component={OnlineFoodDeliveryRevenue}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="OnlinePaymentMethod"
        component={OnlinePaymentMethod}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="ReportOnlineSystem"
        component={ReportOnlineSystem}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="BookingSystem"
        component={BookingSystem}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="BookingSystemScreen"
        component={BookingSystemScreen}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="ReportBookingSystem"
        component={ReportBookingSystem}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="TableManagementScreen"
        component={TableManagement}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="LoyaltyScreen"
        component={LoyaltyScreen}
        options={({ route }) => ({
          headerTitle: "OPERATION - LOYALTY", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="MemberShipScreen"
        component={MemberShipScreen}
        options={({ route }) => ({
          headerTitle: "OPERATION - LOYALTY", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="LisOfPromotion"
        component={LisOfPromotion}
        options={({ route }) => ({
          headerTitle: "OPERATION - LOYALTY", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="ListOfOlaMember"
        component={ListOfOlaMember}
        options={({ route }) => ({
          headerTitle: "OPERATION - LOYALTY", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="PromotionReport"
        component={PromotionReport}
        options={({ route }) => ({
          headerTitle: "OPERATION - LOYALTY", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="OlaMemberReport"
        component={OlaMemberReport}
        options={({ route }) => ({
          headerTitle: "OPERATION - LOYALTY", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
      <TabManageStack.Screen
        name="HTSStack"
        component={HTSStack}
        options={({ route }) => ({
          headerShown: false,
          headerTitle: "IOT", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerBackTitleVisible: false,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),
          headerRight: () => <ModalNotify></ModalNotify>
        })
        }
      />
    </TabManageStack.Navigator>
  );
}

const TabReportStack = createStackNavigator<TabReportParamList>();

function TabReportNavigator() {
  return (
    <TabReportStack.Navigator initialRouteName="TabReportScreen" screenOptions={{ headerStyle: styles.tabHeader }}>
      <TabReportStack.Screen
        name="TabReportScreen"
        component={TabReportScreen}
        options={{
          headerTitle: 'REPORT',
          headerTitleAlign: 'center',
          headerTitleStyle: styles.title,
          headerRight: () => <ModalNotify></ModalNotify>
        }}
      />
      <TabReportStack.Screen
        name="ReportDetail"
        component={ReportDetail}
        options={({ route }) => ({
          headerTitle: route.params.title, headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabReportStack.Screen
        name="SaleTCHourly"
        component={SaleTCHourly}
        options={({ route }) => ({
          headerTitle: 'SALES & TC - HOURLY', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabReportStack.Screen
        name="Awareness"
        component={Awareness}
        options={({ route }) => ({
          headerTitle: 'MANAGEMENT AWARENESS', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabReportStack.Screen
        name="Revenue"
        component={Revenue}
        options={({ route }) => ({
          headerTitle: 'REVENUE MANAGEMENT (ITEM)', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabReportStack.Screen
        name="NumberOfTc"
        component={NumberOfTc}
        options={({ route }) => ({
          headerTitle: 'NUMBER OF TC (ITEM)', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabReportStack.Screen
        name="RevenueSummary"
        component={revenueSummary}
        options={({ route }) => ({
          headerTitle: 'REVENUE SUMMARY', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabReportStack.Screen
        name="RevenueItemSoldByCategory"
        component={revenueItemSold}
        options={({ route }) => ({
          headerTitle: 'REVENUE ITEM SOLD BY CATEGORY', headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
    </TabReportStack.Navigator>
  );
}

const TabAccountStack = createStackNavigator<TabProfileParamList>();

function TabAccountNavigator() {
  return (
    <TabAccountStack.Navigator initialRouteName="TabProfileScreen" screenOptions={{ headerStyle: styles.tabHeader }}>
      <TabAccountStack.Screen
        name="TabProfileScreen"
        component={TabProfileScreen}
        options={{ headerTitle: 'PROFILE', headerTitleStyle: styles.title, headerShown: false }}

      />
      <TabAccountStack.Screen
        name="EmployeeEditProfile"
        component={EmployeeEditProfile}
        options={({ route }) => ({
          headerTitle: "EMPLOYEE EDIT PROFILE", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabAccountStack.Screen
        name="Setting"
        component={Setting}
        options={({ route }) => ({
          headerTitle: "SETTING", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
      <TabAccountStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={({ route }) => ({
          headerTitle: "CHANGE PASSWORD", headerTitleAlign: 'center',
          headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
          headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
          headerBackTitleVisible: false,
          headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />)
        })}
      />
    </TabAccountStack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabHeader: {
    backgroundColor: '#000',
    shadowOpacity: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.mainColor,

  },
  icon: {
    height: 20,
    width: 20,
  },
  iconBell: {
    paddingRight: 15,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    top: 50
  },
  modalView: {
    backgroundColor: colors.grayLight,
    width: 354,
    height: 200,
    borderRadius: 4,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  viewModal: {
    flexDirection: "row",
    height: 50,
    paddingRight: 15,
    paddingTop: 15,
    paddingBottom: 15,
  },
  iconSettingModal: {
    flex: 1,
    height: 25,
    paddingTop: 3,
  },
  headerModal: {
    flex: 9,
    height: 25,
  },
  textModal: {
    fontSize: 17,
    color: '#DAB451',
    fontWeight: 'bold',
  },
  line: {
    height: 0.5,
    backgroundColor: colors.colorLine,
  },
  iconModalItem: {
    flex: 1,
    height: 25,
  },
  viewModalItem: {
    flexDirection: "row",
    height: 50,
    paddingTop: 15,
  },
  textModalItem: {
    fontSize: 17,
    color: colors.colorText,
    fontWeight: 'bold',
  },
  headerModalItem: {
    flex: 8,
    height: 25,
  },
  checkBox: {
    flex: 1,
    height: 25,
  },
});