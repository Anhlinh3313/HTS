import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, useColorScheme, StyleSheet, StatusBar, Platform } from "react-native";
import { Navigation } from "./src/app/navigations/navigation";
import { colors } from "./src/app/utils/Colors";
import { Provider } from "react-redux";
import store from "./src/app/redux/store";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Subscription } from "@unimodules/core";
import * as Font from "expo-font";
// import { AppLoading } from 'expo';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const fetchFonts = () => {
  return Font.loadAsync({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Semibold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
  });
};
const App = () => {
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    fetchFonts()

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
    });

    return () => {
      notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
      responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const isDarkMode = useColorScheme() === "dark";
  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={"light-content"} />
        <Navigation />
      </SafeAreaView>
    </Provider>
  );
};

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
});
