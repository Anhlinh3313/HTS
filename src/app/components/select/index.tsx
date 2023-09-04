import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import { Icons, Images } from "../../assets";
import { CheckBox } from "react-native-elements";
import { colors } from "../../utils/Colors";
import SvgUri from "react-native-svg-uri";
import {IPicker} from '../../models/staffModel'
interface props {
  item: IPicker;
  isCheck: boolean;
  onChecked: (values: IPicker) => void;
}
const Select = ({ item, isCheck, onChecked }: props) => {
  return (
    <View style={{ paddingVertical: 10, flexDirection: "row" }}>
      <CheckBox
        containerStyle={styles.style0}
        checkedIcon={
          <View
            style={[
              styles.iconUnCheck,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <SvgUri source={Icons.iconTickCheckBox}></SvgUri>
          </View>
        }
        uncheckedIcon={<View style={styles.iconUnCheck}></View>}
        checked={isCheck}
        onPress={() => onChecked(item)}
      />
      <Text style={[styles.text]}>{item.name}</Text>
    </View>
  );
};

export default Select;

const styles = StyleSheet.create({
  iconUnCheck: {
    borderRadius: 4,
    backgroundColor: "transparent",
    width: 18,
    height: 18,
    borderColor: "#fff",
    borderWidth: 1,
  },
  style0: {
    margin: 0,
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
  },
  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "400",
    marginLeft: 16,
  },
});
