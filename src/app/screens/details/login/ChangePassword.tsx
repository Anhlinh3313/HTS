import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableNativeFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthorStackParamList } from "../../../types";
import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { UserService } from "../../../netWorking/userService";
import { _getUserId, _getItem } from "../../../netWorking/authService";
import Loading from "../../../components/dialogs/Loading";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
interface Props {
  navigation: StackNavigationProp<AuthorStackParamList>;
}

const ChangePassword = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  interface IStatus {
    isShowPass: boolean;
    error: string;
  }
  interface IInput {
    password: IStatus;
    newPassword: IStatus;
    confirmPassword: IStatus;
  }
  const _statusInput = {
    password: { isShowPass: false, error: "" },
    newPassword: { isShowPass: false, error: "" },
    confirmPassword: { isShowPass: false, error: "" },
  };
  const _input = {
    password: "",
    newPassword: "",
    confirmPassword: "",
  };
  const [isSubmit, setIssubmit] = useState(false);

  const [input, setInput] = useState<IPassword>(_input);
  const [statusInput, setStatusInput] = useState(_statusInput);

  const handleInput = (key: string, value: any) => {
    setInput({ ...input, [key]: value });
  };

  const onSubmit = async () => {
    let validate = await validateForm();
    let pass = await _getItem("password");
    if (input.password != pass) {
      alert("Wrong password!");
      return;
    }
    let id = await _getUserId();
    setIsLoading(true);
    if (validate) {
      const res = await UserService.changePassword({
        userId: +id,
        currentPassWord: input.password,
        newPassWord: input.newPassword,
      });
      if (res.isSuccess === 1) {
        setSent("success");
        setStatusSent("Change password success!");
      } else {
        setSent("fail");
        setStatusSent("Change password fail!");
      }
    }
    setIsLoading(false);
  };
  const validateForm = () => {
    if (input.password == "") {
      alert("Password cannot be blank!");
      return false;
    }

    if (input.newPassword == "") {
      alert("New Password cannot be blank!");
      return false;
    }

    if (input.confirmPassword == "") {
      alert("Confirm Password cannot be blank!");
      return false;
    }
    if (input.newPassword != input.confirmPassword) {
      alert("Confirm password must be equal to password!");
      return false;
    }
    return true;
  };
  const handleShowPass = (type: keyof IInput) => {
    let data = statusInput;
    data[type].isShowPass = !data[type].isShowPass;
    setStatusInput({ ...statusInput, ...data });
  };
  const ViewInput = (type: keyof IInput, valueInput: string | undefined, placeholder: string) => {
    return (
      <View style={{ height: 56, marginTop: 5 }}>
        <View style={{ height: 15 }}>
          {statusInput[type].error == "" ? <></> : <Text style={styles.errorText}>{statusInput[type].error}</Text>}
        </View>
        <View
          style={[
            styles.viewInput,
            {
              borderColor: statusInput[type].error == "" ? colors.black : "red",
              borderWidth: 1,
            },
          ]}
        >
          <TextInput
            style={styles.textInput}
            value={valueInput}
            onChangeText={text => handleInput(type, text)}
            placeholder={placeholder}
            placeholderTextColor="#BDBDBD"
            secureTextEntry={!statusInput[type].isShowPass}
          ></TextInput>
          <TouchableOpacity style={styles.showPass}>
            <Ionicons
              name={statusInput[type].isShowPass ? "eye" : "eye-off"}
              size={20}
              color="#fff"
              onPress={() => {
                handleShowPass(type);
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {isSubmit ? (
          <View style={{ justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#988050" />
          </View>
        ) : (
          <></>
        )}
        <View style={styles.rowlogin}>
          <View style={styles.formlogin}>
            {ViewInput("password", input.password, "Password")}
            {ViewInput("newPassword", input.newPassword, "New Password")}
            {ViewInput("confirmPassword", input.confirmPassword, "Confirm Password")}
            <LinearGradient style={styles.button} colors={["#DAB451", "#988050"]}>
              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                }}
              >
                <Text style={styles.textButton}>Complete</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <SendSuccess
          title={statusSent}
          visible={sent === "success"}
          onRequestClose={() => {
            setSent("");
            props.navigation.goBack();
          }}
        ></SendSuccess>
        <SendFail
          title={statusSent}
          visible={sent === "fail"}
          onRequestClose={() => {
            setSent("");
          }}
        ></SendFail>
        {isLoading && <Loading />}
      </View>
    </TouchableNativeFeedback>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLogin,
  },
  title: {
    color: colors.gray,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "400",
  },
  textButton: {
    textAlign: "center",
    color: "white",
    fontSize: 17,
  },
  rowlogin: {
    flex: 7,
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 0,
  },
  formlogin: {
    justifyContent: "flex-start",
    paddingRight: 30,
    paddingLeft: 30,
  },
  viewInput: {
    flexDirection: "row",
    backgroundColor: "rgba(242, 243, 245, 0.2)",
    height: 46,
    borderRadius: 4,
    // marginBottom: 20,
    zIndex: 1,
  },
  textInput: {
    color: "white",
    opacity: 1,
    zIndex: 3,
    width: "100%",
    paddingLeft: 15,
    fontSize: 14,
    fontWeight: "400",
  },
  button: {
    marginTop: 32,
    borderRadius: 4,
    height: 46,
    justifyContent: "center",
  },
  errorText: {
    color: colors.red,
    marginLeft: 5,
    fontWeight: "500",
    fontSize: 12,
    marginStart: 15,
  },

  showPass: {
    justifyContent: "center",
    position: "absolute",
    right: 0,
    zIndex: 4,
    width: 40,
    height: 50,
    alignItems: "center",
  },
});
