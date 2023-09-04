import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  TouchableOpacity,
} from "react-native-gesture-handler";
import {
  VictoryBar,
  VictoryChart,
  VictoryPie,
  VictoryLine,
  VictoryScatter,
  VictoryAxis,
  VictoryLabel,
  VictoryGroup,
  VictoryVoronoiContainer,
} from "victory-native";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "../../../../components/datetimepicker";
import { Icons } from "../../../../assets";
import PickerModel from "../../../../components/picker/PickerModel";
import DropDownPickerLine from "../../../../components/DropDownPickerLine";
import { IModalPicker } from "../../../../models/Imodel";
import SvgUri from "react-native-svg-uri";
const OnlineFoodDeliveryRevenue = () => {
  const dimensions = Dimensions.get("window");
  const windowWidth = dimensions.width;
  // ----Outlet
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  // ----Picker
  const dataTopPicker = [
    { label: "Food delivery company - All", value: "all" },
    { label: "Grab", value: "grab" },
    { label: "Baemin", value: "baemin" },
    { label: "Shopee Food", value: "shopee" },
  ];
  const [pickerTopValue, setPickerTopValue] = useState(dataTopPicker[0]);
  const handlePicker = (value: IModalPicker) => {
    setPickerTopValue(value);
  };
  // ----Body
  const dataFieldSells = [
    { title: "Net Sales", value: "4,059,0000" },
    { title: "Gross Sales", value: "4,059,0000" },
    { title: "Transaction", value: "11" },
    { title: "Order Cancel", value: "5" },
    { title: "Average TC", value: "4,059,0000" },
  ];
  // --------------------chart
  const dataCharts = [
    { title: "Gross Sales", data: [{ y: 2 }, { y: 1 }, { y: 4 }, { y: 3 }] },
    { title: "Transaction", data: [{ y: 2 }, { y: 1 }, { y: 4 }, { y: 3 }] },
    { title: "Order Cancel", data: [{ y: 2 }, { y: 1 }, { y: 4 }, { y: 3 }] },
  ];
  const dataTimeSales = [
    { time: "06:00 AM - 10:00 AM", color: "#70E6A3" },
    { time: "10:00 AM - 02:00 PM", color: "#A24DE4" },
    { time: "02:00 PM - 05:00 PM", color: "#06C2FF" },
    { time: "05:00 PM - 00:00 AM", color: "#F68942" },
  ];
  // ------chart col

  const [modalVisibleSelect, setModalVisibleSelect] = useState(false);
  const [pickerValueSelect, setPickerValueSelect] = useState("All");

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

  //MultiSelect
  const dataModelSelect: {
    label: string;
    value: string;
  }[] = [
    { label: "All", value: "all" },
    { label: "Net Sales", value: "netSales" },
    { label: "Gross Sales", value: "grossSales" },
    { label: "Transaction", value: "transaction" },
    { label: "Average TC", value: "averageTC" },
  ];

  const [pickerValueChartDisplay, setPickerValueChartDisplay] = useState({
    netSales: true,
    grossSales: true,
    transaction: true,
    averageTC: true,
  });

  const [selectedChart, setSelectedChartValue] = useState([
    "all",
    "netSales",
    "grossSales",
    "transaction",
    "averageTC",
  ]);
  function handleCheck(item: string) {
    let data = selectedChart;
    if (data.includes(item)) {
      if (item === "all") {
        data = [];
        setPickerValueSelect("Select...");
        setPickerValueChartDisplay({
          netSales: false,
          grossSales: false,
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
                labelSeleted +=
                  index != data.length - 1
                    ? `${model.label}, `
                    : `${model.label}`;
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
          setPickerValueSelect("All");
        });
        setPickerValueChartDisplay({
          netSales: true,
          grossSales: true,
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
                  labelSeleted +=
                    index != data.length - 1
                      ? `${model.label}, `
                      : `${model.label}`;
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
  const renderViewChart = (net: boolean, gross: boolean, av: boolean) => {
    let offset = 15;
    let colorScale = ["#F6606F", "#76D146", "#00DFFD"];
    if (net && !gross && !av) {
      offset = 0;
    }
    if (!net && !gross && av) {
      offset = 0;
      colorScale = ["#00DFFD"];
    }
    if (!net && gross && !av) {
      offset = 0;
      colorScale = ["#76D146"];
    }
    if (net && !gross && av) {
      colorScale = ["#F6606F", "#00DFFD"];
    }
    if (!net && gross && av) {
      return (
        <VictoryGroup
          offset={15}
          style={{ data: { width: 15 } }}
          colorScale={["#76D146", "#00DFFD"]}
        >
          <VictoryBar
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            data={[
              { x: 1, y: 260 },
              { x: 2, y: 340 },
              { x: 3, y: 340 },
            ]}
          />
          <VictoryBar
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 },
            }}
            data={[
              { x: 1, y: 200 },
              { x: 2, y: 310 },
              { x: 3, y: 150 },
            ]}
          />
        </VictoryGroup>
      );
    } else {
      return (
        <VictoryGroup
          offset={offset}
          style={{ data: { width: 15 } }}
          colorScale={colorScale}
        >
          {pickerValueChartDisplay.netSales && (
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={[
                { x: 1, y: 320 },
                { x: 2, y: 380 },
                { x: 3, y: 240 },
              ]}
            />
          )}
          {pickerValueChartDisplay.grossSales && (
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={[
                { x: 1, y: 260 },
                { x: 2, y: 340 },
                { x: 3, y: 340 },
              ]}
            />
          )}
          {pickerValueChartDisplay.averageTC && (
            <VictoryBar
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 },
              }}
              data={[
                { x: 1, y: 200 },
                { x: 2, y: 310 },
                { x: 3, y: 150 },
              ]}
            />
          )}
        </VictoryGroup>
      );
    }
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
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={styles.titleHeader}>
            <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>
              ONLINE FOOD DELIVERY REVENUE
            </Text>
          </View>
        </View>
        {/* ---------------------------------------- */}
        <DateTimePicker
          onSubmitFromDate={date => {}}
          onSubmitEndDate={date => {}}
        ></DateTimePicker>
        {/* ---------------------------------------- */}
        <DropDownPickerLine
          data={dataTopPicker}
          onSelected={value => {
            handlePicker(value);
          }}
          itemSelected={pickerTopValue}
        ></DropDownPickerLine>
        {/* ---------------------------------------- */}
        <View
          style={{
            paddingVertical: 15,
            paddingLeft: 15,
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {dataFieldSells.map((item, index) => {
            return (
              <View
                key={index}
                style={[
                  styles.itemFieldSells,
                  { width: windowWidth / 2 - 15 - 7.5 },
                ]}
              >
                <Text style={[styles.textGray, { marginBottom: 8 }]}>
                  {item.title}
                </Text>
                <Text style={styles.text16}>{item.value}</Text>
              </View>
            );
          })}
        </View>
        {/* ---------------------------------------- */}
        <View>
          <ScrollView
            horizontal
            indicatorStyle={"white"}
            pagingEnabled
            persistentScrollbar
          >
            {dataCharts.map((chart, iChart) => {
              return (
                <View
                  style={{ alignItems: "center", width: windowWidth }}
                  key={iChart}
                >
                  <Text style={[styles.text16, { marginBottom: 15 }]}>
                    {pickerTopValue.value === "all"
                      ? `Total ${chart.title}`
                      : chart.title}
                  </Text>
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
                            <View
                              style={[
                                styles.dot,
                                { backgroundColor: item.color },
                              ]}
                            ></View>
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

                          <Text style={[styles.textTitleHeader]}>
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}
          </View>

          <ScrollView
            horizontal={true}  indicatorStyle={"white"} endFillColor={colors.backgroundApp} style={{backgroundColor: colors.backgroundApp}}
          >
            <View style={{ paddingHorizontal: 15 }}>
              <View>
                <VictoryChart
                  domainPadding={{ x: 30, y: 40 }}
                  padding={{ top: 5, bottom: 50, left: 90, right: 80 }}
                  containerComponent={<VictoryVoronoiContainer />}
                  style={{ parent: { cursor: "pointer" } }}
                >
                  <VictoryChart>
                    <VictoryLabel
                      y={210}
                      x={5}
                      angle={-90}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorText,
                      }}
                      text={"Net Sales - Gross Sales - Average TC "}
                    />
                    <VictoryLabel
                      y={150}
                      x={windowWidth - 30}
                      angle={-90}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorText,
                      }}
                      text={"Transaction"}
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
                      x={windowWidth - 65}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorChartLine,
                      }}
                      text={"0"}
                    />
                    <VictoryAxis
                      tickValues={[125.0, 250.0, 375.0, 500.0]}
                      tickFormat={t => `${Math.round(t)}.000.000`}
                      dependentAxis
                      orientation="left"
                      style={whiteStyle}
                    />
                    <VictoryAxis
                      tickValues={["Grab", "Baemin", "Shopee food"]}
                      style={whiteStyleBottom}
                      orientation="bottom"
                    />

                    <VictoryAxis
                      tickValues={[125.0, 250.0, 375.0, 500.0]}
                      tickFormat={t => `${Math.round(t)}`}
                      dependentAxis
                      orientation="right"
                      style={whiteStyle}
                    />
                  </VictoryChart>
                  {/* ------------chart bar- */}
                  {pickerValueChartDisplay.grossSales ||
                  pickerValueChartDisplay.averageTC ||
                  pickerValueChartDisplay.netSales ? (
                    renderViewChart(
                      pickerValueChartDisplay.netSales,
                      pickerValueChartDisplay.grossSales,
                      pickerValueChartDisplay.averageTC
                    )
                  ) : (
                    <VictoryGroup></VictoryGroup>
                  )}

                  {/* ------------ */}
                  {pickerValueChartDisplay.transaction && (
                    <VictoryGroup
                      data={[
                        { x: 0.45, y: 350, fill: "#DAB451" },
                        { x: 1, y: 150, fill: "#DAB451" },
                        { x: 2, y: 270, fill: "#DAB451" },
                        { x: 3, y: 230, fill: "#DAB451" },
                        { x: 4, y: 0, fill: "#DAB451" },
                      ]}
                      color="#5F8BFC"
                    >
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
                        backgroundColor: "#F6606F",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#F6606F" }]}>
                      Net Sales
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 2.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#76D146",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#76D146" }]}>
                      Gross Sales
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 2.5 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#00DFFD",
                      }}
                    ></View>
                    <Text style={[styles.textNoteChart, { color: "#00DFFD" }]}>
                      Average TC
                    </Text>
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
                    <Text style={[styles.textNoteChart, { color: "#5F8BFC" }]}>
                      Transaction
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default OnlineFoodDeliveryRevenue;

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
