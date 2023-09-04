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
import ModalSendEmail from "../../../components/management/items/modalSendEmail";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import DropDownRank from "../../../components/dropDown/DropDownRank";
import { IRevenueSummary, IRevenue } from "../../../models/reportModel";
import { FilterViewModel } from "../../../models/filterViewModel";
import { ReportService } from "../../../netWorking/SpeedposService";
import { getMonday } from "../../../components/generalConvert/conVertMonDay";
import DialogAwait from "../../../components/dialogs/Loading";
import MoneyText from "../../../components/Money";
const revenueSummary = () => {
    const [isLoading, setIsLoading] = useState(false);

    const toDate = new Date();
    let endWeekDay = new Date().setDate(getMonday(toDate).getDate() + 6);
    if (getMonday(toDate).getMonth() < toDate.getMonth()) {
        //check ngày đầu tuần và ngày hiện tại khác tháng
        endWeekDay = new Date(new Date().setMonth(toDate.getMonth() - 1)).setDate(getMonday(toDate).getDate() + 6);
    }
    const [fromDateTime, setFromDateTime] = useState(
        moment(getMonday(toDate)).format("YYYY-MM-DD")
    );
    const [endDateTime, setEndDateTime] = useState(
        moment(endWeekDay).format("YYYY-MM-DD")
    );
    let model: FilterViewModel = {};
    const [checKLoadDefault, setChecKLoadDefault] = useState(true);
    const [modalSendMail, setModalSendMail] = useState(false);
    const [sentStatus, setSentStatus] = useState("");
    const [dataRevenueSummary, setDataRevenueSummary] = useState<IRevenueSummary>(null);
    const [dateSendMail, setDateSendMail] = useState(
        moment(getMonday(toDate)).format("YYYY-MM-DD")
    );

    const handleSendMail = () => {
        setModalSendMail(!modalSendMail);
        setSentStatus("success");
    };

    const loadDataRevenueSummary = async (dateTimeFrom, dateTimeTo, dateTime) => {
        setIsLoading(true);
        model.DateTime = dateTimeFrom;
        const res = await ReportService.getRevenueSummary(dateTimeFrom, dateTimeTo, dateTime);
        if (res.isSuccess == 1) {
            setDataRevenueSummary(res.data)
        }
        setIsLoading(false);
    }

    const OnchangeFromDateTime = (date: any) => {
        const dateTime = new Date(date);
        const fromDate = moment(getMonday(dateTime)).format("YYYY-MM-DD");
        const toDate = moment(dateTime.setDate(getMonday(dateTime).getDate() + 6)).format("YYYY-MM-DD");
        const toDateMonday = moment(getMonday(dateTime)).format("YYYY-MM-DD");
        setDateSendMail(fromDate);
        setFromDateTime(fromDate);
        setEndDateTime(toDate);
        loadDataRevenueSummary(fromDate, toDate, toDateMonday);
    }

    const onChangeDateTime = (item: any) => {
        const fromDate = moment(item).format("YYYY-MM-DD");
        loadDataRevenueSummary(fromDateTime, endDateTime, fromDate);
    }

    useEffect(() => {
        if (checKLoadDefault) {
            let fromDate = fromDateTime;
            let toDate = moment(fromDateTime).format("YYYY-MM-DD");
            loadDataRevenueSummary(fromDate, toDate, fromDateTime);
        }
    }, [])

    const checkValue = (value: any) => {
        if (value == "NaN" || value == undefined || value == 0 || value == null) {
            return 0
        }
        return value
    }
    const ViewDom = (data: IRevenue) => {
        return (
            <View>
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
                            textTransform: 'uppercase'
                        }}
                    >{data.workplaceName}</Text>
                </View>
                <View style={[styles.row, { marginBottom: 10 }]}>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>Estimated Daily Sales</Text>
                        {data.estimatedDailySales ? <MoneyText data={data.estimatedDailySales} style={styles.text} /> : <Text style={styles.text}>0</Text>}
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>Payroll hours</Text>
                        <Text style={styles.text}>{data.userWorkingHour ? Money(data.userWorkingHour) : 0}</Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>Payroll $</Text>
                        {data.payrollVND ? <MoneyText data={checkValue(data.payrollVND)} style={styles.text} /> : <Text style={styles.text}>0</Text>}
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>payroll %</Text>
                        <Text style={styles.text}>{data.payrollPercent ? Money(data.payrollPercent) : 0}</Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>Customer count</Text>
                        <Text style={styles.text}>{data.customercount ? Money(data.customercount) : 0}</Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>Check ave.</Text>
                        <Text style={styles.text}>{data.checkave ? Money(checkValue(data.checkave)) : 0}</Text>
                    </View>
                    <View style={styles.rowItem}>
                        <Text style={styles.textRowTitle}>SPMH</Text>
                        {data.spmh ? <MoneyText data={checkValue(data.spmh)} style={styles.text} /> : <Text style={styles.text}>0</Text>}
                    </View>
                </View>

                <View style={styles.line}></View>
            </View>
        )
    }
    const ViewTotal = (title = '', data = 0, style = {}, type = 'money') => {
        return (
            <>
                <View style={[styles.itemTotal, { backgroundColor: "#8D7550" }, style]}>
                    <Text style={{ fontWeight: "500", color: colors.colorText, textTransform: 'uppercase' }}>
                        {title}
                    </Text>
                    {type === 'money' ? <Text style={{ fontWeight: "600", color: colors.colorText }}>
                        {data ? <MoneyText data={data} style={styles.text} /> : 0}
                    </Text> : <Text style={{ fontWeight: "600", color: colors.colorText }}>
                        {data ? Money(checkValue(data)) : 0}
                    </Text>}


                </View><View style={styles.line}></View>
            </>
        )
    }
    return (
        <View style={styles.container}>
            <DateTimePicker
                onSubmitFromDate={date => OnchangeFromDateTime(date)}
                onSubmitEndDate={date => setEndDateTime(date)}
                isShowTime={false}
                checkkNotEndDate={false}
            ></DateTimePicker>
            <View style={styles.line}></View>
            <ScrollView>
                <View style={{ marginBottom: 2 }}>
                    <DropDownRank
                        defaultValue="Monday"
                        dateFrom={fromDateTime}
                        onChangeDateTime={value => {
                            onChangeDateTime(value?.value);
                        }}
                    ></DropDownRank>
                </View>
                {isLoading ? <DialogAwait></DialogAwait> :
                    <>
                        {dataRevenueSummary?.dataRevenue && dataRevenueSummary.dataRevenue.map((item, index) => {
                            return (<View key={index} >{ViewDom(item)}</View>)

                        })}
                        {ViewTotal('ESTIMATED DAILY SALES', checkValue(dataRevenueSummary?.totalEstimatedDailySales))}
                        {ViewTotal('PAYROLL HOURS', checkValue(dataRevenueSummary?.totalUserWorkingHour), {}, 'percent')}
                        {ViewTotal('PAYROLL $', checkValue(dataRevenueSummary?.totalPayrollVND))}
                        {ViewTotal('PAYROLL %', checkValue(dataRevenueSummary?.totalPayrollPercent), {}, 'percent')}
                        {ViewTotal('CUSTOMER COUNT', checkValue(dataRevenueSummary?.totalCustomercount), {}, 'percent')}
                        {ViewTotal('CHECK AVE.', checkValue(dataRevenueSummary?.totalCheckave))}
                        {ViewTotal('SPMH', checkValue(dataRevenueSummary?.totalSPMH))}
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
                            title={"RevenueSummary"}
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
                    </>
                }
            </ScrollView>
        </View>
    );
}

export default revenueSummary

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
    itemTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
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
