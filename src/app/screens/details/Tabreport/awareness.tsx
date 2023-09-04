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
import PickerModel from "../../../components/picker/PickerModel";
import ModalSendEmail from "../../../components/management/items/modalSendEmail";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
import { getMonday } from "../../../components/generalConvert/conVertMonDay";
import { ReportService } from "../../../netWorking/SpeedposService";
import { StatisticalHome } from "../../../models/statisticalHomeModel";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import MoneyText from "../../../components/Money";
import DateTimePicker from "../../../components/datetimepicker";
import DropDownRank from "../../../components/dropDown/DropDownRank";
import { FilterViewModel } from "../../../models/filterViewModel";
import { _getUserId } from "../../../netWorking/authService";
import DialogAwait from "../../../components/dialogs/Loading";

export default function awareness() {
  const [isLoading, setIsLoading] = useState(false);
  //
  let model: FilterViewModel = {};
  let initModel = { DateFrom: '', DateTo: '', DateTime: '', UserId: '' }
  let modelMonDay: { DateFrom: string, DateTo: string, DateTime: string, UserId: string | number } = initModel;
  //
  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD 00:00")
  );
  const [dateSendMail, setDateSendMail] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD 00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date().setDate(getMonday(toDate).getDate() + 6)).format("YYYY-MM-DD 23:59")
  );
  //StatisticalHome
  const tableStatisticalHome: StatisticalHome[] = [];
  const [dataStatisticalHome, setStatisticalHome] = useState(tableStatisticalHome);
  const [dataMonday, setDataMonday] = useState(tableStatisticalHome);
  const [dataDayWeek, setDataDayWeek] = useState<StatisticalHome>({});

  //
  const [checKLoadDefault, setChecKLoadDefault] = useState(true);
  //
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
  const loadRevenueByySubCategory = async (dateTimeFrom, dateTimeTo) => {
    model.StringDateFrom = dateTimeFrom;
    model.StringDateTo = dateTimeTo;
    model.DateTime = dateTimeFrom;
    model.UserId = await _getUserId();
    const res = await ReportService.GetAwarenessWeek(model);
    let data = [];
    if (res.isSuccess == 1) {
      data = res.data;
      setStatisticalHome(data);
    }
    setChecKLoadDefault(false);
  }

  const laodDataMonday = async (dateTimeFrom) => {
    const dateTime = new Date(moment(dateTimeFrom).format("YYYY-MM-DD"));
    modelMonDay.DateFrom = moment(getMonday(dateTime)).format("YYYY-MM-DD 00:00");
    modelMonDay.DateTo = moment(dateTime.setDate(getMonday(dateTime).getDate() + 6)).format("YYYY-MM-DD 23:59");
    modelMonDay.DateTime = moment(dateTimeFrom).format("YYYY-MM-DD 23:59");
    modelMonDay.UserId = await _getUserId();
    const res = await ReportService.getAwareness(modelMonDay);
    if (res.isSuccess == 1) {
      setDataDayWeek(res.data);
    }
  }

  const onChangeDateTime = async (item: any) => {
    setIsLoading(true);
    const dateFrom = moment(item).format("YYYY-MM-DD 00:00");
    setFromDateTime(dateFrom);
    await laodDataMonday(dateFrom);
    setIsLoading(false);
  }

  const OnchangeFromDateTime = async (date: any) => {
    setIsLoading(true);
    const dateTime = new Date(date);
    const fromDate = moment(getMonday(dateTime)).format("YYYY-MM-DD 00:00");
    const toDate = moment(dateTime.setDate(getMonday(dateTime).getDate() + 6)).format("YYYY-MM-DD 23:59");
    setFromDateTime(fromDate);
    setEndDateTime(toDate);
    setDateSendMail(fromDate);
    await loadRevenueByySubCategory(fromDate, toDate);
    await laodDataMonday(fromDate);
    setIsLoading(false);
  }

  const intData = async (fromDateNow, toDateNow) => {
    setIsLoading(true);
    await loadRevenueByySubCategory(fromDateNow, toDateNow);
    await laodDataMonday(fromDateNow);
    setIsLoading(false);
  }

  useEffect(() => {
    if (checKLoadDefault) {
      const fromDateNow = moment(getMonday(toDate)).format("YYYY-MM-DD 00:00");
      const toDateNow = moment(new Date().setDate(getMonday(toDate).getDate() + 6)).format("YYYY-MM-DD 23:59");
      intData(fromDateNow, toDateNow)
    }
  }, [])

  return (
    <View style={styles.container}>
      <PickerModel
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>
      <View><Text style={{
        marginLeft: 15, fontStyle: "normal",
        fontWeight: "600",
        fontSize: 12,
        lineHeight: 18,
        color: "#A4A4A4",
      }}>Weekly Display - Choose a day to start</Text></View>
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
            onChangeDateTime(value.value);
          }}
        ></DropDownRank>
      </View>
      {isLoading ? <DialogAwait></DialogAwait> :
        <ScrollView>
          <View style={{ flex: 1 }}>

            <View>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Day</Text>
                  <Text style={styles.text}>{dataDayWeek.dayName}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Date</Text>
                  <Text style={styles.text}>{dataDayWeek.dayMonth}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>MGR INTITALS</Text>
                  <Text style={styles.text}>{dataDayWeek.userName}</Text>
                </View>

                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>BUDGET ED Daily Sales</Text>
                  {/* <Text style={styles.text}>{dataDayWeek.budgetedDailySales ? Money(dataDayWeek.budgetedDailySales) : 0}</Text> */}
                  <MoneyText data={Math.round(dataDayWeek.budgetedDailySales)} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>BUDGET Accum Sales Pd</Text>
                  {/* nhân với 7 ngày trong tuần (data.budgetedDailySales * 7) */}
                  {/* <Text style={styles.text}>{data.budgetedDailySales ? Money(data.budgetedDailySales * 7) : 0}</Text> */}
                  <MoneyText data={Math.round(dataDayWeek.budgetedAccumSalessPD)} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>ACTUALDAILY SALES (VND)</Text>
                  {/* <Text style={styles.text}>{data.actualDailySales ? Money(data.actualDailySales) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.actualDailySales} style={styles.text} />
                </View>
                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Less Mgmt Meals (VND)</Text>
                  {/* <Text style={styles.text}>{data.lessMgntMeab ? Money(data.lessMgntMeab) : "---"}</Text> */}
                  <MoneyText data={dataDayWeek.lessMgntMeab} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Less VAT 10%</Text>
                  {/* <Text style={styles.text}>{data.lessVAT10 ? Money(data.lessVAT10) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.lessVAT10} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Less SC 5%</Text>
                  {/* <Text style={styles.text}>{data.lessSC5 ? Money(data.lessSC5) : "---"}</Text> */}
                  <MoneyText data={dataDayWeek.lessSC5} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Estimated Daily Sales</Text>
                  {/* <Text style={[styles.text, { color: colors.mainColor }]}>{data.estimatedDailySales ? Money(data.estimatedDailySales) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.estimatedDailySales} style={[styles.text, { color: colors.mainColor }]} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>ESTIMATED Accum Sales...</Text>
                  {/* <Text style={styles.text}>{data.estimatedAccumSalesPd ? Money(data.estimatedAccumSalesPd) : 0}</Text> */}
                  <MoneyText data={+dataDayWeek.estimatedDailySales * 7} style={styles.text} />
                </View>
                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>VARIANCE DAILY</Text>
                  {/* <Text style={styles.text}>{data.variancedaily ? Money(data.variancedaily) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.variancedaily} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>VARIANCE ACCUMULATED</Text>
                  {/* <Text style={styles.text}>{data.varianceAccumulated ? Money(data.varianceAccumulated) : 0}</Text> */}
                  <MoneyText data={+dataDayWeek.variancedaily * 7} style={styles.text} />
                </View>
                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Customer Count</Text>
                  <Text style={styles.text}>{dataDayWeek.customerCount ? dataDayWeek.customerCount : 0}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Check Average</Text>
                  {/* <Text style={styles.text}>{data.checkAverage ? Money(data.checkAverage) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.checkAverage} style={styles.text} />
                </View>
                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Wastage VND</Text>
                  {dataDayWeek.wastageVND === 0 ? <Text style={styles.text}>Not Available</Text> : <MoneyText data={dataDayWeek.wastageVND} style={styles.text} />}
                  {/* <Text style={styles.text}>{data.wastageVND ? Money(data.wastageVND) : 0}</Text> */}
                  {/* <MoneyText data={data.wastageVND} style={styles.text} /> */}
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Wastage %</Text>
                  {dataDayWeek.wastagePercent === 0 ? <Text style={styles.text}>Not Available</Text> : <Text style={styles.text}>{`${dataDayWeek.wastagePercent ? Money(dataDayWeek.wastagePercent) : 0}%`}</Text>}
                  {/* <Text style={styles.text}>{`${data.wastagePercent ? Money(data.wastagePercent) : 0}%`}</Text> */}
                </View>
                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Actual Store Working H...</Text>
                  <Text style={styles.text}>{dataDayWeek.actualStoreWorkingHours ? Money(dataDayWeek.actualStoreWorkingHours) : 0}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Payroll (VND)</Text>
                  {/* <Text style={styles.text}>{data.payrollVND ? Money(data.payrollVND) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.payrollVND} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>BUGETED Payroll %</Text>
                  <Text style={styles.text}>{`${dataDayWeek.budgetPayrollPercent ? Money(dataDayWeek.budgetPayrollPercent) : 0}%`}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Payroll %</Text>
                  <Text style={styles.text}>{`${dataDayWeek.payrollPercent ? Money(dataDayWeek.payrollPercent) : 0}%`}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Actual SPMH</Text>
                  {/* <Text style={styles.text}>{data.actualSPMH ? Money(data.actualSPMH) : 0}</Text> */}
                  <MoneyText data={dataDayWeek.actualSPMH} style={styles.text} />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.textRowTitle}>Hours should have used</Text>
                  <Text style={styles.text}>{dataDayWeek.hoursShouldHaveUsded ? Money(dataDayWeek.hoursShouldHaveUsded) : 0}</Text>
                </View>
                <View style={[styles.rowItem, { marginBottom: 15 }]}>
                  <Text style={styles.textRowTitle}>Variance</Text>
                  <Text style={styles.text}>{dataDayWeek.variance ? Money(dataDayWeek.variance) : 0}</Text>
                </View>
              </View>
            </View>

            <View style={styles.line}></View>
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
                WEEKLY TOTAL
              </Text>
            </View>
            {
              dataStatisticalHome?.map((dataWeekly, indexEstimate) => (
                <View key={indexEstimate} style={styles.row}>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>BUDGET ED Daily Sales</Text>
                    {/* <Text style={styles.text}>{dataWeekly.budgetedDailySales ? Money(dataWeekly.budgetedDailySales) : 0}</Text> */}
                    <MoneyText data={Math.round(dataWeekly.budgetedDailySales)} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>BUDGET Accum Sales Pd</Text>
                    {/* <Text style={styles.text}>{dataWeekly.budgetedAccumSalessPD ? Money(dataWeekly.budgetedAccumSalessPD) : 0}</Text> */}
                    <MoneyText data={Math.round(dataWeekly.budgetedAccumSalessPD)} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>ACTUALDAILY SALES (VND)</Text>
                    {/* <Text style={styles.text}>{dataWeekly.actualDailySales ? Money(dataWeekly.actualDailySales) : 0}</Text> */}
                    <MoneyText data={dataWeekly.actualDailySales} style={styles.text} />
                  </View>
                  <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>FOC (VND)</Text>
                    {/* <Text style={styles.text}>{dataWeekly.lessMgntMeab ? Money(dataWeekly.lessMgntMeab) : "---"}</Text> */}
                    <MoneyText data={dataWeekly.lessMgntMeab} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Less VAT 10%</Text>
                    {/* <Text style={styles.text}>{dataWeekly.lessVAT10 ? Money(dataWeekly.lessVAT10) : 0}</Text> */}
                    <MoneyText data={dataWeekly.lessVAT10} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Less SC 5%</Text>
                    {/* <Text style={styles.text}>{dataWeekly.lessSC5 ? Money(dataWeekly.lessSC5) : "---"}</Text> */}
                    <MoneyText data={dataWeekly.lessSC5} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Estimated Daily Sales</Text>
                    {/* <Text style={[styles.text, { color: colors.mainColor }]}>{dataWeekly.estimatedDailySales ? Money(dataWeekly.estimatedDailySales) : 0}</Text> */}
                    <MoneyText data={dataWeekly.estimatedDailySales} style={[styles.text, { color: colors.mainColor }]} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>ESTIMATED Accum Sales...</Text>
                    {/* <Text style={styles.text}>{dataWeekly.estimatedAccumSalesPd ? Money(dataWeekly.estimatedAccumSalesPd) : 0}</Text> */}
                    <MoneyText data={+dataWeekly.estimatedAccumSalesPd} style={styles.text} />
                  </View>
                  <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>VARIANCE DAILY</Text>
                    {/* <Text style={styles.text}>{dataWeekly.variancedaily ? Money(dataWeekly.variancedaily) : 0}</Text> */}
                    <MoneyText data={dataWeekly.variancedaily} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>VARIANCE ACCUMULATED</Text>
                    {/* <Text style={styles.text}>{dataWeekly.varianceAccumulated ? Money(dataWeekly.varianceAccumulated) : 0}</Text> */}
                    <MoneyText data={+dataWeekly.varianceAccumulated} style={styles.text} />
                  </View>
                  <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Customer Count</Text>
                    <Text style={styles.text}>{dataWeekly.customerCount ? dataWeekly.customerCount : 0}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Check Average</Text>
                    {/* <Text style={styles.text}>{dataWeekly.checkAverage ? Money(dataWeekly.checkAverage) : 0}</Text> */}
                    <MoneyText data={dataWeekly.checkAverage} style={styles.text} />
                  </View>
                  <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Wastage VND</Text>
                    {dataWeekly.wastageVND === 0 ? <Text style={styles.text}>Not Available</Text> : <MoneyText data={dataWeekly.wastageVND} style={styles.text} />}
                    {/* <Text style={styles.text}>{dataWeekly.wastageVND ? Money(dataWeekly.wastageVND) : 0}</Text> */}
                    {/* <MoneyText data={dataWeekly.wastageVND} style={styles.text} /> */}
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Wastage %</Text>
                    {dataWeekly.wastagePercent === 0 ? <Text style={styles.text}>Not Available</Text> : <Text style={styles.text}>{`${dataWeekly.wastagePercent ? Money(dataWeekly.wastagePercent) : 0}%`}</Text>}
                    {/* <Text style={styles.text}>{`${dataWeekly.wastagePercent ? Money(dataWeekly.wastagePercent) : 0}%`}</Text> */}
                  </View>
                  <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Actual Store Working H...</Text>
                    <Text style={styles.text}>{dataWeekly.actualStoreWorkingHours ? Money(dataWeekly.actualStoreWorkingHours) : 0}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Payroll (VND)</Text>
                    {/* <Text style={styles.text}>{dataWeekly.payrollVND ? Money(dataWeekly.payrollVND) : 0}</Text> */}
                    <MoneyText data={dataWeekly.payrollVND} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>BUGETED Payroll %</Text>
                    <Text style={styles.text}>{`${dataWeekly.budgetPayrollPercent ? Money(dataWeekly.budgetPayrollPercent) : 0}%`}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Payroll %</Text>
                    <Text style={styles.text}>{`${dataWeekly.payrollPercent ? Money(dataWeekly.payrollPercent) : 0}%`}</Text>
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Actual SPMH</Text>
                    {/* <Text style={styles.text}>{dataWeekly.actualSPMH ? Money(dataWeekly.actualSPMH) : 0}</Text> */}
                    <MoneyText data={dataWeekly.actualSPMH} style={styles.text} />
                  </View>
                  <View style={styles.rowItem}>
                    <Text style={styles.textRowTitle}>Hours should have used</Text>
                    <Text style={styles.text}>{dataWeekly.hoursShouldHaveUsded ? Money(dataWeekly.hoursShouldHaveUsded) : 0}</Text>
                  </View>
                  <View style={[styles.rowItem, { marginBottom: 15 }]}>
                    <Text style={styles.textRowTitle}>Variance</Text>
                    <Text style={styles.text}>{dataWeekly.variance ? Money(dataWeekly.variance) : 0}</Text>
                  </View>
                </View>
              ))
            }
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
            title={"Management Awareness"}
            visible={modalSendMail}
            dateTime={dateSendMail}
            isPickType={true}
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
  pickerDate: {
    backgroundColor: "#414141",
    borderRadius: 4,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text500: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.white,
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
