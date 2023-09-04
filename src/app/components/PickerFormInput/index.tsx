import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Dimensions, TouchableHighlight, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icons, Images } from "../../assets";
import { colors } from "../../utils/Colors";
// import { ScrollView, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
interface IPicker {
  id: number;
  code: string;
  name: string;
}
interface props {
  items: IPicker[];
  title: string;
  //   value: IPicker;
  onChoose: (value: IPicker) => void;
}
const PickerFormInput = ({ items, title, onChoose }: props) => {
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;
  const [isVisible, setIsVisible] = useState(false);
  const [pickValue, setPickValue] = useState<IPicker>(items[0]);
  const handleOnChoose = (item: IPicker) => {
    setPickValue(item);
    setIsVisible(false);
    onChoose(item);
  };
  return (
    <View style={{ flex: 1, marginBottom: 15 }}>
      <Text style={styles.textTitleItemInput}>{title}</Text>
      <TouchableOpacity
        style={[styles.inputUnit]}
        onPress={() => {
          setIsVisible(!isVisible);
        }}
      >
        <Text numberOfLines={1} style={{ color: colors.white, width: "80%" }}>
          {pickValue.name}
        </Text>
        <Ionicons style={{}} name={"caret-down"} size={14} color={"#fff"}></Ionicons>
      </TouchableOpacity>
      {/* picker */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible);
        }}
      >
        <TouchableHighlight
          style={{ borderRadius: 4, height: windowHeight }}
          onPressIn={() => {
            setIsVisible(false);
          }}
        >
          <View style={[styles.centeredView, { height: windowHeight, backgroundColor: "rgba(0, 0, 0, 0.5)" }]}>
            <View style={[styles.modalView, { width: windowWidth - 50 }]}>
              <ScrollView>
                {items.map((item, index) => (
                  <View key={index}>
                    <TouchableHighlight
                      style={{ padding: 10 }}
                      underlayColor={colors.yellowishbrown}
                      onPress={() => handleOnChoose(item)}
                    >
                      <Text style={[{ color: colors.white }]}>{item.name}</Text>
                    </TouchableHighlight>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableHighlight>
      </Modal>
    </View>
  );
};

export default PickerFormInput;

const styles = StyleSheet.create({
  inputUnit: {
    height: 40,
    flex: 1,
    borderRadius: 4,
    backgroundColor: "#303030",
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  pickUnit: {
    width: "100%",
    maxHeight: 177,
    backgroundColor: "#414141",
    borderRadius: 4,
    position: "absolute",
    right: 0,
    top: 71,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textTitleItemInput: {
    color: colors.gray,
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 9,
  },
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
    maxHeight: 177,
  },

  /////
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  modalView: {
    backgroundColor: colors.grayLight,
    width: "85%",
    maxHeight: 300,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    paddingVertical: 10,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
