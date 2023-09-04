import React, { useEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal,
    // TouchableHighlight,
    Dimensions,
    // ScrollView,
    TouchableWithoutFeedback, Platform
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../utils/Colors';
import { useState } from "react";
import SvgUri from "react-native-svg-uri";
import moment from "moment";
import { Icons } from "../../assets";
import {
    VictoryChart,
    VictoryAxis,
    VictoryLine,
    VictoryScatter,
    VictoryLabel,
    VictoryBar,
    VictoryTooltip,
    VictoryVoronoiContainer,
    VictoryGroup
} from "victory-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from "react-native-calendars";
import RadioForm from 'react-native-simple-radio-button';
import PickerModel from '../../components/picker/PickerModel';
import SelectMultiple from 'react-native-select-multiple'
import { Imodel } from '../../models/Imodel';
import { OwnerHighLevelService } from '../../netWorking/ownerHighLevel';
import { Money } from '../../components/generalConvert/conVertmunberToMoney';
import { RevenueMonthlyModel } from '../../models/RevenueMonthly';
import DialogAwait from '../../components/dialogs/dialogAwait';
import Loading from '../../components/dialogs/Loading';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';

export default function TabOwnerHighLVScreen() {
    const loadListYear = async () => {
        let currentYear = new Date().getFullYear();
        let data = []
        for (let i = 0; i <= 10; i++) {
            data.push({ label: (currentYear - i).toString(), value: i })
        }
        setDataModelYear(data);
    }
    const [dataModelYear, setDataModelYear] = useState<Imodel[]>([]);

    const dataModelBox = [
        { label: 'Daily Revenue', value: 0 },
        { label: 'Monthly Revenue', value: 1 },
    ]

    const width = Dimensions.get("window").width;
    const [pickerValueCheckBox, setPickerValueCheckBox] = useState("Select Daily Or Monthly");
    const [modalVisibleYear, setModalVisibleYear] = useState(false);
    const [modalVisibleSelect, setModalVisibleSelect] = useState(false);
    const [pickerValueYear, setPickerValueYear] = useState(new Date().getFullYear().toString());
    const dimensions = Dimensions.get('window');
    const windowHeight = dimensions.height;
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const toDate = new Date();
    const [modalCheckBox, setModalCheckBox] = useState(false);
    const [dataRevenuePoint, setDataRevenuePoint] = useState<any[]>([]);
    const [dataRevenueDaily, setDataRevenueDaily] = useState<RevenueMonthlyModel>(null);
    const [isSubmit, setIssubmit] = useState(false);
    const [fromDateTime, setFromDateTime] = useState(null);

    const [endDateTime, setEndDateTime] = useState(null);

    const [DateTimeDaily, setFromDateTimeDaily] = useState(
        moment(new Date().setDate(toDate.getDate())).format("YYYY-MM-DD")
    );
    const whiteStyle = {
        grid: { stroke: colors.colorLine, strokeWidth: 0.5 },
        axis: { stroke: colors.backgroundApp },
        tickLabels: { fill: colors.colorChartLine, fontSize: 10 },
    };

    const [date, setDate] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD"));
    const [typeDateTime, setTypeDateTime] = useState('');

    const [dataMarkedDatesState, setDataMarkedDatesState] = useState({});
    const showDatePicker = (type: string) => {
        let dateTime = ''
        if (type === 'from') {
            fromDateTime!==null? dateTime = fromDateTime : dateTime= moment(new Date()).format("YYYY-MM-DD")
        } else if (type === 'end') {
            endDateTime!==null? dateTime = endDateTime : dateTime= moment(new Date()).format("YYYY-MM-DD")
        } else if (type === 'daily') {
            dateTime = DateTimeDaily
        }
        let dataMarked: any = {};
        let datePresent = dateTime.slice(0, 10)

        dataMarked[datePresent] = {
            selected: true,
        };
        setDate(datePresent);
        setTypeDateTime(type);
        setDataMarkedDatesState(dataMarked);
        setDatePickerVisibility(true);
    };

    const onDayPress = (day: any) => {
        // Tạo date từ ngày nhấn vào
        const date = new Date(
            new Date().setFullYear(day.year, Number(day.month - 1), day.day)
        );
        setDate(moment(date).format("YYYY-MM-DD"));
        let dataMarked: any = {};
        dataMarked[day.dateString] = {
            selected: true,
        };
        setDataMarkedDatesState(dataMarked);
    };


    const hideDatePicker = () => {
        return setDatePickerVisibility(false);
    };

    const handleConfirm = async () => {
        const pickDate = new Date(date)
        pickDate.setSeconds(0)
        const dateNow = new Date();
        const ParamDateTime = moment(pickDate).format("YYYY-MM-DD");
        if (typeDateTime === 'end') {
            setEndDateTime(ParamDateTime);
            if(fromDateTime!==null){
                loadCharDateTime(fromDateTime, ParamDateTime);
            }
        } else if (typeDateTime === 'from') {
            setFromDateTime(ParamDateTime);
            if(endDateTime!==null){
                loadCharDateTime(ParamDateTime, endDateTime);
            }
        } else if (typeDateTime === 'daily' && pickDate < dateNow) {
            setFromDateTimeDaily(ParamDateTime);
            loadRevenueOfDaily(ParamDateTime);
        }
        hideDatePicker();
    };
    const whiteStyleBottom = {
        axis: { stroke: colors.colorLine },
        ticks: { stroke: colors.gray, size: 8, margin: 5 },
        tickLabels: { fontSize: 10, padding: 5, fill: "#A4A4A4" },
    };

    const [modalCheckBoxMonth, setModalCheckBoxMonth] = useState(false);


    const [checkDailyDay, setCheckDailyDay] = useState(false);
    const [checkDailyMoth, setCheckDailyMoth] = useState(false);
    const [textDate, setTextDate] = useState('');
    const [radioValue, setradioValue] = useState('');

    const onchangeRadio = (event: any) => {
        setModalCheckBox(false);
        if (event == 0) {
            showDatePicker('daily');
            setDatePickerVisibility(true);
            setCheckDailyDay(true);
            setCheckDailyMoth(false);
            setPickerValueCheckBox("Daily Revenue");
            setTextDate('Date');
        } else {
            setCheckDailyMoth(true);
            setCheckDailyDay(false);
            setModalCheckBoxMonth(true);
            setDatePickerVisibility(false);
            setPickerValueCheckBox("Monthly Revenue");
            setTextDate('Month');
        }
        setradioValue(event);
    };


    //onchang chart
    const [isAll, setAll] = useState(true);
    const [isNetSales, setNetSales] = useState(true);
    const [isGrossSales, setGrossSales] = useState(true);
    const [isTransaction, setTransaction] = useState(true);
    const [isCustomer, setCustomer] = useState(true);

    const [pickerValueSelect, setPickerValueSelect] = useState("Select...");

    const [valueHeightChart, setValueHeightChart] = useState([50, 100, 150, 200, 250, 300])
    const dataModelSelect = [
        { label: 'All', value: 0 },
        { label: 'Net Sales', value: 1 },
        { label: 'Gross Sales', value: 2 },
        { label: 'Transaction', value: 3 },
        { label: 'Customer', value: 4 },
    ]

    const dataModel: Imodel[] = []
    const [dataChart, setDataChart] = useState(dataModelSelect);
    const [selectedChart, setselectedChartValue] = useState(dataModel);
    const onSelectionsChange = (data: Imodel[], item: Imodel) => {
        let selectedAll = data.find(x => x.value == 0);
        if (selectedAll && item.value == 0) {
            setselectedChartValue(dataChart);
            setAll(true);
            setNetSales(true);
            setGrossSales(true);
            setTransaction(true);
            setCustomer(true);
            setPickerValueSelect('All')
        }
        else {
            setAll(true);
            setNetSales(true);
            setGrossSales(true);
            setTransaction(true);
            setCustomer(true);
            setselectedChartValue(dataModel);
            setPickerValueSelect('Select...')
        }
        if (item.value != 0) {
            if (!selectedAll && data.length == dataChart.length - 1) {
                setselectedChartValue(dataChart);
                setPickerValueSelect('All')
            }
            else {

                let indexAll = selectedChart.findIndex(x => x.value == 0);
                if (indexAll >= 0) {
                    data.splice(indexAll, 1);
                }
                setselectedChartValue(data);
                const checkNetSales = data.find(x => x.value == 1);
                const checkGrossSales = data.find(x => x.value == 2);
                const checkTransaction = data.find(x => x.value == 3);
                const checkCustomer = data.find(x => x.value == 4);
                setNetSales(false);
                setGrossSales(false);
                setTransaction(false);
                setCustomer(false);

                let labelSeleted = "";
                data.map((map, index) => {
                    if (map.value != 0)
                        labelSeleted += index != (data.length - 1) ? `${map.label},` : `${map.label}`;
                })
                setPickerValueSelect(labelSeleted);

                //checkNetSales
                if (checkNetSales) {
                    setNetSales(true);
                } else {
                    setNetSales(false);
                }
                //checkGrossSales
                if (checkGrossSales) {
                    setGrossSales(true);
                } else {
                    setGrossSales(false);
                }
                //checkTransaction
                if (checkTransaction) {
                    setTransaction(true);
                } else {
                    setTransaction(false);
                }
                //checkCustomer
                if (checkCustomer) {
                    setCustomer(true);
                } else {
                    setCustomer(false);
                }
            }
        }
    }
    //end onchange chart

    //change picker month year
    const [month, setMonth] = useState(+moment(new Date().setDate(toDate.getDate())).format("MM"));

    const [year, setYear] = useState(+moment(new Date().setDate(toDate.getDate())).format("YYYY"));

    let yearNow = +moment(new Date().setDate(toDate.getDate())).format("YYYY");

    const increaseMonth = () => {
        if (month < 12) {
            setMonth(month + 1);
        } else setMonth(1);
    };

    const decreaseMonth = () => {
        if (month > 1) {
            setMonth(month - 1);
        } else setMonth(12);
    };

    const increaseYear = () => {
        if (year < yearNow) {
            setYear(year + 1);
        } else setYear(2018);
    };

    const decreaseYear = () => {
        if (year > 2019) {
            setYear(year - 1);
        } else setYear(yearNow);
    };

    const nonthYearNow = month + '/' + year;
    const [monthly, setmonthly] = useState(nonthYearNow);
    //done picker month year
    const handleConfirmYear = () => {
        const monthYear = month + '/' + year;
        setmonthly(monthYear);
        loadRevenueOfMonthly(month, year);
        hideMonthlyPicker();
    };

    //onchang hide Picker Monthly Year
    const hideMonthlyPicker = () => {
        return setModalCheckBoxMonth(false);
    };

    let getYear = toDate.getFullYear();
    const [yearNowChar, setYearNowChart] = useState(getYear.toString());

    const dateMonthArray: string[] = [];
    const [pointNet, setPointNet] = useState([]);
    const [pointGross, setPointGross] = useState([]);
    const [pointTransaction, setPointTransaction] = useState([]);
    const [pointCustomer, setPointCustomer] = useState([]);
    const [dateMonth, setDateMonth] = useState(dateMonthArray);
    const [checkLoadDatetimeDefault, setLoadDatetimeDefault] = useState(true);
    const [widthChart, setWidthChart] = useState(400);

    const getDaysArray = (fromDateTime: any, endDateTime: any) => {
        for (var arr = [], dt = new Date(fromDateTime); dt <= endDateTime; dt.setDate(dt.getDate() + 1)) {
            arr.push(moment(new Date(dt)).format("DD-MM"));
        }
        return arr;
    };
    const loadCharDateTime = (startDate: any, endDate: any) => {
        var daylist = getDaysArray(new Date(startDate), new Date(endDate));
        daylist.map((v) => v.slice(0, 10)).join("");

        setDateMonth(daylist);
        if (daylist.length > 0) {
            setWidthChart((daylist.length * 60 + 170))
        }
        loadRevenueOfDate(startDate, endDate);
    };

    const loadRevenueOfYear = async () => {
        let model = {
            "year": Number(pickerValueYear)
        }
        setIssubmit(true);
        let data = await OwnerHighLevelService.ReportRevenueYear(model);
        setIssubmit(false);
        setDataRevenuePoint(data);
    }

    const ratio = 200000
    const loadRevenueOfDate = async (startDate: any, endDate: any) => {
        // ------Ratio tỉ lệ cột Customer, Transaction trên biểu đồ---------
        let model = {
            "DateFrom": startDate,
            "DateTo": endDate,
            "Ratio": ratio
        }
        setIssubmit(true);
        let data = await OwnerHighLevelService.ReportRevenueDate(model);
        let maxNet =Math.max(...data.lineNet.map(e => e.revenue)).toFixed()
        let maxGross =Math.max(...data.lineGross.map(e => e.revenue)).toFixed()
        let maxCustomer =Math.max(...data.customerBar.map(e => e.revenue)).toFixed()
        let maxTransaction =Math.max(...data.transactionBar.map(e => e.revenue)).toFixed()
        let max = Math.max(...[+maxNet/200000,+maxGross/200000,+maxCustomer,+maxTransaction].map(e => e))
        if(max > 300){
            let _max =Number(max.toFixed())
            let heights = [+(_max/6).toFixed(),+(_max/3).toFixed(),+(_max/2).toFixed(), +(_max/1.5).toFixed(),+(_max/1.2).toFixed(), _max ]
            setValueHeightChart(heights);
        }        
        setPointNet(data.lineNet);
        setPointGross(data.lineGross);
        setPointCustomer(data.customerBar);
        setPointTransaction(data.transactionBar);
        setIssubmit(false);
    }

    const loadRevenueOfDaily = async (date: any) => {
        setDataRevenueDaily(null);
        let model = {
            "DateFrom": date,
            "DateTo": date
        }
        setIssubmit(true);
        let data = await OwnerHighLevelService.ReportRevenueDaily(model);
        setIssubmit(false);
        setDataRevenueDaily(data);
    }

    const loadRevenueOfMonthly = async (month: any, year: any) => {
        setDataRevenueDaily(null);
        let model = {
            "Month": month,
            "Year": year
        }
        setIssubmit(true);
        let data = await OwnerHighLevelService.ReportRevenueMonthly(model);
        setIssubmit(false);
        setDataRevenueDaily(data);
    }

    useEffect(() => {
        loadListYear();
        loadRevenueOfYear();
        if (checkLoadDatetimeDefault) {
            if (fromDateTime!==null &&endDateTime!==null){
                loadCharDateTime(fromDateTime, endDateTime);
            }
        }
    }, [pickerValueYear])
    return (
        <View style={styles.container}>
            <PickerModel
                defaultValue="Outlet"
                onSelectedValue={value => {

                }}
            ></PickerModel>
            <View style={styles.line}></View>
            <ScrollView>
                <View style={styles.containerCenter}>
                    <View style={[styles.salseYear, { zIndex: 10 }]}>
                        <View style={styles.saleForYear}>
                            <Text style={styles.tesxtAaleForYear}>Sales for year</Text>
                        </View>

                        <View style={styles.year}>
                            <TouchableOpacity
                                style={{ flex: 1, flexDirection: 'row', paddingTop: 10 }}
                                onPress={() => {
                                    setModalVisibleYear(!modalVisibleYear);
                                }}
                            >
                                <View style={{ flex: 8 }}>
                                    <Text style={{ color: "#fff", fontSize: 14, paddingLeft: 5 }}>
                                        {pickerValueYear}
                                    </Text>
                                </View>
                                <View style={{ flex: 2 }}>
                                    <SvgUri source={Icons.dateTime} />
                                </View>
                            </TouchableOpacity>
                            {modalVisibleYear && (
                            <View style={[styles.listPickerYear, { width: '100%', }]}>
                                <ScrollView nestedScrollEnabled>
                                    {dataModelYear.map((data, index) => (
                                        <View key={index}>
                                            <TouchableHighlight
                                                style={{ padding: 10, }}
                                                underlayColor={'rgba(0, 0, 0, 0.2)'}
                                                onPress={() => {
                                                    setModalVisibleYear(false)
                                                    setPickerValueYear(data.label);
                                                    setYearNowChart(data.label);
                                                }}
                                            >
                                                <Text style={{ color: colors.colorText, fontWeight: '500', fontSize: 16, textAlign: 'center' }}>{data.label}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}
                        </View>
                        
                        <View style={{ flex: 3 }}>
                        </View>
                    </View>
                    <View style={styles.charYear}>
                        <ScrollView horizontal={true} endFillColor={'#fff'}>
                            <View>
                                <VictoryChart
                                    width={900}
                                    domainPadding={{ x: 55, y: 45 }}
                                    padding={{ top: 5, bottom: 50, left: 67, right: 25 }}
                                    containerComponent={
                                        <VictoryVoronoiContainer />
                                    }
                                    style={{ parent: { cursor: "pointer" } }}
                                >
                                    <VictoryLabel
                                        y={250}
                                        x={50}
                                        style={{
                                            fontSize: 10,
                                            fontStyle: "normal",
                                            fill: colors.colorText,
                                        }}
                                        text={"0"}
                                    />
                                    <VictoryAxis
                                        tickValues={[125000000, 250000000, 375000000, 500000000, 625000000, 750000000]}
                                        tickFormat={(t) => `${Money(t)}`}
                                        dependentAxis
                                        orientation="left"
                                        style={whiteStyle}
                                    />
                                    <VictoryAxis
                                        tickValues={[`${yearNowChar}-01`, `${yearNowChar}-02`, `${yearNowChar}-03`, `${yearNowChar}-04`,
                                        `${yearNowChar}-05`, `${yearNowChar}-06`, `${yearNowChar}-07`, `${yearNowChar}-08`,
                                        `${yearNowChar}-09`, `${yearNowChar}-10`, `${yearNowChar}-11`, `${yearNowChar}-12`]}
                                        style={whiteStyleBottom}
                                        orientation="bottom"
                                    />
                                    <VictoryGroup
                                        data={dataRevenuePoint}
                                        color="#5F8BFC"
                                    >
                                        <VictoryLine
                                            interpolation="natural"
                                            labels={({ datum }) => [
                                                pickerValueYear + '-' + datum.month,
                                                "This year: " + Money(datum.revenue ? Math.round(datum.revenue).toString() : Math.round(datum.y).toString()) ?? '0',
                                                "Last year: " + Money(datum.lastYearRevenue ? Math.round(datum.lastYearRevenue).toString() : '0')
                                            ]}
                                            labelComponent={
                                                <VictoryTooltip
                                                    activateData={true}
                                                    renderInPortal={false}
                                                    centerOffset={{ y: -20 }}
                                                    style={
                                                        {
                                                            fontSize: 13,
                                                            margin: 5,
                                                            fill: "#5F8BFC",
                                                        }
                                                    }
                                                    flyoutStyle={{
                                                        stroke: "#C4C4C4",
                                                        fill: "#414141"
                                                    }}
                                                    cornerRadius={2}
                                                />
                                            }
                                        />
                                        <VictoryScatter
                                            size={3}
                                            style={{
                                                data: {
                                                    fill: "#DAB451",
                                                },
                                            }}
                                        />
                                    </VictoryGroup>
                                </VictoryChart>
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.line}></View>
                <View style={styles.containerCenter}>
                    <View style={styles.rowHeader}>
                        <View style={styles.rowFromDate}>
                            <Text style={styles.textFromDate}>From Date</Text>
                            <View style={styles.fromDate}>
                                <TouchableOpacity
                                    style={styles.cssText}
                                    onPress={() => showDatePicker('from')}
                                >
                                    <View style={{ flex: 8, paddingLeft: 5 }}>
                                        <Text style={{ color: "#fff", fontSize: 14 }}>
                                            {fromDateTime===null?'Select date..':moment(fromDateTime).format("DD/MM/YYYY")}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <SvgUri source={Icons.dateTime} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.rowEndDate}>
                            <Text style={styles.endDate}>End Date</Text>
                            <View style={styles.fromDate}>
                                <TouchableOpacity
                                    style={styles.cssText}
                                    onPress={() => showDatePicker('end')}
                                >
                                    <View style={{ flex: 8, paddingLeft: 5 }}>
                                        <Text style={{ color: "#fff", fontSize: 14 }}>
                                            {endDateTime===null?'Select date..':moment(endDateTime).format("DD/MM/YYYY")}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 2 }}>
                                        <SvgUri source={Icons.dateTime} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={[styles.salectChart, { zIndex: Platform.OS === 'ios' ? 10 : undefined }]}>
                        <View style={styles.chartPicker}>
                            <TouchableOpacity
                                onPress={
                                    () => {
                                        setModalVisibleSelect(!modalVisibleSelect);
                                    }
                                }
                            >
                                <View style={styles.selectpickerModal}>
                                    <Text style={styles.text}>{pickerValueSelect}</Text>
                                </View>
                            </TouchableOpacity>
                            <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff"
                                onPress={() => {
                                    setModalVisibleSelect(!modalVisibleSelect);
                                }} />
                        </View>
                        {modalVisibleSelect && (
                            <View style={[styles.listPicker, { width: width - 30 }]}>
                                <View style={{ height: 275 }}>
                                    <SelectMultiple
                                        rowStyle={{ backgroundColor: colors.grayLight, borderBottomWidth: 0 }}
                                        labelStyle={{ color: colors.white }}
                                        checkboxStyle={{ tintColor: colors.white }}
                                        selectedCheckboxSource={Icons.iconChecked}
                                        items={dataModelSelect}
                                        style={{ zIndex: 100 }}
                                        selectedItems={selectedChart}
                                        onSelectionsChange={onSelectionsChange}
                                    />
                                </View>
                            </View>
                        )}
                    </View>

                    <ScrollView horizontal={true} endFillColor={'#fff'}>
                        <View style={{ flex: 1, paddingTop: 30, minWidth: 500 }}>
                            <View>
                                {isAll && (
                                    <VictoryChart
                                        domainPadding={{ x: 40, y: 45 }}
                                        width={widthChart}
                                        padding={{ top: 5, bottom: 50, left: 90, right: 80 }}
                                        containerComponent={
                                            <VictoryVoronoiContainer />
                                        }
                                        style={{ parent: { cursor: "pointer" } }}
                                    >
                                        <VictoryChart
                                        >
                                            <VictoryLabel
                                                y={200}
                                                x={5}
                                                angle={-90}
                                                style={{
                                                    fontSize: 10,
                                                    fontStyle: "normal",
                                                    fill: colors.colorText,
                                                }}
                                                text={"Net Sales - Gross Sales"} />
                                            <VictoryLabel
                                                y={200}
                                                x={widthChart - 25}
                                                angle={-90}
                                                style={{
                                                    fontSize: 10,
                                                    fontStyle: "normal",
                                                    fill: colors.colorText,
                                                }}
                                                text={"Transaction - Customer"} />
                                            <VictoryLabel
                                                y={250}
                                                x={70}
                                                style={{
                                                    fontSize: 10,
                                                    fontStyle: "normal",
                                                    fill: colors.colorText,
                                                }}
                                                text={"0"}
                                            />
                                            <VictoryAxis
                                                tickValues={valueHeightChart}
                                                tickFormat={(t) => `${Money(Math.round(t * ratio))}`}
                                                dependentAxis
                                                orientation="left"
                                                style={whiteStyle}
                                            />
                                            <VictoryAxis
                                                tickValues={dateMonth}
                                                style={whiteStyleBottom}
                                                orientation="bottom"
                                            />

                                            <VictoryAxis
                                                tickValues={valueHeightChart}
                                                tickFormat={(t) => `${Money(t)}`}
                                                dependentAxis
                                                orientation="right"
                                                style={whiteStyle}
                                            />
                                        </VictoryChart>

                                        {isNetSales && (
                                            <VictoryGroup
                                                data={pointNet}
                                                color="#F6606F"
                                            >
                                                <VictoryLine
                                                    interpolation="natural"
                                                    labels={({ datum }) => ["N: " + datum.date, `${Money(datum.revenue) ?? 0}` + " VND"]}
                                                    labelComponent={
                                                        <VictoryTooltip
                                                            renderInPortal={false}
                                                            centerOffset={{ x: 0, y: -80 }}
                                                            style={
                                                                {
                                                                    fontSize: 10,
                                                                    fill: "#F6606F",
                                                                }
                                                            }
                                                            // flyoutWidth={120}
                                                            // flyoutHeight={50}
                                                            flyoutStyle={{
                                                                stroke: "#C4C4C4",
                                                                fill: "#414141"
                                                            }}
                                                            cornerRadius={2}
                                                        />
                                                    }
                                                />
                                                <VictoryScatter
                                                    size={3}
                                                    style={{
                                                        data: {
                                                            fill: "#DAB451"
                                                        },
                                                    }}
                                                />
                                            </VictoryGroup>
                                        )}
                                        <VictoryGroup
                                            offset={15}
                                            style={{ data: { width: 15 } }}
                                            colorScale={["#5F8BFC", "#FDB441"]}
                                        >
                                            {isTransaction &&
                                                <VictoryBar
                                                    labels={({ datum }) => ["T: " + datum.date, Money(datum.y.toString())]}
                                                    labelComponent={
                                                        <VictoryTooltip
                                                            renderInPortal={false}
                                                            centerOffset={{ x: isCustomer ? 70 : 0, y: -43 }}
                                                            style={
                                                                {
                                                                    fontSize: 10,
                                                                    fill: "#5F8BFC",
                                                                }
                                                            }
                                                            // flyoutWidth={120}
                                                            // flyoutHeight={50}
                                                            flyoutStyle={{
                                                                stroke: "#C4C4C4",
                                                                fill: "#414141"
                                                            }}
                                                            cornerRadius={2}
                                                        />
                                                    }
                                                    data={pointTransaction}
                                                />
                                            }
                                            {isCustomer &&
                                                <VictoryBar
                                                    labels={({ datum }) => ["C: " + datum.date, Money(datum.y.toString())]}
                                                    labelComponent={
                                                        <VictoryTooltip
                                                            renderInPortal={false}
                                                            centerOffset={{ x: isTransaction ? - 60 : 0, y: -43 }}
                                                            style={
                                                                {
                                                                    fontSize: 10,
                                                                    fill: "#FDB441",
                                                                }
                                                            }
                                                            // flyoutWidth={120}
                                                            // flyoutHeight={50}
                                                            flyoutStyle={{
                                                                stroke: "#C4C4C4",
                                                                fill: "#414141"
                                                            }}
                                                            cornerRadius={2}
                                                        />
                                                    }
                                                    data={pointCustomer}
                                                />}
                                        </VictoryGroup>
                                        {isGrossSales && (
                                            <VictoryGroup
                                                data={pointGross}
                                                color="#76D146"
                                            >
                                                <VictoryLine
                                                    interpolation="natural"
                                                    labels={({ datum }) => ["G: " + datum.date, `${Money(datum.revenue) ?? 0}` + " VND"]}
                                                    labelComponent={
                                                        <VictoryTooltip
                                                            renderInPortal={false}
                                                            centerOffset={{ x: 0, y: -5 }}
                                                            style={
                                                                {
                                                                    fontSize: 10,
                                                                    fill: "#76D146",
                                                                }
                                                            }
                                                            // flyoutWidth={120}
                                                            // flyoutHeight={50}
                                                            flyoutStyle={{
                                                                stroke: "#C4C4C4",
                                                                fill: "#414141"
                                                            }}
                                                            cornerRadius={2}
                                                        />
                                                    }
                                                />
                                                <VictoryScatter
                                                    size={3}
                                                    style={{
                                                        data: {
                                                            fill: "#DAB451"
                                                        },
                                                    }}
                                                />
                                            </VictoryGroup>
                                        )}
                                    </VictoryChart>
                                )}
                            </View>
                            <View style={styles.rowTableChart}>
                                <View style={{ marginRight: 15 }}>
                                    <Text style={{ textAlign: "center" }}>
                                        <SvgUri source={Icons.Ellipse_foc} />
                                        <Text> </Text>
                                        <Text style={styles.commentChart}>Net Sales</Text>
                                    </Text>
                                </View>
                                <View style={{ marginRight: 15 }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        <SvgUri source={Icons.Ellipse_discount} />
                                        <Text> </Text>
                                        <Text style={styles.commentChartTable}>Gross Sales</Text>
                                    </Text>
                                </View>
                                <View style={{ marginRight: 15 }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        <SvgUri source={Icons.iconTransaction} />
                                        <Text> </Text>
                                        <Text style={styles.commentTransaction}> Transaction</Text>
                                    </Text>
                                </View>
                                <View style={{ marginRight: 15 }}>
                                    <Text style={{ textAlign: 'center' }}>
                                        <SvgUri source={Icons.iconCustomer} />
                                        <Text> </Text>
                                        <Text style={styles.commentCustomer}>Customer</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{ paddingBottom: 15, paddingTop: 15 }}>
                        <View style={styles.lineItem}></View>
                    </View>
                    <View style={[modalCheckBox&&{minHeight: 200 }]}>
                        <View style={styles.viewPicker}>
                            <TouchableWithoutFeedback
                                style={{ zIndex: 3 }}
                                onPress={
                                    () => {
                                        setModalCheckBox(!modalCheckBox);
                                    }
                                }
                            >
                                <View style={styles.pickerModal}>
                                    <Text style={styles.text}>{pickerValueCheckBox}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff"
                                onPress={() => {
                                }} />
                        </View>
                        {
                            modalCheckBox &&
                            <View style={{ position: 'absolute', left: 0, top:0, zIndex: 5 }}>
                                <View style={[styles.modalViewSelectMultiple, { backgroundColor: "#414141" }]}>
                                    <RadioForm
                                        initial={radioValue}
                                        style={{ zIndex: 10 }}
                                        radio_props={dataModelBox}
                                        buttonColor={colors.white}
                                        labelStyle={{ fontSize: 16, color: colors.white, paddingBottom: 20, paddingTop: 3 }}
                                        buttonOuterColor={colors.white}
                                        selectedButtonColor={colors.white}
                                        buttonSize={16}
                                        onPress={onchangeRadio}
                                    />
                                </View>
                            </View>
                        }
                        {
                            checkDailyDay && (

                                <View style={styles.daily}>
                                    <View style={styles.ViewDate}>
                                        <View style={{ flex: 7 }}>
                                            <Text style={styles.textDate}>{textDate}:</Text>
                                        </View>
                                        <View style={{ flex: 3, alignItems: 'flex-end' }}>
                                            <TouchableOpacity
                                                style={styles.cssText}
                                                onPress={() => showDatePicker('daily')}
                                            >
                                                <View style={{ flex: 3, flexDirection: 'row', paddingTop: 5 }}>
                                                    <Text style={{ flex: 8.6, color: "#fff", fontSize: 14, }}>
                                                        {moment(DateTimeDaily).format("DD/MM/YYYY")}
                                                    </Text>
                                                    <Text style={{ flex: 1.4 }}>
                                                        <SvgUri source={Icons.dateTime} />
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.information}>
                                        <View style={styles.shareInformation}>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Net value</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text numberOfLines={1} style={styles.numInformation}>
                                                        {Money(dataRevenueDaily?.now.totalNetSales)}
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Last {dataRevenueDaily?.last.weekdays}</Text>
                                                <Text style={styles.dayInformation}>{Money(dataRevenueDaily?.last.totalNetSales)}</Text>
                                            </View>
                                            <View style={{ flex: 0.5 }}></View>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Transaction</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text style={styles.numInformation}>
                                                    {dataRevenueDaily?.now.totalTransaction}    
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Last {dataRevenueDaily?.last.weekdays}</Text>
                                                <Text style={styles.dayInformation}>{dataRevenueDaily?.last.totalTransaction}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.5 }}></View>
                                        <View style={{ flex: 4.75, backgroundColor: colors.backgroundApp, flexDirection: "row" }}>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Customer</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text style={styles.numInformation}>
                                                        {dataRevenueDaily?.now.totalCustomer}
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Last {dataRevenueDaily?.last.weekdays}</Text>
                                                <Text style={styles.dayInformation}>{dataRevenueDaily?.last.totalCustomer}</Text>
                                            </View>
                                            <View style={{ flex: 0.5 }}></View>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Week to date</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text numberOfLines={1} style={styles.numInformation}>
                                                        {Money(dataRevenueDaily?.now.totalNetSalesWeeks)}
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Week to Last {dataRevenueDaily?.last.weekdays}</Text>
                                                <Text style={styles.dayInformation}>{Money(dataRevenueDaily?.last.totalNetSalesWeeks)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        {
                            checkDailyMoth && (
                                <View style={styles.daily}>
                                    <View style={styles.ViewDate}>
                                        <View style={{ flex: 8 }}>
                                            <Text style={styles.textDate}>{textDate}:</Text>
                                        </View>
                                        <View style={{ flex: 2, alignItems: 'flex-end' }}>
                                            <TouchableOpacity
                                                style={styles.cssText}
                                                onPress={() => setModalCheckBoxMonth(true)}
                                            >
                                                <View style={{ flex: 3, flexDirection: 'row', paddingTop: 5 }}>
                                                    <Text style={{ flex: 7.7, color: "#fff", fontSize: 14, }}>
                                                        {monthly}
                                                    </Text>
                                                    <Text style={{ flex: 2.3 }}>
                                                        <SvgUri source={Icons.dateTime} />
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.information}>
                                        <View style={styles.shareInformation}>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Net value</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text style={styles.numInformation}>
                                                    {Money(dataRevenueDaily?.now.totalNetSales)}    
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Last Month</Text>
                                                <Text style={styles.dayInformation}>{Money(dataRevenueDaily?.last.totalNetSales)}</Text>
                                            </View>
                                            <View style={{ flex: 0.5 }}></View>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Transaction</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text style={styles.numInformation}>
                                                        {dataRevenueDaily?.now.totalTransaction}  
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Last Month</Text>
                                                <Text style={styles.dayInformation}>{dataRevenueDaily?.last.totalTransaction}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 0.5 }}></View>
                                        <View style={{ flex: 4.75, backgroundColor: colors.backgroundApp, flexDirection: "row" }}>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Customer</Text>
                                                <View style={{ padding: 12 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text style={styles.numInformation}>
                                                    {dataRevenueDaily?.now.totalCustomer}   
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Last Month</Text>
                                                <Text style={styles.dayInformation}>{dataRevenueDaily?.last.totalCustomer}</Text>
                                            </View>
                                            <View style={{ flex: 0.5 }}></View>
                                            <View style={styles.rowInformation}>
                                                <Text style={styles.headerInformation}>Accumulated till this month</Text>
                                                <View style={{ paddingLeft: 12, paddingRight: 12, paddingBottom: 10 }}>
                                                    <View style={styles.lineItem}></View>
                                                </View>
                                                <View style={styles.itemRevenue}>
                                                    <Text style={styles.numInformation}>
                                                    {Money(dataRevenueDaily?.now.totalNetSalesWeeks)}  
                                                    </Text>
                                                    <SvgUri source={Icons.icondaily}/>
                                                </View>
                                                <Text style={styles.dayInformation}>Same Period last year</Text>
                                                <Text style={styles.dayInformation}>{Money(dataRevenueDaily?.last.totalNetSalesWeeks)}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                    </View>
                </View>
            </ScrollView>
            {
                isDatePickerVisible && (
                    <ScrollView style={[styles.dateTimeModal, { height: windowHeight - 130 }]} showsVerticalScrollIndicator={false}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isDatePickerVisible}
                        >
                            <View style={{ top: 50 }}>
                                <View style={styles.dateTimeContainer} >
                                    <View style={styles.dateTimeHeader}>
                                        <Text style={styles.dateTimeHeaderText}>DATE</Text>
                                    </View>
                                    <Calendar
                                        style={{ backgroundColor: "transparent", }}
                                        monthFormat={"MMM yyyy"}
                                        renderHeader={(date: string) => {
                                            return (
                                                <View>
                                                    <Text style={{ color: "#fff" }}>{moment(date.toString()).format("MMM yyyy")}</Text>
                                                </View>
                                            );
                                        }}
                                        firstDay={1}
                                        onDayPress={onDayPress}
                                        onDayLongPress={onDayPress}
                                        markedDates={dataMarkedDatesState}
                                        theme={{
                                            arrowColor: "white",
                                            textSectionTitleColor: "#fff",
                                            calendarBackground: "transparent",
                                            dayTextColor: "#fff",
                                            selectedDayBackgroundColor: "#DAB451",
                                            selectedDayTextColor: "#ff0",
                                            textDisabledColor: "transparent",
                                            todayTextColor: "#fff",
                                            'stylesheet.calendar.header': {
                                                header: {
                                                    backgroundColor: '#595959',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                    marginTop: 6,
                                                    alignItems: 'center'
                                                }
                                            },
                                            'stylesheet.calendar.main': {
                                                container: {
                                                    padding: 0,
                                                }
                                            }
                                        }}
                                    />
                                    <LinearGradient style={styles.dateTimeButton}
                                        colors={['#DAB451', '#988050']}>
                                        <TouchableOpacity
                                            onPress={handleConfirm}
                                        >
                                            <Text
                                                style={styles.dateTimeText}
                                            >
                                                Done
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <TouchableOpacity
                                        style={[styles.dateTimeButton, { marginBottom: 10, }]}
                                        onPress={hideDatePicker}
                                    >
                                        <Text
                                            style={styles.dateTimeText}
                                        >
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                )
            }

            {
                modalCheckBoxMonth && (
                    <ScrollView style={[styles.dateTimeModal, { height: windowHeight - 130 }]} showsVerticalScrollIndicator={false}>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalCheckBoxMonth}
                        >
                            <View style={{ top: 200 }}>
                                <View style={styles.dateTimeContainer} >
                                    <View style={styles.dateTimeHeader}>
                                        <Text style={styles.dateTimeHeaderText}>Monthly</Text>
                                    </View>
                                    <View style={{ paddingTop: 8, paddingLeft: 32, paddingRight: 32 }}>
                                        <View style={styles.lineItem}></View>
                                    </View>
                                    <View style={styles.timeContainer}>
                                        <View style={{ flex: 1.5 }}></View>
                                        <View style={styles.timeHourView}>
                                            <TouchableOpacity
                                                style={styles.timeArrow}
                                                onPress={increaseMonth}
                                            >
                                                <Ionicons name="caret-up" size={20} color="#fff" />
                                            </TouchableOpacity>
                                            <Text style={styles.timeText}>
                                                {`${month}`}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={decreaseMonth}
                                                style={styles.timeArrow}
                                            >
                                                <Ionicons name="caret-down" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: "center",
                                                justifyContent: "space-around",
                                            }}
                                        >
                                        </View>
                                        <View style={styles.timeHourView}>
                                            <TouchableOpacity
                                                style={styles.timeArrow}
                                                onPress={increaseYear}
                                            >
                                                <Ionicons name="caret-up" size={20} color="#fff" />
                                            </TouchableOpacity>
                                            <Text style={styles.timeText}>
                                                {`${year}`}
                                            </Text>
                                            <TouchableOpacity
                                                style={styles.timeArrow}
                                                onPress={decreaseYear}
                                            >
                                                <Ionicons name="caret-down" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flex: 1.5 }}></View>
                                    </View>
                                    <LinearGradient style={styles.dateTimeButton}
                                        colors={['#DAB451', '#988050']}>
                                        <TouchableOpacity
                                            onPress={handleConfirmYear}
                                        >
                                            <Text
                                                style={styles.dateTimeText}
                                            >
                                                Done
                                            </Text>
                                        </TouchableOpacity>
                                    </LinearGradient>
                                    <TouchableOpacity
                                        style={[styles.dateTimeButton, { marginBottom: 10, }]}
                                        onPress={hideMonthlyPicker}
                                    >
                                        <Text
                                            style={styles.dateTimeText}
                                        >
                                            Close
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                )
            }
            {/* <DialogAwait
                isShow={isSubmit}
            ></DialogAwait> */}
            {isSubmit && <Loading />}
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundApp,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.white
    },
    viewPicker: {
        paddingLeft: 15,
        backgroundColor: colors.grayLight,
        borderRadius: 4,
        width:220
    },
    pickerModal: {
        height: 46,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor: colors.grayLight,
        color: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600'
    },
    iconDown: {
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 12,
        zIndex: 4
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    centeredViewYear: {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        paddingRight: 22,
    },
    centeredViewSelectMultiple: {
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingLeft: 15,
        paddingRight: 15,
    },
    modalView: {
        backgroundColor: colors.white,
        width: 354,
        height: 200,
        padding: 15,
        borderRadius: 4,
        paddingBottom: 20,
        justifyContent: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewYear: {
        backgroundColor: colors.grayLight,
        width: 150,
        height: 200,
        paddingTop: 15,
        borderRadius: 4,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalViewSelectMultiple: {
        backgroundColor: colors.white,
        paddingTop: 25,
        paddingLeft: 15,
        paddingRight: 15,
        height: 120,
        width: 220,
        borderRadius: 4,
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    line: {
        height: 10,
        backgroundColor: colors.backgroundTab,
    },
    containerCenter: {
        backgroundColor: colors.backgroundApp,
        padding: 15
    },
    salseYear: {
        flex: 1,
        // zIndex: 10,
        flexDirection: 'row',
    },
    saleForYear: {
        flex: 3,
        borderRadius: 4,
        alignItems: 'center',
        height: 40,
        backgroundColor: colors.grayLight,
    },
    tesxtAaleForYear: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
        paddingTop: 10
    },
    year: {
        flex: 3,
        borderRadius: 4,
        alignItems: 'center',
        height: 40,
        marginLeft: 10,
        backgroundColor: colors.grayLight,
    },
    charYear: {
        flex: 1,
        fontSize: 12
    },
    fromDate: {
        flex: 1,
        fontSize: 14,
        backgroundColor: colors.grayLight,
        borderRadius: 4
    },
    rowHeader: {
        flex: 1,
        flexDirection: 'row',
    },
    rowFromDate: {
        flex: 1,
        height: 60,
        backgroundColor: colors.backgroundApp,
        paddingRight: 5,
    },
    textFromDate: {
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 12,
        lineHeight: 21,
        color: "#A4A4A4",
    },
    cssText: {
        flex: 1,
        flexDirection: "row",
        alignItems: 'center'
    },
    rowEndDate: {
        flex: 1,
        height: 60,
        backgroundColor: colors.backgroundApp,
        paddingLeft: 5,
    },
    endDate: {
        fontStyle: "normal",
        fontWeight: "600",
        fontSize: 12,
        lineHeight: 21,
        color: "#A4A4A4",
    },
    BoxModal: {
        flex: 1,
        paddingLeft: 10,
    },
    checkBox: {
        alignSelf: "center",
    },
    textModalBox: {
        flex: 9,
        color: colors.black,
        fontWeight: '500',
        fontSize: 16,
        paddingTop: 5
    },
    modelCategory: {
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    rowTableChart: {
        flex: 1,
        flexDirection: "row",
        height: 30,
        justifyContent: 'center',
    },
    commentChart: {
        color: "#F6606F",
        textAlign: "center",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
    },
    commentChartTable: {
        color: "#76D146",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
    },
    lineItem: {
        height: 1,
        backgroundColor: colors.colorLine,
    },
    commentTransaction: {
        color: "#5F8BFC",
        textAlign: "center",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
    },
    commentCustomer: {
        color: "#FDB441",
        fontStyle: "normal",
        fontWeight: "500",
        fontSize: 12,
        lineHeight: 20,
    },
    dateTimeModal: {
        flex: 1,
        width: "100%",
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    dateTimeContainer: {
        width: "90%",
        alignSelf: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 5,
    },
    dateTimeHeader: {
        width: "100%", justifyContent: "center", marginTop: 14
    },
    dateTimeHeaderText: {
        color: "#fff", textAlign: "center", fontSize: 17
    },
    timeContainer: {
        flexDirection: "row", padding: 30, height: 150
    },
    timeHourView: {
        flex: 3,
        backgroundColor: "#595959",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-around",
    },
    timeArrow: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    timeText: {
        color: "#fff",
        fontSize: 18,
    },
    timeDevide: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
    },
    timePeriod: {
        flex: 2,
        backgroundColor: "#595959",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "space-around",
    },
    timePeriodDivide: {
        width: "33%",
        height: 1,
        backgroundColor: "#A4A4A4",
    },
    dateTimeButton: {
        width: "90%",
        height: 40,
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 4,
    },
    dateTimeText: {
        color: "#fff",
        textAlign: "center",
        fontSize: 17
    },
    salectChart: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 15
    },
    chartPicker: {
        flex: 5,
        backgroundColor: colors.grayLight,
        borderRadius: 4
    },
    selectpickerModal: {
        height: 40,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor: colors.grayLight,
        color: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        paddingLeft: 8
    },
    daily: {
        flex: 1,
        flexDirection: "column"
    },
    ViewDate: {
        flex: 1,
        flexDirection: "row",
        height: 40
    },
    textDate: {
        paddingTop: 10,
        color: colors.white,
        fontSize: 14,
        fontWeight: '500'
    },
    information: {
        flex: 9,
        flexDirection: "column",
        height: 290,
    },
    shareInformation: {
        flex: 4.75,
        flexDirection: "row",
    },
    headerInformation: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '500',
        textAlign: "center",
        padding: 12
    },
    numInformation: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        textAlign: "center",
        justifyContent:'center',
        marginRight: 8,
        maxWidth:'80%'
    },
    itemRevenue:{
        flexDirection:'row', alignItems:'center', alignSelf:'center'
    },
    dayInformation: {
        color: colors.colorLine,
        fontSize: 12,
        fontWeight: '500',
        textAlign: "center",
        paddingTop: 4
    },
    rowInformation: {
        flex: 4.75,
        backgroundColor: colors.grayLight,
        borderRadius: 4
    },
    iconInformation: {
        // marginLeft: 8,
        // paddingTop: 6
    },
    listPicker: {
        zIndex: 5,
        position: 'absolute',
        backgroundColor: colors.grayLight,
        borderRadius: 4,
        borderColor: colors.backgroundApp,
        paddingHorizontal: 7,
        paddingVertical: 5,
        height: 275,
        top: 60,
    },
    listPickerYear: {
        zIndex: 5,
        position: 'absolute',
        backgroundColor: colors.grayLight,
        borderRadius: 4,
        borderColor: colors.backgroundApp,
        paddingHorizontal: 7,
        paddingVertical: 5,
        height: 180,
        top: 45,
    },
    itemPicker: {
        height: 30,
        justifyContent: "center",
    },
    textItemPicker: {
        color: colors.colorText,
    },
})
