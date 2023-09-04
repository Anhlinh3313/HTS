import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity, Image, ImageProps } from "react-native";
import { ITimeAndLegendModel } from "../../../../../../components/management/contants";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ItemFullTimeDone from "./itemFullTimeDone";
import ItemPartTimeDone from "./itemPartTimeDone";
import { IStaff } from "../../../../../../models/staffModel";
import { Icons, Images } from "../../../../../../assets";
import SvgUri from "react-native-svg-uri";
import { useDispatch, useSelector } from "react-redux";
export interface IModal {
  isShow?: boolean;
  type?: string;
}
interface Props {
  data: IStaff;
}
const ItemStaffDone = (props: Props) => {
  const dispatch = useDispatch();
  const { data } = props;
  const [show, setShow] = useState(false);
  const handleBack = () => {
    dispatch({ type: "CHANGE_CONFIRM", payload: data.id });
  };
  return (
    <View>
      <View style={styles.staff}>
        {data.positionId === 1 ? (
          <View>
            <View
              style={[
                styles.headerStaff,
                {
                  justifyContent: "space-between",
                  backgroundColor: "#504F4F",
                  padding: 10,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                },
              ]}
            >
              <TouchableOpacity onPress={() => handleBack()} style={[styles.headerStaff, { marginBottom: 0 }]}>
                <SvgUri height="15" width="15" fill={colors.mainColor} source={Icons.iconBack} />
                <Text style={[styles.textNameStaff, { color: "#DAB451", marginLeft: 10 }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{}}
                onPress={() => {
                  setShow(!show);
                }}
              >
                <Ionicons name={show ? "caret-up" : "caret-down"} size={20} color={colors.colorLine} />
              </TouchableOpacity>
            </View>
            <View style={[styles.headerStaff, { paddingHorizontal: 10 }]}>
              <View style={[styles.headerStaff, { marginBottom: 0 }]}>
                <Image source={Icons.avatar} style={styles.avatarStaff}></Image>
                <Text style={[styles.textNameStaff, { fontWeight: "700" }]}>{`${data.firstName} ${data.lastName}`}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.headerStaff, { paddingHorizontal: 10, paddingTop: 10, justifyContent: "space-between" }]}>
            <View style={[styles.headerStaff, { marginBottom: 0 }]}>
              <Image source={Icons.avatar} style={styles.avatarStaff}></Image>
              <Text style={[styles.textNameStaff, { fontWeight: "700" }]}>{`${data.firstName} ${data.lastName}`}</Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setShow(!show);
              }}
            >
              <Ionicons name={show ? "caret-up" : "caret-down"} size={20} color={colors.colorLine} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.bodyStaff, { paddingHorizontal: 10 }]}>
          <View style={styles.itemInfoDone}>
            <Text style={[styles.textInfoStaff, { color: colors.gray }]}>Title: </Text>
            <Text style={styles.textInfoStaff}>{data.title}</Text>
          </View>
          <View style={styles.itemInfoDone}>
            <Text style={[styles.textInfoStaff, { color: colors.gray }]}>Position: </Text>
            <Text style={styles.textInfoStaff}>{data.positionName}</Text>
          </View>
          <View style={[styles.itemInfoDone]}>
            <Text style={[styles.textInfoStaff, { color: colors.gray }]}>Phone: </Text>
            <Text style={styles.textInfoStaff}>{data.phone}</Text>
          </View>
        </View>
      </View>
      {show && (
        <View>
          {data.positionName === "Full-Time" ? (
            <View>
              {data.workingScheduleData.map((item, index) => {
                return (
                  <View key={index}>
                    <ItemFullTimeDone data={item}></ItemFullTimeDone>
                  </View>
                );
              })}
            </View>
          ) : (
            <ItemPartTimeDone data={data.workingScheduleData}></ItemPartTimeDone>
          )}
        </View>
      )}
    </View>
  );
};
export default ItemStaffDone;

const styles = StyleSheet.create({
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },

  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "600",
  },
  itemReport: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
  },
  textInfoStaff: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "400",
  },
  buttonForm: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  textButtonForm: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "400",
  },

  buttonConfirmSchedule: {
    width: 150,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  staff: {
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    paddingBottom: 10,
    marginBottom: 12,
  },
  headerStaff: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarStaff: {
    width: 44,
    height: 44,
    borderRadius: 30,
    backgroundColor: "#c4c4c4",
    marginRight: 15,
  },
  textNameStaff: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "500",
  },
  bodyStaff: {},
  itemInfo: {
    marginVertical: 1,
  },
  itemInfoDone: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewTitleFromTo: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 5,
    backgroundColor: "#878787",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  viewFromTo: {
    flexDirection: "row",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    paddingVertical: 10,
  },
});
