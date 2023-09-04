import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import { useEffect, useState } from "react";
import moment from "moment";
import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "../../../components/datetimepicker";
import PickerModel from "../../../components/picker/PickerModel";
import ModalSendEmail from "../../../components/management/items/modalSendEmail";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import DropDownRank from "../../../components/dropDown/DropDownRank";
import { SaleTCHourlyModel } from "../../../models/saleTCHourlyModel";
import { FilterViewModel } from "../../../models/filterViewModel";
import { getRevenueAndTCPERHour, ReportService, SalesByPaymentmMethodService } from "../../../netWorking/SpeedposService";
import { RevenueAndTCPERHour } from "../../../models/revenueAndTCPERHourModel";
import { getMonday } from "../../../components/generalConvert/conVertMonDay";
import DialogAwait from "../../../components/dialogs/Loading";
import MoneyText from "../../../components/Money";

export default function saleTCHourly() {
  const [isLoading, setIsLoading] = useState(false);

  const toDate = new Date();
  let endWeekDay=new Date().setDate(getMonday(toDate).getDate() + 6);
  if(getMonday(toDate).getMonth()<toDate.getMonth()){
    //check ngày đầu tuần và ngày hiện tại khác tháng
    endWeekDay = new Date(new Date().setMonth(toDate.getMonth()-1)).setDate(getMonday(toDate).getDate() + 6);
  }
  const [fromDateTime, setFromDateTime] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD 00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(endWeekDay).format("YYYY-MM-DD 23:59")
  );
  let model: FilterViewModel = {};
  const [checKLoadDefault, setChecKLoadDefault] = useState(true);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [sentStatus, setSentStatus] = useState("");
  //Get Revenue And TCPE RHour
  const revenueAndTCPERHour: RevenueAndTCPERHour[] = [];
  const [dataRevenueAndTCPERHour, setRevenueAndTCPERHour] = useState(revenueAndTCPERHour);
  
  const tableSaleTCHourly: SaleTCHourlyModel[] = [];
  const [dataSaleTCHourly, setSaleTCHourly] = useState(tableSaleTCHourly);

  const [dataTotalSales, setTotalSales] = useState(0);
  const [numberTC, setNumberTC] = useState(0);

  const [dataTotalSalesWeekly, setTotalSalesWeekly] = useState(0);
  const [numberTCWeekly, setNumberTCWeekly] = useState(0);

  const [dateSendMail, setDateSendMail] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD 00:00")
  );

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

  const loadDataSaleTCHourly = async (dateTimeFrom, dateTimeTo) => {
    setIsLoading(true);
    model.StringDateFrom = dateTimeFrom;
    model.StringDateTo = dateTimeTo;
    const res = await ReportService.getSalesAndTCHour(model);
    let data = [];
    if (res.isSuccess == 1) {
      data = res.data;
      setSaleTCHourly(data);
    }
    setChecKLoadDefault(false);
    setIsLoading(false);
  }

  const loadRevenueAndTCPERHour = async (dateTimeFrom, dateTimeTo) => {
    setIsLoading(true);
    const resRevenueAndTCPERHour = await getRevenueAndTCPERHour(dateTimeFrom, dateTimeTo);
    let data = [];
    let totalNet = 0;
    let totalTC = 0;
    if (resRevenueAndTCPERHour.isSuccess == 1) {
      data = resRevenueAndTCPERHour.data;
      let datas = resRevenueAndTCPERHour.data as RevenueAndTCPERHour[];
      datas.map(map => {
        totalNet += map.netSales;
        totalTC += map.tc;
      })
      setRevenueAndTCPERHour(data)
    }
    setNumberTC(totalTC);
    setTotalSales(totalNet);
    setIsLoading(false);
  }

  const laodDataAWeek = async (dateTimeAWeekFrom, dateTimeAWeekTo) => {
    setIsLoading(true);
    const resRevenueAndTCPERHour = await getRevenueAndTCPERHour(dateTimeAWeekFrom, dateTimeAWeekTo);
    let data = [];
    let totalNetWeekly = 0;
    let totalTCWeekly = 0;

    if (resRevenueAndTCPERHour.isSuccess == 1) {
      data = resRevenueAndTCPERHour.data;
      let datas = resRevenueAndTCPERHour.data as RevenueAndTCPERHour[];
      datas.map(map => {
        totalNetWeekly += map.netSales;
        totalTCWeekly += map.tc;
      })
    }
    setNumberTCWeekly(totalTCWeekly)
    setTotalSalesWeekly(totalNetWeekly);
    setIsLoading(false);
  }


  const OnchangeFromDateTime = (date: any) => {
    const dateTime = new Date(date);
    const fromDate = moment(getMonday(dateTime)).format("YYYY-MM-DD 00:00");
    const toDate = moment(dateTime.setDate(getMonday(dateTime).getDate() + 6)).format("YYYY-MM-DD 23:59");
    const toDateMonday = moment(fromDate).format("YYYY-MM-DD 23:59");
    setDateSendMail(fromDate);
    setFromDateTime(fromDate);
    setEndDateTime(toDate);
    loadDataSaleTCHourly(fromDate, toDateMonday);
    loadRevenueAndTCPERHour(fromDate, toDateMonday);
    laodDataAWeek(fromDate, toDate);
  }

  const onChangeDateTime = (item: any) => {
    const dateFrom = moment(item).format("YYYY-MM-DD 00:00");
    const dateTo = moment(item).format("YYYY-MM-DD 23:59");
    setFromDateTime(dateFrom);
    setEndDateTime(dateTo);

    loadDataSaleTCHourly(dateFrom, dateTo);
    loadRevenueAndTCPERHour(dateFrom, dateTo);
  }

  useEffect(() => {
    if (checKLoadDefault) {
      let fromDate = fromDateTime;
      let toDate = moment(fromDateTime).format("YYYY-MM-DD 23:59");
      loadDataSaleTCHourly(fromDate, toDate);
      loadRevenueAndTCPERHour(fromDate, toDate);
      laodDataAWeek(fromDateTime, endDateTime);
    }
  }, [])
  return (
    <View style={styles.container}>
      <PickerModel
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value?.value);
        }}
      ></PickerModel>
      
      <View><Text style={{marginLeft:15, fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: 12,
                  lineHeight: 18,
                  color: "#A4A4A4",}}>Weekly Display - Choose a day to start</Text></View>
      <DateTimePicker
        onSubmitFromDate={date => OnchangeFromDateTime(date)}
        onSubmitEndDate={date => setEndDateTime(date)}
        isShowTime={false}
        checkkNotEndDate={false}
      ></DateTimePicker>
      <View style={styles.line}></View>
      <View>
        <DropDownRank
          defaultValue="Monday"
          dateFrom={fromDateTime}
          onChangeDateTime={value => {
            onChangeDateTime(value?.value);
          }}
        ></DropDownRank>
      </View>
      {isLoading ? <DialogAwait></DialogAwait> :
        <ScrollView>
          <View>
            {
              dataRevenueAndTCPERHour.map((data, indexB) => (
                data.journey == "BREAKFAST" ?
                  (<View key={indexB}>
                    <View
                      style={{
                        borderBottomColor: colors.colorLine,
                        borderBottomWidth: 0.5,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.colorText,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        BREAKFAST
                      </Text>
                    </View>
                    <View>
                      {
                        dataSaleTCHourly.map((data, indexBREAKFAST) => (
                          <View key={indexBREAKFAST} style={styles.row}>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>00:00 - 00:59</Text>
                              {data.hourZero?<MoneyText data={data.hourZero} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourZero ? Money(data.hourZero) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>01:00 - 01:59</Text>
                              {data.hourZero?<MoneyText data={data.hourZero} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourOne} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourOne ? Money(data.hourOne) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>02:00 - 02:59</Text>
                              {data.hourTwo?<MoneyText data={data.hourTwo} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourTwo} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourTwo ? Money(data.hourTwo) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>03:00 - 03:59</Text>
                              {data.hourThree?<MoneyText data={data.hourThree} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourThree} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourThree ? Money(data.hourThree) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>04:00 - 04:59</Text>
                              {data.hourFour?<MoneyText data={data.hourFour} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourFour} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourFour ? Money(data.hourFour) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>05:00 - 05:59</Text>
                              {data.hourFive?<MoneyText data={data.hourFive} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourFive} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourFive ? Money(data.hourFive) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>06:00 - 06:59</Text>
                              {data.hourSix?<MoneyText data={data.hourSix} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourSix} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourSeven ? Money(data.hourSeven) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>07:00 - 07:59</Text>
                              {data.hourSeven?<MoneyText data={data.hourSeven} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourSeven} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourSeven ? Money(data.hourSeven) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>08:00 - 08:59</Text>
                              {data.hourEight?<MoneyText data={data.hourEight} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourEight} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourEight ? Money(data.hourEight) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>09:00 - 09:59</Text>
                              {data.hourNine?<MoneyText data={data.hourNine} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourNine} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourNine ? Money(data.hourNine) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>10:00 - 10:59</Text>
                              {data.hourTen?<MoneyText data={data.hourTen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourTen} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourTen ? Money(data.hourTen) : 0}</Text> */}
                            </View>
                          </View>
                        ))
                      }
                    </View>
                    <View
                      style={[
                        styles.itemTotal,
                        { backgroundColor: "#878787" },
                      ]}
                    >
                      <Text style={{ fontWeight: "500", color: colors.colorText }}>
                        TOTAL:
                      </Text>
                     
                      <Text style={{ fontWeight: "600", color: colors.colorText }}>
                        {data.journey == "BREAKFAST" ? <MoneyText data={data.netSales} style={styles.text} /> : 0}
                      </Text>
                    </View>
                  </View>
                  ) : null
              ))
            }
            {
              dataRevenueAndTCPERHour.map((data, indexL) => (
                data.journey == "LUNCH" ?
                  (<View key={indexL}>
                    <View
                      style={{
                        borderBottomColor: colors.colorLine,
                        borderBottomWidth: 0.5,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.colorText,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        LUNCH
                      </Text>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                      {
                        dataSaleTCHourly.map((data, indexLUNCH) => (
                          <View key={indexLUNCH} style={styles.row}>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>11:00 - 11:59</Text>
                              {data.hourEleven?<MoneyText data={data.hourEleven} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourEleven} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourEleven ? Money(data.hourEleven) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>12:00 - 12:59</Text>
                              {/* <MoneyText data={data.hourTwelve} style={styles.text} /> */}
                              {data.hourTwelve?<MoneyText data={data.hourTwelve} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourTwelve ? Money(data.hourTwelve) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>13:00 - 13:59</Text>
                              {data.hourThirteen?<MoneyText data={data.hourThirteen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <MoneyText data={data.hourThirteen} style={styles.text} /> */}
                              {/* <Text style={styles.text}>{data.hourThirteen ? Money(data.hourThirteen) : 0}</Text> */}
                            </View>
                          </View>
                        ))
                      }
                      <View
                        style={[
                          styles.itemTotal,
                          { backgroundColor: "#878787" },
                        ]}
                      >
                        <Text style={{ fontWeight: "500", color: colors.colorText }}>
                          TOTAL:
                        </Text>
                        <Text style={{ fontWeight: "600", color: colors.colorText }}>
                          {data.journey == "LUNCH" ? <MoneyText data={data.netSales} style={styles.text} />: 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                  ) : null
              ))
            }
            {
              dataRevenueAndTCPERHour.map((data, indexAFTERNOON) => (
                data.journey == "AFTERNOON" ?
                  (<View key={indexAFTERNOON}>
                    <View
                      style={{
                        borderBottomColor: colors.colorLine,
                        borderBottomWidth: 0.5,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.colorText,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        AFTERNOON
                      </Text>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                      {
                        dataSaleTCHourly.map((data, indexAFTERNOON) => (
                          <View key={indexAFTERNOON} style={styles.row}>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>14:00 - 14:59</Text>
                              {data.hourFourteen?<MoneyText data={data.hourFourteen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourFourteen ? Money(data.hourFourteen) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>15:00 - 15:59</Text>
                              {data.hourFifteen?<MoneyText data={data.hourFifteen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourFifteen ? Money(data.hourFifteen) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>16:00 - 16:59</Text>
                              {data.hourTSixteen?<MoneyText data={data.hourTSixteen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourTSixteen ? Money(data.hourTSixteen) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>17:00 - 17:59</Text>
                              {data.hourSeventeen?<MoneyText data={data.hourSeventeen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourSeventeen ? Money(data.hourSeventeen) : 0}</Text> */}
                            </View>
                          </View>
                        ))
                      }
                      <View
                        style={[
                          styles.itemTotal,
                          { backgroundColor: "#878787" },
                        ]}
                      >
                        <Text style={{ fontWeight: "500", color: colors.colorText }}>
                          TOTAL:
                        </Text>
                        <Text style={{ fontWeight: "600", color: colors.colorText }}>
                          {data.journey == "AFTERNOON" ? <MoneyText data={data.netSales} style={styles.text} /> : 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                  ) : null
              ))
            }
            {
              dataRevenueAndTCPERHour.map((data, indexD) => (
                data.journey == "DINNER" ?
                  (<View key={indexD}>
                    <View
                      style={{
                        borderBottomColor: colors.colorLine,
                        borderBottomWidth: 0.5,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.colorText,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        DINNER
                      </Text>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                      {
                        dataSaleTCHourly.map((data, indexDINNER) => (
                          <View key={indexDINNER} style={styles.row}>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>18:00 - 18:59</Text>
                              {data.hourEighteen?<MoneyText data={data.hourEighteen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourEighteen ? Money(data.hourEighteen) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>19:00 - 19:59</Text>
                              {data.hourNineteen?<MoneyText data={data.hourNineteen} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourNineteen ? Money(data.hourNineteen) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>20:00 - 20:59</Text>
                              {data.hourTwenty?<MoneyText data={data.hourTwenty} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourTwenty ? Money(data.hourTwenty) : 0}</Text> */}
                            </View>
                          </View>
                        ))
                      }
                      <View
                        style={[
                          styles.itemTotal,
                          { backgroundColor: "#878787" },
                        ]}
                      >
                        <Text style={{ fontWeight: "500", color: colors.colorText }}>
                          TOTAL:
                        </Text>
                        <Text style={{ fontWeight: "600", color: colors.colorText }}>
                          {data.journey == "DINNER" ? <MoneyText data={data.netSales} style={styles.text} /> : 0}
                        </Text>
                      </View>
                    </View>
                  </View>


                  ) : null
              ))
            }
            {
              dataRevenueAndTCPERHour.map((data, indexLD) => (
                data.journey == "LATE DINNER" ?
                  (<View key={indexLD}>
                    <View
                      style={{
                        borderBottomColor: colors.colorLine,
                        borderBottomWidth: 0.5,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.colorText,
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        LATE DINNER
                      </Text>
                    </View>
                    <View style={{ paddingBottom: 10 }}>
                      {
                        dataSaleTCHourly.map((data, indexLATEDINNER) => (
                          <View key={indexLATEDINNER} style={styles.row}>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>21:00 - 21:59</Text>
                              {data.hourTwentyOne?<MoneyText data={data.hourTwentyOne} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourTwentyOne ? Money(data.hourTwentyOne) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>22:00 - 22:59</Text>
                              {data.hourTwentyTwo?<MoneyText data={data.hourTwentyTwo} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourTwentyTwo ? Money(data.hourTwentyTwo) : 0}</Text> */}
                            </View>
                            <View style={styles.rowItem}>
                              <Text style={styles.textRowTitle}>23:00 - 23:59</Text>
                              {data.hourTwentyThree?<MoneyText data={data.hourTwentyThree} style={styles.text} />:<Text style={styles.text}>0</Text>}
                              {/* <Text style={styles.text}>{data.hourTwentyThree ? Money(data.hourTwentyThree) : 0}</Text> */}
                            </View>
                          </View>
                        ))
                      }
                      <View
                        style={[
                          styles.itemTotal,
                          { backgroundColor: "#878787" },
                        ]}
                      >
                        <Text style={{ fontWeight: "500", color: colors.colorText }}>
                          TOTAL:
                        </Text>
                        <Text style={{ fontWeight: "600", color: colors.colorText }}>
                          {data.journey == "LATE DINNER" ?<MoneyText data={data.netSales} style={styles.text} /> : 0}
                        </Text>
                      </View>
                    </View>
                  </View>
                  ) : null
              ))
            }
          </View>
          <View
            style={[
              styles.itemTotal,
              { backgroundColor: "#8D7550", marginBottom: 10 },
            ]}
          >
            <Text style={{ fontWeight: "500", color: colors.colorText }}>
              DAILY TOTAL SALE:
            </Text>
            <Text style={{ fontWeight: "600", color: colors.colorText }}>
              {dataTotalSales ? <MoneyText data={dataTotalSales} style={styles.text} />: 0}
            </Text>
          </View>
          <View style={[styles.itemTotal, { backgroundColor: "#8D7550", marginBottom: 10 }]}>
            <Text style={{ fontWeight: "500", color: colors.colorText }}>
              DAILY TICKET AVERAGE:
            </Text>
            <Text style={{ fontWeight: "600", color: colors.colorText }}>
              {dataTotalSales ? <MoneyText data={dataTotalSales / numberTC} style={styles.text} />: 0}
            </Text>
          </View>
          <View style={[{ backgroundColor: "#C4C4C4", marginBottom: 10, height:.5 }]}></View>

          <View style={[styles.itemTotal, { backgroundColor: "#8D7550", marginBottom: 10 }]}>
            <Text style={{ fontWeight: "500", color: colors.colorText }}>
              WEEKLY TOTAL SALE:
            </Text>
            <Text style={{ fontWeight: "600", color: colors.colorText }}>
              {dataTotalSalesWeekly ? <MoneyText data={dataTotalSalesWeekly} style={styles.text} />: 0}
            </Text>
          </View>

          <View style={[styles.itemTotal, { backgroundColor: "#8D7550" }]}>
            <Text style={{ fontWeight: "500", color: colors.colorText }}>
              WEEKLY TICKET AVERAGE:
            </Text>
            <Text style={{ fontWeight: "600", color: colors.colorText }}>
              {dataTotalSalesWeekly ? <MoneyText data={dataTotalSalesWeekly / numberTCWeekly} style={styles.text} />: 0}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 32,
            }}
          >
            <LinearGradient
              style={styles.buttonSubmit}
              colors={["#DAB451", "#988050"]}
            >
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
                  <Text style={[styles.title, { textAlign: "center" }]}>
                    Send
                  </Text>
                </View>
              </TouchableHighlight>
            </LinearGradient>
          </View>
          <ModalSendEmail
            title={"Sales & TC - Hourly"}
            visible={modalSendMail}
            isPickType={true}
            dateTime={dateSendMail}
            onRequestClose={() => {
              setModalSendMail(!modalSendMail);
            }}
            onRequestSend={() => {
              handleSendMail();
            }}
          ></ModalSendEmail>
          <SendSuccess
            visible={sentStatus === "success"}
            onRequestClose={() => setSentStatus("")}
          ></SendSuccess>
          <SendFail
            visible={sentStatus === "fail"}
            onRequestClose={() => setSentStatus("")}
          ></SendFail>
        </ScrollView>
      }
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
  text500: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
  },
  itemTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  pickerDate: {

    backgroundColor: "#414141",
    borderRadius: 4,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    paddingLeft: 15,
    paddingRight: 15,
  },
  rowItem: {
    flex: 1,
    height: 21,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  textRowTitle: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '500'
  },
  text: {
    textAlign: 'left',
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: 15,
    color: "#fff",
    paddingLeft: 8,
  },
});
