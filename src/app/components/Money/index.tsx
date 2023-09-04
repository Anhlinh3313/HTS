import React, { useState, useEffect } from "react";
import { Text, StyleProp, TextStyle } from "react-native";
import { _getCurrency } from "../../netWorking/authService";
import { colors } from "../../utils/Colors";
interface props {
  data: number;
  style?: StyleProp<TextStyle>;
}
export default function Money({ data, style = {} }: props) {
  const [value, setValue] = useState("0");
  const [currencyMode, setCurrencyMode] = useState("0");
  const getValueCurrency = async () => {
    let res = await _getCurrency();
    setCurrencyMode(res);
  };
  function convertK(value: number) {
    let number = value / 1000;
    if (Number.isInteger(number)) {
      return `${number}k`;
    } else {
      return `${number.toFixed(2)}k`;
    }
  }
  function convertM(value: number) {
    let number = value / 1000000;
    if (Number.isInteger(number)) {
      return `${number}Mil`;
    } else {
      return `${number.toFixed(2)}Mil`;
    }
  }
  function convertMoney(value: number) {
    if (value) {
      const str = value.toString().split(".");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return str.join(".");
    }
  }
  function convertMoneyK(value: string) {
    if (value) {
      const str = value.split("k");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return str.join("k");
    }
  }
  function convertMoneyM(value: string) {
    if (value) {
      const str = value.split("Mil");
      str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return str.join("Mil");
    }
  }

  useEffect(() => {
    switch (currencyMode) {
      case "0":
        if (data) {
          setValue(convertMoney(Math.round(data)));
        }
        break;

      case "1":
        if (data) {
          setValue(convertMoneyK(convertK(Math.round(data))));
        }
        break;

      case "2":
        if (data) {
          setValue(convertMoneyM(convertM(Math.round(data))));
        }
        break;

      default:
        if (data) {
          const str = Math.round(data).toString().split(".");
          str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          setValue(str.join("."));
        }
        break;
    }
  }, [currencyMode]);
  useEffect(() => {
    getValueCurrency();
  }, []);
  return <Text style={[{ color: colors.colorText }, style]}>{value}</Text>;
}
