import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Platform, TouchableHighlight } from "react-native";
import { colors } from "../../utils/Colors";
import { Icons } from "../../assets";
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
} from "victory-native";
import { Table, Row, Cell } from "react-native-table-component";
import moment from "moment";
import SvgUri from "react-native-svg-uri";
import HomeDateTimePicker from "../../components/homeDatetimePicker";
import DateTimePicker from "../../components/datetimepicker";
import PickerModel from "../../components/picker/PickerModel";
import { Money } from "../../components/generalConvert/conVertmunberToMoney";
import MoneyText from "../../components/Money";
import { IModalPicker } from "../../models/Imodel";
import DropDownPickerLine from "../../components/DropDownPickerLine";
import { Svg } from "react-native-svg";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabHomeParamList } from "../../types";
import {
  getFocAndDiscount,
  getHomeFocAndDiscountDetail,
  getRevenueAndTCPERHour,
  getRevenueBySubCategory,
  getSalesByPaymentmMethod,
  getTopBest,
  getTopWorst,
  revenueBySubCategory,
  SalesByPaymentmMethodService,
  getTop
} from "../../netWorking/SpeedposService";
import { StatisticalHome } from "../../models/statisticalHomeModel";
import { Revenue } from "../../models/revenueModel";
import { FocAndDiscount } from "../../models/focAndDiscountModel";
import { FocAndDiscountDetail } from "../../models/focAndDiscountDetailModel";
import { RevenueAndTCPERHour } from "../../models/revenueAndTCPERHourModel";
import { TopBest } from "../../models/topBestModel";
import { TopWorst } from "../../models/topWorstModel";
import DateHomePicker from "../../components/dateHomePicker";
import { SalesByPaymentmMethod } from "../../models/salesByPaymentmMethodModel";
import DialogAwait from "../../components/dialogs/dialogAwait";
import Loading from "../../components/dialogs/Loading";
import { FilterViewModel } from "../../models/filterViewModel";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { checkRole } from "../../components/generalConvert/roles";
import DatePickerCustom from "../../components/DatePickerCustom";
import { LinearGradient } from "expo-linear-gradient";

export interface dataCharLineModel {
  x?: string;
  y?: number;
}

export interface DataTop {
  x?: string;
  y?: number;
  x0?: number;
}

const ChartClick = Platform.select({
  ios: TouchableOpacity,
  android: Svg,
});

export interface Props {
  route: RouteProp<TabHomeParamList, "TabHomeScreen">;
  navigation: StackNavigationProp<TabHomeParamList>;
}
const TabHomeScreen = (props: Props) => {
  const { access } = useSelector((state: RootState) => state.accesses);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTop, setIsLoadingTop] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);

  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD 00:00"));
  const fromDateTimeRef = useRef(fromDateTime);
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD 23:59"));
  const endDateTimeRef = useRef(endDateTime);

  //
  const [outlet, setoutlet] = useState(2);
  const [droplistOutlet, setDroplistOutlet] = useState("");
  const [validateFromDateTime, setValidateFromDateTime] = useState("");
  const [validateEndDateTime, setValidateEndDateTime] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [checKLoadDefault, setChecKLoadDefault] = useState(true);
  //StatisticalHome
  const tableStatisticalHome: StatisticalHome[] = [];
  const [dataStatisticalHome, setStatisticalHome] = useState(tableStatisticalHome);
  //Revenue
  const tableRevenue: Revenue[] = [];
  const [dataRevenue, setRevenue] = useState(tableRevenue);
  // chart
  const datachar: dataCharLineModel[] = [];
  const [dataCharLine, setDataCharLine] = useState(datachar);
  //foc And Discount
  const focAndDiscount: FocAndDiscount[] = [];
  const [dataFocAndDiscount, setFocAndDiscount] = useState(focAndDiscount);
  //foc And Discount detail
  const focAndDiscountDetail: FocAndDiscountDetail[] = [];
  const [dataFocAndDiscountDetail, setFocAndDiscountDetail] = useState(focAndDiscountDetail);
  //Get Revenue And TCPE RHour
  const revenueAndTCPERHour: RevenueAndTCPERHour[] = [];
  const [dataRevenueAndTCPERHour, setRevenueAndTCPERHour] = useState(revenueAndTCPERHour);
  // create sales by payment method
  const [cash, setCash] = useState(0);
  const [eWallet, setEWallet] = useState(0);
  const [creditCard, setCreditCard] = useState(0);
  const [dataVoucher, setVoucher] = useState(0);
  // top best
  const topBest: DataTop[] = [];
  const [dataTopBest, setTopBest] = useState(topBest);
  // top best
  const topWorst: DataTop[] = [];
  const [dataTopWorst, setTopWorst] = useState(topWorst);
  //number top best
  const numberTopBestDefaults = 5;
  const [numberTopBest, setNumberTopBest] = useState(numberTopBestDefaults);
  //number top worst
  const numberTopTopWorstDefaults = 5;
  const [numberTopWorst, setNumberTopWorst] = useState(numberTopTopWorstDefaults);
  // date top
  const [fromDateTopBest, setFromDateTopBest] = useState(null);
  const [endDateWorst, setEndDateWorst] = useState(null);
  // const [fromDateTopBest, setFromDateTopBest] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD"));
  // const [endDateWorst, setEndDateWorst] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD"));
  //payrool
  const [numberFoc, setNumberFoc] = useState(0);
  const [numberDiscount, setNumberDiscount] = useState(0);
  //
  let model: FilterViewModel = {};
  //

  const onchangeOutlet = async (data: any) => {
    if (data) {
      setChecKLoadDefault(true);
      setoutlet(data);
      setDroplistOutlet(data);
    }
  };

  const OnchangeFromDateTime = async (dateTime: any) => {
    let toDate = dateTime.replace('00:00', '23:59')
    setChecKLoadDefault(true);
    setFromDateTime(dateTime);
    setEndDateTime(toDate);
    fromDateTimeRef.current = dateTime;
    endDateTimeRef.current = toDate;
    setValidateFromDateTime(dateTime);
    setValidateEndDateTime(toDate);
    await loadStatisticalHome(dateTime, toDate);
  };

  const OnchangeEndDateTime = async (dateTime: any) => {
    setChecKLoadDefault(true);
    setEndDateTime(dateTime);
    endDateTimeRef.current = dateTime;
    setValidateEndDateTime(dateTime);
    await loadStatisticalHome(fromDateTime, dateTime);
  };

  const loadRevenueByySubCategory = async (dateTimeFrom, dateTimeTo) => {
    const res = await getRevenueBySubCategory(dateTimeFrom, dateTimeTo);
    let data = [];
    if (res.isSuccess == 1) {
      data = res.data;
      setStatisticalHome(data);
      let dataFocAnDiscount = res.data as StatisticalHome[];
      dataFocAnDiscount.map(map => {
        // tính phần  trăm payrool
        setNumberFoc(Math.round((map.payrollPercent / (map.payrollPercent + map.budgetPayrollPercent)) * 100));
        setNumberDiscount(Math.round((map.budgetPayrollPercent / (map.payrollPercent + map.budgetPayrollPercent)) * 100));
      });
    }
    setIsRefresh(false);
  };

  const loadFocAndDiscount = async (dateTimeFrom, dateTimeTo) => {
    const resFocAndDiscount = await getFocAndDiscount(dateTimeFrom, dateTimeTo);
    let data = [];
    if (resFocAndDiscount.isSuccess == 1) {
      data = resFocAndDiscount.data;
      setFocAndDiscount(data);
    }
  };

  const loadFocAndDiscountDetail = async (dateTimeFrom, dateTimeTo) => {
    const resFocAndDiscountDetail = await getHomeFocAndDiscountDetail(dateTimeFrom, dateTimeTo);
    let data = [];
    if (resFocAndDiscountDetail.isSuccess == 1) {
      data = resFocAndDiscountDetail.data;
      setFocAndDiscountDetail(data);
    }
  };

  const loadRevenueAndTCPERHour = async (dateTimeFrom, dateTimeTo) => {
    const resRevenueAndTCPERHour = await getRevenueAndTCPERHour(dateTimeFrom, dateTimeTo);
    let data = [];
    if (resRevenueAndTCPERHour.isSuccess == 1) {
      data = resRevenueAndTCPERHour.data;
      data.sort((a, b) => parseFloat(a.timeArea.slice(0, 2)) - parseFloat(b.timeArea.slice(0, 2)));
      setRevenueAndTCPERHour(data);
    }
  };

  const loadSalesCAS = async (dateTimeFrom, dateTimeTo) => {
    model.StringDateFrom = dateTimeFrom;
    model.StringDateTo = dateTimeTo;
    const res = await SalesByPaymentmMethodService.getSalesCASH(model);
    if (res && res.data) {
      res.data.map(map => {
        if (map.tender !== null) {
          setCash(map.tender);
        }
      });
    }
  };

  const loadSalesDEBT = async (dateTimeFrom, dateTimeTo) => {
    model.StringDateFrom = dateTimeFrom;
    model.StringDateTo = dateTimeTo;
    const res = await SalesByPaymentmMethodService.getSalesDEBT(model);
    if (res && res.data) {
      res.data.map(map => {
        if (map.tender !== null) {
          setCreditCard(map.tender);
        }
      });
    }
  };

  const loadStatisticalHome = async (dateTimeFrom, dateTimeTo) => {
    setIsLoading(true);
    if (!dateTimeFrom && !dateTimeTo) {
      dateTimeFrom = fromDateTime;
      dateTimeTo = endDateTime;
    }
    await loadRevenueByySubCategory(dateTimeFrom, dateTimeTo);
    //get Revenue
    let dataFrom = moment(new Date(dateTimeFrom)).format("YYYY-MM-DD");
    let dataTo = moment(new Date(dateTimeTo)).format("YYYY-MM-DD");
    const resRevenue = await revenueBySubCategory(dataFrom, dataTo, dateTimeFrom, dateTimeTo);
    if (resRevenue.isSuccess == 1) {
      let dataRevenue = resRevenue.data as Revenue[];
      dataRevenue.map(map => {
        tableRevenue.push({
          productGroup: map.productGroup,
          fullProductGroup: map.fullProductGroup,
          productGroupPourCent: map.productGroupPourCent,
          revenueProductGroup: map.revenueProductGroup,
          reportNo: map.reportNo,
        });
        datachar.push({ x: map.productGroup, y: map.productGroupPourCent });
      });
      setDataCharLine(datachar);
      setRevenue(tableRevenue);
    }
    //get FocAndDiscount
    await loadFocAndDiscount(dateTimeFrom, dateTimeTo);
    //get Home Foc And Discount Detail
    await loadFocAndDiscountDetail(dateTimeFrom, dateTimeTo);

    //Get Revenue And TCPER Hour
    await loadRevenueAndTCPERHour(dateTimeFrom, dateTimeTo);
    //sales by payment method
    // loadSalesByPaymentmMethod(dateTimeFrom, dateTimeTo);
    await loadSalesCAS(dateTimeFrom, dateTimeTo);
    await loadSalesDEBT(dateTimeFrom, dateTimeTo);
    setChecKLoadDefault(false);
    setIsLoading(false);
  };

  //onchange From Date Best
  const OnchangeFromDateBest = async (dateTime: any) => {
    setFromDateTopBest(dateTime);
    if (endDateWorst !== null) {
      setIsLoadingTop(true)
      await loadTop(numberTopBest, dateTime, endDateWorst);
      // await loadTopWorst(numberTopWorst, dateTime, endDateWorst);
      setIsLoadingTop(false)
    }
  };

  //onchange From Date Worst
  const OnchangeFromDateBWorst = async (dateTime: any) => {
    setEndDateWorst(dateTime);
    if (fromDateTopBest !== null) {
      setIsLoadingTop(true)
      await loadTop(numberTopBest, fromDateTopBest, dateTime);
      // await loadTopWorst(numberTopWorst, fromDateTopBest, dateTime);
      setIsLoadingTop(false)
    }
  };

  const loadTopBest = async (item, dateFrom, dateTo) => {
    if (!dateFrom && !dateTo) {
      dateFrom = fromDateTopBest;
      dateTo = endDateWorst;
    }
    const resTopBest = await getTopBest(15, dateFrom, dateTo);
    if (resTopBest.isSuccess == 1) {
      let data = resTopBest.data as TopBest[];
      data.map(map => {
        topBest.push({
          // x: /\s/.test(map.prodName) ? map.prodName.match(/\b([A-Z])/g).join("") : map.prodName,
          x: map.prodName,
          y: map.totalNetCostEach,
          x0: map.revenuePercent,
        });
      });
      setTopBest(topBest);
    }
  };

  const loadTopWorst = async (item, dateFrom, dateTo) => {
    if (!dateFrom && !dateTo) {
      dateFrom = fromDateTopBest;
      dateTo = endDateWorst;
    }
    const resTopWorst = await getTopWorst(15, dateFrom, dateTo);
    if (resTopWorst.isSuccess == 1) {
      let data = resTopWorst.data as TopWorst[];
      data.map(map => {
        topWorst.push({
          // x: /\s/.test(map.prodName) ? map.prodName.match(/\b([A-Z])/g).join("") : map.prodName,
          x: map.prodName,
          y: map.totalNetCostEach,
          x0: map.revenuePercent,
        });
      });
      setTopWorst(topWorst);
    }
  };
  const loadTop = async (item, dateFrom, dateTo) => {
    if (!dateFrom && !dateTo) {
      dateFrom = fromDateTopBest;
      dateTo = endDateWorst;
    }
    const resTop = await getTop(15, dateFrom, dateTo);
    let topWorst = []
    let topBest = []
    if (resTop.isSuccess == 1) {
      let data = resTop.data
      data.dataTopBest.map(map => {
        topBest.push({
          // x: /\s/.test(map.prodName) ? map.prodName.match(/\b([A-Z])/g).join("") : map.prodName,
          x: map.prodName,
          y: map.totalNetCostEach,
          x0: map.revenuePercent,
        });
      });
      data.dataTopWord.map(map => {
        topWorst.push({
          // x: /\s/.test(map.prodName) ? map.prodName.match(/\b([A-Z])/g).join("") : map.prodName,
          x: map.prodName,
          y: map.totalNetCostEach,
          x0: map.revenuePercent,
        });
      });
      setTopBest(topBest);
      setTopWorst(topWorst);
    }
  };

  //onchange number top best
  const onchangeTopBestValue = (item: any) => {
    setOnchangeTopBest(item);
    let valueTopBest = parseInt(item.value);
    setNumberTopBest(valueTopBest);
    // if(fromDateTopBest !== null &&endDateWorst!== null){
    //   loadTopBest(valueTopBest, fromDateTopBest, endDateWorst);
    // }
  };
  //onchange number top worst
  const onchangeTopWorstValue = (item: any) => {
    setOnchangeTopWorst(item);
    let valueTopWorst = parseInt(item.value);
    setNumberTopWorst(valueTopWorst);
    // if(fromDateTopBest !== null &&endDateWorst!== null){
    //   loadTopWorst(valueTopWorst, fromDateTopBest, endDateWorst);
    // }
  };

  const topBestSelling: IModalPicker[] = [
    { label: "Top 5 Best Selling Menu Items By Profit Margin", value: "5" },
    { label: "Top 10 Best Selling Menu Items By Profit Margin", value: "10" },
    { label: "Top 15 Best Selling Menu Items By Profit Margin", value: "15" },
  ];
  const topWorstSelling: IModalPicker[] = [
    { label: "Top 5 Worst Selling Menu Items By Profit Margin", value: "5" },
    { label: "Top 10 Worst Selling Menu Items By Profit Margin", value: "10" },
    { label: "Top 15 Worst Selling Menu Items By Profit Margin", value: "15" },
  ];
  const [onchangeTopBest, setOnchangeTopBest] = useState(topBestSelling[0]);
  const [onchangeTopWorst, setOnchangeTopWorst] = useState(topWorstSelling[0]);
  const castNum = (item: any) => {
    return +item;
  };

  const state = {
    tableHead: ["Date", "Bill No", "Amount (VND)", "Discount (VND)", "Discount %", "Payable (VND)", "Reason"],
    widthArr: [90, 100, 100, 100, 100, 100, 100],
  };

  const stateTable = {
    tableHead: ["Journey", "Time Area", "Net Sale (VND)", "TC", "Average Check (VND)"],
    widthArr: [120, 150, 120, 100, 120],
  };

  const whiteStyle = {
    axis: { stroke: "#A4A4A4" },
    axisLabel: { fontSize: 20, fill: "#A4A4A4" },
    ticks: { stroke: "#A4A4A4", size: 7 },
    tickLabels: { fontSize: 15, padding: 1, fill: "#A4A4A4" },
  };

  const whiteStyleBottom = {
    axis: { stroke: "#A4A4A4" },
    axisLabel: { fontSize: 10, fill: "#A4A4A4" },
    ticks: { stroke: colors.backgroundApp },
    tickLabels: { fontSize: 10, padding: 10, fill: "#A4A4A4" },
  };

  const width = Dimensions.get("window").width;

  const dataSetMony = [[{ x: 1 }, { x: 2 }, { x: 3 }, { x: 4 }, { x: 5 }, { x: 6 }]];
  const maxmap = dataSetMony.map(dataset => Math.max(...dataset.map(d => d.x)));

  const handleDataRevenueCategory = () => {
    let _listCategory = [];
    dataRevenue &&
      dataRevenue.map(item => {
        _listCategory.push({ label: item.fullProductGroup, value: item.reportNo, fromdate: fromDateTime, enddate: endDateTime });
      });
    return _listCategory;
  };

  useEffect(() => {
    if (checKLoadDefault) {
      loadStatisticalHome(fromDateTime, endDateTime);
      // loadTopBest(numberTopBest, fromDateTopBest, endDateWorst);
      // loadTopWorst(numberTopWorst, fromDateTopBest, endDateWorst);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      setIsRefresh(true);
      loadRevenueByySubCategory(fromDateTimeRef.current, endDateTimeRef.current);
    });
    return unsubscribe;
  }, [props.navigation]);
  const getDomainChartTop = (data: any[]) => {
    if (data.length > 0) {
      let maxDomain = Math.max(...data.map(e => e.y)).toFixed()
      return [0, +maxDomain + 5]
    } else {
      return [0, 10]
    }
  }
  return (
    <View style={styles.mainBody}>
      {isLoading || isRefresh ? (
        <Loading></Loading>
      ) : (
        <ScrollView>
          {checkRole(access, 'HOME') ? (
            <View style={{ flex: 1 }}>
              <View>
                <PickerModel
                  defaultValue="Ola Restaurant"
                  onSelectedValue={value => {
                    onchangeOutlet(value?.value);
                  }}
                ></PickerModel>
                {/* <HomeDateTimePicker
                  fromDate={fromDateTime}
                  endDate={endDateTime}
                  onSubmitFromDate={date => {
                    OnchangeFromDateTime(date);
                    // OnchangeEndDateTime(date.replace('00:00', '23:59'));
                  }}
                  disableToDate={true}
                  textTitle="Select One Day"
                ></HomeDateTimePicker> */}
                <DatePickerCustom
                  value={fromDateTime}
                  onSubmit={date => {
                    OnchangeFromDateTime(moment(new Date(date)).format('YYYY-MM-DD 00:00'));
                  }}
                ></DatePickerCustom>
              </View>
              <View style={styles.viewContent}></View>
              <View>
                {dataStatisticalHome.map((data, indexEstimate) => (
                  <View key={indexEstimate} style={styles.row}>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Day</Text>
                      <Text style={styles.text}>{data.dayName}</Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Date</Text>
                      <Text style={styles.text}>{data.dayMonth}</Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>MGR INTITALS</Text>
                      <Text style={styles.text}>{data.userName}</Text>
                    </View>

                    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>BUDGET ED Daily Sales</Text>
                      {/* <Text style={styles.text}>{data.budgetedDailySales ? Money(data.budgetedDailySales) : 0}</Text> */}
                      <MoneyText data={Math.round(data.budgetedDailySales)} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>BUDGET Accum Sales Pd</Text>
                      {/* <Text style={styles.text}>{data.budgetedAccumSalessPD ? Money(data.budgetedAccumSalessPD) : 0}</Text> */}
                      <MoneyText data={data.budgetedAccumSalessPD} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>ACTUALDAILY SALES (VND)</Text>
                      {/* <Text style={styles.text}>{data.actualDailySales ? Money(data.actualDailySales) : 0}</Text> */}
                      <MoneyText data={data.actualDailySales} style={styles.text} />
                    </View>
                    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>FOC (VND)</Text>
                      {/* <Text style={styles.text}>{data.lessMgntMeab ? Money(data.lessMgntMeab) : "---"}</Text> */}
                      <MoneyText data={data.lessMgntMeab} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Less VAT 10%</Text>
                      {/* <Text style={styles.text}>{data.lessVAT10 ? Money(data.lessVAT10) : 0}</Text> */}
                      <MoneyText data={data.lessVAT10} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Less SC 5%</Text>
                      {/* <Text style={styles.text}>{data.lessSC5 ? Money(data.lessSC5) : "---"}</Text> */}
                      <MoneyText data={data.lessSC5} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Estimated Daily Sales</Text>
                      {/* <Text style={[styles.text, { color: colors.mainColor }]}>{data.estimatedDailySales ? Money(data.estimatedDailySales) : 0}</Text> */}
                      <MoneyText data={data.estimatedDailySales} style={[styles.text, { color: colors.mainColor }]} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>ESTIMATED Accum Sales...</Text>
                      {/* <Text style={styles.text}>{data.estimatedAccumSalesPd ? Money(data.estimatedAccumSalesPd) : 0}</Text> */}
                      <MoneyText data={data.estimatedAccumSalesPd} style={styles.text} />
                    </View>
                    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>VARIANCE DAILY</Text>
                      {/* <Text style={styles.text}>{data.variancedaily ? Money(data.variancedaily) : 0}</Text> */}
                      <MoneyText data={data.variancedaily} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>VARIANCE ACCUMULATED</Text>
                      {/* <Text style={styles.text}>{data.varianceAccumulated ? Money(data.varianceAccumulated) : 0}</Text> */}
                      <MoneyText data={data.varianceAccumulated} style={styles.text} />
                    </View>
                    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Customer Count</Text>
                      <Text style={styles.text}>{data.customerCount ? data.customerCount : 0}</Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Check Average</Text>
                      {/* <Text style={styles.text}>{data.checkAverage ? Money(data.checkAverage) : 0}</Text> */}
                      <MoneyText data={data.checkAverage} style={styles.text} />
                    </View>
                    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Wastage VND</Text>
                      {data.wastageVND === 0 ? <Text style={styles.text}>Not Available</Text> : <MoneyText data={data.wastageVND} style={styles.text} />}
                      {/* <Text style={styles.text}>{data.wastageVND ? Money(data.wastageVND) : 0}</Text> */}

                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Wastage %</Text>
                      {data.wastagePercent === 0 ? <Text style={styles.text}>Not Available</Text> : <Text style={styles.text}>{`${data.wastagePercent ? Money(Math.round(data.wastagePercent * 100) / 100) : 0
                        }%`}</Text>}

                    </View>
                    <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Actual Store Working H...</Text>
                      <Text style={styles.text}>{data.actualStoreWorkingHours ? Money(data.actualStoreWorkingHours) : 0}</Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Payroll (VND)</Text>
                      {/* <Text style={styles.text}>{data.payrollVND ? Money(data.payrollVND) : 0}</Text> */}
                      <MoneyText data={data.payrollVND} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>BUGETED Payroll %</Text>
                      <Text style={styles.text}>{`${data.budgetPayrollPercent ? Money(Math.round(data.budgetPayrollPercent * 100) / 100) : 0
                        }%`}</Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Payroll %</Text>
                      <Text style={styles.text}>{`${data.payrollPercent ? Money(data.payrollPercent) : 0}%`}</Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Actual SPMH</Text>
                      {/* <Text style={styles.text}>{data.actualSPMH ? Money(data.actualSPMH) : 0}</Text> */}
                      <MoneyText data={data.actualSPMH} style={styles.text} />
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Hours should have used</Text>
                      <Text style={styles.text}>{data.hoursShouldHaveUsded ? Money(data.hoursShouldHaveUsded) : 0}</Text>
                      {/* <MoneyText data={data.hoursShouldHaveUsded} style={styles.text}/> */}
                    </View>
                    <View style={[styles.rowItem, { marginBottom: 15 }]}>
                      <Text style={styles.textRowTitle}>Variance</Text>
                      <Text style={styles.text}>{data.variance ? Money(data.variance) : 0}</Text>
                      {/* <MoneyText data={data.variance} style={styles.text}/> */}
                    </View>
                  </View>
                ))}

                {/* ------------- sales by payment method ---------------- */}
                <View style={styles.viewContent}></View>
                <View style={styles.payRoll}>
                  <View>
                    <Text style={styles.payRollHeader}>SALES BY PAYMENT METHOD</Text>
                  </View>
                  <View style={styles.linePayRoll}></View>
                  <View style={styles.row}>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Cash</Text>
                      {/* <Text style={styles.text}>{cash ? Money(cash) : 0} VND</Text> */}
                      <Text>
                        <MoneyText data={cash} style={styles.text} />
                        <Text style={styles.text}> VND</Text>
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>E-Wallet</Text>
                      {/* <Text style={styles.text}>{eWallet ? Money(eWallet) : 0} VND</Text> */}
                      <Text>
                        <MoneyText data={eWallet} style={styles.text} />
                        <Text style={styles.text}> VND</Text>
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Credit Card</Text>
                      {/* <Text style={styles.text}>{creditCard ? Money(creditCard) : 0} VND</Text> */}
                      <Text>
                        <MoneyText data={creditCard} style={styles.text} />
                        <Text style={styles.text}> VND</Text>
                      </Text>
                    </View>
                    <View style={styles.rowItem}>
                      <Text style={styles.textRowTitle}>Voucher</Text>
                      {/* <Text style={styles.text}>{dataVoucher ? Money(dataVoucher) : 0} VND</Text> */}
                      <Text>
                        <MoneyText data={dataVoucher} style={styles.text} />
                        <Text style={styles.text}> VND</Text>
                      </Text>
                    </View>
                  </View>
                </View>
                {/* ------------------------------------------------------- */}

                <View style={styles.viewContent}></View>
                <View style={styles.payRoll}>
                  <View>
                    <Text style={styles.payRollHeader}>PAYROLL</Text>
                  </View>
                  <View style={styles.linePayRoll}></View>
                  <View>
                    <View style={styles.pieChart}>
                      <View style={[styles.pieChart, { alignItems: "center" }]}>
                        <VictoryPie
                          data={[
                            { x: numberFoc, y: numberFoc, boder: 140 },
                            { x: numberDiscount, y: numberDiscount, boder: 150 },
                          ]}
                          radius={({ datum }) => datum.boder}
                          colorScale={["#5F8BFC", "#FB8832"]}
                          padding={15}
                          labels={({ datum }) => `${datum.y ? datum.y : ""} ${datum.y ? "%" : ""}`}
                          labelRadius={() => 50}
                          labelPosition={() => "centroid"}
                          style={{
                            labels: {
                              fill: "white",
                              fontSize: 20,
                              fontWeight: "bold",
                            },
                            data: {
                              fillOpacity: 0.9,
                              stroke: colors.backgroundApp,
                              strokeWidth: 5,
                            },
                          }}
                        />
                      </View>
                    </View>
                    <View style={styles.rowTableChart}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ alignSelf: "center" }}>
                          <SvgUri source={Icons.Ellipse_one} />
                          <Text> </Text>
                          <Text style={styles.budgetedPayroll}>Payroll %</Text>
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ alignSelf: "center" }}>
                          <SvgUri source={Icons.Ellipse_two} />
                          <Text> </Text>
                          <Text style={styles.commentPayRoll}>BUDGET Payroll %</Text>
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.viewContent}></View>
                <View style={styles.payRoll}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15 }}>
                    <Text style={styles.payRollHeader}>REVENUE BY SUB CATEGORY</Text>
                    <LinearGradient
                      style={{
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 4
                      }}
                      colors={["#DAB451", "#988050"]}
                    >
                      <TouchableHighlight
                        underlayColor={colors.yellowishbrown}
                        onPress={() => {
                          dataRevenue.length > 0 && props.navigation.navigate("RevenueBySubCategory", {
                            data: {
                              id: 1,
                              dataRevenue: handleDataRevenueCategory(),
                            },
                          });
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            paddingVertical: 5,
                            paddingHorizontal: 15
                          }}
                        >
                          <Text style={[styles.title, { textAlign: "center", fontSize: 12, fontWeight: '700' }]}>
                            Details
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </LinearGradient>
                  </View>
                  <View style={styles.linePayRoll}></View>
                  <ScrollView horizontal>
                    <View>
                      <View style={styles.pieChartChar}>
                        <ChartClick>
                          <VictoryChart
                            padding={{ top: 50, bottom: 30, left: 55, right: 55 }}
                            height={300}
                            width={dataRevenue.length > 5 ? dataRevenue.length * 70 : width}
                            domainPadding={{ x: 60, y: 30 }}
                          >
                            <VictoryAxis
                              events={[
                                {
                                  childName: "all",
                                  target: "tickLabels",
                                  eventHandlers: {
                                    onPressIn: (evt, prop) => {
                                      // props.navigation.navigate("RevenueBySubCategory", {
                                      //   data: {
                                      //     id: prop.datum,
                                      //     dataRevenue: handleDataRevenueCategory(),
                                      //   },
                                      // });
                                    },
                                  },
                                },
                              ]}
                              tickLabelComponent={<VictoryLabel></VictoryLabel>}
                              style={whiteStyleBottom}
                            />
                            <VictoryLabel
                              y={32}
                              x={30}
                              style={{
                                fontSize: 12,
                                fontStyle: "normal",
                                fill: "#A4A4A4",
                              }}
                              text={"MIL VND"}
                            ></VictoryLabel>
                            <VictoryChart>
                              <VictoryAxis
                                tickValues={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                dependentAxis
                                orientation="right"
                                style={whiteStyle}
                              />
                              <VictoryAxis
                                tickValues={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
                                tickFormat={t => `${Money(t / 10 / 2)}`}
                                dependentAxis
                                orientation="left"
                                style={whiteStyle}
                              />
                            </VictoryChart>
                            <VictoryLabel
                              y={32}
                              x={dataRevenue.length > 5 ? dataRevenue.length * 70 - 45 : width - 45}
                              style={{
                                fontSize: 12,
                                fontStyle: "normal",
                                fill: "#A4A4A4",
                              }}
                              text={"%"}
                            ></VictoryLabel>
                            {dataRevenue.map((data, indexStoreProduct) => (
                              <VictoryGroup key={indexStoreProduct}>
                                <VictoryBar
                                  data={[{ x: data.productGroup, y: data.revenueProductGroup }]}
                                  barRatio={0.8}
                                  barWidth={() => 25}
                                  style={{
                                    data: {
                                      fill: ({ datum }) => (datum.x === 3 ? "#5BCBF6" : "#5BCBF6"),
                                    },
                                    labels: { fill: "#FEFFFF", fontSize: 10 },
                                  }}
                                  labels={({ datum }) => (datum.y / 10).toFixed(2)}
                                  labelComponent={<VictoryLabel dy={0} />}
                                />

                                <VictoryScatter
                                  data={[
                                    {
                                      x: data.productGroup,
                                      y: data.productGroupPourCent,
                                      fill: "red",
                                      fullname: data.fullProductGroup,
                                    },
                                  ]}
                                  size={5}
                                  style={{
                                    data: {
                                      fill: ({ datum }) => datum.fill,
                                    },
                                  }}
                                />
                              </VictoryGroup>
                            ))}
                            <VictoryLine
                              data={dataCharLine}
                              style={{
                                data: {
                                  stroke: "red",
                                },
                                labels: { fill: "#A4A4A4" },
                              }}
                              labels={({ datum }) => datum.y}
                            />
                          </VictoryChart>
                        </ChartClick>
                      </View>
                      <View style={styles.rowTableChart}>
                        <View style={{ flex: 5 }}>
                          <Text style={{ position: "absolute", right: 0 }}>
                            <SvgUri source={Icons.Ellipse_green} />
                            <Text> </Text>
                            <Text style={styles.commentChart}>MIL VND</Text>
                          </Text>
                        </View>
                        <View style={{ flex: 5 }}>
                          <Text style={{ position: "absolute", left: 20 }}>
                            <SvgUri source={Icons.Ellipse_red} />
                            <Text> </Text>
                            <Text style={styles.commentChartTable}>%</Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </View>

              <View>
                <View style={styles.viewContent}></View>
                <View style={styles.payRoll}>
                  <View>
                    <Text style={styles.payRollHeader}>FOC & DISCOUNT</Text>
                  </View>
                  <View style={styles.linePayRoll}></View>
                  <View style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <View style={[styles.pieChart, { alignItems: "center" }]}>
                      {dataFocAndDiscount.map((data, indexFoc) =>
                        !data.foc && !data.discount ? null : (
                          <VictoryPie
                            key={indexFoc}
                            data={[
                              { x: data.foc ? data.foc : 0, y: data.foc ? data.foc : 0, boder: 140 },
                              { x: data.discount ? data.discount : 0, y: data.discount ? data.discount : 0, boder: 150 },
                            ]}
                            radius={({ datum }) => datum.boder}
                            width={335}
                            colorScale={["#76D146", "#F6606F"]}
                            padding={15}
                            labels={({ datum }) => `${datum.y ? datum.y : ""} ${datum.y ? "%" : ""}`}
                            labelRadius={() => 50}
                            labelPosition={() => "centroid"}
                            style={{
                              labels: {
                                fill: "white",
                                fontSize: 20,
                                fontWeight: "bold",
                              },
                              data: {
                                fillOpacity: 0.9,
                                stroke: colors.backgroundApp,
                                strokeWidth: 5,
                              },
                            }}
                          />
                        )
                      )}
                    </View>
                    <View style={styles.pieChart}></View>

                    <View style={styles.rowTableChart}>
                      <View style={{ flex: 5 }}>
                        <Text style={{ alignSelf: "center" }}>
                          <SvgUri source={Icons.Ellipse_discount} />
                          <Text> </Text>
                          <Text style={styles.commentDiscount}>FOC</Text>
                        </Text>
                      </View>
                      <View style={{ flex: 5 }}>
                        <Text style={{ alignSelf: "center" }}>
                          <SvgUri source={Icons.Ellipse_foc} />
                          <Text> </Text>
                          <Text style={styles.commentChartTableFoc}>Discount</Text>
                        </Text>
                      </View>
                    </View>
                    <View style={styles.lineTable}></View>
                    <ScrollView horizontal={true} style={{ backgroundColor: "#17151C" }}>
                      <View>
                        <Table
                          borderStyle={{
                            borderWidth: 0.5,
                            borderColor: "#C1C0B9",
                          }}
                          style={styles.hedertable}
                        >
                          <Row
                            data={state.tableHead}
                            widthArr={state.widthArr}
                            style={styles.header}
                            textStyle={styles.textTable}
                          />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                          <Table>
                            {dataFocAndDiscountDetail?.map((rowDatas, indexFocAndDiscountDetail) => (
                              <View
                                key={indexFocAndDiscountDetail}
                                style={[
                                  { flexDirection: "row", height: 50 },
                                  indexFocAndDiscountDetail % 2 == 0 ? { backgroundColor: "#8D7550" } : {},
                                ]}
                              >
                                <Cell
                                  key={1}
                                  data={rowDatas.date ? moment(rowDatas.date).format("DD/MM/YY HH:mm") : "---"}
                                  style={{ width: state.widthArr[0] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={2}
                                  data={rowDatas.billNo ? rowDatas.billNo : "---"}
                                  style={{ width: state.widthArr[1] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={3}
                                  // data={rowDatas.amount ? Money(rowDatas.amount) : "---"}
                                  data={rowDatas.amount ? <MoneyText data={rowDatas.amount} style={[styles.text, { textAlign: 'center' }]} /> : "---"}
                                  style={{ width: state.widthArr[2] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={4}
                                  // data={rowDatas.discount ? Money(rowDatas.discount) : "---"}
                                  data={rowDatas.discount ? <MoneyText data={rowDatas.discount} style={[styles.text, { textAlign: 'center' }]} /> : "---"}
                                  style={{ width: state.widthArr[3] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={5}
                                  data={rowDatas.discountPercen ? rowDatas.discountPercen : "---"}
                                  style={{ width: state.widthArr[4] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={6}
                                  // data={rowDatas.payment ? Money(rowDatas.payment) : "---"}
                                  data={rowDatas.payment ? <MoneyText data={rowDatas.payment} style={[styles.text, { textAlign: 'center' }]} /> : "---"}
                                  style={{ width: state.widthArr[5] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={7}
                                  data={rowDatas.reason ? rowDatas.reason : "---"}
                                  style={{ width: state.widthArr[6] }}
                                  textStyle={styles.textRowTable}
                                />
                              </View>
                            ))}
                          </Table>
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.viewContent}></View>
                <View style={styles.payRoll}>
                  <View>
                    <Text style={styles.payRollHeader}>REVENUE & TC PER HOURS</Text>
                  </View>
                  <View style={styles.linePayRoll}></View>
                  <View style={{ paddingRight: 15, paddingLeft: 15 }}>
                    <ScrollView horizontal={true} style={{ backgroundColor: "#17151C" }}>
                      <View>
                        <Table
                          borderStyle={{
                            borderWidth: 0.5,
                            borderColor: "#C1C0B9",
                          }}
                          style={styles.hedertable}
                        >
                          <Row
                            data={stateTable.tableHead}
                            widthArr={stateTable.widthArr}
                            style={styles.header}
                            textStyle={styles.textTable}
                          />
                        </Table>

                        <ScrollView style={styles.dataWrapper}>
                          <Table>
                            {dataRevenueAndTCPERHour?.map((rowData, indexRevenueHour) => (
                              <View
                                key={indexRevenueHour}
                                style={[
                                  { flexDirection: "row", height: 50 },
                                  indexRevenueHour % 2 == 0 ? { backgroundColor: "#8D7550" } : {},
                                ]}
                              >
                                <Cell
                                  key={1}
                                  data={rowData.journey ? rowData.journey : "---"}
                                  style={{ width: stateTable.widthArr[0] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={2}
                                  data={rowData.timeArea ? rowData.timeArea : "---"}
                                  style={{ width: stateTable.widthArr[1] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={3}
                                  // data={rowData.netSales ? Money(rowData.netSales) : "---"}
                                  data={rowData.netSales ? <MoneyText data={rowData.netSales} style={[styles.text, { textAlign: 'center' }]} /> : "---"}
                                  style={{ width: stateTable.widthArr[2] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={4}
                                  // data={rowData.tc ? Money(rowData.tc) : "---"}
                                  data={rowData.tc ? <MoneyText data={rowData.tc} style={[styles.text, { textAlign: 'center' }]} /> : "---"}
                                  style={{ width: stateTable.widthArr[3] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={5}
                                  // data={rowData.averageCheck ? Money(rowData.averageCheck) : "---"}
                                  data={
                                    rowData.averageCheck ? <MoneyText data={rowData.averageCheck} style={[styles.text, { textAlign: 'center' }]} /> : "---"
                                  }
                                  style={{ width: stateTable.widthArr[4] }}
                                  textStyle={styles.textRowTable}
                                />
                              </View>
                            ))}
                          </Table>
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                </View>
              </View>

              <View>
                <View style={styles.viewContent}></View>
                <View style={[styles.payRoll, { paddingTop: 10 }]}>
                  <DateHomePicker
                    onSubmitFromDate={date => {
                      OnchangeFromDateBest(date);
                    }}
                    onSubmitEndDate={date => {
                      OnchangeFromDateBWorst(date);
                    }}
                    isShowTime={false}
                    fromDate={fromDateTopBest}
                    endDate={endDateWorst}
                  ></DateHomePicker>
                  <View style={{}}>
                    <DropDownPickerLine
                      data={topBestSelling}
                      onSelected={value => {
                        onchangeTopBestValue(value);
                      }}
                      itemSelected={onchangeTopBest}
                    ></DropDownPickerLine>
                    <ScrollView
                      horizontal={true}
                      endFillColor={colors.backgroundApp}
                      style={{ backgroundColor: colors.backgroundApp }}
                    >
                      <VictoryChart
                        horizontal
                        width={666}
                        height={160 + 30 * castNum(onchangeTopBest.value)}
                        padding={{ top: 50, bottom: 70, left: dataTopBest.length > 0 ? 200 : 90, right: 50 }}
                        domain={{ y: getDomainChartTop(dataTopBest.slice(0, castNum(onchangeTopBest.value))) }}
                        domainPadding={{ x: 50 }}
                      >
                        <VictoryLabel
                          y={80 + 30 * castNum(onchangeTopBest.value)}
                          x={666 - 40}
                          style={{
                            fontSize: 10,
                            fontStyle: "normal",
                            fill: colors.colorText,
                          }}
                          text={"Mil VND"}
                        />
                        <VictoryLabel
                          y={35}
                          x={dataTopBest.length > 0 ? 150 : 50}
                          style={{
                            fontSize: 10,
                            fontStyle: "normal",
                            fill: "#C4C4C4",
                          }}
                          text={"Product"}
                        ></VictoryLabel>
                        <VictoryLabel
                          y={105 + 30 * castNum(onchangeTopBest.value)}
                          x={dataTopBest.length > 0 ? 177 : 67}
                          style={{
                            fontSize: 12,
                            fontStyle: "normal",
                            fill: colors.colorText,
                          }}
                          text={"0"}
                        ></VictoryLabel>
                        <VictoryAxis
                          style={{
                            axis: { stroke: colors.colorLine },
                            tickLabels: { fontSize: 12, fill: colors.colorText },
                          }}
                          dependentAxis={true}
                          orientation="bottom"
                        />
                        <VictoryAxis
                          style={{
                            axis: { stroke: colors.colorLine },
                            tickLabels: { fontSize: 12, fill: colors.colorText },
                          }}
                          orientation="left"
                        />
                        {dataTopBest.slice(0, castNum(onchangeTopBest.value)).map((data, indexTopBest) => (
                          <VictoryGroup key={indexTopBest}>
                            <VictoryBar
                              labelComponent={<VictoryLabel dx={0} />}
                              labels={({ datum }) => datum.y}
                              barWidth={() => 20}
                              style={{
                                labels: {
                                  fill: colors.colorText,
                                  color: colors.colorText,
                                  fontSize: 12,
                                },
                              }}
                              data={[{ x: data.x, y: data.y, x0: data.x0 ? data.x0.toFixed(2) : 0 }]}
                            />
                            <VictoryBar
                              labels={({ datum }) => Money(`${datum.x0}%`)}
                              labelComponent={<VictoryLabel dx={70} />}
                              barWidth={() => 20}
                              style={{
                                data: { fill: "#5BCBF6" },
                                labels: {
                                  fill: colors.colorText,
                                  color: colors.colorText,
                                  fontSize: 12,
                                },
                              }}
                              data={[{ x: data.x, y: data.y, x0: data.x0 ? data.x0.toFixed(2) : 0 }]}
                            />
                          </VictoryGroup>
                        ))}
                      </VictoryChart>
                    </ScrollView>
                  </View>
                  <View style={{}}>
                    <DropDownPickerLine
                      data={topWorstSelling}
                      onSelected={value => {
                        onchangeTopWorstValue(value);
                      }}
                      itemSelected={onchangeTopWorst}
                    ></DropDownPickerLine>
                    <ScrollView
                      horizontal={true}
                      endFillColor={colors.backgroundApp}
                      style={{ backgroundColor: colors.backgroundApp }}
                    >
                      <VictoryChart
                        horizontal
                        width={666}
                        height={150 + 30 * castNum(onchangeTopWorst.value)}
                        padding={{ top: 50, bottom: 70, left: dataTopWorst.length > 0 ? 200 : 90, right: 50 }}
                        domain={{ y: getDomainChartTop(dataTopWorst.slice(0, castNum(onchangeTopWorst.value))) }}
                        domainPadding={{ x: 50 }}
                      >
                        <VictoryLabel
                          y={80 + 30 * castNum(onchangeTopWorst.value)}
                          x={666 - 40}
                          style={{
                            fontSize: 10,
                            fontStyle: "normal",
                            fill: colors.colorText,
                          }}
                          text={"Mil VND"}
                        />
                        <VictoryLabel
                          y={35}
                          x={dataTopWorst.length > 0 ? 150 : 50}
                          style={{
                            fontSize: 10,
                            fontStyle: "normal",
                            fill: "#C4C4C4",
                          }}
                          text={"Product"}
                        ></VictoryLabel>
                        <VictoryLabel
                          y={97 + 30 * castNum(onchangeTopWorst.value)}
                          x={dataTopWorst.length > 0 ? 177 : 67}
                          style={{
                            fontSize: 12,
                            fontStyle: "normal",
                            fill: colors.colorText,
                          }}
                          text={"0"}
                        ></VictoryLabel>
                        <VictoryAxis
                          style={{
                            axis: { stroke: colors.colorLine },
                            tickLabels: { fontSize: 12, fill: colors.colorText },
                          }}
                          dependentAxis={true}
                          orientation="bottom"
                        />
                        <VictoryAxis
                          style={{
                            axis: { stroke: colors.colorLine },
                            tickLabels: { fontSize: 12, fill: colors.colorText },
                          }}
                          orientation="left"
                        />
                        {dataTopWorst.slice(0, castNum(onchangeTopWorst.value)).map((data, indexTopWorst) => (
                          <VictoryGroup key={indexTopWorst}>
                            <VictoryBar
                              labels={({ datum }) => datum.y}
                              labelComponent={<VictoryLabel dx={0} />}
                              barWidth={() => 20}
                              style={{
                                labels: {
                                  fill: colors.colorText,
                                  color: colors.colorText,
                                  fontSize: 12,
                                },
                              }}
                              data={[{ x: data.x, y: data.y, x0: data.x0 ? data.x0.toFixed(2) : 0 }]}
                            />
                            <VictoryBar
                              labels={({ datum }) => Money(`${datum.x0}%`)}
                              labelComponent={<VictoryLabel dx={70} />}
                              barWidth={() => 20}
                              style={{
                                data: { fill: "#5BCBF6" },
                                labels: {
                                  fill: colors.colorText,
                                  color: colors.colorText,
                                  fontSize: 12,
                                },
                              }}
                              data={[{ x: data.x, y: data.y, x0: data.x0 ? data.x0.toFixed(2) : 0 }]}
                            />
                          </VictoryGroup>
                        ))}
                      </VictoryChart>
                    </ScrollView>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 100 }}>
              <Text style={{ color: colors.yellowishbrown, fontSize: 18 }}>You do not have access</Text>
            </View>
          )}
        </ScrollView>
      )}
      {isLoadingTop && <Loading></Loading>}
    </View>
  );
};
//css view
const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  headerHome: {
    color: "#DAB451",
    fontSize: 17,
    textAlign: "center",
    lineHeight: 25,
    fontStyle: "normal",
    fontWeight: "600",
    paddingTop: 49,
  },
  viewPicker: {
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
  },
  pickerHome: {
    height: 45,
    paddingTop: 9,
    borderRadius: 4,
    backgroundColor: "#414141",
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 3.82,
    elevation: 5,
  },
  row: {
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },

  viewContent: {
    height: 10,
    backgroundColor: "#414141",
  },
  container: {
    backgroundColor: colors.backgroundApp,
    paddingRight: 15,
    paddingLeft: 15,
  },
  rowTableChart: {
    flex: 1,
    flexDirection: "row",
    height: 18,
  },
  rowDataMoney: {
    flex: 4,
    height: 21,
    backgroundColor: colors.backgroundApp,
    paddingLeft: 5,
    textAlign: "right",
    color: "#DAB451",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 14,
  },
  lineTable: {
    borderBottomColor: "#C4C4C4",
    borderBottomWidth: 1,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  pieChart: {
    alignItems: "center",
  },
  pieChartChar: {
    alignItems: "center",
    height: 320,
  },
  payRoll: {
    flex: 1,
    paddingBottom: 10,
    paddingTop: 10
  },
  payRollHeader: {
    paddingLeft: 15,
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "left",
    color: "#fff",
  },
  linePayRoll: {
    borderBottomColor: "#C4C4C4",
    borderBottomWidth: 1,
    paddingTop: 10,
  },
  budgetedPayroll: {
    color: "#5F8BFC",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
  },
  commentPayRoll: {
    color: "#FB8832",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
  },
  commentChart: {
    color: "#528AC1",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
  },
  commentDiscount: {
    color: "#76D146",
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
  },
  commentChartTable: {
    color: "#F33535",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
  },
  commentChartTableFoc: {
    color: "#F6606F",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 20,
  },
  header: {
    height: 50,
    backgroundColor: "#878787",
  },
  text: {
    textAlign: "left",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    color: "#fff",
    paddingLeft: 8,
  },
  textTable: {
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    color: "#fff",
    paddingLeft: 8,
  },
  dataWrapper: {
    marginTop: -1,
  },
  rows: {
    height: 40,
    backgroundColor: "#414141",
  },
  hedertable: {
    marginTop: 15,
    backgroundColor: colors.backgroundApp,
  },
  headTables: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  wrapperTables: {
    flexDirection: "row",
  },
  titleTables: {
    backgroundColor: "#f6f8fa",
    width: 118,
  },
  rowTables: {
    height: 28,
  },
  textTables: {
    textAlign: "center",
  },
  cssText: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 8,
  },
  iconDown: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 12,
    zIndex: 4,
  },
  textRowTable: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  rowItem: {
    flex: 1,
    height: 21,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  textRowTitle: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: "500",
  },
});

export default TabHomeScreen;
