import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/loginScreen';
import ForgotPasswordScreen from '../screens/details/login/ForgotPassword';
import Verification from '../screens/details/login/Verification';
import CreateNewPassword from '../screens/details/login/CreateNewPassword';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthorStackParamList, BottomTabParamList, RootStackParamList } from '../types';
import { colors } from '../utils/Colors';
import { Icons } from "../assets";
import SvgUri from "react-native-svg-uri";

const Stack = createStackNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<AuthorStackParamList>();
const BottomTab = createStackNavigator<BottomTabParamList>();
export const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Root" component={RootStackScreen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );

    function AuthorStackScreen() {
        return (
            <>
                <MainStack.Navigator initialRouteName="Login">
                    <MainStack.Screen name="Login" component={LoginScreen} options={{headerShown: false,}} />
                    <MainStack.Screen name="Forgot" component={ForgotPasswordScreen} options={{ 
                        headerStyle: styles.tabHeaderV2,
                        headerTitle:"FORGOT PASSWORD", headerTitleAlign: 'center',
                        headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
                        headerBackTitleVisible: false,
                        headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
                        headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),}}/>
                    <MainStack.Screen name="Verification" component={Verification} options={{ 
                        headerStyle: styles.tabHeaderV2,
                        headerTitle:"VERIFICATION", headerTitleAlign: 'center',
                        headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
                        headerBackTitleVisible: false,
                        headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
                        headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),}}/>
                    <MainStack.Screen name="CreateNewPassword" component={CreateNewPassword} options={{ 
                        headerStyle: styles.tabHeaderV2,
                        headerTitle:"CREATE NEW PASSWORD", headerTitleAlign: 'center',
                        headerTitleStyle: styles.title, headerTintColor: colors.mainColor,
                        headerBackTitleVisible: false,
                        headerLeftContainerStyle: { paddingLeft: 5, width: 50 },
                        headerBackImage: () => (<SvgUri height="20" width="20" fill={colors.mainColor} source={Icons.iconBack} />),}}/>
                </MainStack.Navigator>
            </>
        );
    }

    function MainStackScreen() {
        return (
            <BottomTab.Navigator initialRouteName="BottomTab">
                <BottomTab.Screen name="BottomTab" component={BottomTabNavigator} options={{ headerShown: false }} />
            </BottomTab.Navigator>
        );
    }

    function RootStackScreen() {
        return (
            <RootStack.Navigator mode="modal" initialRouteName="Author">
                <RootStack.Screen name="Main"
                    component={MainStackScreen}
                    options={{
                        headerShown: false, cardStyle: {
                            backgroundColor: colors.mainColor
                        },
                    }}
                />
                <RootStack.Screen name='Author' component={AuthorStackScreen} options={{ headerShown: false }} />
            </RootStack.Navigator>
        );
    }
}
const styles = StyleSheet.create({
    tabHeader: {
      backgroundColor: '#000',
      shadowOpacity: 0,
    },
    tabHeaderV2: {
      backgroundColor: '#17151C',
      shadowOpacity: 0,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      alignSelf: 'center',
      color: colors.mainColor
    },
    
  });