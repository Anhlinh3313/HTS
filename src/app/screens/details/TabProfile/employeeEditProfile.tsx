import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../utils/Colors";
import moment from "moment";
import { Icons } from "../../../assets";
import { RouteProp } from "@react-navigation/native";
import { TabProfileParamList } from "../../../types";
import SvgUri from "react-native-svg-uri";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { _addCurrency, _getUserId } from "../../../netWorking/authService";
import { UserService } from "../../../netWorking/userService";
import DialogAwait from "../../../components/dialogs/Loading";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/reducers";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
export interface Props {
  route: RouteProp<TabProfileParamList, "EmployeeEditProfile">;
}

const dataModel = [
  { label: "Male", value: true },
  { label: "Female", value: false },
];

export default function EmployeeEditProfile(router: Props) {
  const { profile } = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;

  const [modalVisible, setModalVisible] = useState(false);
  const [input, setInput] = useState<UserModel>({});
  const [curentAvatar, setcurentAvatar] = useState<string>('');
  const [newAvatar, setNewAvatar] = useState<string>('');
  const [isSubmit, setIssubmit] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [sentStatus, setSentStatus] = useState("");

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    handleInput("birthday", moment(date.toString()).format("MM/DD/YYYY"));
    hideDatePicker();
  };

  const isValidateForm = () => {
    if (input.fullName == '') {
      alert("FullName cannot be blank!");
      return false;
    }

    if (input.birthday == '') {
      alert("Birthday cannot be blank!");
      return false;
    }

    if (input.phoneNumber == '') {
      alert("Telephone cannot be blank!");
      return false;
    }

    if (input.code == '') {
      alert("Code cannot be blank!");
      return false;
    }

    if (input.email == '') {
      alert("Email cannot be blank!");
      return false;
    }

    if (input.title == '') {
      alert("Title cannot be blank!");
      return false;
    }

    if (input.position == '') {
      alert("Position cannot be blank!");
      return false;
    }
    return true
  }

  const onSubmit = async () => {
    if (isValidateForm() == true) {
      setIssubmit(true);
      const user = await UserService.updateUser(input);
      if (user != null) {
        setSentStatus("success");
        setInput(user)
        dispatch({ type: "UPDATE_PROFILE", payload: user });
        await _addCurrency(`${user.currencyMode}`);
        if (newAvatar && curentAvatar != newAvatar) {
          const res = await UserService.uploadAvatar(newAvatar);
          if (res != null) {
            handleInput("avatarBase64", res.url);
          }
        }
      }else{
        setSentStatus("fail");
      }
      setIssubmit(false);
    }
  }

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    if (!result.cancelled) {
      handleInput("avatarBase64", result.uri);
      if (result.base64)
        setNewAvatar(result.base64);
    }
  };
  const handleInput = (key: string, value: any) => {
    setInput({ ...input, [key]: value });
  };

  // async function loadDataUser() {
  //   let userId = await _getUserId();
  //   const res = await UserService.getUserById(userId);
  //   if (res) {
  //     setInput(res[0])
  //     if (res[0].avatarBase64)
  //       setcurentAvatar(res[0].avatarBase64);
  //   }
  // }
  useEffect(() => {
    setInput(profile)
    setcurentAvatar(profile.avatarBase64);
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.topSpace}></View>
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.textTitle}>Full Name</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => handleInput("fullName", text)}
            value={input.fullName}
            placeholder={"Enter Full Name..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textTitle}>Birthday</Text>

          <View style={styles.viewPicker}>
            <TouchableWithoutFeedback
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
              onPress={showDatePicker}
            >
              <Text style={styles.text}>
                {moment(input.birthday).format("MM/DD/YYYY")}
              </Text>
            </TouchableWithoutFeedback>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            date={input.birthday ? new Date(moment(input.birthday).format("MM/DD/YYYY")) : new Date()}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            isDarkModeEnabled={true}
          />
        </View>
        <View>
          <Text style={styles.textTitle}>Telephone</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => handleInput("phoneNumber", text)}
            keyboardType={"phone-pad"}
            value={input.phoneNumber}
            placeholder={"Enter Telephone Number..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textTitle}>Employee Code</Text>
          <TextInput
            editable={false}
            style={styles.textInput}
            onChangeText={text => handleInput("code", text)}
            keyboardType={"decimal-pad"}
            value={input.code}
            placeholder={"Enter Employee Code..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textTitle}>Gender</Text>
          <View style={styles.viewPicker}>
            <TouchableWithoutFeedback
              style={{
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Text style={styles.text}>{typeof input.gender === 'boolean' ? input.gender ? 'Male' : 'Female' : input.gender === 'true' ? 'Male' : 'Female'}</Text>
            </TouchableWithoutFeedback>

            <Ionicons
              style={styles.iconDown}
              name="caret-down"
              size={20}
              color="#fff"
              onPress={() => {
                setModalVisible(true);
              }}
            />
          </View>
        </View>
        <View>
          <Text style={styles.textTitle}>Email</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => handleInput("email", text)}
            keyboardType={"email-address"}
            value={input.email}
            placeholder={"Enter Your Email..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <TouchableWithoutFeedback onPress={pickImage}>
          <View>
            <Text style={styles.textTitle}>Attached File</Text>
            <View style={[styles.viewFile]}>
              <View style={styles.backgroundIcon}>
                <SvgUri source={Icons.iconPaperclip} />
              </View>
              <Text style={[styles.text, { width: '80%' }]} numberOfLines={1}>
                {input.avatarBase64}
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={styles.textTitle}>Title</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => handleInput("title", text)}
            value={input.title}
            placeholder={"Enter Title..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textTitle}>Position</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => handleInput("namePosition", text)}
            value={input.namePosition}
            placeholder={"Enter Position..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <View>
          <Text style={styles.textTitle}>Workplace</Text>
          <TextInput
            editable={false}
            style={[styles.textInput,{backgroundColor:'#8C8C8C', color:'#555555'}]}
            onChangeText={text => handleInput("workplace", text)}
            value={input.workplace}
            placeholder={"Enter Workplace..."}
            placeholderTextColor={"#A4A4A4"}
          ></TextInput>
        </View>
        <LinearGradient style={[styles.button, { marginBottom: 150 }]} colors={["#DAB451", "#988050"]}>
          <TouchableOpacity
            onPress={() => {
              onSubmit();
            }}
          >
            <Text style={styles.textButton}>Update</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <TouchableHighlight
          style={{ borderRadius: 4, height: windowHeight }}
          onPressIn={() => {
            setModalVisible(false);
          }}
        >
          <View style={[styles.centeredView, { height: windowHeight }]}>
            <View style={styles.modalView}>
              <View>
                <Text style={styles.titleModal}>Choose Gender</Text>
              </View>
              <ScrollView>
                {dataModel.map((data, index) => (
                  <View key={index}>
                    <TouchableHighlight
                      style={{ padding: 10 }}
                      underlayColor={"rgba(0, 0, 0, 0.2)"}
                      onPress={() => {
                        setModalVisible(false);
                        if (data.value == true) {
                          handleInput("gender", "true");
                        }
                        else {
                          handleInput("gender", "false");
                        }
                      }}
                    >
                      <Text
                        style={{
                          color: colors.black,
                          fontWeight: "500",
                          fontSize: 16,
                        }}
                      >
                        {data.label}
                      </Text>
                    </TouchableHighlight>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableHighlight>
      </Modal>

      <SendSuccess
        visible={sentStatus === "success"}
        onRequestClose={() => setSentStatus("")}
      ></SendSuccess>
      <SendFail
        visible={sentStatus === "fail"}
        onRequestClose={() => setSentStatus("")}
      ></SendFail>
      {isSubmit && <DialogAwait></DialogAwait>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  topSpace: {
    width: "100%",
    height: 10,
    backgroundColor: "#2a2731",
  },
  form: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    height: "100%",
  },
  textTitle: {
    color: colors.gray,
    fontSize: 12,
    fontWeight: "600",
  },
  textInput: {
    backgroundColor: "#303030",
    borderRadius: 4,
    height: 40,
    marginVertical: 10,
    paddingHorizontal: 11,
    color: colors.colorText,
    fontWeight: '300'
  },
  button: {
    height: 36,
    width: 150,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 50,
    marginTop: 22,
  },
  textButton: {
    color: colors.colorText,
    fontSize: 16,
  },

  viewPicker: {
    backgroundColor: "#303030",
    borderRadius: 4,
    height: 40,
    marginVertical: 10,
    justifyContent: "center",
    paddingLeft: 11,
  },
  iconDown: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 8,
    zIndex: 4,
  },
  text: {
    color: colors.colorText,
    fontWeight: '300'
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
  titleModal: {
    fontSize: 16,
    color: colors.black,
    textAlign: "center",
    fontWeight: "bold",
  },
  viewFile: {
    backgroundColor: "#303030",
    borderRadius: 4,
    height: 40,
    marginVertical: 10,
    paddingLeft: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  backgroundIcon: {
    backgroundColor: "#636363",
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
});

