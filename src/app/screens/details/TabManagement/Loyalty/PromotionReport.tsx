import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Image, TouchableHighlight } from "react-native";
import DateTimePicker from "../../../../components/datetimepicker";
import PickerModel from "../../../../components/picker/PickerModel";
import { colors } from "../../../../utils/Colors";
import { Imodel } from "../../../../models/Imodel";
import { ScrollView } from "react-native-gesture-handler";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryVoronoiContainer } from "victory-native";
import DropDown from "../../../../components/dropDown/DropDown";
import { getPromotionReport } from "../../../../netWorking/loyaltyService";
import moment from "moment";
import DialogAwait from "../../../../components/dialogs/Loading";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";
export function PromotionReport() {
  const [isLoading, setIsLoading] = useState(false);
  const dataOption: Imodel[] = [
    { label: "Top 5 promotion during a period of time", value: 5 },
    { label: "Top 10 promotion during a period of time", value: 10 },
  ];

  const PromotionChart = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  const revenueChart = [10000000, 20000000, 30000000, 40000000, 50000000, 60000000, 70000000, 80000000, 90000000, 100000000];
  const widthChar = revenueChart.length * 80;
  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  //--------datetime picker
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD"));

  const [numTop, setNumTop] = useState(5);
  const [dataPromotionReport, setDataPromotionReport] = useState([]);
  const [totalNetCostEach, setTotalNetCostEach] = useState(0);
  const [valueRevenueChart, setValueRevenueChart] = useState(revenueChart);

  const loadPromotionReport = async () => {
    setIsLoading(true);
    const res = await getPromotionReport(fromDateTime, endDateTime, 1, numTop);
    if (res.isSuccess === 1 && res.data) {
      setDataPromotionReport(res.data.pointPromotionReport);
      setTotalNetCostEach(res.data.totalnetCostEach);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadPromotionReport();
  }, [fromDateTime, endDateTime, numTop]);
  useEffect(() => {
    if (dataPromotionReport.length > 0) {
      let _revenueChart = [];
      let units = dataPromotionReport[0].y.toString().length;
      let unit = dataPromotionReport[0].y.toString().charAt(0);
      for (let index = 1; index < +unit + 2; index++) {
        _revenueChart.push(index * 10 ** (units - 1));
      }
      setValueRevenueChart(_revenueChart);
    }
  }, [dataPromotionReport]);
  return (
    <View style={styles.container}>
      {/* -----------------Picker Outlet------------- */}
      <PickerModel
        data={null}
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>
      {/* ------------------------------ */}
      <DateTimePicker
        onSubmitFromDate={date => setFromDateTime(moment(date).format("YYYY-MM-DD"))}
        onSubmitEndDate={date => setEndDateTime(moment(date).format("YYYY-MM-DD"))}
        isShowTime={false}
        fromDate={fromDateTime}
        endDate={endDateTime}
      ></DateTimePicker>
      {/* ---------------------------------------- */}
      <View style={styles.line}></View>
      <View style={{ paddingHorizontal: 15, marginBottom: 10, zIndex: 2 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>PROMOTION REPORT</Text>
        </View>
        <View style={{ marginTop: 15 }}>
          <DropDown
            data={dataOption}
            defaultLabel={dataOption[0].label}
            heightContent={70}
            onSelected={values => {
              setNumTop(values.value);
            }}
          ></DropDown>
        </View>
      </View>
      <ScrollView>
        <View style={{ paddingHorizontal: 15 }}>
          {/* -------------------------- */}
          {dataPromotionReport.length > 0 && (
            <ScrollView horizontal={true} endFillColor={colors.backgroundApp} style={{ backgroundColor: colors.backgroundApp }}>
              <View style={{ marginVertical: 15 }}>
                <VictoryChart
                  domainPadding={{ x: 40, y: 45 }}
                  width={widthChar + 170}
                  height={dataPromotionReport.length * 60 + 100}
                  padding={{ top: 30, bottom: 50, left: 130, right: 80 }}
                  containerComponent={<VictoryVoronoiContainer />}
                  style={{ parent: { cursor: "pointer" } }}
                >
                  <VictoryChart>
                    <VictoryLabel
                      y={10}
                      x={100}
                      style={{
                        fontSize: 12,
                        fontStyle: "normal",
                        fill: "#C4C4C4",
                      }}
                      text={"Promotion"}
                    ></VictoryLabel>
                    <VictoryLabel
                      x={widthChar + 110}
                      y={dataPromotionReport.length * 60 - 50}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorText,
                      }}
                      text={"Million"}
                    />
                    <VictoryLabel
                      y={dataPromotionReport.length * 60 + 60}
                      x={128}
                      style={{
                        fontSize: 10,
                        fontStyle: "normal",
                        fill: colors.colorText,
                      }}
                      text={"0"}
                    />

                    <VictoryAxis
                      tickValues={PromotionChart}
                      tickFormat={t => `${t}`}
                      style={whiteStyleBottom}
                      orientation="left"
                    />
                    <VictoryAxis
                      dependentAxis
                      tickValues={valueRevenueChart}
                      tickFormat={t => `${Money(t)}`}
                      style={whiteStyleBottom}
                      orientation="bottom"
                    />
                  </VictoryChart>
                  <VictoryGroup
                    horizontal={true}
                    padding={{ top: 0, bottom: 50, left: 90, right: 80 }}
                    offset={15}
                    style={{ data: { width: 16 } }}
                    colorScale={["#5F8BFC"]}
                  >
                    <VictoryBar
                      labelComponent={<VictoryLabel dx={5} dy={-8} />}
                      style={{
                        labels: {
                          fill: colors.colorText,
                          color: colors.colorText,
                          fontSize: 12,
                        },
                      }}
                      labels={({ datum }) => [Money(Math.round(datum.y))]}
                      data={dataPromotionReport}
                    />
                    <VictoryBar
                      labelComponent={<VictoryLabel dx={-21} dy={7} />}
                      style={{
                        labels: {
                          fill: colors.colorText,
                          color: colors.colorText,
                          fontSize: 12,
                        },
                      }}
                      labels={({ datum }) => [
                        Math.round((datum.y / valueRevenueChart[valueRevenueChart.length - 1]) * 100) + "%",
                      ]}
                      data={dataPromotionReport}
                    />
                  </VictoryGroup>
                </VictoryChart>
              </View>
            </ScrollView>
          )}

          {/* ----------------- */}
          <View>
            <View style={styles.titlrevenue}>
              <Text style={styles.text16}>Revenue Brought by Promotion</Text>
            </View>
            <View style={styles.containerRevenue}>
              <View style={styles.itemrevenueLeft}>
                <View style={{ flex: 2, justifyContent: "center" }}>
                  <Text style={[styles.textGray16, styles.textCenter]}>Promotion</Text>
                </View>
                <View style={{ flex: 2, justifyContent: "center" }}>
                  <Text style={[styles.text16, styles.textCenter]}>
                    {dataPromotionReport.length > 0 ? dataPromotionReport[0].x : "Buy 1 Get 1"}
                  </Text>
                </View>
              </View>
              <View style={styles.itemrevenueRight}>
                <View style={{ flex: 2, justifyContent: "center" }}>
                  <Text style={[styles.textGray16, styles.textCenter]}>Revenue</Text>
                </View>
                <View style={{ flex: 2, justifyContent: "center" }}>
                  <Text style={[styles.text16, styles.textCenter]}>{`${Money(Math.round(totalNetCostEach)) ?? 0} VND`}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {isLoading && <DialogAwait></DialogAwait>}
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
  textCenter: {
    textAlign: "center",
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
  textGray16: {
    color: colors.colorLine,
    fontWeight: "400",
    fontSize: 14,
  },
  text: {
    color: colors.white,
    fontWeight: "400",
    fontSize: 14,
  },
  titleHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginLeft: 25,
    marginRight: 25,
    borderBottomColor: colors.colorLine,
  },

  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 16,
  },
  itemDropDown: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dropDowns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dropDowBody: {
    backgroundColor: colors.grayLight,
    position: "absolute",
    zIndex: 1000,
    right: 0,
    left: 0,
    top: 42,
  },
  titlrevenue: {
    borderBottomWidth: 1,
    paddingBottom: 10,
    borderBottomColor: colors.white,
  },
  containerRevenue: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
  },
  itemrevenueLeft: {
    flex: 2,
    height: 77,
    marginRight: 5,
    padding: 5,
    borderRadius: 4,
    flexDirection: "column",
    backgroundColor: colors.grayLight,
  },
  itemrevenueRight: {
    flex: 2,
    height: 77,
    marginLeft: 5,
    borderRadius: 4,
    padding: 5,
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: colors.grayLight,
  },
});

const whiteStyle = {
  grid: { stroke: colors.white, strokeWidth: 0.5 },
  axis: { stroke: colors.backgroundApp },
  tickLabels: { fill: colors.white, fontSize: 10 },
};

const whiteStyleBottom = {
  axis: { stroke: colors.white },
  tickLabels: { fontSize: 10, padding: 5, fill: colors.white },
};
