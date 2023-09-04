import React, { useState }  from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";

import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
export default function modalCancel({
  visible,
  onRequestClose,
  onRequestSend,
}: {
  visible: boolean;
  onRequestClose: () => void;
  onRequestSend?: (reason:string) => void;
}) {
  const [reason, setReason] = useState("");
  const handleSend=()=>{
    if(reason===''){alert('Reason cannot be blank!'); return}
    if(reason.length===1){alert('Reason by minimum 2 characters!'); return}
    if(reason.length>100){alert('Reason by maximum 100 characters!'); return}
    onRequestSend(reason)
    onRequestClose()
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      statusBarTranslucent={true}
      onRequestClose={onRequestClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={[styles.containerModal]}>
        <View style={styles.modal}>
          <View style={styles.headerModal}>
            <Text style={styles.textMain}>Reason For Cancel</Text>
          </View>
          <View style={styles.bodyInputModal}>
            <Text style={[styles.textTitleModal]}>Reason</Text>
            <TextInput
              multiline
              style={[styles.inputModal, { height: 180, textAlignVertical:'top' }]}
              placeholder={"Add reason"}
              placeholderTextColor={colors.gray}
              value={reason}
              onChangeText={text => setReason(text)}
            ></TextInput>
          </View>

          <View
            style={{ flexDirection: "row", marginTop: 20, marginBottom: 5 }}
          >
            <TouchableOpacity
              onPress={onRequestClose}
              style={[
                styles.buttonSend,
                { backgroundColor: "#636363", flex: 1, marginRight: 8 },
              ]}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {handleSend()}}
              style={{ flex: 1, marginLeft: 8 }}
            >
              <LinearGradient
                style={styles.buttonSend}
                colors={["#DAB451", "#988050"]}
              >
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
    fontStyle: "italic",
    paddingVertical: 8,
    fontWeight:'300'
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
});
