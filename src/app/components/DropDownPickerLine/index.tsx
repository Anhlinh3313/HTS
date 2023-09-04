import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Platform } from "react-native";
import { IModalPicker } from "../../models/Imodel";
import { colors } from "../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
  TouchableHighlight,
  TouchableOpacity,
} from "react-native-gesture-handler";
const DropDownPicker = ({
  data,
  itemSelected,
  onSelected,
}: {
  data: IModalPicker[];
  itemSelected: IModalPicker;
  onSelected: (values: IModalPicker) => void;
}) => {
  const [isShow, setIsShow] = useState(false);
  const onSelectedItem = (val: IModalPicker) => {
    onSelected(val);
    setIsShow(!isShow);
  };
  return (
    <View style={{ marginTop: 15, paddingHorizontal: 15, zIndex: 999 }}>
      <TouchableHighlight
        underlayColor={"transparent"}
        onPress={() => {
          setIsShow(!isShow);
        }}
      >
        <View style={styles.viewPicker}>
          <Text style={styles.textMain} numberOfLines={1}>
            {itemSelected.label}
          </Text>
          <Ionicons
            style={styles.iconDown}
            name="caret-down"
            size={20}
            color="#fff"
            onPress={
              Platform.OS === "ios"
                ? () => {
                    setIsShow(!isShow);
                  }
                : undefined
            }
          />
        </View>
      </TouchableHighlight>
      {isShow && (
        <View style={styles.viewPickCategory}>
          {data.map((item, index) => (
            <TouchableHighlight
              key={index}
              underlayColor={"#675E50"}
              onPress={() => onSelectedItem(item)}
              style={styles.itemPicker}
            >
              <Text style={[styles.text, { width: "95%" }]}>{item.label}</Text>
            </TouchableHighlight>
          ))}
        </View>
      )}
    </View>
  );
};

export default DropDownPicker;

const styles = StyleSheet.create({
  viewPicker: {
    justifyContent: "center",
    paddingBottom: 10,
    borderBottomColor: colors.colorLine,
    borderBottomWidth: 1,
  },
  textMain: {
    color: colors.colorLine,
    fontSize: 14,
    fontWeight: "500",
    width: "90%",
  },
  text: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "500",
  },
  iconDown: {
    position: "absolute",
    top: -2,
    right: 0,
    zIndex: 4,
  },
  viewPickCategory: {
    backgroundColor: "#414141",
    borderRadius: 4,
    paddingVertical: 10,
    marginHorizontal: 15,
    position: "absolute",
    right: 0,
    left: 0,
    top: 33,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,elevation: 5
  },
  itemPicker: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
});
