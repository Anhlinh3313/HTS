import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { IPicker } from "../../../models/staffModel";
import { colors } from "../../../utils/Colors";
const index = ({
  data,
  visible,
  onRequestClose,
  onChange,
}: {
  data: IPicker[];
  visible: boolean;
  onRequestClose: () => void;
  onChange: (item: IPicker) => void;
}) => {
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
      <TouchableWithoutFeedback onPress={() => onRequestClose()}>
        <View style={[styles.containerModal]}>
          <View style={styles.modal}>
            {data.map((item, index) => {
              return (
                <TouchableOpacity
                  style={styles.item}
                  key={index}
                  onPress={() => {
                    onChange(item);
                    onRequestClose();
                  }}
                >
                  <Text style={styles.text}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default index;

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
  item: { paddingHorizontal: 30, paddingVertical: 15 },
  text: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "500",
  },
});
