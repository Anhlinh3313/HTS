import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabManageParamList } from "../../../../../types";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ItemServiceTeam from "./items/itemServiceTeam";
import ItemPartTimeAvailability from "./items/itemPartTimeAvailability";
import ModalPicker from "../../../../../components/management/ModalPicker";
import { StaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import { IPicker, initDataPicker, NO_AVAILABILITY } from "../../../../../models/staffModel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
export interface Props {
  route: RouteProp<TabManageParamList, "Reports">;
  navigation: StackNavigationProp<TabManageParamList>;
}
const PartTimeAvailability = (props: { props: Props }) => {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports);
  const staffs = useSelector((state: RootState) => state.staff.part_time_staffs);
  const [isLoading, setIsLoading] = useState(false);

  const [showPickerTeam, setShowPickerTeam] = useState(false);
  const [valueTeam, setValueTeam] = useState<IPicker>(initDataPicker);

  const [recordAreas, setRecordAreas] = useState<IPicker[]>([]);

  const loadAllRecordArea = async () => {
    const res = await StaffService.getAllRecordArea();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push({ id: item.id, code: item.code, name: item.name });
        }
      });
      setRecordAreas(listData);
    }
  };
  const loadStaffInfo = async () => {
    setIsLoading(true);
    const res = await StaffService.getFreeStaff(reports.fromDate, reports.endDate, valueTeam.id);
    if (res.isSuccess == 1 && res.data) {
      res.data.forEach(staff => {
        staff.staffFreeTimeInfo.forEach(element => {
          element.staffFreeTimeList = element.staffFreeTimeList.filter(_item => _item.timeRange !== null);
        });
      });
      dispatch({ type: "GET_STAFF_PART_TIME", payload: res.data });
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadAllRecordArea();
  }, []);
  useEffect(() => {
    loadStaffInfo();
  }, [valueTeam, reports.fromDate, reports.endDate]);
  useEffect(() => {
    if (recordAreas.length > 0) {
      setValueTeam(recordAreas[0]);
    }
  }, [recordAreas]);

  const onConfirmStaff = async () => {
    setIsLoading(true);
    let reqArr = [];
    // handle request value
    staffs.forEach(staff => {
      let days = [];
      staff.staffFreeTimeInfo.forEach(item => {
        let times = [];
        item.staffFreeTimeList.forEach(time => {
          if (time.managementAgree) {
            times.push(time.workingTimeId);
          }
          if (time.workingTimeId === NO_AVAILABILITY) {
            times.push(time.workingTimeId);
          }
        });
        if (times.length > 0) {
          days.push({
            Rank: item.rank,
            FreeDate: item.freeDate.slice(0, 10),
            WorkingTimeId: times,
          });
        }
      });
      if (days.length > 0) {
        reqArr.push({
          StaffId: staff.staffId,
          StaffFreeTimesList: days,
        });
      }
    });
    const rangeInfos = reqArr.map(t => StaffService.updateStaffFreeTime(t.StaffId, t.StaffFreeTimesList));
    const infos = await Promise.all(rangeInfos);

    setIsLoading(false);
    if (infos.findIndex(item => item.isSuccess === 1) !== -1) {
      props.props.navigation.navigate("Reports", {
        title: "BACK OFFICE - STAFF MANAGEMENT",
        id: 6,
      });
    }
  };
  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>PART-TIME AVAILABILITY</Text>
        </View>
      </View>

      <View
        style={{
          borderRadius: 4,
          marginTop: 6,
          backgroundColor: colors.grayLight,
        }}
      >
        <View
          style={[
            styles.radius_top,
            {
              backgroundColor: "#878787",
              padding: 15,
              justifyContent: "center",
            },
          ]}
        >
          <Text style={[styles.textTitleHeader, { alignSelf: "center" }]}>{`${valueTeam.name.toUpperCase()} TEAM`}</Text>
          <TouchableOpacity
            style={{ position: "absolute", alignSelf: "flex-end", right: 15 }}
            onPress={() => {
              setShowPickerTeam(!showPickerTeam);
            }}
          >
            <Ionicons name="caret-down" size={20} color="#fff"></Ionicons>
          </TouchableOpacity>
        </View>
        {staffs.map((item, index) => {
          return (
            <View key={index}>
              <ItemServiceTeam item={item}>
                <ItemPartTimeAvailability data={item}></ItemPartTimeAvailability>
              </ItemServiceTeam>
            </View>
          );
        })}
      </View>

      <View style={{ padding: 30 }}>
        <TouchableOpacity onPress={() => onConfirmStaff()} style={{ width: 130, alignSelf: "center" }}>
          <LinearGradient style={styles.buttonSend} colors={["#DAB451", "#988050"]}>
            <Text style={styles.textButton}>Confirm</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <ModalPicker
        visible={showPickerTeam}
        data={recordAreas}
        onRequestClose={() => setShowPickerTeam(false)}
        onChange={item => {
          setValueTeam(item);
        }}
      ></ModalPicker>
      {isLoading && <Loading />}
    </View>
  );
};

export default PartTimeAvailability;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  row_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  titleHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
  },
  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 14,
  },
  textGray: {
    color: colors.gray,
    fontWeight: "400",
    fontSize: 14,
  },
  radius_top: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  textTitleHeader400: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 14,
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
    backgroundColor: "#3C3B3B",
  },
  staff: {
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
});
