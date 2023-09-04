import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  Switch,
  TouchableOpacity,
  TextInput,
  Modal,Keyboard
} from "react-native";
import { colors } from "../../../utils/Colors";
import { RouteProp } from "@react-navigation/native";
import { TabProfileParamList } from "../../../types";

import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../assets";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView } from "react-native-gesture-handler";
import { _getUserId, _addCurrency } from "../../../netWorking/authService";
import { UserService } from "../../../netWorking/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface Props {
  route: RouteProp<TabProfileParamList, "Setting">;
}
export default function Setting(router: Props) {
  const dataCurrencySetting = [
    { label: "Full currency", value: "Display 1,000,000K", id: 0 },
    { label: "K currency", value: "Display 1000K", id: 1 },
    { label: "Mil currency", value: "Display 1.0 Mil", id: 2 },
  ];
  const [sms, setSms] = useState(false);
  const [inApp, setInApp] = useState(false);
  const [email, setEmail] = useState(false);
  const [security, setSecurity] = useState(false);
  const [currencySettingId, setCurrencySettingId] = useState(0);
  const [inputWorkingHour, setInputWorkingHour] = useState("0");
  const [modalConfirm, setModalConfirm] = useState(false);
  const toggleSwitchSms = () => setSms(previousState => !previousState);
  const toggleSwitchInApp = () => setInApp(previousState => !previousState);
  const toggleSwitchEmail = () => setEmail(previousState => !previousState);
  const toggleSwitchSecurity = async() => {
    setSecurity(previousState => !previousState)
    try {
        await AsyncStorage.setItem('security',`${+!security}`);
      } catch (error) {
      }
  }
  async function _getAsyncStorage() {
      try {
          let res= await AsyncStorage.getItem('security');
          setSecurity(!!+res)
      } catch (error) {
          return error;
      }
  }
  //
  const [input, setInput] = useState<UserModel>({});
  //
  const onConfirm = async () => {
    input.isSendSMS = sms;
    input.isSendInApp = inApp;
    input.isSendMail = email;
    input.currencyMode = currencySettingId;
    input.workingHour = inputWorkingHour;
    // await _addCurrency(currencySettingId)
    await AsyncStorage.setItem('currencyMode',currencySettingId.toString());
    updateUser(input);
  };
  //
  const updateUser = async (value) => {
    const user = await UserService.updateUser(value);
    if (user != null) {
      setModalConfirm(!modalConfirm);
      setInput(user);
    }
  }
  //
  async function loadDataUser() {
    let userId = await _getUserId();
    const res = await UserService.getUserById(userId);
    if (res) {
      setInput(res[0]);
      setSms(res[0].isSendSMS ? true : false);
      setInApp(res[0].isSendInApp ? true : false);
      setEmail(res[0].isSendMail ? true : false);
      setInputWorkingHour(res[0].workingHour ? res[0].workingHour.toString() : "0");
      if (res[0].currencyMode) {
        setCurrencySettingId(res[0].currencyMode);
      }
    }
  }

  useEffect(() => {
    loadDataUser();
    _getAsyncStorage();
  }, [])
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
     const keyboardDidShowListener = Keyboard.addListener(
       'keyboardDidShow',
       () => {
         setKeyboardVisible(true); // or some other action
       }
     );
     const keyboardDidHideListener = Keyboard.addListener(
       'keyboardDidHide',
       () => {
         setKeyboardVisible(false); // or some other action
       }
     );
 
     return () => {
       keyboardDidHideListener.remove();
       keyboardDidShowListener.remove();
     };
   }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.topSpace}></View>
      <View style={styles.partBody}>
        <Text style={styles.textTitle}>Notification Setting</Text>
        <View style={styles.containerSetting}>
          {/* <View style={[styles.itemSetting, { marginBottom: 24 }]}>
            <Text style={styles.title}>Send SMS</Text>
            <Switch
              trackColor={{ false: "#303030", true: "#DAB451" }}
              thumbColor={"#fff"}
              onValueChange={toggleSwitchSms}
              value={sms}
            />
          </View> */}
          <View style={[styles.itemSetting, { marginBottom: 24 }]}>
            <Text style={styles.title}>Send In - App Notification</Text>
            <Switch
              trackColor={{ false: "#303030", true: "#DAB451" }}
              thumbColor={"#fff"}
              onValueChange={toggleSwitchInApp}
              value={inApp}
            />
          </View>
          <View style={styles.itemSetting}>
            <Text style={styles.title}>Send E-Mail</Text>
            <Switch
              trackColor={{ false: "#303030", true: "#DAB451" }}
              thumbColor={"#fff"}
              onValueChange={toggleSwitchEmail}
              value={email}
            />
          </View>
        </View>
      </View>
      <View style={styles.topSpace}></View>
      <View style={styles.partBody}>
        <Text style={styles.textTitle}>Security setting</Text>
        <View style={styles.containerSetting}>
          <View style={[styles.itemSetting, { }]}>
            <Text style={styles.title}>FaceID/TouchID</Text>
            <Switch
              trackColor={{ false: "#303030", true: "#DAB451" }}
              thumbColor={"#fff"}
              onValueChange={toggleSwitchSecurity}
              value={security}
            />
          </View>
        </View>
      </View>
      <View style={styles.topSpace}></View>
      <View style={styles.partBody}>
        <Text style={styles.textTitle}>Currency Setting</Text>
        <View style={styles.containerSetting}>
          {dataCurrencySetting.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setCurrencySettingId(item.id)
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom:
                    index === dataCurrencySetting.length - 1 ? 0 : 24,
                }}
              >
                <View>
                  <Text style={[styles.title, { marginBottom: 4 }]}>
                    {item.label}
                  </Text>
                  <Text style={[styles.textValue, {}]}>{item.value}</Text>
                </View>
                <SvgUri
                  source={
                    currencySettingId === item.id ? Icons.iconRadioButton : Icons.iconRadioButtonOff
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={styles.topSpace}></View>
      <View style={[styles.partBody,{marginBottom:isKeyboardVisible?220:0}]}>
        {/* <Text style={styles.textTitle}>Actual Store Working Hours</Text>
        <View style={{ paddingVertical: 9 }}>
          <View style={[{ marginBottom: 24 }]}>
            <TextInput
              keyboardType="numeric"
              style={[styles.input,{ marginRight: 0, marginBottom:32}]}
              value={inputWorkingHour}
              onChangeText={text => setInputWorkingHour(text)}
            ></TextInput>
            
          </View>
        </View> */}
        <LinearGradient
              style={styles.button}
              colors={["#DAB451", "#988050"]}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalConfirm(!modalConfirm);
                }}
              >
                <Text style={{ color: colors.colorText }}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalConfirm}
        statusBarTranslucent={true}
        onRequestClose={() => {
          setModalConfirm(!modalConfirm);
        }}
      >
        <View style={[styles.containerModal]}>
          <View style={styles.modal}>
            <View style={styles.headerModal}>
              <Text style={styles.textMain}>Actual Store Working Hours</Text>
            </View>

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 25,
                paddingHorizontal: 50,
              }}
            >
              <Image source={Icons.iconQuestion} />
              <Text style={{ color: colors.colorText, textAlign: "center", marginTop: 25 }}>
                Are you sure want to change this information?
              </Text>
            </View>

            {/* Button */}
            <View
              style={{ flexDirection: "row", marginTop: 20, marginBottom: 5 }}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalConfirm(!modalConfirm);
                }}
                style={[
                  styles.buttonSend,
                  { backgroundColor: "#636363", flex: 1, marginRight: 8 },
                ]}
              >
                <Text style={styles.textButton}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onConfirm();
                }}
                style={{ flex: 1, marginLeft: 8 }}
              >
                <LinearGradient
                  style={styles.buttonSend}
                  colors={["#DAB451", "#988050"]}
                >
                  <Text style={styles.textButton}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  partBody: {
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  topSpace: {
    width: "100%",
    height: 10,
    backgroundColor: "#2a2731",
  },
  itemSetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    color: colors.colorText,
  },
  textValue: {
    fontSize: 12,
    color: colors.colorLine,
  },
  line: {
    height: 1,
    backgroundColor: colors.colorLine,
    marginVertical: 16,
  },
  textTitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "600",
  },
  containerSetting: {
    paddingHorizontal: 9,
    paddingVertical: 24,
  },

  button: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 2,
    height: 40,
    backgroundColor: "#303030",
    marginRight: 12,
    borderRadius: 4,
    paddingHorizontal: 5,
    color: colors.colorText,
  },
  //modal
  textButton: {
    fontSize: 16,

    color: colors.colorText,
  },
  buttonSend: {
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  containerModal: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#414141",
    borderRadius: 4,
    padding: 15,
    width: "90%",
  },
  headerModal: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
    paddingBottom: 15,
    alignItems: "center",
  },
  textMain: {
    color: "#DAB451",
    fontWeight: "500",
    alignItems: "center",
  },
});
