import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableHighlight,
} from "react-native";

import { colors } from "../../utils/Colors";
import { Icons } from "../../assets";
import SvgUri from "react-native-svg-uri";
const SendSuccess = ({
  title ="Send Success",
  visible,
  onRequestClose,
}: {
  title?:string;
  visible: boolean;
  onRequestClose: () => void;
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.containerModal}>
        <TouchableHighlight
          underlayColor="#414141"
          style={{ borderRadius: 4 }}
          onPress={() => {
            onRequestClose();
          }}
        >
          <View
            style={{ height: 200, borderRadius: 4, backgroundColor: "#414141" }}
          >
            <SvgUri height="150" source={Icons.iconModelSuccess} />
            <Text style={styles.textConfirm}>{title}</Text>
          </View>
        </TouchableHighlight>
      </View>
    </Modal>
  );
};

export default SendSuccess;

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  textConfirm: {
    color: colors.mainColor,
    fontSize: 20,
    textAlign: "center",
  },
});
