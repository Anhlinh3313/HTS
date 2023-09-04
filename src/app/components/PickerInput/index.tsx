import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Icons, Images } from "../../assets";
import { colors } from "../../utils/Colors";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
interface props {
  items: string[];
  value: string;
  onChoose: (value: string) => void;
}
const PickerInput = ({ items, value, onChoose }: props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pickValue, setPickValue] = useState(value);
  const handleOnChoose = (item:any) => {
    setPickValue(item)
    setIsVisible(false);
    onChoose(item)
  };
  return (
    <View style={{ flex: 1}}>
      <TouchableOpacity
        style={[styles.inputUnit]}
        onPress={() => {
          setIsVisible(!isVisible);
        }}
      >
        <Text numberOfLines={1} style={{ color: colors.white, width:'80%' }}>{pickValue}</Text>
        <Ionicons
          style={{}}
          name={"caret-down"}
          size={14}
          color={"#fff"}
        ></Ionicons>
      </TouchableOpacity>
      {/* picker */}
      {isVisible && (
        <View style={[styles.pickUnit]}>
          {items.map((item, index) => {
            return (
              <TouchableHighlight
                key={index}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 4,
                }}
                underlayColor={colors.yellowishbrown}
                onPress={()=>handleOnChoose(item)}
              >
                <Text numberOfLines={1} style={{ color: colors.white }}>{item}</Text>
              </TouchableHighlight>
            );
          })}
        </View>
      )}

      {/* -------------- */}
    </View>
  );
};

export default PickerInput;

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
    width:'100%',
    backgroundColor: "#414141",
    borderRadius: 4,
    position: "absolute",
    right: 0,
    top: 50,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex:9999
  },
});
