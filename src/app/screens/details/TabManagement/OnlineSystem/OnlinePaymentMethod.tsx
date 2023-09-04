import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TextInput,
  KeyboardTypeOptions,
  ImageProps,
  Platform,
  Dimensions,
} from "react-native";
import { TouchableHighlight, TouchableOpacity } from "react-native-gesture-handler";
import {
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryGroup,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory-native";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "../../../../components/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../assets";
import PickerModel from "../../../../components/picker/PickerModel";
import DropDownPickerLine from "../../../../components/DropDownPickerLine";
import { IModalPicker, Imodel } from "../../../../models/Imodel";
import ModalRadioButton from "../../../../components/ModalRadioButton";
import SelectMultiple from "react-native-select-multiple";
import SvgUri from "react-native-svg-uri";
import { getAllPaymentType } from "../../../../netWorking/paymentService";
import { getTransactionDetail, getTransactionPayment } from "../../../../netWorking/transactionService";
import { transactionDetailModel, transactionPaymentModel } from "../../../../models/transactionModel";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";
import DialogAwait from "../../../../components/dialogs/Loading";
const OnlinePaymentMethod = () => {
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;
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
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD"));
  // -----------
  const [titleColumnChart, setTitleColumnChart] = useState(["Cash", "Credit Card", "E-Wallet"]);
  // ----Picker
  const [dataTopPicker, setdataTopPicker] = useState<IModalPicker[]>([{ label: "Payment Method - All", value: 0 }]);
  const [pickerTopValue, setPickerTopValue] = useState<IModalPicker>(dataTopPicker[0]);
  const [pickerTopValueChild, setPickerTopValueChild] = useState<string | undefined>("");
  const [paymentList, setPaymentList] = useState([]);
  const [dataPaymentList, setDataPaymentList] = useState([]);
  const [tickValueMoney, setTickValueMoney] = useState([25, 50, 75, 100]);
  // ----Body
  const dataInitFieldSells = {
    totalAmount: { title: "Total Amount", value: 0 },
    averageTC: { title: "Average TC", value: 0 },
    transaction: { title: "Transaction", value: 0 },
    promotion: { title: "Promotion", value: 0 },
  };
  const [fieldSells, setFieldSells] = useState(dataInitFieldSells);
  //--------chart pie
  interface IDataChartPie {
    title: string;
    data: { y: number }[];
  }
  const [dataChartPie, setDataChartPie] = useState<IDataChartPie[]>([]);
  //--------chart col
  // interface IDataChartCol {
  //   amount?: any;
  //   averageTC?: { x: number; y: number }[];
  // }
  const [dataChartCol, setDataChartCol] = useState({ totalAmount: {}, averageTC: {}, transaction: {}, promotion: {} });
  //-----------Fetch API----------------------------------------------------------------------
  const loadPaymentTypeList = async () => {
    setPaymentList([]);
    const res = await getAllPaymentType();
    let dataList = [];
    if (res.isSuccess == 1 && res.data) {
      dataList = res.data;
      const dataPaymentType = [{ label: "Payment Method - All", value: 0 }];
      dataList.map(item => {
        if (item.isActive) {
          dataPaymentType.push({ label: item.descript, value: item.methodNum });
        }
      });
      setdataTopPicker(dataPaymentType);
    }
  };
  const loadPaymentList = async () => {
    setIsLoading(true);
    setPaymentList([]);
    const res = await getTransactionPayment(fromDateTime, endDateTime, null, null);

    let dataList = [];
    if (res.isSuccess == 1 && res.data) {
      dataList = res.data as transactionPaymentModel[];

      const detailTransacts = dataList.map(t => loadTransactionDetail(t.transact));
      let transacts = await Promise.all(detailTransacts);
      transacts = transacts.filter(x => x !== undefined);
      dataList.forEach(t => {
        const transact = transacts.find(i => i.transact === t.transact);
        if (transact) {
          t.prodType = transact.prodType;
        }
      });
      setPaymentList(dataList);
    }

    setIsLoading(false);
  };
  const loadTransactionDetail = async (transact: number) => {
    const res = await getTransactionDetail(null, null, null, transact);
    let dataList = [];
    if (res.isSuccess == 1 && res.data) {
      dataList = res.data as transactionDetailModel[];
      return dataList[0];
    }
  };
  //----------------------------------------------------------------------------------------
  // pick payment method
  const handlePicker = (value: IModalPicker) => {
    const _dataChartPie = [];
    setPickerTopValue(value);
    let dataCash = [];
    let _dataChartCol = dataChartCol;
    let count = 0;
    let countPromo = 0;

    let countTotalAmount = { morning: 0, noon: 0, afternoon: 0, night: 0 };
    let countTransaction = { morning: 0, noon: 0, afternoon: 0, night: 0 };
    let countAverageTC = { morning: 0, noon: 0, afternoon: 0, night: 0 };
    let countPromotion = { morning: 0, noon: 0, afternoon: 0, night: 0 };
    const morning = moment("10:00am", "h:mma");
    const noon = moment("02:00pm", "h:mma");
    const afternoon = moment("05:00pm", "h:mma");
    const night = moment("23:59pm", "h:mma");

    if (value.value === 0) {
      //choose all payment method

      /// init dataChartColumn
      Object.keys(_dataChartCol).map(i => {
        _dataChartCol[i] = dataTopPicker.reduce((obj, item) => {
          if (item.value !== 0) {
            return {
              ...obj,
              [item.label]: 0,
            };
          }
        }, _dataChartCol[i]);
      });
      // get arr title chart from payment types
      let _titleColChart = [];
      dataTopPicker.map(i => {
        if (i.value !== 0) {
          _titleColChart.push(i.label);
        }
      });
      //
      paymentList.map(item => {
        dataCash.push(item);
        count += item.tender;
        dataTopPicker.map(i => {
          // get dataChartColumn
          if (i.value === item.methodNum) {
            _dataChartCol.totalAmount[i.label] = _dataChartCol.totalAmount[i.label] + item.tender;
            _dataChartCol.averageTC[i.label] = _dataChartCol.averageTC[i.label] + item.tender / paymentList.length;
            _dataChartCol.transaction[i.label] = _dataChartCol.transaction[i.label] + 1;
            if (item.prodType === 100) {
              _dataChartCol.promotion[i.label] = _dataChartCol.promotion[i.label] + 1;
            }
          }
        });
      });
      setTitleColumnChart(_titleColChart);
    } else {
      /// init dataChartColumn
      Object.keys(_dataChartCol).map(i => {
        _dataChartCol[i] = {
          ...{},
          [value.label]: 0,
        };
      });
      paymentList.map(item => {
        if (item.methodNum === value.value) {
          dataCash.push(item);
          count += item.tender;
          _dataChartCol.totalAmount[value.label] = _dataChartCol.totalAmount[value.label] + item.tender;
          _dataChartCol.averageTC[value.label] = _dataChartCol.averageTC[value.label] + item.tender / paymentList.length;
          _dataChartCol.transaction[value.label] = _dataChartCol.transaction[value.label] + 1;
          if (item.prodType === 100) {
            _dataChartCol.promotion[value.label] = _dataChartCol.promotion[value.label] + 1;
          }
        }
      });
      setTitleColumnChart([value.label]);
    }

    //---------- handle data Chart pie
    dataCash.map(item => {
      const time = moment(moment(item.transDate).format("h:mma"), "h:mma");
      if (item.prodType === 100) {
        countPromo++;
      }
      if (time.isBefore(morning)) {
        countTotalAmount.morning = countTotalAmount.morning + item.tender;
        countTransaction.morning = countTransaction.morning + 1;
        countAverageTC.morning = countAverageTC.morning + item.tender / dataCash.length;
        if (item.prodType === 100) {
          countPromotion.morning = countPromotion.morning + 1;
        }
      }
      if (time.isBetween(morning, noon)) {
        countTotalAmount.noon = countTotalAmount.noon + item.tender;
        countTransaction.noon = countTransaction.noon + 1;
        countAverageTC.noon = countAverageTC.noon + item.tender / dataCash.length;
        if (item.prodType === 100) {
          countPromotion.noon = countPromotion.noon + 1;
        }
      }
      if (time.isBetween(noon, afternoon)) {
        countTotalAmount.afternoon = countTotalAmount.afternoon + item.tender;
        countTransaction.afternoon = countTransaction.afternoon + 1;
        countAverageTC.afternoon = countAverageTC.afternoon + item.tender / dataCash.length;
        if (item.prodType === 100) {
          countPromotion.afternoon = countPromotion.afternoon + 1;
        }
      }
      if (time.isBetween(afternoon, night)) {
        countTotalAmount.night = countTotalAmount.night + item.tender;
        countTransaction.night = countTransaction.night + 1;
        countAverageTC.night = countAverageTC.night + item.tender / dataCash.length;
        if (item.prodType === 100) {
          countPromotion.night = countPromotion.night + 1;
        }
      }
    });
    _dataChartPie.push({
      title: "Total Amount",
      data: [
        { y: countTotalAmount.noon },
        { y: countTotalAmount.afternoon },
        { y: countTotalAmount.night },
        { y: countTotalAmount.morning },
      ],
    });
    _dataChartPie.push({
      title: "Average TC",
      data: [
        { y: countAverageTC.noon },
        { y: countAverageTC.afternoon },
        { y: countAverageTC.night },
        { y: countAverageTC.morning },
      ],
    });
    _dataChartPie.push({
      title: "Transaction",
      data: [
        { y: countTransaction.noon },
        { y: countTransaction.afternoon },
        { y: countTransaction.night },
        { y: countTransaction.morning },
      ],
    });
    _dataChartPie.push({
      title: "Promotion",
      data: [
        { y: countPromotion.noon },
        { y: countPromotion.afternoon },
        { y: countPromotion.night },
        { y: countPromotion.morning },
      ],
    });
    const __fieldSells = {
      totalAmount: { ...fieldSells.totalAmount, value: Money(Math.round(count)) },
      averageTC: { ...fieldSells.averageTC, value: Money(Math.round(count / dataCash.length)) },
      transaction: { ...fieldSells.transaction, value: dataCash.length },
      promotion: { ...fieldSells.promotion, value: countPromo },
    };

    setDataChartCol(_dataChartCol);

    setFieldSells({ ...fieldSells, ...__fieldSells });
    setDataPaymentList(dataCash);
    setDataChartPie(_dataChartPie);
  };

  const handlePickerChild = (value: string | undefined) => {
    setPickerTopValueChild(value);
    setModalRadioButton(false);
  };
  const handleClosePickerChild = () => {
    setModalRadioButton(false);
  };

  const [modalRadioButton, setModalRadioButton] = useState(false);

  // --------------------chart pie
  const dataTimeSales = [
    { time: "06:00 AM - 10:00 AM", color: "#70E6A3" },
    { time: "10:00 AM - 02:00 PM", color: "#A24DE4" },
    { time: "02:00 PM - 05:00 PM", color: "#06C2FF" },
    { time: "05:00 PM - 00:00 AM", color: "#F68942" },
  ];
  // ------chart col

  const [modalVisibleSelect, setModalVisibleSelect] = useState(false);
  const [pickerValueSelect, setPickerValueSelect] = useState("All");

  //MultiSelect
  const dataModelSelect: {
    label: string;
    value: string;
  }[] = [
    { label: "All", value: "all" },
    { label: "Total Amount", value: "totalAmount" },
    { label: "Promotion", value: "promotion" },
    { label: "Transaction", value: "transaction" },
    { label: "Average TC", value: "averageTC" },
  ];
  const [pickerValueChartDisplay, setPickerValueChartDisplay] = useState({
    totalAmount: true,
    promotion: true,
    transaction: true,
    averageTC: true,
  });

  const [selectedChart, setSelectedChartValue] = useState(["all", "totalAmount", "promotion", "transaction", "averageTC"]);
  function handleCheck(item: string) {
    let data = selectedChart;
    if (data.includes(item)) {
      if (item === "all") {
        data = [];
        setPickerValueSelect("Select...");
        setPickerValueChartDisplay({
          totalAmount: false,
          promotion: false,
          transaction: false,
          averageTC: false,
        });
      } else {
        data = data.filter(i => i !== item);
        data = data.filter(i => i !== "all");
        let labelSeleted = "";
        data.map((map, index) => {
          dataModelSelect.map(model => {
            if (map != "all") {
              if (map === model.value) {
                labelSeleted += index != data.length - 1 ? `${model.label}, ` : `${model.label}`;
              }
            }
          });
        });
        setPickerValueSelect(labelSeleted);
        setPickerValueChartDisplay({
          ...pickerValueChartDisplay,
          [item]: false,
        });
      }
      setSelectedChartValue(data);
    } else {
      if (item === "all") {
        data = [];
        dataModelSelect.map(item => {
          data.push(item.value);
        });
        setPickerValueSelect("All");
        setPickerValueChartDisplay({
          totalAmount: true,
          promotion: true,
          transaction: true,
          averageTC: true,
        });
      } else {
        if (selectedChart.length === dataModelSelect.length - 2) {
          data = [...data, "all"];
        }
        data = [...data, item];
        if (data.length === dataModelSelect.length) {
          setPickerValueSelect("All");
        } else {
          let labelSeleted = "";
          data.map((map, index) => {
            dataModelSelect.map(model => {
              if (map != "all") {
                if (map === model.value) {
                  labelSeleted += index != data.length - 1 ? `${model.label}, ` : `${model.label}`;
                }
              }
            });
          });
          setPickerValueSelect(labelSeleted);
        }
        setPickerValueChartDisplay({
          ...pickerValueChartDisplay,
          [item]: true,
        });
      }
      setSelectedChartValue(data);
    }
  }
  useEffect(() => {
    loadPaymentList();
  }, [fromDateTime, endDateTime]);
  useEffect(() => {
    loadPaymentTypeList();
  }, []);
  useEffect(() => {
    if (paymentList.length > 0) {
      handlePicker(pickerTopValue);
    }
  }, [paymentList]);
  useEffect(() => {
    let _titleColChart = [];
    dataTopPicker.map(i => {
      if (i.value !== 0) {
        _titleColChart.push(i.label);
      }
    });
    setTitleColumnChart(_titleColChart);
  }, [dataTopPicker]);
  // ---------------------------------style
  const whiteStyleBottom = {
    axis: { stroke: colors.colorLine },
    ticks: { stroke: colors.gray, size: 8, margin: 5 },
    tickLabels: { fontSize: 10, padding: 5, fill: "#A4A4A4" },
  };
  const whiteStyle = {
    grid: { stroke: colors.colorLine, strokeWidth: 0.25 },
    axis: { stroke: colors.backgroundApp },
    tickLabels: { fill: colors.colorChartLine, fontSize: 10 },
  };
  const handleDataChartCol = (data: any, type: string) => {
    let arr = [];
    Object.values(data).map((item, index) => {
      arr.push({ x: index + 1, y: +item / 1000000 });
    });
    return arr;
  };
  const handleDataChartLine = (data: any) => {
    let arr = [{ x: 0.45, y: 0, fill: "#DAB451" }];
    Object.values(data).map((item, index) => {
      arr.push({ x: index + 1, y: +item, fill: "#DAB451" });
    });
    return arr;
  };
  useEffect(() => {
    let maxInNumbers = Math.max.apply(Math, Object.values(dataChartCol.totalAmount));
    if (maxInNumbers !== -Infinity && maxInNumbers > 100000000) {
      let money = maxInNumbers / 1000000;
      setTickValueMoney([Math.round(money / 4), Math.round(money / 2), Math.round(money - money / 4), Math.round(money)])
    }
  }, [dataChartCol.totalAmount])
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* -----------------Picker Outlet------------- */}
        <PickerModel
          data={outletModel}
          defaultValue="Ola Restaurant"
          onSelectedValue={value => {
            onchangeOutlet(value?.value);
          }}
        ></PickerModel>
        {/* ----------------------------------------------- */}

        <View style={styles.line}></View>
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={styles.titleHeader}>
            <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>ONLINE PAYMENT METHOD</Text>
          </View>
        </View>
        {/* ---------------------------------------- */}
        <DateTimePicker
          onSubmitFromDate={date => setFromDateTime(moment(date).format("YYYY-MM-DD"))}
          onSubmitEndDate={date => setEndDateTime(moment(date).format("YYYY-MM-DD"))}
          fromDate={fromDateTime}
          endDate={endDateTime}
        ></DateTimePicker>
        {/* ---------------------------------------- */}
        <DropDownPickerLine
          data={dataTopPicker}
          onSelected={value => {
            handlePicker(value);
          }}
          itemSelected={pickerTopValue}
        ></DropDownPickerLine>
        {pickerTopValueChild !== "" && (
          <View style={styles.viewWallet}>
            <Text style={styles.textTitleHeader}>{pickerTopValueChild}</Text>
          </View>
        )}
        {/* ---------------------------------------- */}
        <View
          style={{
            paddingVertical: 15,
            paddingLeft: 15,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {Object.values(fieldSells).map((item, index) => {
            return (
              <View key={index} style={[styles.itemFieldSells, { width: windowWidth / 2 - 15 - 7.5 }]}>
                <Text style={[styles.textGray, { marginBottom: 8 }]}>{item.title}</Text>
                <Text style={styles.text16}>{item.value ?? 0}</Text>
              </View>
            );
          })}
        </View>
        {/* ---------------------------------------- */}
        <View>
          <ScrollView horizontal indicatorStyle={"white"} pagingEnabled persistentScrollbar>
            {dataChartPie.map((chart, iChart) => {
              return (
                <View style={{ alignItems: "center", width: windowWidth }} key={iChart}>
                  <Text style={[styles.text16, { marginBottom: 15 }]}>{chart.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <VictoryPie
                      width={windowWidth / 1.8}
                      height={windowWidth / 1.8}
                      theme={{
                        pie: {
                          padding: 15,
                        },
                      }}
                      animate={{ duration: 2000 }}
                      data={chart.data}
                      colorScale={["#A24DE4", "#06C2FF", "#F68942", "#70E6A3"]}
                      style={{ labels: { fill: colors.backgroundApp } }}
                    />
                    <View style={{}}>
                      {dataTimeSales.map((item, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              marginVertical: 4,
                            }}
                          >
                            <View style={[styles.dot, { backgroundColor: item.color }]}></View>
                            <Text
                              style={{
                                fontSize: 12,
                                fontWeight: "500",
                                color: item.color,
                              }}
                            >
                              {item.time}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* --------------------chartCol */}
        <View>
          <View style={[styles.salectChart, { zIndex: 10 }]}>
            <TouchableOpacity
              onPress={() => {
                setModalVisibleSelect(!modalVisibleSelect);
              }}
            >
              <View style={styles.chartPicker}>
                <Text style={styles.textTitleHeader}>{pickerValueSelect}</Text>

                <Ionicons name="caret-down" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            {modalVisibleSelect && (
              <View style={[styles.listPicker, { width: windowWidth - 30 }]}>
                <View style={{ borderRadius: 4 }}>
                  <View style={{ paddingVertical: 5 }}>
                    {dataModelSelect.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleCheck(item.value)}
                          style={{
                            paddingVertical: 10,
                            flexDirection: "row",
                            paddingLeft: 15,
                          }}
                        >
                          {selectedChart.includes(item.value) ? (
                            <View
                              style={[
                                styles.iconUnCheck,
                                {
                                  alignItems: "center",
                                  justifyContent: "center",
                                },
                              ]}
                            >
                              <SvgUri source={Icons.iconTickCheckBox}></SvgUri>
                            </View>
                          ) : (
                            <View style={styles.iconUnCheck}></View>
                          )}

                          <Text style={[styles.textTitleHeader]}>{item.label}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </View>
          <ScrollView
            horizontal={true}
            endFillColor={colors.backgroundApp}
            style={{ backgroundColor: colors.backgroundApp }}
            indicatorStyle={"white"}
          >
            <View style={{ paddingHorizontal: 15 }}>
              <View>
                <VictoryChart
                  domainPadding={{ x: 30, y: 40 }}
                  padding={{ top: 5, bottom: 50, left: 90, right: 80 }}
                  width={titleColumnChart.length > 4 ? titleColumnChart.length * 80 : windowWidth}
                  containerComponent={<VictoryVoronoiContainer />}
                  style={{ parent: { cursor: "pointer" } }}
                >
                  <VictoryChart>
                    <VictoryLabel
                      y={170}
                      x={5}
                      angle={-90}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorText,
                      }}
                      text={"Amount - Average TC"}
                    />
                    <VictoryLabel
                      y={170}
                      x={titleColumnChart.length > 4 ? titleColumnChart.length * 80 - 30 : windowWidth - 30}
                      angle={-90}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorText,
                      }}
                      text={"Transaction - Promotion"}
                    />
                    <VictoryLabel
                      y={250}
                      x={70}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorChartLine,
                      }}
                      text={"0"}
                    />
                    <VictoryLabel
                      y={250}
                      x={titleColumnChart.length > 4 ? titleColumnChart.length * 80 - 65 : windowWidth - 65}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorChartLine,
                      }}
                      text={"0"}
                    />
                    <VictoryAxis
                      tickValues={tickValueMoney}
                      tickFormat={t => `${Math.round(t)}.000.000`}
                      dependentAxis
                      orientation="left"
                      style={whiteStyle}
                    />
                    <VictoryAxis tickValues={titleColumnChart} style={whiteStyleBottom} orientation="bottom" />

                    <VictoryAxis
                      tickValues={tickValueMoney}
                      tickFormat={t => `${Math.round(t)}`}
                      dependentAxis
                      orientation="right"
                      style={whiteStyle}
                    />
                  </VictoryChart>
                  {/* ----------value of chart--- */}
                  <VictoryGroup
                    offset={!pickerValueChartDisplay.totalAmount && pickerValueChartDisplay.averageTC ? 0 : 15}
                    style={{ data: { width: 15 } }}
                    colorScale={
                      !pickerValueChartDisplay.totalAmount && pickerValueChartDisplay.averageTC
                        ? ["#00DFFD"]
                        : ["#A24DE4", "#00DFFD"]
                    }
                  >
                    {pickerValueChartDisplay.totalAmount && (
                      <VictoryBar
                        animate={{
                          duration: 2000,
                          onLoad: { duration: 1000 },
                        }}
                        data={handleDataChartCol(dataChartCol.totalAmount, "totalAmount")}
                      />
                    )}
                    {pickerValueChartDisplay.averageTC && (
                      <VictoryBar
                        animate={{
                          duration: 2000,
                          onLoad: { duration: 1000 },
                        }}
                        data={handleDataChartCol(dataChartCol.averageTC, "averageTC")}
                      />
                    )}
                  </VictoryGroup>
                  {/* ------------ */}
                  {/* ----------------Line1 */}
                  {pickerValueChartDisplay.transaction && (
                    <VictoryGroup data={handleDataChartLine(dataChartCol.transaction)} color="#5F8BFC">
                      <VictoryLine interpolation="natural" />
                      <VictoryScatter
                        size={3}
                        style={{
                          data: {
                            fill: ({ datum }) => datum.fill,
                          },
                        }}
                      />
                    </VictoryGroup>
                  )}

                  {/* ----------------Line2 */}
                  {pickerValueChartDisplay.promotion && (
                    <VictoryGroup data={handleDataChartLine(dataChartCol.promotion)} color="#FDB441">
                      <VictoryLine interpolation="natural" />
                      <VictoryScatter
                        size={3}
                        style={{
                          data: {
                            fill: ({ datum }) => datum.fill,
                          },
                        }}
                      />
                    </VictoryGroup>
                  )}
                </VictoryChart>
              </View>
              <View style={styles.rowTableChart}>
                <View style={{ flex: 2.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* <SvgUri source={Icons.Ellipse_foc} /> */}
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#A24DE4",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#A24DE4" }]}>Total Amount</Text>
                  </View>
                </View>
                <View style={{ flex: 2.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#06C2FF",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#06C2FF" }]}>Average TC</Text>
                  </View>
                </View>
                <View style={{ flex: 2.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 8,
                        height: 2,
                        backgroundColor: "#5F8BFC",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#5F8BFC" }]}>Transaction</Text>
                  </View>
                </View>
                <View style={{ flex: 2.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 8,
                        height: 2,
                        backgroundColor: "#FDB441",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#FDB441" }]}>Promotion</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* -----------Modal---- */}
      {/* <ModalRadioButton
        title={pickerTopValueCache.label}
        visible={modalRadioButton}
        data={listPickerTopChild}
        onRequestClose={() => {
          handleClosePickerChild();
        }}
        onRequestSend={value => {
          handlePickerChild(value);
        }}
      ></ModalRadioButton> */}
      {isLoading && <DialogAwait></DialogAwait>}
    </View>
  );
};

export default OnlinePaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
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
  itemFieldSells: {
    height: 77,
    backgroundColor: "#414141",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginRight: 15,
    marginBottom: 15,
  },
  viewWallet: {
    backgroundColor: "#675E50",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 15,
    marginTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    marginRight: 4,
    borderRadius: 8,
  },

  //chartCol
  rowTableChart: {
    flex: 1,
    flexDirection: "row",
    height: 30,
  },
  textNoteChart: {
    color: colors.colorText,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
    marginLeft: 4,
  },
  lineItem: {
    height: 0.5,
    backgroundColor: colors.colorLine,
  },
  salectChart: {
    paddingTop: 15,
    paddingHorizontal: 15,
  },

  chartPicker: {
    height: 40,
    flexDirection: "row",
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  listPicker: {
    position: "absolute",
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    borderColor: colors.backgroundApp,
    top: 60,
    left: 15,
  },
  iconUnCheck: {
    borderRadius: 4,
    backgroundColor: "transparent",
    width: 18,
    height: 18,
    borderColor: "#fff",
    borderWidth: 1,
    marginRight: 10,
  },
});
