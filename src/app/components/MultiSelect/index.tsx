import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Icons, Images } from "../../assets";
import { CheckBox } from "react-native-elements";
import { colors } from "../../utils/Colors";
import SvgUri from "react-native-svg-uri";
import { ScrollView } from "react-native-gesture-handler";
interface props {
  items: { label: string; value: number }[];
  value: number[];
  onChecked: (values: number[]) => void;
}
const MultiSelect = ({ items, value, onChecked }: props) => {
  const [values, setValues] = useState<number[]>([]);

  function handleCheck(key: number) {
    let data = values;
    if (data.includes(key)) {
      data = data.filter(item => item !== key);
      setValues(data);
    } else {
      data = [...data, key];
      setValues(data);
    }
    onChecked(data);
  }
  useEffect(() => {
    setValues(value);
  }, [value]);
  return (
    <View style={{ paddingVertical: 5 }}>
      <ScrollView>
        {items.map((item, index) => {
          return (
            <View
              key={index}
              style={{ paddingVertical: 5, flexDirection: "row" }}
            >
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
                checked={values.includes(item.value)}
                onPress={() => handleCheck(item.value)}
              />
              <Text style={[styles.text]}>{item.label}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default MultiSelect;

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
