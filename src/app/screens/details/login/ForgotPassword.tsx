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
import { AuthorStackParamList } from "../../../types";
import { colors } from "../../../utils/Colors";
import { ValidateEmail } from "../../../components/management/utils";
import { LinearGradient } from "expo-linear-gradient";
import { getOPTCode } from "../../../netWorking/authService";
interface Props {
  navigation: StackNavigationProp<AuthorStackParamList>;
}
const ForgotPassword = (props: Props) => {
  const [isSubmit, setIssubmit] = useState(false);
  const [input, setInput] = useState<string>("");
  const [txtError, setTxtError] = useState("");

  const onChangeInput = (value: string) => {
    setInput(value);
    if (value && input) {
      setTxtError("");
    }
  };

  const clearInput = () => {
    setInput("");
  };

  const onSubmit = async () => {
    let validate = validateForm();
    if (validate) {
      props.navigation.navigate("Verification", { input });
    }
  };

  const validateForm = () => {
    if (input === "") {
      setTxtError("PhoneNumber or Email cannot be blank!");
      return false;
    }
    if (!ValidateEmail(input)) {
      setTxtError("Email invalid!");
      return false;
    }
    return true;
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
            <Text style={styles.title}>
              Please enter your telephone or email address and we will send your password by email immediately.
            </Text>
            <View style={{ height: 56 }}>
              <View style={{ height: 15 }}>{txtError == "" ? <></> : <Text style={styles.errorText}>{txtError}</Text>}</View>
              <View
                style={[
                  styles.viewInput,
                  {
                    borderColor: txtError == "" ? colors.black : "red",
                    borderWidth: 1,
                  },
                ]}
              >
                <TextInput
                  style={styles.textInput}
                  value={input}
                  onChangeText={onChangeInput}
                  placeholder="Telephone or Email"
                  placeholderTextColor="#BDBDBD"
                ></TextInput>
              </View>
            </View>
            <LinearGradient style={styles.button} colors={["#DAB451", "#988050"]}>
              <TouchableOpacity
                onPress={() => {
                  onSubmit();
                }}
              >
                <Text style={styles.textButton}>Send</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
};

export default ForgotPassword;

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
});
