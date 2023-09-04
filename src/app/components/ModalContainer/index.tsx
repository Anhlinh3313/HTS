import React from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity } from "react-native";
import { colors } from "../../utils/Colors";
interface props {
  title: string | undefined;
  visible: boolean;
  onRequestClose: () => void;
  children?: any;
}
const ModalContainer = ({
  title,
  visible,
  onRequestClose,
  children,
}: props) => {
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
          <View style={styles.bodyInputModal}>{children}</View>

          <View style={{ marginBottom: 15, alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                onRequestClose();
              }}
              style={[
                styles.buttonSend,
                { backgroundColor: "#636363", width: 150 },
              ]}
            >
              <Text style={styles.textButton}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalContainer;

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
    marginVertical:24
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
