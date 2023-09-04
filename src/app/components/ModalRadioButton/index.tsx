import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal,
  TouchableOpacity,
} from "react-native";

import { colors } from "../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../assets";
import { IModalPicker } from "../../models/Imodel";
interface props {
  title: string | undefined;
  visible: boolean;
  data: IModalPicker[];
  onRequestClose: () => void;
  onRequestSend?: (value: string | undefined) => void;
}
const ModalRadioButton = ({
  title,
  visible,
  data,
  onRequestClose,
  onRequestSend,
}: props) => {
  const [value, setValue] = useState<string | undefined>("");
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
      <View style={[styles.containerModal]}>
        <View style={styles.modal}>
          <View style={styles.headerModal}>
            <Text style={styles.textMain}>{title}</Text>
          </View>
          <View style={styles.bodyInputModal}>
            {data.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setValue(item.value);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                >
                  <SvgUri
                    source={
                      value === item.value
                        ? Icons.iconRadioButton
                        : Icons.iconRadioButtonOff
                    }
                  />
                  <Text style={[styles.textButton, { marginLeft: 10 }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", marginBottom: 5 }}>
            <TouchableOpacity
              onPress={() => {
                onRequestClose();
              }}
              style={[
                styles.buttonSend,
                { backgroundColor: "#636363", flex: 1, marginRight: 8 },
              ]}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                onRequestSend(value);
              }}
              style={{ flex: 1, marginLeft: 8 }}
            >
              <LinearGradient
                style={styles.buttonSend}
                colors={["#DAB451", "#988050"]}
              >
                <Text style={styles.textButton}>Done</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalRadioButton;

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
    paddingLeft: 10,
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
});
