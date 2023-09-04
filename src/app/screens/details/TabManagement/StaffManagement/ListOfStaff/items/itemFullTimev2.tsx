import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, ToastAndroid, Platform, Alert, Switch } from "react-native";
import { CheckBox } from "react-native-elements";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import MultiSelect from "../../../../../../components/MultiSelect";
import Select from "../../../../../../components/select";
import { IPicker, IWorkingScheduleRequest } from "../../../../../../models/staffModel";
import Loading from "../../../../../../components/dialogs/Loading";
import TimePickerStaff from "../../../../../../components/TimePickerStaff";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/reducers";
import moment from "moment";
import { get12HourTime } from "../../../../../../components/generalConvert/conVertMonDay";
interface Props {
    isSaved: boolean;
    data: IWorkingScheduleRequest;
    index: number;
    onChangeTime: any;
    onChangeOT: any
}

const emptyPicker = {
    id: 0,
    code: "",
    name: "",
};
const itemStaffFullTime = (props: Props) => {
    const workingTimes = useSelector((state: RootState) => state.staff.workingTimes);
    const legends = useSelector((state: RootState) => state.staff.legends);

    const { isSaved, data, index, onChangeTime, onChangeOT } = props;
    const [isLoading, setIsLoading] = useState(false);

    const [isOT, setIsOT] = useState(false);
    const [visibleBookingTime, setVisibleBookingTime] = useState(false);
    const [selectedTime, setSelectedTime] = useState<number[]>([]); // ca chính
    const [selectedTimeSplit, setSelectedTimeSplit] = useState<number[]>([]); // ca gãy
    const [visibleBookingLegend, setVisibleBookingLegend] = useState(false);
    const [visibleStraightSplit, setVisibleStraightSplit] = useState(false);
    const [dataLegend, setDataLegend] = useState<IPicker[]>([]);
    const [valueCheckedLegend, setValueCheckedLegend] = useState<IPicker>(emptyPicker);
    const [valueRemark, setValueRemark] = useState("");
    const [timeModel, setTimeModel] = useState([]);

    const [valueTimeSelected, setValueTimeSelected] = useState([]);

    const onSelectionsChangeTime = (times: number[]) => {
        setVisibleBookingLegend(false)
        setValueCheckedLegend(emptyPicker);
        setValueRemark("");
        setSelectedTime(times);
    };
    const onSelectionsChangeTimeSplit = (times: number[]) => {
        setVisibleBookingLegend(false)
        setValueCheckedLegend(emptyPicker);
        setValueRemark("");
        setSelectedTimeSplit(times);

    };
    const onSelectionsChangeLegend = (data: IPicker) => {
        setSelectedTime([]);
        setSelectedTimeSplit([]);
        if (valueCheckedLegend.id === data.id) {
            setValueCheckedLegend(emptyPicker);
        } else setValueCheckedLegend(data);
    };
    const checkOT = () => {
        setIsOT(!isOT);
        if (!isOT) {
            setVisibleBookingTime(true);
        }
        if (isSaved && isOT) {
            setSelectedTime([]);
            onChangeOT(data.WorkingDate, {
                time: [],
                timeSplit: [],
                legend: valueCheckedLegend.id,
                remark: valueRemark,
                isOT,
            })
        }
    };
    useEffect(() => { // fill cái time đã có
        if (data.WorkingWeekTime !== null) {
            setSelectedTime(data.WorkingWeekTime[0].timeId);
            setSelectedTimeSplit(data.WorkingWeekTime[0].timeSplitId);
            if (data.WorkingWeekTime[0].timeSplitId.length > 0) {
                setVisibleStraightSplit(true)
            }
            setIsOT(!!data.WorkingWeekTime[0].OT);
        }
        if (data.LegendId !== null) {
            setValueCheckedLegend(legends.find(item => item.id == data.LegendId));
            if (data.Remark !== null) {
                setValueRemark(data.Remark);
                handleVisibleLegend()
            }
        }
    }, []);
    useEffect(() => { // init các legend
        if (legends.length > 0) {
            setDataLegend(legends);
        }
    }, [legends]);
    useEffect(() => {
        // let uniq = [...new Set([...selectedTime,...selectedTimeSplit])];
        onChangeTime(data.WorkingDate, {
            time: selectedTime,
            timeSplit: selectedTimeSplit,
            legend: valueCheckedLegend.id,
            remark: valueRemark,
            isOT,
        }, isSaved);
    }, [valueCheckedLegend, selectedTime, selectedTimeSplit, valueRemark, isOT]);
    useEffect(() => {
        if (workingTimes.length > 0) {
            let items = [];
            workingTimes.map(item => {
                if (isSaved && data.WorkingWeekTime !== null) {
                    if (!data.WorkingWeekTime[0].WorkingWeekTimeId.includes(item.id)) {
                        items.push({ label: item.timeRange, value: item.id });
                    }
                } else {
                    items.push({ label: item.timeRange, value: item.id });
                }
            });
            setTimeModel(items);
        }
    }, [workingTimes]);

    const handleTime = () => {
        let timesPick = [];
        let selected = [...selectedTime];
        let selectedSplit = [...selectedTimeSplit];
        if (selectedSplit.length == 0) {
            selected.sort(function (a, b) {
                return a - b;
            });
            selected.map(item => {
                timesPick.push(workingTimes.find(time => time.id === item));
            });
            let arr = [];
            let temp = 0;
            for (let i = 0; i < timesPick.length; i++) {
                if (selected[i] + 1 !== selected[i + 1]) {
                    arr.push(timesPick.slice(temp, i + 1));
                    temp = i + 1;
                }
                if (selected[i] === selected[selected.length - 1]) {
                    arr.push(timesPick.slice(temp, i));
                }
            }
            let result = [];
            arr.map(item => {
                if (item.length > 0) {
                    result.push({ from: item[0].timeRange.split(" ")[0], to: item[item.length - 1].timeRange.split(" ")[2] });
                }
            });
            setValueTimeSelected(result);
        } else {
            let result = []
            if (selectedTime.length > 0) {
                let from = workingTimes.find(item => item.id === selectedTime[0]).timeRange.slice(0, 5)
                let to = workingTimes.find(item => item.id === selectedTime[selectedTime.length - 1]).timeRange.slice(8, 13)
                result.push({ from: from, to: to })
            }
            if (selectedTimeSplit.length > 0) {
                let from2 = workingTimes.find(item => item.id === selectedTimeSplit[0]).timeRange.slice(0, 5)
                let to2 = workingTimes.find(item => item.id === selectedTimeSplit[selectedTimeSplit.length - 1]).timeRange.slice(8, 13)
                result.push({ from: from2, to: to2 })
            }

            setValueTimeSelected(result);
        }

    };

    useEffect(() => {
        handleTime();
    }, [selectedTime]);

    function notifyMessage(msg: string) {
        if (Platform.OS === "android") {
            ToastAndroid.show(msg, ToastAndroid.SHORT);
        } else {
            Alert.alert(msg)
            return;
        }
    }
    const handleVisibleLegend = () => {
        if (!visibleBookingLegend) {
            setVisibleStraightSplit(false)
            setVisibleBookingTime(false)
        }
        setVisibleBookingLegend(!visibleBookingLegend)
    }
    const handleVisibleBookingTime = () => {
        if (!visibleBookingTime) {
            setVisibleBookingLegend(false)
            setValueCheckedLegend(emptyPicker);
            setValueRemark("");
        }
        setVisibleBookingTime(!visibleBookingTime);
    }
    const handleVisibleStraightSplit = () => {
        if (selectedTime.length > 0) {
            setVisibleStraightSplit(!visibleStraightSplit)
        }
    }
    return (
        <View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: colors.colorText, marginRight: 10 }}>{moment(data.WorkingDate).format("dddd, DD MMMM yyyy")}</Text>
                <CheckBox
                    onPress={() =>
                        isSaved && data.LegendId !== null
                            ? notifyMessage("Legend has been selected, time cannot be changed at this time!")
                            : checkOT()
                    }
                    title="OT"
                    checked={isOT}
                    checkedColor={"#988050"}
                    uncheckedColor={colors.colorText}
                    containerStyle={{
                        backgroundColor: "transparent",
                        borderWidth: 0,
                    }}
                    textStyle={{ color: colors.colorText, fontWeight: "500" }}
                />
            </View>
            <View style={styles.containerSchedule}>
                <View style={[styles.itemSchedule, { marginBottom: 0 }]}>
                    <Text style={styles.textItemReport}>Time</Text>
                    <TouchableOpacity
                        onPress={() => {
                            isSaved && data.LegendId !== null
                                ? notifyMessage("Legend has been selected, time cannot be changed at this time!")
                                : handleVisibleBookingTime();
                        }}
                        style={{ position: "absolute", right: 0, top: 9 }}
                    >
                        <Ionicons name="caret-down" size={20} color={colors.colorLine} />
                    </TouchableOpacity>
                </View>

                {visibleBookingTime ? (
                    <View style={{}}>
                        <TimePickerStaff data={selectedTime} onChangeTime={(times) => onSelectionsChangeTime(times)}></TimePickerStaff>
                        {/* <MultiSelect items={timeModel} onChecked={items => onSelectionsChange(items)} value={selectedTime}></MultiSelect> */}
                    </View>
                ) : (
                    <View style={{ paddingBottom: 16 }}>
                        <View style={[styles.itemSchedule]}>
                            <Text style={styles.textInfoStaff}>Straight shift and Split shift</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    flex: 1,
                                }}
                            >
                                <Text style={[styles.textInfoStaff, { marginRight: 15 }]}>
                                    {valueTimeSelected.length > 0 ? get12HourTime(valueTimeSelected[0].from) : ""}
                                </Text>
                                <Text style={styles.textInfoStaff}>
                                    {valueTimeSelected.length > 0 ? get12HourTime(valueTimeSelected[0].to) : ""}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    flex: 1,
                                    justifyContent: "flex-end",
                                }}
                            >
                                <Text style={[styles.textInfoStaff, { marginRight: 15 }]}>
                                    {valueTimeSelected.length > 1 ? get12HourTime(valueTimeSelected[valueTimeSelected.length - 1].from) : ""}
                                </Text>
                                <Text style={styles.textInfoStaff}>
                                    {valueTimeSelected.length > 1 ? get12HourTime(valueTimeSelected[valueTimeSelected.length - 1].to) : ""}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>

            <View style={styles.containerSchedule}>
                <View style={styles.titleSwitchButton}>
                    <Text style={styles.titleYellow}>STRAIGHT SHIFT AND SPLIT SHIFT</Text>
                    <Switch
                        trackColor={{ false: "#303030", true: "#DAB451" }}
                        thumbColor={"#fff"}
                        onValueChange={() => handleVisibleStraightSplit()}
                        value={visibleStraightSplit}
                    />
                </View>

                {visibleStraightSplit ? (
                    <View style={[styles.containerPickContent,]}>
                        <TimePickerStaff data={selectedTimeSplit} onChangeTime={(times) => onSelectionsChangeTimeSplit(times)}></TimePickerStaff>
                    </View>
                ) : (
                    <View></View>
                )}
            </View>
            <View style={styles.containerSchedule}>
                {/* <View style={styles.itemSchedule}>
                <Text style={styles.textItemReport}>Legend</Text>
                <TouchableOpacity
                    onPress={() => {
                    isSaved ? notifyMessage("Legend cannot be changed at this time!") : setVisibleBookingLegend(!visibleBookingLegend);
                    }}
                    style={{ position: "absolute", right: 0, top: 9 }}
                >
                    <Ionicons name="caret-down" size={20} color={colors.colorLine} />
                </TouchableOpacity>
                </View> */}
                <View style={styles.titleSwitchButton}>
                    <Text style={styles.titleYellow}>LEGEND</Text>
                    <Switch
                        trackColor={{ false: "#303030", true: "#DAB451" }}
                        thumbColor={"#fff"}
                        onValueChange={() => handleVisibleLegend()}
                        value={visibleBookingLegend}
                    />
                </View>

                {visibleBookingLegend ? (
                    <View style={styles.containerPickContent}>
                        <ScrollView style={{ height: 128 }} persistentScrollbar={true} nestedScrollEnabled={true}>
                            {dataLegend.map((item, index) => {
                                return (
                                    <View key={index}>
                                        <Select
                                            item={item}
                                            isCheck={valueCheckedLegend.id === item.id}
                                            onChecked={value => onSelectionsChangeLegend(value)}
                                        ></Select>
                                    </View>
                                );
                            })}
                        </ScrollView>
                    </View>
                ) : (
                    <View>
                        {/* {valueCheckedLegend.id !== 0 && (
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginBottom: 7,
                                }}
                            >
                                <View style={styles.dot}></View>
                                <Text style={styles.textInfoStaff}>{`${valueCheckedLegend.code} - ${valueCheckedLegend.name}`}</Text>
                            </View>
                        )}

                        {valueRemark !== "" && (
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={styles.dot}></View>
                                <Text style={styles.textInfoStaff}>Remark: {valueRemark}</Text>
                            </View>
                        )} */}
                    </View>
                )}
            </View>
            {valueCheckedLegend.id !== 0 && visibleBookingLegend && (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Text style={[styles.textItemReport, { flex: 1 }]}>Remark</Text>
                    <TextInput
                        onChangeText={text => setValueRemark(text)}
                        value={valueRemark}
                        style={{
                            backgroundColor: colors.grayLight,
                            flex: 4,
                            height: 40,
                            borderRadius: 4,
                            paddingHorizontal: 10,
                            color: colors.colorText,
                        }}
                    ></TextInput>
                </View>
            )}

            <View style={{ backgroundColor: colors.backgroundTab, height: 10 }}></View>
            {isLoading && <Loading />}
        </View>
    );
};
export default itemStaffFullTime;

const styles = StyleSheet.create({
    titleSwitchButton: {
        flexDirection: 'row',
        paddingVertical: 6,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleYellow: {
        fontWeight: '500',
        fontSize: 14,
        color: colors.mainColor
    },
    containerPickContent: {

        borderTopWidth: 0.5,
        borderTopColor: colors.colorLine,
    },
    line: {
        height: 10,
        backgroundColor: colors.backgroundTab,
    },
    itemReport: {
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.colorLine,
    },
    textItemReport: {
        color: colors.colorText,
        fontSize: 14,
        fontWeight: "500",
    },
    textInfoStaff: {
        color: colors.colorText,
        fontSize: 14,
        fontWeight: "400",
    },
    itemInput: {
        height: 40,
        borderRadius: 4,
        backgroundColor: "#303030",
        paddingHorizontal: 11,
        color: colors.colorText,
    },
    buttonForm: {
        flex: 1,
        height: 36,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
    containerSchedule: {
        backgroundColor: colors.grayLight,
        borderRadius: 4,
        marginBottom: 10,
        paddingHorizontal: 15,
    },
    itemSchedule: {
        alignItems: "center",
        justifyContent: "center",
        height: 41,
        marginBottom: 15,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.colorLine,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 4,
        backgroundColor: colors.colorText,
        marginHorizontal: 9,
    },
});
