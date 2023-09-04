import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";

import { colors } from "../../utils/Colors";
const Reason = ({
  title = "REASON",
  content = "",
  visible,
  onRequestClose,
}: {
  title?: string;
  content?: string;
  visible: boolean;
  onRequestClose: () => void;
}) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.containerModal}>
        <View
          style={{
            width: "90%",
            borderRadius: 4,
            backgroundColor: "#414141",
            padding: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View style={{ paddingBottom: 15, borderBottomWidth: 0.5, borderBottomColor: "#C4C4C4" }}>
            <Text style={[{ color: "#DAB451", textAlign: "center", fontWeight: "500" }]}>{title}</Text>
          </View>

          <View
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 3.84,
              elevation: 3,
              marginTop: 15,
              backgroundColor: "#474747",
              padding: 16,
              borderRadius: 4,
            }}
          >
            <Text style={{ color: "#A4A4A4" }}>{content}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              onRequestClose();
            }}
            style={{
              width: 150,
              alignSelf: "center",
              marginBottom: 5,
              marginTop: 32,
              backgroundColor: "#636363",
              paddingHorizontal: 52,
              paddingVertical: 6,
              borderRadius: 4,
            }}
          >
            <Text style={{ fontSize: 16, color: colors.colorText }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Reason;

const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
