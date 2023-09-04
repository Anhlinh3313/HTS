import * as React from "react";
import { StyleSheet, View, Text, ScrollView, TouchableHighlight, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import moment from "moment";
import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "../../../components/datetimepicker";
import PickerModel from "../../../components/picker/PickerModel";
import ModalSendEmail from "../../../components/management/items/modalSendEmail";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
import { Table, Row, Cell } from "react-native-table-component";
import { getMonday } from "../../../components/generalConvert/conVertMonDay";
import { FilterViewModel } from "../../../models/filterViewModel";
import { ReportService } from "../../../netWorking/SpeedposService";
import { TableRevenue } from "../../../models/tablerevenue";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import DialogAwait from "../../../components/dialogs/Loading";
import MoneyText from "../../../components/Money";
import DropDown from "../../../components/dropDown/DropDown";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../assets";

function getDaysArray(start: Date, end: Date) {
  let arr = [];
  for (let dt = start; new Date(dt) <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push({ value: +new Date(dt), label: moment(new Date(dt)).format("dddd (DD-MM-YYYY)") });
  }
  return arr;
}

const toDate = new Date();
const WEEKDAYS = getDaysArray(getMonday(toDate), new Date(new Date(getMonday(toDate)).setDate(getMonday(toDate).getDate() + 6)));
export default function revenue() {
  const [isLoading, setIsLoading] = useState(false);
  const [fromDateTime, setFromDateTime] = useState(moment(getMonday(toDate)).format("YYYY-MM-DD 00:00"));
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date().setDate(getMonday(toDate).getDate() + 6)).format("YYYY-MM-DD 23:59")
  );
  const [weekDays, setWeekDays] = useState(WEEKDAYS);
  const [daySelect, setDaySelect] = useState({
    value: +getMonday(toDate),
    label: moment(getMonday(toDate)).format("dddd (DD-MM-YYYY)"),
  });

  let model: FilterViewModel = {};

  const [modalSendMail, setModalSendMail] = useState(false);
  const [sentStatus, setSentStatus] = useState("");

  const handleSendMail = () => {
    setModalSendMail(!modalSendMail);
    setSentStatus("success");
  };
  const [outlet, setoutlet] = useState(2);
  const [droplistOutlet, setDroplistOutlet] = useState("");
  const onchangeOutlet = async (data: any) => {
    setoutlet(data);
    setDroplistOutlet(data);
  };
  //
  const [totalRevenues, setTotalRevenues] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [totalProfit, setProfit] = useState(0);
  //
  const [dataRevenue, setRevenue] = useState([]);

  const [quantitySort, setQuantitySort] = useState(true);
  const [profitSort, setProfitSort] = useState(false);

  const loadRevenue = async dateTimeFrom => {
    setIsLoading(true);
    const res = await ReportService.getRevenueManagementItem(dateTimeFrom);
    if (res.isSuccess == 1) {
      let result = [];
      let totalNetCostEach = 0;
      let totalQuantity = 0;
      let totalProfit = 0;
      res.data.map(item => {
        if (item.name !== 'O- COMMENT') {
          result.push(item);
          // result.push({
          //   name: item.name,
          //   total: item.total,
          //   totalQuantity: totalQuantity,
          //   reportNo: item.reportNo,
          //   data: prodData.sort(function (a, b) {
          //     return a.countProdNum - b.countProdNum;
          //   }),
          // });
          totalQuantity += item.totalQuantity;
          totalNetCostEach += item.totalNetCostEach;
          totalProfit += item.totalProfit;
        }

      });
      setRevenue(result);
      setTotalRevenues(totalNetCostEach);
      setTotalQuantities(totalQuantity);
      setProfit(totalProfit);
    }
    setIsLoading(false);
  };


  const OnchangeFromDateTime = (date: any) => {
    const dateTime = new Date(date);
    const fromDate = moment(dateTime).format("YYYY-MM-DD 00:00");
    const toDate = moment(new Date(new Date(dateTime).setDate(dateTime.getDate() + 6))).format("YYYY-MM-DD 23:59");
    const arrDays = getDaysArray(dateTime, new Date(new Date(dateTime).setDate(dateTime.getDate() + 6)));
    setFromDateTime(fromDate);
    setEndDateTime(toDate);
    setWeekDays(arrDays);
    setDaySelect(arrDays[0]);
  };

  useEffect(() => {
    loadRevenue(moment(new Date(daySelect.value)).format("YYYY-MM-DD 00:00:01"));
  }, [daySelect.value]);
  useEffect(() => {
    let data = [...dataRevenue]
    data.map(item => {
      if (quantitySort) {
        item.data.sort((a, b) => parseFloat(a.totalProdQuantity) - parseFloat(b.totalProdQuantity))
      } else {
        item.data.sort((a, b) => parseFloat(b.totalProdQuantity) - parseFloat(a.totalProdQuantity))
      }
    })
    setRevenue(data)
  }, [quantitySort]);
  useEffect(() => {
    let data = [...dataRevenue]
    data.map(item => {
      if (profitSort) {
        item.data.sort((a, b) => parseFloat(a.totalProdProfit) - parseFloat(b.totalProdProfit))
      } else {
        item.data.sort((a, b) => parseFloat(b.totalProdProfit) - parseFloat(a.totalProdProfit))
      }
    })
    setRevenue(data)
  }, [profitSort]);
  return (
    <View style={styles.container}>
      <PickerModel
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>
      <View>
        <Text style={{ marginLeft: 15, fontStyle: "normal", fontWeight: "600", fontSize: 12, lineHeight: 18, color: "#A4A4A4" }}>
          Weekly Display - Choose a day to start
        </Text>
      </View>
      <DateTimePicker
        onSubmitFromDate={date => OnchangeFromDateTime(date)}
        onSubmitEndDate={date => { }}
        isShowTime={false}
        checkkNotEndDate={false}
      ></DateTimePicker><View style={styles.line}></View>
      <View style={{ paddingHorizontal: 15, zIndex: 2, marginTop: 4 }}>
        <DropDown
          data={weekDays}
          onSelected={value => {
            setDaySelect(value);
          }}
          backgroundColor={{ backgroundColor: "#414141" }}
          value={daySelect}
        ></DropDown>
      </View>
      {isLoading ? (
        <DialogAwait></DialogAwait>
      ) : (
        <ScrollView>
          <View
            style={{
              flex: 1,
              paddingVertical: 15,
              paddingHorizontal: 15,
            }}
          >
            <ScrollView horizontal={true}>
              <View style={{ backgroundColor: "#414141", borderRadius: 4 }}>
                <Table style={{ borderRadius: 4 }}>
                  {/* <Row
                  data={dataTable.tableHead}
                  style={{
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    height: 58,
                    backgroundColor: "#878787",
                    paddingLeft: 10,
                  }}
                  flexArr={[1,1,1,1]}
                  textStyle={[styles.text, {}]}
                /> */}
                  <View
                    style={[
                      { flexDirection: "row", height: 50, paddingLeft: 10, backgroundColor: "#878787", },
                      { borderTopLeftRadius: 4, borderTopRightRadius: 4 }
                    ]}
                  >
                    <Cell
                      data={'Item'}
                      style={{ width: 150 }}
                      textStyle={styles.textRowTable}
                    />
                    <Cell
                      data={'Revenue'

                      }
                      style={{ width: 100 }}
                      textStyle={styles.textRowTable}
                    />
                    <Cell
                      data={
                        <TouchableOpacity onPress={() => { setQuantitySort(!quantitySort) }} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                          <Text style={styles.textRowTable}>Quantity</Text>
                          <SvgUri source={Icons.iconSoft} />
                        </TouchableOpacity>}
                      style={{ width: 100 }}
                      textStyle={styles.textRowTable}
                    />
                    <Cell
                      data={
                        <TouchableOpacity onPress={() => { setProfitSort(!profitSort) }} style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
                          <Text style={styles.textRowTable}>Profit</Text>
                          <SvgUri source={Icons.iconSoft} />
                        </TouchableOpacity>}
                      style={{ width: 100 }}
                      textStyle={styles.textRowTable}
                    />
                  </View>
                  {dataRevenue.map((item, indexTable) => {
                    return (
                      <View key={indexTable}>
                        <Row
                          data={[item.reporName]}
                          style={[styles.styleRowTable, { backgroundColor: "#17151C" }, { paddingLeft: 10 }]}
                          flexArr={[1]}
                          textStyle={[styles.text600, { backgroundColor: "#ff0" }]}
                        />
                        <Table>
                          {item.data?.map((row, index2) => (
                            <View
                              key={index2}
                              style={[
                                { flexDirection: "row", height: 50, paddingLeft: 10 },
                                index2 % 2 == 0 ? { backgroundColor: "#8D7550" } : {},
                              ]}
                            >
                              <Cell
                                key={0}
                                data={row.prodName ? row.prodName : "---"}
                                style={{ width: 150 }}
                                textStyle={styles.textRowTable}
                                numberOfLines={1}
                              />
                              <Cell
                                key={1}
                                data={Money(row.totalProdNetCostEach)}
                                // data={
                                //   <View style={{ flex: 1, justifyContent: "center" }}>
                                //     <MoneyText data={row.totalProdNetCostEach} style={styles.text} />
                                //   </View>
                                // }
                                style={{ width: 100 }}
                                textStyle={styles.textRowTable}
                              />
                              <Cell
                                key={2}
                                data={row.totalProdQuantity ? Money(row.totalProdQuantity) : 0}
                                style={{ width: 100 }}
                                textStyle={styles.textRowTable}
                              />
                              <Cell
                                key={3}
                                data={Money(row.totalProdProfit)}
                                // data={<View style={{ flex: 1, justifyContent: "center" }}>
                                //   <MoneyText data={row.totalProdProfit} style={styles.text} />
                                // </View>}
                                style={{ width: 100 }}
                                textStyle={styles.textRowTable}
                              />
                            </View>
                          ))}
                        </Table>
                        <Table>
                          <View style={{ flexDirection: "row", height: 50, paddingLeft: 10 }}>
                            <Cell key={0} data={"Total"} style={{ width: 150 }} textStyle={styles.textRowTable} />
                            <Cell
                              key={1}
                              data={item.totalNetCostEach ? Money(item.totalNetCostEach) : 0}
                              // data={
                              //   <View style={{ flex: 3, justifyContent: "center" }}>
                              //     <MoneyText data={item.totalNetCostEach} style={styles.text} />
                              //   </View>
                              // }
                              style={{ width: 100 }}
                              textStyle={styles.textRowTable}
                            />
                            <Cell
                              key={2}
                              data={item.totalQuantity ? Money(item.totalQuantity) : 0}
                              style={{ width: 100 }}
                              textStyle={styles.textRowTable}
                            />
                            <Cell
                              key={3}
                              data={Money(item.totalProfit)}
                              // data={
                              //   <View style={{ flex: 3, justifyContent: "center" }}>
                              //     <MoneyText data={item.totalProfit} style={styles.text} />
                              //   </View>
                              // }
                              style={{ width: 100 }}
                              textStyle={styles.textRowTable}
                            />
                          </View>
                        </Table>
                      </View>
                    );
                  })}
                  <Table>
                    <View
                      style={{
                        flexDirection: "row",
                        height: 50,
                        backgroundColor: "#8D7550",
                        paddingLeft: 10,
                        borderBottomLeftRadius: 4,
                        borderBottomRightRadius: 4,
                      }}
                    >
                      <Cell key={0} data={"Total sale"} style={{ width: 150 }} textStyle={styles.textRowTable} />
                      <Cell
                        key={1}
                        data={Money(totalRevenues)}
                        // data={
                        //   <View style={{ flex: 1, justifyContent: "center" }}>
                        //     <MoneyText data={totalRevenues} style={styles.text} />
                        //   </View>
                        // }
                        style={{ width: 100 }}
                        textStyle={styles.textRowTable}
                      />
                      <Cell
                        key={2}
                        data={totalQuantities ? Money(totalQuantities) : 0}
                        style={{ width: 100 }}
                        textStyle={styles.textRowTable}
                      />
                      <Cell
                        key={3}
                        data={Money(totalProfit)}
                        // data={
                        //   <View style={{ flex: 1, justifyContent: "center" }}>
                        //     <MoneyText data={totalProfit} style={styles.text} />
                        //   </View>
                        // }
                        style={{ width: 100 }}
                        textStyle={styles.textRowTable}
                      />
                    </View>
                  </Table>
                </Table>
              </View>
            </ScrollView>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 32,
            }}
          >
            <LinearGradient style={styles.buttonSubmit} colors={["#DAB451", "#988050"]}>
              <TouchableHighlight
                underlayColor={colors.yellowishbrown}
                onPress={() => {
                  setModalSendMail(!modalSendMail);
                }}
              >
                <View
                  style={{
                    height: 36,
                    width: 150,
                    justifyContent: "center",
                  }}
                >
                  <Text style={[styles.title, { textAlign: "center" }]}>Send</Text>
                </View>
              </TouchableHighlight>
            </LinearGradient>
          </View>
          <ModalSendEmail
            title={"Revenue Management (Item)"}
            visible={modalSendMail}
            isPickType={true}
            dateTime={fromDateTime}
            onRequestClose={() => {
              setModalSendMail(!modalSendMail);
            }}
            onRequestSend={() => {
              handleSendMail();
            }}
          ></ModalSendEmail>
          <SendSuccess visible={sentStatus === "success"} onRequestClose={() => setSentStatus("")}></SendSuccess>
          <SendFail visible={sentStatus === "fail"} onRequestClose={() => setSentStatus("")}></SendFail>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  buttonSubmit: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  text600: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  styleRowTable: {
    height: 36,
  },
  textRowTable: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "400",
  },
});
