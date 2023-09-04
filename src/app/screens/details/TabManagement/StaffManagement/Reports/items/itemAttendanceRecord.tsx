import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { CheckBox } from "react-native-elements";
import { Table, Row } from "react-native-table-component";
import { IItemOfficeAttendanceRecord, IPicker } from "../../../../../../models/staffModel";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../../redux/reducers";
import { ReportStaffService } from "../../../../../../netWorking/staffService";
export default function ItemAttendanceRecord(props: any) {
  const dispatch = useDispatch();
  const reports = useSelector((state: RootState) => state.reports);
  const legends = useSelector((state: RootState) => state.staff.legends);
  const tableHead = [];
  const tableRow = [];
  const widthArr = [];
  legends.map(item => {
    tableHead.push(item.code);
    tableRow.push("---");
    widthArr.push(44);
  });
  const weeks = [];
  /// lấy số tuần trong tháng
  for (
    let i = 0;
    i <
    Math.ceil(
      moment(
        new Date(
          new Date(moment(reports.fromDate).format("YYYY-MM-DD")).getFullYear(),
          new Date(moment(reports.fromDate).format("YYYY-MM-DD")).getMonth() + 1,
          0
        )
      ).date() / 7
    );
    i++
  ) {
    weeks.push({ key: i + 1, value: `Week ${i + 1}` });
  }
  //
  const [isNotPresent, setIsNotPresent] = useState(false);
  const [isShowWeeks, setIsShowWeeks] = useState(false);
  const [valueWeeks, setValueWeeks] = useState(weeks[0]);
  const [dataLegendState, setDataLegendState] = useState<IItemOfficeAttendanceRecord[]>([]);
  const [itemChange, setItemChange] = useState(0);
  const [dataRowState, setDataRowState] = useState(tableRow);

  const onHandleLegend = (index: number) => {
    if (itemChange) {
      setItemChange(0);
    } else setItemChange(index);
  };
  const pickWeek = (item: any) => {
    setValueWeeks(item);
    dispatch({
      type: "CHANGE_DATE",
      payload: {
        fromDate: moment(new Date(moment(reports.endDate).format("YYYY-MM-DD")).setDate(item.key * 7 - 6)).format(
          "YYYY-MM-DD 00:00"
        ),
        endDate: moment(new Date(moment(reports.endDate).format("YYYY-MM-DD")).setDate(item.key * 7)).format("YYYY-MM-DD 00:00"),
      },
    });
    setIsShowWeeks(false);
  };
  const handleConfirmLegend = async (item: IPicker) => {
    const res = await ReportStaffService.updateOfficeAttendanceRecord(props.position.id, [
      { workingScheduleId: itemChange, LegendId: item.id },
    ]);
    
    if (res.isSuccess == 1 && res.data) {
      let data = [...dataLegendState];
      let index = dataLegendState.findIndex(e => e.workingScheduleId === itemChange);
      data[index] = { ...data[index], legendId: item.id, legendCode: item.code };
      setDataLegendState(data);
    }
    setItemChange(0);
  };

  const handleColor = (item: string) => {
    switch (item) {
      case "P":
        return "#76D146";
      case "NP":
        return "#FDB441";
      case null:
        return "#8D7550";
      default:
        return "#FF3232";
    }
  };

  useEffect(() => {
    if (props.data) {
      setDataLegendState(props.data.staffWorkingDayInfo);
      let _tableRow = [...tableRow];
      tableHead.map((item, index) => {
        Object.keys(props.data).map(legend => {
          if (item == legend.toUpperCase()) {
            _tableRow[index] = props.data[legend];
          }
        });
      });
      setDataRowState(_tableRow);
    }
  }, [props.data]);
  const disableLegend = item => {
    if (item?.workingDate && item.workingDate.slice(0, 10) != moment(new Date()).format("YYYY-MM-DD")) {
      return true;
    }
    if (item.legendCode == "P") {
      return false;
    }
    if (item.legendCode == null) {
      return false;
    }

    return true;
  };
  useEffect(() => {
    weeks.map(item => {
      if (item.key === Math.ceil(moment(reports.fromDate).date() / 7)) {
        setValueWeeks(item);
      }
    });
  }, [reports.fromDate]);

  return (
    <View style={{ backgroundColor: "#414141" }}>
      <View style={{ paddingHorizontal: 16, zIndex: 2 }}>
        <View style={[styles.row_between, { marginTop: 10 }]}>
          <Text style={styles.textGray}>Roster</Text>
          <Text style={styles.textTitleHeader400}>{props.data ? props.data.dutyName : "-"}</Text>
        </View>
        <View style={[styles.row_between, { paddingVertical: 10 }]}>
          <Text style={styles.textGray}>Check In</Text>
          <CheckBox
            containerStyle={{
              margin: 0,
              marginLeft: 0,
              marginRight: 0,
              padding: 0,
            }}
            checkedIcon={
              <View style={styles.iconChecked}>
                <Ionicons name={"checkmark"} size={14} color="#DAB451"></Ionicons>
              </View>
            }
            uncheckedIcon={<View style={styles.iconUnCheck}></View>}
            checked={isNotPresent}
            onPress={() => setIsNotPresent(!isNotPresent)}
          />
        </View>
        {isNotPresent && (
          <View
            style={{
              marginBottom: 10,
              backgroundColor: "#675E50",
              padding: 16,
            }}
          >
            <TouchableOpacity style={styles.pickerWeek} onPress={() => setIsShowWeeks(!isShowWeeks)}>
              <Text style={styles.textTitleHeader}>{valueWeeks.value}</Text>
              <Ionicons style={{ marginLeft: 28 }} name={"caret-down"} size={20} color="#fff"></Ionicons>
            </TouchableOpacity>
            {isShowWeeks && (
              <View
                style={{
                  position: "absolute",
                  backgroundColor: "#414141",
                  top: 50,
                  left: 16,
                  width: 91,
                  zIndex: 9,
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  paddingTop: 20,
                }}
              >
                {weeks.map((item, index) => {
                  return (
                    <TouchableOpacity key={index} style={{ marginBottom: 15 }} onPress={() => pickWeek(item)}>
                      <Text style={styles.textTitleHeader}>{item.value}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            <View style={{ paddingTop: 12 }}>
              {dataLegendState.length > 0 &&
                dataLegendState.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.row_between,
                        {
                          marginVertical: 4,
                          zIndex: item.workingScheduleId === itemChange ? 10 : 5,
                        },
                      ]}
                    >
                      <View style={[styles.row_between, { width: 80 }]}>
                        <Text style={styles.textWeekDays}>{moment(item.workingDate).format("ddd")}</Text>
                        <View
                          style={{
                            backgroundColor: handleColor(item.legendCode),
                            padding: 8,
                            borderRadius: 99,
                            width: 38,
                            height: 38,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={styles.textNumber}>{moment(item.workingDate).format("DD")}</Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        disabled={disableLegend(item)}
                        onPress={() => {
                          onHandleLegend(item.workingScheduleId);
                        }}
                      >
                        <View
                          style={[
                            {
                              width: 120,
                              borderRadius: 4,
                              backgroundColor: !disableLegend(item) ? "#414141" : "#8C8C8C",
                              paddingHorizontal: 12,
                              paddingVertical: 9,
                            },
                            styles.row_between,
                          ]}
                        >
                          <Text style={styles.textTitleHeader}>{item.legendCode}</Text>
                          <Ionicons
                            style={{ marginLeft: 28 }}
                            name={"caret-down"}
                            size={14}
                            color={!disableLegend(item) ? "#fff" : "#555555"}
                          ></Ionicons>
                        </View>
                      </TouchableOpacity>
                      {item.workingScheduleId === itemChange && (
                        <View
                          style={{
                            backgroundColor: "#878787",
                            borderRadius: 4,
                            position: "absolute",
                            width: 120,
                            height: 110,
                            right: 0,
                            top: 37,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                            paddingTop: 8,
                          }}
                        >
                          <ScrollView>
                            {legends.map(item => {
                              return (
                                <TouchableOpacity
                                  key={item.id}
                                  style={{
                                    paddingHorizontal: 16,
                                    paddingTop: 8,
                                    paddingBottom: 8,
                                  }}
                                  onPress={() => {
                                    handleConfirmLegend(item);
                                  }}
                                >
                                  <Text style={styles.textTitleHeader}>{item.code}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          </View>
        )}
      </View>
      <ScrollView horizontal style={{ borderRadius: 4, paddingHorizontal: 16 }}>
        <Table style={{ marginVertical: 10, borderRadius: 4, marginRight: 32 }}>
          <Row
            data={tableHead}
            widthArr={widthArr}
            style={{
              borderTopLeftRadius: 4,
              borderTopRightRadius: 4,
              height: 36,
              backgroundColor: "#878787",
            }}
            textStyle={styles.textTableTitle}
          />

          <Row data={dataRowState} widthArr={widthArr} style={[styles.styleRowTable]} textStyle={styles.textTable} />
        </Table>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row_between: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconChecked: {
    borderRadius: 4,
    backgroundColor: "#fff",
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  iconUnCheck: {
    borderRadius: 4,
    backgroundColor: "transparent",
    width: 18,
    height: 18,
    borderColor: "#fff",
    borderWidth: 1,
  },
  pickerWeek: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
    width: 91,
    paddingBottom: 8,
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
  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 14,
  },
  textWeekDays: {
    color: colors.colorText,
    fontSize: 12,
  },
  textNumber: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "600",
  },
  containerLegend: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  legend: {
    backgroundColor: "#414141",
    borderRadius: 4,
    padding: 10,
    width: "80%",
  },
  //table

  textTableTitle: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },
  textTable: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
  },

  styleRowTable: {
    height: 37,
    backgroundColor: "#3C3B3B",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
});
