import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
export default function itemServiceTeam(props: any) {
  const [isVisibleDetail, setIsVisibleDetail] = useState(false);
  return (
    <View>
      <View
        style={[
          styles.row_between,
          {
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#8D7550",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            setIsVisibleDetail(!isVisibleDetail);
          }}
        >
          {isVisibleDetail ? (
            <Ionicons name="remove-circle-outline" size={20} color="#000"></Ionicons>
          ) : (
            <Ionicons name="add-circle-outline" size={20} color="#fff"></Ionicons>
          )}
        </TouchableOpacity>
        <View>
          <Text
            style={[
              {
                fontWeight: "700",
                color: colors.colorText,
                fontSize: 14,
                textAlign: "right",
              },
            ]}
          >
            {props.item ? props.item.staffName : "-"}
          </Text>
          {!isVisibleDetail && (
            <Text
              style={[
                {
                  fontWeight: "400",
                  color: colors.colorLine,
                  fontSize: 12,
                  textAlign: "right",
                },
              ]}
            >
              {props.item?.dutyName ?? props.item.roster ?? "-"}
            </Text>
          )}
        </View>
      </View>
      {isVisibleDetail && <View>{props.children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  row_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
