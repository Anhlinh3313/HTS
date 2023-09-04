import React, { useState } from "react";
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
import { RouteProp } from "@react-navigation/native";
import { AuthorStackParamList } from "../../../types";
import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { forgotPassword } from "../../../netWorking/authService";
import Loading from "../../../components/dialogs/Loading";
import SendFail from "../../../components/modalNotification/SendFail";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
interface Props {
  navigation: StackNavigationProp<AuthorStackParamList>;
  route: RouteProp<AuthorStackParamList, "CreateNewPassword">;
}
const CreateNewPassword = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  interface IStatus {
    isShowPass: boolean;
    error: string;
  }
  interface IInput {
    newPassword: IStatus;
    confirmPassword: IStatus;
  }

  const _statusInput = {
    newPassword: { isShowPass: false, error: "" },
    confirmPassword: { isShowPass: false, error: "" },
  };
  const _input = {
    newPassword: "",
    confirmPassword: "",
  };

  const [input, setInput] = useState<IPassword>(_input);
  const [statusInput, setStatusInput] = useState(_statusInput);

  const handleInput = (key: string, value: any) => {
    setInput({ ...input, [key]: value });
  };

  const handleShowPass = (type: keyof IInput) => {
    let data = statusInput;
    data[type].isShowPass = !data[type].isShowPass;
    setStatusInput({ ...statusInput, ...data });
  };

  const validateForm = () => {
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
  const onSubmit = async () => {
    let validate = await validateForm();
    if (validate) {
      setIsLoading(true);
      const res = await forgotPassword(props.route.params.otp, input.newPassword, input.confirmPassword);
      setIsLoading(false);
      if (res.isSuccess === 1) {
        setSent("success");
        setStatusSent(res.message)
      } else {
        setSent("fail");
        setStatusSent(res.message)
      }
    }
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
        <View style={styles.rowlogin}>
          <View style={styles.formlogin}>
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
            props.navigation.replace("Login");
          }}
        ></SendSuccess>
        <SendFail
          title={statusSent}
          visible={sent === "fail"}
          onRequestClose={() => {
            setSent("");
          }}
        ></SendFail>
        {isLoading && <Loading></Loading>}
      </View>
    </TouchableNativeFeedback>
  );
};

export default CreateNewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#17151C",
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
