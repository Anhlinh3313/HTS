import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, ViewStyle, Dimensions } from "react-native";
import { ScrollView} from "react-native-gesture-handler";

import DropDownPickerLine from "../../../../components/DropDownPickerLine";
import { IModalPicker, Imodel } from "../../../../models/Imodel";
import { colors } from "../../../../utils/Colors";
import PickerModel from "../../../../components/picker/PickerModel";
import DateTimePicker from "../../../../components/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import ModalContainer from "../../../../components/ModalContainer";
import { Table, Row } from "react-native-table-component";
import Dash from "react-native-dash";
import DialogAwait from "../../../../components/dialogs/dialogAwait";
import { getListTable, getTableSetupsGroundFloor, getSections, getTransactionDetail } from "../../../../netWorking/tableService";
import { transactionHeader } from "../../../../netWorking/transactionHeaderService";
import { getListBooking } from "../../../../netWorking/bookingService";
import { bookingModel } from "../../../../models/bookingModel";
import { tableModel } from "../../../../models/tableModel";
import { transactionDetailModel, transactionHeaderModel } from "../../../../models/transactionModel";
import moment from "moment";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";
import DatePickerCustom from "../../../../components/DatePickerCustom";
const TableManagement = () => {
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const [isLoading, setIsLoading] = useState(false);
  // ----Outlet
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  // -----DateTime picker

  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(new Date().getDate()+1)).format("YYYY-MM-DD"));
  const changeDate = (date: Date) => {
    let _date = new Date(date);
    let _endDate = new Date(date).setDate(_date.getDate() + 1);
    setFromDateTime(moment(_date).format("YYYY-MM-DD"));
    setEndDateTime(moment(_endDate).format("YYYY-MM-DD"));
  };
  // ----Picker
  const initTopPicker = { label: "", value: "0" };
  const [listSections, setListSections] = useState([]);
  const [pickerTopValue, setPickerTopValue] = useState<IModalPicker>(initTopPicker);

  const handlePicker = (value: IModalPicker) => {
    setPickerTopValue(value);
  };
  // -------------------------
  const [visibleOrderPlaced, setVisibleOrderPlaced] = useState(false);
  const [visiblePaymentPending, setVisiblePaymentPending] = useState(false);
  // -------------------------
  const [tableEmpty, setTableEmpty] = useState<tableModel[]>([]);
  const [tableLive, setTableLive] = useState<bookingModel[]>([]);
  const [tableBook, setTableBook] = useState<bookingModel[]>([]);
  const [transactionDetailTable, setTransactionDetailTable] = useState([]);
  const [transactionHeaderTable, setTransactionHeaderTable] = useState<transactionHeaderModel>();

  const fetchTransactionDetail = async (memCode: number) => {
    const res = await getTransactionDetail(fromDateTime, endDateTime, memCode, null);
    if (res.isSuccess == 1 && res.data) {
      return res.data;
    } else return null;
  };
  const fetchTransactionHeader = async (memCode: number) => {
    const res = await transactionHeader(fromDateTime, endDateTime, memCode, null);
    if (res.isSuccess == 1 && res.data) {
      return res.data;
    } else return null;
  };
  const fetchListTableBooking = async () => {
    
    setIsLoading(true);
    const dateNow = new Date();
    let dataTableLive = [];
    let dataTableBook = [];
    let tables = [];
    //
    const tableRes = await getListTable();
    if (tableRes.isSuccess == 1 && tableRes.data) {
      tables = tableRes.data as tableModel[];
    }
    //
    const res = await getListBooking(fromDateTime, endDateTime, null, null);
    if (res.isSuccess == 1 && res.data) {
      let dataList = res.data as bookingModel[];
      dataList.map(item => {
        if (new Date(item.timeStart) > dateNow) {
          const iTable = tables.findIndex(element => element.tableNum === item.tableNum);
          tables.splice(iTable, 1);
          dataTableBook.push(item);
        }
        if (new Date(item.timeStart) < dateNow && new Date(item.timeEnd) > dateNow) {
          const iTable = tables.findIndex(element => element.tableNum === item.tableNum);
          tables.splice(iTable, 1);
          dataTableLive.push(item);
        }
      });

      // fetch  transactionDetails
      const transactionDetails = dataTableLive.map(t => fetchTransactionDetail(t.memCode));
      const details = await Promise.all(transactionDetails);
      dataTableLive.forEach((t, i) => {
        details.forEach((detail, index) => {
          if (i === index) {
            t.transactionDetail = detail;
          }
        });
      });

      //fetch  transactionHeader
      const transactionHeaders = dataTableLive.map(t => fetchTransactionHeader(t.memCode));
      const headers = await Promise.all(transactionHeaders);
      dataTableLive.forEach(t => {
        headers.forEach(detail => {
          detail.forEach(iDetail => {
            if (
              t.tableNum === iDetail.tableNum &&
              t.memCode === iDetail.memCode &&
              new Date(moment(t.timeStart).format("YYYY-MM-DD")).getTime() ==
                new Date(moment(iDetail.openDate).format("YYYY-MM-DD")).getTime()
            ) {
              t.transactionHeader = iDetail;
            }
          });
        });
      });
    }
    setTableEmpty(tables);
    setTableLive(dataTableLive);
    setTableBook(dataTableBook);

    setIsLoading(false);
  };
  const fetchSections = async () => {
    const res = await getSections();
    if (res.isSuccess == 1 && res.data) {
      let dataList = [];
      res.data.map(item => {
        dataList.push({ label: item.descript, value: item.secNum });
      });
      setListSections(dataList);
    }
  };
  const viewOrderPlaced = (data: transactionDetailModel[]) => {
    setVisibleOrderPlaced(!visibleOrderPlaced);
    setTransactionDetailTable(data);
  };
  const viewPaymentPending = (dataTransactionHeader: transactionHeaderModel, dataTransactionDetail: transactionDetailModel[]) => {
    setVisiblePaymentPending(!visiblePaymentPending);
    setTransactionDetailTable(dataTransactionDetail);
    setTransactionHeaderTable(dataTransactionHeader);
  };
  const parseDataTable = (data: transactionDetailModel) => {
    return [data.descript, data.quan];
  };
  const parseDataTablePending = (data: transactionDetailModel) => {
    return [data.descript, data.quan, data.netCostEach];
  };
  useEffect(() => {
    fetchSections();
    // fetchListTable();
  }, []);
  useEffect(() => {
    fetchListTableBooking();
  }, [fromDateTime, endDateTime]);
  useEffect(() => {
    if (listSections.length > 0) {
      setPickerTopValue(listSections[0]);
    }
  }, [listSections]);
  const ViewTopProperty = (title: string, value: number, style?: ViewStyle) => {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "#414141",
            height: 70,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          },
          style,
        ]}
      >
        <Text style={[styles.textGray, { marginBottom: 5, fontSize: 12 }]}>{title}</Text>
        <Text style={styles.text16}>{value}</Text>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* -----------------Picker Outlet------------- */}
        <PickerModel
          data={outletModel}
          defaultValue="Ola Restaurant"
          onSelectedValue={value => {
            onchangeOutlet(value.value);
          }}
        ></PickerModel>
        {/* ----------------------------------------------- */}
        <View style={styles.line}></View>
        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
            <View style={styles.titleHeader}>
              <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>TABLE MANAGEMENT</Text>
            </View>
          </View>
          <DatePickerCustom
            onSubmit={date => {
              changeDate(date);
            }}
          ></DatePickerCustom>
        </View>

        {/* ---------------------------------------- */}
        <DropDownPickerLine
          data={listSections}
          onSelected={value => {
            handlePicker(value);
          }}
          itemSelected={pickerTopValue}
        ></DropDownPickerLine>
        {/* ---------------------------------------- */}
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingTop: 24,
            paddingHorizontal: 15,
            paddingBottom: 16,
          }}
        >
          {ViewTopProperty("Empty Table", tableEmpty.length, { marginRight: 10 })}
          {ViewTopProperty("Live Table", tableLive.length, { marginRight: 10 })}
          {ViewTopProperty("Book Table", tableBook.length)}
        </View>
        {/* -----------Live table */}
        <View style={{ paddingHorizontal: 15, marginBottom: 14 }}>
          <Text style={[styles.textGray, { marginBottom: 4 }]}>Live Table</Text>
          {tableLive.length > 0 ? (
            tableLive.map((item, index) => {
              return (
                <View
                  key={index}
                  style={{
                    borderRadius: 4,
                    backgroundColor: "#414141",
                    marginBottom: 10,
                  }}
                >
                  {/* header */}
                  <View style={styles.headerTable}>
                    <Text style={{ color: colors.colorText }}>Table {item.tableNum}</Text>
                  </View>
                  {/* row1 */}
                  <View style={{ paddingHorizontal: 16, paddingVertical: 9 }}>
                    <Text style={styles.textGray}>Open Time:</Text>
                    <Text style={[styles.text16, { fontWeight: "600", lineHeight: 24 }]}>
                      {moment(item.timeStart).format("HH:mm A")}
                    </Text>
                  </View>

                  {/* row2 */}
                  <View style={[styles.viewItemTableRow, { backgroundColor: "#8D7550" }]}>
                    <View>
                      <Text style={styles.textGray}>Order Placed:</Text>
                      <Text style={[styles.text16, { fontWeight: "600", lineHeight: 24 }]}>
                        {item.transactionDetail ? item.transactionDetail.length : 0}
                      </Text>
                    </View>
                    <LinearGradient style={styles.viewButton} colors={["#DAB451", "#988050"]}>
                      <TouchableOpacity
                        onPress={() => {
                          viewOrderPlaced(item.transactionDetail ?? []);
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 12,
                            color: colors.colorText,
                          }}
                        >
                          View
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                  {/* row3 */}
                  <View style={[styles.viewItemTableRow]}>
                    <View>
                      <Text style={styles.textGray}>Payment Pending:</Text>
                      <Text style={[styles.text16, { fontWeight: "600", lineHeight: 24 }]}>
                        {item.transactionHeader ? Money(item.transactionHeader.finalTotal) : 0} VND
                      </Text>
                    </View>
                    <LinearGradient style={styles.viewButton} colors={["#DAB451", "#988050"]}>
                      <TouchableOpacity
                        onPress={() => {
                          viewPaymentPending(item.transactionHeader, item.transactionDetail);
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "700",
                            fontSize: 12,
                            color: colors.colorText,
                          }}
                        >
                          View
                        </Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                </View>
              );
            })
          ) : (
            <View
              style={{
                paddingVertical: 16,
                borderRadius: 4,
                width: "100%",
                backgroundColor: "#414141",
                alignItems: "center",
              }}
            >
              <Text style={styles.textGray}>0 table</Text>
            </View>
          )}
        </View>
        {/* -----------Empty table */}
        <View style={{ paddingHorizontal: 15, marginBottom: 24 }}>
          <Text style={[styles.textGray, { marginBottom: 4 }]}>Empty Table </Text>
          <ScrollView style={{ height: tableEmpty.length > 0 ? 95 * 5 : 60, borderRadius: 4 }}>
            {tableEmpty.map((item, index) => {
              return (
                <View key={index} style={{ borderRadius: 4, backgroundColor: "#414141", marginBottom: 10, height:85 }}>
                  {/* header */}
                  <View style={styles.headerTable}>
                    <Text style={{ color: colors.colorText }}>Table {item.tableNum}</Text>
                  </View>
                  {/* row1 */}
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      alignSelf: "center",
                    }}
                  >
                    <Text style={styles.textGray}>{item.numCustomer} person capacity</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        {/* -----------Book table */}
        <View style={{ paddingHorizontal: 15, marginBottom: 24 }}>
          <Text style={[styles.textGray, { marginBottom: 4 }]}>Book Table</Text>
          <ScrollView style={{ height: tableBook.length > 0 ? windowHeight / 2 : 60, borderRadius: 4 }}>
            {tableBook.map((item, index) => {
              return (
                <TouchableOpacity key={index} style={{ borderRadius: 4, backgroundColor: "#414141", marginBottom: 10 }}>
                  {/* header */}
                  <View style={styles.headerTable}>
                    <Text style={{ color: colors.colorText }}>Table {item.tableNum}</Text>
                  </View>
                  {/* row1 */}
                  <View
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      alignSelf: "center",
                    }}
                  >
                    <Text style={styles.textGray}>{item.numCust} person capacity</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {/* <View style={{ borderRadius: 4, backgroundColor: "#414141" }}>
            <View style={styles.headerTable}>
              <Text style={{ color: colors.colorText }}>Book Table</Text>
            </View>
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 16,
                alignSelf: "center",
              }}
            >
              <Text style={styles.textGray}>{tableBook.length} person book</Text>
            </View>
          </View> */}
        </View>
      </ScrollView>
      <ModalContainer title={"Order placed"} visible={visibleOrderPlaced} onRequestClose={() => setVisibleOrderPlaced(false)}>
        <View style={[styles.viewBodyModal, { maxHeight: windowHeight - 300 }]}>
          <Table style={{ borderRadius: 4 }}>
            <Row
              data={["Item", "Quantity"]}
              style={styles.viewBodyHeaderModal}
              flexArr={[3, 2]}
              textStyle={[styles.text12, { alignSelf: "center" }]}
            />
            <ScrollView style={{ maxHeight: "88%", minHeight: 50 }}>
              {transactionDetailTable.map((item, index) => {
                return (
                  <Row
                    key={index}
                    data={parseDataTable(item)}
                    style={[styles.styleRowTable, index % 2 === 0 && { backgroundColor: "#8D7550" }, { paddingLeft: 10 }]}
                    flexArr={[3, 2]}
                    textStyle={[styles.textTitleHeader400, { alignSelf: "center" }]}
                  />
                );
              })}
            </ScrollView>
          </Table>
        </View>
      </ModalContainer>
      {/*------------------ Payment Pending----------------- */}
      <ModalContainer
        title={"Payment Pending"}
        visible={visiblePaymentPending}
        onRequestClose={() => setVisiblePaymentPending(false)}
      >
        <View style={[styles.viewBodyModal, { maxHeight: windowHeight - 500 }]}>
          <Table style={{ borderRadius: 4 }}>
            <Row
              data={["Item", "Quantity", "Price"]}
              style={styles.viewBodyHeaderModal}
              flexArr={[3, 2, 2]}
              textStyle={[styles.text12, { alignSelf: "center" }]}
            />
            <ScrollView style={{ maxHeight: "76%", minHeight: 50 }}>
              {transactionHeaderTable &&
                transactionDetailTable.map((item, index) => {
                  return (
                    <Row
                      key={index}
                      data={parseDataTablePending(item)}
                      style={[styles.styleRowTable, index % 2 === 0 && { backgroundColor: "#8D7550" }, { paddingLeft: 10 }]}
                      flexArr={[3, 2, 2]}
                      textStyle={[styles.textTitleHeader400, { alignSelf: "center" }]}
                    />
                  );
                })}
            </ScrollView>
          </Table>
        </View>
        <View style={{ marginTop: 24 }}>
          <View style={[styles.styleRow, { marginBottom: 10 }]}>
            <Text style={styles.textGray}>Net total:</Text>
            <Text style={[{ color: colors.colorText }]}>
              {transactionHeaderTable?.netTotal ? Money(transactionHeaderTable.netTotal) : 0}
            </Text>
          </View>
          <View style={[styles.styleRow, { marginBottom: 10 }]}>
            <Text style={styles.textGray}>Total discount:</Text>
            <Text style={[{ color: colors.colorText }]}>
              {transactionHeaderTable?.tax1 ? Money(transactionHeaderTable.tax1) : 0}
            </Text>
          </View>
          <View style={[styles.styleRow, { marginBottom: 10 }]}>
            <Text style={styles.textGray}>Sub total:</Text>
            <Text style={[{ color: colors.colorText }]}>
              {transactionHeaderTable?.tax2 ? Money(transactionHeaderTable.tax2) : 0}
            </Text>
          </View>
          <View style={[styles.styleRow, { marginBottom: 10 }]}>
            <Text style={styles.textGray}>SVC 5%:</Text>
            <Text style={[{ color: colors.colorText }]}>
              {transactionHeaderTable?.tax3 ? Money(transactionHeaderTable.tax3) : 0}
            </Text>
          </View>
          <View style={[styles.styleRow, { marginBottom: 24 }]}>
            <Text style={styles.textGray}>VAT 10%:</Text>
            <Text style={[{ color: colors.colorText }]}>
              {transactionHeaderTable?.tax4 ? Money(transactionHeaderTable.tax4) : 0}
            </Text>
          </View>

          <Dash dashStyle={{ height: 0.5 }} dashColor={colors.colorLine} />
          <View style={[styles.styleRow, { marginTop: 24 }]}>
            <Text style={styles.textGray}>Total:</Text>
            <Text style={[{ color: colors.colorText, fontSize: 18, fontWeight: "600" }]}>
              {transactionHeaderTable?.finalTotal ? Money(transactionHeaderTable.finalTotal) : 0}
            </Text>
          </View>
        </View>
      </ModalContainer>
      <DialogAwait isShow={isLoading}></DialogAwait>
    </View>
  );
};

export default TableManagement;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  text16: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 16,
  },
  textGray: {
    color: colors.colorLine,
    fontWeight: "400",
    fontSize: 14,
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
  viewItemTableRow: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewButton: {
    height: 30,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTable: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#878787",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: 36,
  },
  text12: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 12,
  },
  styleRowTable: {
    height: 36,
    alignItems: "center",
  },
  textTitleHeader400: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 14,
  },
  viewBodyModal: {
    backgroundColor: "#414141",
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  viewBodyHeaderModal: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    height: 36,
    backgroundColor: "#878787",
    paddingLeft: 10,
    alignItems: "center",
  },
  styleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
