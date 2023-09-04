import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Image, TouchableHighlight, Dimensions } from "react-native";
import DateTimePicker from "../../../../components/datetimepicker";
import PickerModel from "../../../../components/picker/PickerModel";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Imodel } from "../../../../models/Imodel";
import { ScrollView } from "react-native-gesture-handler";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryVoronoiContainer } from "victory-native";
import { Icons } from "../../../../assets";
import { OlaMember } from "../../../../models/olaMember";
import DropDown from "../../../../components/dropDown/DropDown";
import { getListOlaMemberReport, getTopOlaMemberReport, getAccumulatedCustomer } from "../../../../netWorking/loyaltyService";
import moment from "moment";
import DialogAwait from "../../../../components/dialogs/Loading";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";
export function OlaMemberReport() {
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const [isLoading, setIsLoading] = useState(false);
  const optionsTopMember: Imodel[] = [
    { label: "Top 5 customer during a period of time", value: 5 },
    { label: "Top 10 customer during a period of time", value: 10 },
    { label: "Top 15 customer during a period of time", value: 15 },
  ];
  const optionsTopAccumulated: Imodel[] = [
    { label: "Top 5 accumulated customer", value: 5 },
    { label: "Top 10 accumulated customer", value: 10 },
    { label: "Top 15 accumulated customer", value: 15 },
  ];
  const optionsLeastAccumulated: Imodel[] = [
    { label: "Least 5 accumulated customer", value: 5 },
    { label: "Least 10 accumulated customer", value: 10 },
    { label: "Least 15 accumulated customer", value: 15 },
  ];
  //--------datetime picker
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD"));

  const [dataMember, setDataMember] = useState<OlaMember[]>([]);

  const [numTopMember, setNumTopMember] = useState(5);
  const [numTopMemberAccumulated, setNumTopMemberAccumulated] = useState(5);
  const [numLeastMemberAccumulated, setNumLeastMemberAccumulated] = useState(5);

  const [dataTopMember, setDataTopMember] = useState([]);
  const [dataTopMemberAccumulated, setDataTopMemberAccumulated] = useState([]);
  const [dataLeastMemberAccumulated, setDataLeastMemberAccumulated] = useState([]);

  const [totalTopMember, setTotalTopMember] = useState(0);
  const [totalTopMemberAccumulated, setTotalTopMemberAccumulated] = useState(0);
  const [totalLeastMemberAccumulated, setTotalLeastMemberAccumulated] = useState(0);

  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  const loadListOlaMemberReport = async () => {
    setIsLoading(true);
    const res = await getListOlaMemberReport(fromDateTime, endDateTime, 1, 900);
    if (res.isSuccess === 1 && res.data) {
      setDataMember(res.data.listCustomerOla);
    }
    setIsLoading(false);
  };
  const loadTopOlaMemberReport = async () => {
    setIsLoading(true);
    const res = await getTopOlaMemberReport(fromDateTime, endDateTime, numTopMember);
    if (res.isSuccess === 1 && res.data) {
      let _list = res.data.pointCustomerReport;
      _list.map((item, index) => {
        if (item.x == "") {
          item.x = "No Name";
        }
      });
      setDataTopMember(_list.reverse());
      setTotalTopMember(res.data.totalNetFinal);
    }
    setIsLoading(false);
  };
  const loadAccumulatedCustomer = async (numberRows: number = 5, isTopAccumulated: boolean = true) => {
    setIsLoading(true);
    const res = await getAccumulatedCustomer(numberRows, isTopAccumulated);
    if (res.isSuccess === 1 && res.data) {
      let _list = res.data.pointCustomerReport;
      _list.map((item, index) => {
        if (item.x == "") {
          item.x = "No Name";
        }
      });
      if (isTopAccumulated) {
        setDataTopMemberAccumulated(_list.reverse());
        setTotalTopMemberAccumulated(res.data.totalNetFinal);
      } else {
        setDataLeastMemberAccumulated(_list.reverse());
        setTotalLeastMemberAccumulated(res.data.totalNetFinal);
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadTopOlaMemberReport();
  }, [fromDateTime, endDateTime, numTopMember]);
  useEffect(() => {
    loadAccumulatedCustomer(numTopMemberAccumulated, true);
  }, [numTopMemberAccumulated]);
  useEffect(() => {
    loadAccumulatedCustomer(numLeastMemberAccumulated, false);
  }, [numLeastMemberAccumulated]);
  useEffect(() => {
    loadListOlaMemberReport();
  }, [fromDateTime, endDateTime]);

  const handleWidthChart = (data: number) => {
    let _revenueChart = [];
    let units = data.toString().length;
    let unit = data.toString().charAt(0);
    for (let index = 1; index < +unit + 2; index++) {
      _revenueChart.push(index * 10 ** (units - 1));
    }
    return _revenueChart;
  };
  const handlePercentChart = (data: number) => {
    let units = data.toString().length;
    let unit = data.toString().charAt(0);
    return (+unit + 1) * 10 ** (units - 1);
  };
  const renderChartComponent = (
    id: number,
    options: Imodel[],
    onChangeOption: (value: number) => void,
    dataChart: { x: string; y: number }[],
    defaultLabel: string,
    total: number
  ) => {
    return (
      <View style={{ paddingHorizontal: 15, zIndex: id + 1 }}>
        <View style={{ marginTop: 15, zIndex: 2 }}>
          <DropDown
            data={options}
            heightContent={120}
            defaultLabel={defaultLabel}
            onSelected={values => {
              onChangeOption(values.value);
            }}
          ></DropDown>
        </View>
        {/* -------------------------- */}
        {dataChart.length > 0 && (
          <ScrollView horizontal={true} endFillColor={colors.backgroundApp} style={{ backgroundColor: colors.backgroundApp }}>
            <View style={{ marginVertical: 15 }}>
              <VictoryChart
                domainPadding={{ x: 40, y: 45 }}
                width={handleWidthChart(Math.round(total)).length * 100 + 250}
                height={dataChart.length * 60 + 100}
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
                    text={"Customer"}
                  ></VictoryLabel>
                  <VictoryLabel
                    y={dataChart.length * 60 + 66}
                    x={125}
                    style={{
                      fontSize: 12,
                      fontStyle: "normal",
                      fill: colors.colorText,
                    }}
                    text={"0"}
                  />
                  <VictoryAxis
                    tickValues={dataChart}
                    tickFormat={t => `${t}`}
                    style={{
                      axis: { stroke: colors.white },
                      tickLabels: { fontSize: 12, padding: 20, fill: colors.white },
                    }}
                    orientation="left"
                  />
                  <VictoryAxis
                    dependentAxis
                    tickFormat={t => `${Money(t)}`}
                    tickValues={handleWidthChart(Math.round(total))}
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
                    data={dataChart}
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
                    labels={({ datum }) => [Math.round((datum.y / handlePercentChart(Math.round(total))) * 100) + "%"]}
                    data={dataChart}
                  />
                </VictoryGroup>
              </VictoryChart>
            </View>
          </ScrollView>
        )}

        {/* ----------------- */}
      </View>
    );
  };
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
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>OLA MEMBER REPORT</Text>
        </View>
        <View style={styles.rowTransaction}>
          <Text style={styles.textGray}>Transaction:</Text>
          <Text style={styles.text16}>{dataMember.length} TC</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ paddingHorizontal: 15 }}>
          <FlatList
            data={dataMember}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.itemMember}>
                <View style={styles.itemMemberHeader}>
                  <View style={{ width: 54, justifyContent: "center" }}>
                    <Image style={styles.avatarImg} source={Icons.avatar} />
                  </View>
                  <View style={{ marginLeft: 8, justifyContent: "center" }}>
                    <Text style={[styles.text16]}>{item.customerName}</Text>
                  </View>
                </View>
                <View style={styles.itemRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.textGray}>Transaction:</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    <Text style={styles.text}>{item.transaction}</Text>
                  </View>
                </View>
                <View style={styles.itemRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.textGray}>Total amount:</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    <Text numberOfLines={1} style={styles.text}>
                      {Money(Math.round(item.totalAmount)) ?? Math.round(item.totalAmount)} VND
                    </Text>
                  </View>
                </View>
                <View style={styles.itemRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.textGray}>Amount discount:</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    <Text numberOfLines={1} style={styles.text}>
                      {Money(Math.round(item.amountDiscount)) ?? Math.round(item.amountDiscount)} VND
                    </Text>
                  </View>
                </View>
                <View style={styles.itemRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.textGray}>Net Spending:</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    <Text numberOfLines={1} style={styles.text}>
                      {Money(Math.round(item.netSpending)) ?? Math.round(item.netSpending)} VND
                    </Text>
                  </View>
                </View>
              </View>
            )}
          ></FlatList>
        </View>

        <View style={[styles.line, { marginTop: 15 }]}></View>
        {renderChartComponent(
          3,
          optionsTopMember,
          value => {
            setNumTopMember(value);
          },
          dataTopMember,
          optionsTopMember[0].label,
          totalTopMember
        )}
        <View style={[styles.line, { marginTop: 15 }]}></View>
        {renderChartComponent(
          2,
          optionsTopAccumulated,
          value => {
            setNumTopMemberAccumulated(value);
          },
          dataTopMemberAccumulated,
          optionsTopAccumulated[0].label,
          totalTopMemberAccumulated
        )}
        <View style={[styles.line, { marginTop: 15 }]}></View>
        {renderChartComponent(
          1,
          optionsLeastAccumulated,
          value => {
            setNumLeastMemberAccumulated(value);
          },
          dataLeastMemberAccumulated,
          optionsLeastAccumulated[0].label,
          totalLeastMemberAccumulated
        )}
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
  rowTransaction: {
    height: 40,
    padding: 10,
    backgroundColor: colors.yellowishbrown,
    marginHorizontal: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  itemMember: {
    height: 191,
    borderRadius: 4,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.grayLight,
  },
  itemMemberHeader: {
    height: 44,
    flexDirection: "row",
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  itemRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
});

const whiteStyleBottom = {
  axis: { stroke: colors.white },
  tickLabels: { fontSize: 12, padding: 10, fill: colors.white },
};
