import React, { useState, useEffect, useRef } from "react";
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
import { getOPTCode } from "../../../netWorking/authService";
import Loading from "../../../components/dialogs/Loading";
interface Props {
  navigation: StackNavigationProp<AuthorStackParamList>;
  route: RouteProp<AuthorStackParamList, "Verification">;
}
const Verification = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const refInput1: React.MutableRefObject<any> = useRef(),
    refInput2: React.MutableRefObject<any> = useRef(),
    refInput3: React.MutableRefObject<any> = useRef(),
    refInput4: React.MutableRefObject<any> = useRef(),
    refInput5: React.MutableRefObject<any> = useRef(),
    refInput6: React.MutableRefObject<any> = useRef();
  const [input, setInput] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });

  const onHandleInput = (key, value) => {
    setInput(prevState => ({
      ...prevState,
      [key]: value,
    }));
  };
  const [otp, setOtp] = useState("");
  const [time, setTime] = useState(59);
  const [expireOTP, setExpireOTP] = useState(300);
  const onSubmit = () => {
    if (expireOTP === 0) {
      alert("OTP expired, please resend OTP!");
      return;
    }
    if (otp == `${input.input1}${input.input2}${input.input3}${input.input4}${input.input5}${input.input6}`) {
      props.navigation.navigate("CreateNewPassword", { otp });
    } else {
      alert("Wrong OTP!");
    }
  };

  const sendOTP = async () => {
    setIsLoading(true);
    const res = await getOPTCode(props.route.params.input);
    setIsLoading(false);
    if (res.isSuccess === 1) {
      setExpireOTP(300);
      setOtp(res.data);
      alert(res.message);
    } else {
      alert(res.message);
    }
  };
  const reSend = () => {
    if (time == 0) {
      setTime(59);
      sendOTP();
    }
  };

  useEffect(() => {
    sendOTP();
  }, []);

  useEffect(() => {
    if (!time) return;
    const intervalId = setInterval(() => {
      setTime(time - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [time]);
  useEffect(() => {
    if (!expireOTP) return;
    const intervalId = setInterval(() => {
      setExpireOTP(expireOTP - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [expireOTP]);
  return (
    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.rowlogin}>
          <View style={styles.formlogin}>
            <Text style={styles.title}>Please enter OTP code send to {props.route.params.input}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TextInput
                ref={refInput1}
                maxLength={1}
                keyboardType="numeric"
                style={styles.textInput}
                value={input.input1}
                onChangeText={text => {
                  onHandleInput("input1", text);
                  if (input.input1 === "") {
                    refInput2.current.focus();
                  }
                }}
              ></TextInput>
              <TextInput
                ref={refInput2}
                maxLength={1}
                keyboardType="numeric"
                style={styles.textInput}
                value={input.input2}
                onChangeText={text => {
                  onHandleInput("input2", text);
                  if (input.input2 === "") {
                    refInput3.current.focus();
                  } else {
                    refInput1.current.focus();
                  }
                }}
              ></TextInput>
              <TextInput
                ref={refInput3}
                maxLength={1}
                keyboardType="numeric"
                style={styles.textInput}
                value={input.input3}
                onChangeText={text => {
                  onHandleInput("input3", text);
                  if (input.input3 === "") {
                    refInput4.current.focus();
                  } else {
                    refInput2.current.focus();
                  }
                }}
              ></TextInput>
              <TextInput
                ref={refInput4}
                maxLength={1}
                keyboardType="numeric"
                style={styles.textInput}
                value={input.input4}
                onChangeText={text => {
                  onHandleInput("input4", text);
                  if (input.input4 === "") {
                    refInput5.current.focus();
                  } else {
                    refInput3.current.focus();
                  }
                }}
              ></TextInput>
              <TextInput
                ref={refInput5}
                maxLength={1}
                keyboardType="numeric"
                style={styles.textInput}
                value={input.input5}
                onChangeText={text => {
                  onHandleInput("input5", text);
                  if (input.input5 === "") {
                    refInput6.current.focus();
                  } else {
                    refInput4.current.focus();
                  }
                }}
              ></TextInput>
              <TextInput
                ref={refInput6}
                maxLength={1}
                keyboardType="numeric"
                style={styles.textInput}
                value={input.input6}
                onChangeText={text => {
                  onHandleInput("input6", text);
                  if (input.input6 !== "") {
                    refInput5.current.focus();
                  }
                }}
              ></TextInput>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 32 }}>
              <TouchableOpacity onPress={() => reSend()}>
                <Text style={{ color: "#DAB451", marginRight: 8 }}>Resend OTP</Text>
              </TouchableOpacity>
              <Text style={{ color: "#A4A4A4" }}>{time}s</Text>
            </View>
            <LinearGradient style={styles.button} colors={["#DAB451", "#988050"]}>
              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                }}
              >
                <Text style={styles.textButton}>Next</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        {isLoading && <Loading></Loading>}
      </View>
    </TouchableNativeFeedback>
  );
};

export default Verification;

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
    backgroundColor: "rgba(242, 243, 245, 0.2)",
    width: 44,
    height: 56,
    color: "white",
    textAlign: "center",
    borderRadius: 4,
    fontWeight: "700",
    fontSize: 16,
  },
  button: {
    marginTop: 32,
    borderRadius: 4,
    height: 46,
    justifyContent: "center",
  },
});
