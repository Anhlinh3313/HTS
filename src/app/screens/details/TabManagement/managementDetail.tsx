import React, { useEffect, useState } from "react";
import {
    ScrollView,
    View,
    StyleSheet,
    Text,
    FlatList
} from "react-native";
import { colors } from "../../../utils/Colors";
import moment from "moment";
import { Icons } from "../../../assets";
import { Table, Row, Cell } from "react-native-table-component";
import { RouteProp } from "@react-navigation/native";
import { TabManageParamList } from "../../../types";
import SvgUri from "react-native-svg-uri";
import PickerModel from "../../../components/picker/PickerModel";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import { StatisticalHome } from "../../../models/statisticalHomeModel";
import { getRevenueAndTCPERHour, getRevenueBySubCategory } from "../../../netWorking/SpeedposService";
import { RevenueAndTCPERHour } from "../../../models/revenueAndTCPERHourModel";
import { Background } from "victory-native";
import MoneyText from "../../../components/Money";
import Loading from "../../../components/dialogs/Loading";

export interface Props {
    route: RouteProp<TabManageParamList, "ManagementDetail">;
}

export default function ManagementDetail(router: Props) {

    const [isLoading, setIsLoading] = useState(false);
    const toDate = new Date();
    const [fromDateTime, setFromDateTime] = useState(
        moment(new Date().setDate(toDate.getDate())).format("YYYY-MM-DD 00:00:00")
    );
    const [endDateTime, setEndDateTime] = useState(
        moment(new Date().setDate(toDate.getDate())).format("YYYY-MM-DD HH:mm:ss")
    );
    //StatisticalHome
    const tableStatisticalHome: StatisticalHome[] = [];
    const [dataStatisticalHome, setStatisticalHome] = useState(tableStatisticalHome);
    //Get Revenue And TCPE RHour
    const revenueAndTCPERHour: RevenueAndTCPERHour[] = [];
    const [dataRevenueAndTCPERHour, setRevenueAndTCPERHour] = useState(revenueAndTCPERHour);
    //check load default
    const [checkLoad, setCheckLoad] = useState(true);
    const stateTable = {
        tableHead: ['Journey', 'Time Area', 'Net Sale (VND)', 'TC', 'Average Check (VND)'],
        widthArr: [100, 120, 120, 120, 120,]
    }

    const loadIntData = async () => {
        setIsLoading(true)
        await loadDataManagementAwareness();
        await loadRevenueAndTCPERHour();
        setCheckLoad(false);
        setIsLoading(false)
    }


    const loadDataManagementAwareness = async () => {
        const res = await getRevenueBySubCategory(fromDateTime, endDateTime);
        if (res.isSuccess == 1) {
            setStatisticalHome(res.data);
        }
    }

    const loadRevenueAndTCPERHour = async () => {
        const resRevenueAndTCPERHour = await getRevenueAndTCPERHour(fromDateTime, endDateTime);
        if (resRevenueAndTCPERHour.isSuccess == 1) {
            setRevenueAndTCPERHour(resRevenueAndTCPERHour.data)
        }
    }

    useEffect(() => {
        if (checkLoad) {
            loadIntData();
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={[styles.textTime, { marginTop: 10 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ width: 20 }}>
                        <SvgUri
                            source={Icons.dateTime}
                        />
                    </View>
                    <View >
                        <Text style={[styles.text, { marginLeft: 8 }]} numberOfLines={1}>{moment(new Date()).format('DD/MM/YYYY HH:mm')}</Text>
                    </View>
                </View>
            </View>
            <PickerModel
                defaultValue="Ola Restaurant"
                onSelectedValue={value => {
                    
                }}
            ></PickerModel>
            <View style={styles.line}></View>

            {/* <ScrollView> */}
            <View style={{ flex: 1 }}>
                <FlatList
                    data={dataStatisticalHome}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <View>
                            <View key={index} style={styles.row}>
                                <View style={styles.rowItem}>
                                    <Text style={styles.text}>MANAGEMENT AWARENESS</Text>
                                </View>
                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Day</Text>
                                    <Text style={styles.text}>{item.dayName}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Date</Text>
                                    <Text style={styles.text}>{item.dayMonth}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>MGR INTITALS</Text>
                                    <Text style={styles.text}>{item.userName}</Text>
                                </View>

                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>BUDGET ED Daily Sales</Text>
                                    <MoneyText data={Math.round(item.budgetedDailySales)} style={styles.text} />
                                    {/* <Text style={styles.text}>{item.budgetedDailySales ? Money(item.budgetedDailySales) : 0}</Text> */}
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>BUDGET Accum Sales Pd</Text>
                                    {/* <Text style={styles.text}>{item.budgetedAccumSalessPD ? Money(item.budgetedAccumSalessPD) : 0}</Text> */}
                                    <MoneyText data={item.budgetedAccumSalessPD} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>ACTUALDAILY SALES (VND)</Text>
                                    {/* <Text style={styles.text}>{item.actualDailySales ? Money(item.actualDailySales) : 0}</Text> */}
                                    <MoneyText data={item.actualDailySales} style={styles.text} />
                                </View>
                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>FOC (VND)</Text>
                                    {/* <Text style={styles.text}>{item.lessMgntMeab ? Money(item.lessMgntMeab) : "---"}</Text> */}
                                    <MoneyText data={item.lessMgntMeab} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Less VAT 10%</Text>
                                    {/* <Text style={styles.text}>{item.lessVAT10 ? Money(item.lessVAT10) : 0}</Text> */}
                                    <MoneyText data={item.lessVAT10} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Less SC 5%</Text>
                                    {/* <Text style={styles.text}>{item.lessSC5 ? Money(item.lessSC5) : "---"}</Text> */}
                                    <MoneyText data={item.lessSC5} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Estimated Daily Sales</Text>
                                    {/* <Text style={[styles.text, { color: colors.mainColor }]}>{item.estimatedDailySales ? Money(item.estimatedDailySales) : 0}</Text> */}
                                    <MoneyText data={item.estimatedDailySales} style={[styles.text, { color: colors.mainColor }]} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>ESTIMATED Accum Sales...</Text>
                                    {/* <Text style={styles.text}>{item.estimatedAccumSalesPd ? Money(item.estimatedAccumSalesPd) : 0}</Text> */}
                                    <MoneyText data={item.estimatedAccumSalesPd} style={styles.text} />
                                </View>
                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>VARIANCE DAILY</Text>
                                    {/* <Text style={styles.text}>{item.variancedaily ? Money(item.variancedaily) : 0}</Text> */}
                                    <MoneyText data={item.variancedaily} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>VARIANCE ACCUMULATED</Text>
                                    {/* <Text style={styles.text}>{item.varianceAccumulated ? Money(item.varianceAccumulated) : 0}</Text> */}
                                    <MoneyText data={item.varianceAccumulated} style={styles.text} />
                                </View>
                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Customer Count</Text>
                                    <Text style={styles.text}>{item.customerCount}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Check Average</Text>
                                    {/* <Text style={styles.text}>{item.checkAverage ? Money(item.checkAverage) : 0}</Text> */}
                                    <MoneyText data={item.checkAverage} style={styles.text} />
                                </View>
                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Wastage VND</Text>
                                    <Text style={styles.text}>{item.wastageVND ? Money(item.wastageVND) : 'Not Available'}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Wastage %</Text>
                                    <Text style={styles.text}>{`${item.wastagePercent ? `${Money(item.wastagePercent)}%` : 'Not Available'}`}</Text>
                                </View>
                                <View style={{ borderBottomColor: colors.gray, borderBottomWidth: 1, marginTop: 15 }}></View>

                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Actual Store Working H...</Text>
                                    <Text style={styles.text}>{item.actualStoreWorkingHours ? Money(item.actualStoreWorkingHours) : 0}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Payroll (VND)</Text>
                                    {/* <Text style={styles.text}>{item.payrollVND ? Money(item.payrollVND) : 0}</Text> */}
                                    <MoneyText data={item.payrollVND} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>BUGETED Payroll %</Text>
                                    <Text style={styles.text}>{`${item.budgetPayrollPercent ? Money(item.budgetPayrollPercent) : 0}%`}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Payroll %</Text>
                                    <Text style={styles.text}>{`${item.payrollPercent ? Money(item.payrollPercent) : 0}%`}</Text>
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Actual SPMH</Text>
                                    {/* <Text style={styles.text}>{item.actualSPMH ? Money(item.actualSPMH) : 0}</Text> */}
                                    <MoneyText data={item.actualSPMH} style={styles.text} />
                                </View>
                                <View style={styles.rowItem}>
                                    <Text style={styles.textRowTitle}>Hours should have used</Text>
                                    <Text style={styles.text}>{item.hoursShouldHaveUsded ? Money(item.hoursShouldHaveUsded) : 0}</Text>
                                </View>
                                <View style={[styles.rowItem, { marginBottom: 15 }]}>
                                    <Text style={styles.textRowTitle}>Variance</Text>
                                    <Text style={styles.text}>{item.variance ? Money(item.variance) : 0}</Text>
                                </View>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.rowHeader}>
                                <Text style={styles.title}>REVENUE & TC PER HOURS</Text>
                            </View>
                            <View style={{ alignItems: 'center', paddingRight: 15, paddingLeft: 15, paddingBottom: 20, paddingTop: 20 }}>
                                <ScrollView horizontal={true} style={{ backgroundColor: '#17151C' }} >
                                    <View>
                                        <Table style={[styles.hedertable, { borderTopLeftRadius: 4, borderTopRightRadius: 4 }]}
                                            borderStyle={{ borderWidth: 1, borderColor: '#DADADA' }}>
                                            <Row data={stateTable.tableHead}
                                                widthArr={stateTable.widthArr}
                                                style={[styles.rowheaderTable]}
                                                textStyle={[styles.textRowTable]} />
                                        </Table>
                                        <Table>
                                            <Table>
                                                {
                                                    dataRevenueAndTCPERHour?.map((rowData, indexRevenueHour) => (
                                                        <View key={indexRevenueHour} style={[{ flexDirection: 'row', height: 50 }, indexRevenueHour % 2 == 0 ? { backgroundColor: '#8D7550' } : {}]}>
                                                            <Cell key={1}
                                                                data={rowData.journey ? rowData.journey : "---"}
                                                                style={{ width: stateTable.widthArr[0] }}
                                                                textStyle={styles.textRowTable} />
                                                            <Cell key={2}
                                                                data={rowData.timeArea ? rowData.timeArea : "---"}
                                                                style={{ width: stateTable.widthArr[1] }}
                                                                textStyle={styles.textRowTable} />
                                                            <Cell key={3}
                                                                data={rowData.netSales ? <MoneyText data={rowData.netSales} style={[styles.text,{textAlign:'center'}]} /> : "---"}
                                                                style={{ width: stateTable.widthArr[2] }}
                                                                textStyle={styles.textRowTable} />
                                                            <Cell key={4}
                                                                data={rowData.tc ? <MoneyText data={rowData.tc} style={[styles.text,{textAlign:'center'}]} /> : "---"}
                                                                style={{ width: stateTable.widthArr[3] }}
                                                                textStyle={styles.textRowTable} />
                                                            <Cell key={5}
                                                                data={rowData.averageCheck ? <MoneyText data={rowData.averageCheck} style={[styles.text,{textAlign:'center'}]} /> : "---"}
                                                                style={{ width: stateTable.widthArr[4] }}
                                                                textStyle={styles.textRowTable} />
                                                        </View>
                                                    ))
                                                }
                                            </Table>
                                        </Table>

                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    )}
                ></FlatList>
            </View>
            {/* </ScrollView> */}
            
      {isLoading && <Loading></Loading>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundApp,
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600'
    },
    textTime: {
        flexDirection: 'row',
        justifyContent: 'center',
        fontSize: 14,
        fontWeight: '500',
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.white
    },
    textRowTitle: {
        color: colors.gray,
        fontSize: 14,
        fontWeight: '500'
    },
    textRowTable: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    containerPicker: {
        marginTop: 17,
        backgroundColor: colors.backgroundApp,
        paddingBottom: 15
    },
    viewPicker: {
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 15,
        backgroundColor: colors.grayLight,
        borderRadius: 4
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
    iconDown: {
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 12,
        zIndex: 4
    },
    line: {
        height: 10,
        backgroundColor: colors.backgroundTab,
    },
    row: {
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
        paddingLeft: 15,
        paddingRight: 15,
    },
    rowHeader: {
        flex: 1,
        height: 44,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'center',
        borderBottomColor: colors.colorLine,
        borderBottomWidth: 0.5
    },
    rowItem: {
        flex: 1,
        height: 21,
        marginTop: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',

    },
    rowheaderTable: {
        height: 50,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        backgroundColor: '#878787',
    },
    rowTable: {
        height: 40,
        backgroundColor: '#414141'
    },
    hedertable: {
        marginTop: 15,
        backgroundColor: colors.backgroundLogin,
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
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
});
