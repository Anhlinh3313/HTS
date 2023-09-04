import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";

import { colors } from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ValidateEmail } from "../management/utils";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../assets";
import { _getUserId } from "../../netWorking/authService";
export default function modalSendEmail({
  title = "Weekly Crew Schedule & OT Forecast Sample",
  visible,
  onRequestClose,
  onChangeText,
  onRequestSend,
  isPickType = false,
  isVisibleEmail = true,
}: {
  title?: string;
  dateTime?: string;
  visible: boolean;
  isPickType?: boolean;
  onRequestClose: () => void;
  onRequestSend?: (description, email) => void;
  onChangeText?: (isVisible: boolean) => void;
  isVisibleEmail?: boolean;
}) {
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [valueRadioButton, setValueRadioButton] = useState("excel");
  const handleSend = async () => {
    if (isVisibleEmail) {
      if (email === "") {
        alert("Email cannot be blank!");
        return;
      }
      if (!ValidateEmail(email)) {
        alert("Email invalid!");
        return;
      }
    }
    onRequestSend(description, email);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={() => {
        onRequestClose();
      }}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.containerModal]}>
        <View style={styles.modal}>
          <View style={styles.headerModal}>
            <Text style={styles.textMain}>{title}</Text>
          </View>
          <View style={styles.bodyInputModal}>
            <Text style={[styles.textTitleModal]}>Description</Text>
            <TextInput
              multiline
              style={[styles.inputModal, { height: 180, textAlignVertical: "top" }]}
              placeholder={"Enter Text"}
              placeholderTextColor={colors.gray}
              value={description}
              onChangeText={text => setDescription(text)}
            ></TextInput>
          </View>
          {isVisibleEmail && (
            <View style={styles.bodyInputModal}>
              <Text style={styles.textTitleModal}>Send to email</Text>
              <TextInput
                style={styles.inputModal}
                placeholder={"Enter email"}
                placeholderTextColor={colors.gray}
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType={"email-address"}
              ></TextInput>
            </View>
          )}

          {/* RadioButton */}
          {isPickType && (
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <TouchableOpacity
                onPress={() => {
                  setValueRadioButton("excel");
                }}
                style={styles.radioButtonStyle}
              >
                <SvgUri source={valueRadioButton === "excel" ? Icons.iconRadioButton : Icons.iconRadioButtonOff} />
                <Text style={[styles.textButton, { marginLeft: 10 }]}>Excel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setValueRadioButton("pdf");
                }}
                style={styles.radioButtonStyle}
              >
                <SvgUri source={valueRadioButton === "pdf" ? Icons.iconRadioButton : Icons.iconRadioButtonOff} />
                <Text style={[styles.textButton, { marginLeft: 10 }]}>PDF</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Button */}
          <View style={{ flexDirection: "row", marginTop: 20, marginBottom: 5 }}>
            <TouchableOpacity
              onPress={() => {
                onRequestClose();
              }}
              style={[styles.buttonSend, { backgroundColor: "#636363", flex: 1, marginRight: 8 }]}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                handleSend();
              }}
              style={{ flex: 1, marginLeft: 8 }}
            >
              <LinearGradient style={styles.buttonSend} colors={["#DAB451", "#988050"]}>
                <Text style={styles.textButton}>Send</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  bodyInputModal: {
    marginTop: 15,
  },
  textTitleModal: {
    fontWeight: "600",
    color: colors.gray,
    fontSize: 12,
    marginBottom: 4,
  },
  inputModal: {
    borderRadius: 4,
    backgroundColor: "#303030",
    paddingHorizontal: 10,
    color: colors.colorText,
    paddingVertical: 8,
    fontStyle: "italic",
    fontWeight: "300",
  },

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
  radioButtonStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
