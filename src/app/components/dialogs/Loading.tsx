import React from "react";
import { Modal, View, Text, ActivityIndicator, Dimensions } from "react-native";

export default function Loading() {
  const dimensions = Dimensions.get("window");
  return (
    <View
      style={{
        position: "absolute",
        zIndex: 999999,
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <View
        style={{
          width: dimensions.width,
          height: dimensions.height - 130,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#988050" />
      </View>
    </View>
  );
}
