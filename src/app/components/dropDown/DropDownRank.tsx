import React, { useEffect, useState } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Dimensions
} from "react-native";
import { ImodelDate } from "../../models/Imodel";
import { colors } from "../../utils/Colors";
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import { getMonday } from "../generalConvert/conVertMonDay";

const DropDownRank = ({
    dateFrom,
    defaultValue,
    onChangeDateTime,
}: {
    dateFrom?: string;
    defaultValue: string;
    onChangeDateTime: (values: ImodelDate) => void;
}) => {
    const dimensions = Dimensions.get('window');
    const windowHeight = dimensions.height;
    const windowWidth = dimensions.width;
    const [modalVisible, setModalVisible] = useState(false);
    let dataPicker: ImodelDate[] = [];
    let day = [
        { label: "Monday" },
        { label: "Tuesday" },
        { label: "Wednesday" },
        { label: "Thursday" },
        { label: "Friday" },
        { label: "Saturday" },
        { label: "Sunday" }
    ];
    const [dataModel, setDataModel] = useState(dataPicker);
    const [pickerValue, setPickerValue] = useState<any>(defaultValue);

    const handleConfirm = (value: ImodelDate) => {
        setPickerValue(value.label);
        setModalVisible(false);
        onChangeDateTime(value);
    }
    async function loadDataDateTime() {
        const date = new Date(moment(dateFrom).format("YYYY-MM-DD"));
        const monDateTime = new Date(moment(getMonday(date)).format("YYYY-MM-DD"));
        const dateDefault = new Date(moment(monDateTime.setDate(monDateTime.getDate() - 1)).format("YYYY-MM-DD"));
        // từ ngày bắt đầu cộng thêm 6 ngày, đúng 1 tuần
        day.map(map => {
            dataPicker.push({ label: map.label, value: moment(dateDefault.setDate(dateDefault.getDate() + 1)).format("YYYY-MM-DD") });
        })
        setDataModel(dataPicker);
    }

    useEffect(() => {
        setPickerValue(moment(dateFrom).format("dddd"))
        loadDataDateTime();
    }, [dateFrom])

    return (
        <View>
            <View style={styles.containerPicker}>
                <TouchableWithoutFeedback
                    onPress={
                        () => {
                            setModalVisible(true);
                        }
                    }
                >
                    <View style={styles.viewPicker}>
                        <View style={styles.pickerModal}>
                            <Text style={styles.text}>{pickerValue}</Text>
                        </View>
                        <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff"
                            onPress={() => {
                                setModalVisible(true);
                            }} />
                    </View>
                </TouchableWithoutFeedback>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <TouchableHighlight
                    style={{ borderRadius: 4, height: windowHeight }}
                    onPressIn={() => {
                        setModalVisible(false)
                    }}
                >
                    <View style={[styles.centeredView, { height: windowHeight, backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                        <View style={[styles.modalView, { width: windowWidth - 30 }]}>
                            <View style={{ marginTop: 10 }}>
                                <Text style={[styles.title, { color: colors.white, textAlign: 'center', fontWeight: 'bold' }]}>Choose Day</Text>
                            </View>
                            <ScrollView>
                                {
                                    dataModel.map((data, index) => (
                                        <View key={index}>
                                            <TouchableHighlight
                                                style={{ padding: 10 }}
                                                underlayColor={'rgba(0, 0, 0, 0.2)'}
                                                onPress={() => {
                                                    handleConfirm(data)
                                                }}
                                            >
                                                <Text style={[styles.textItem, { color: colors.white }]}>{data.label}</Text>
                                            </TouchableHighlight>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>
                </TouchableHighlight>
            </Modal>
        </View>
    );
}
export default DropDownRank;
const styles = StyleSheet.create({
    containerPicker: {
        marginTop: 10,
        backgroundColor: colors.backgroundApp,
        paddingBottom: 10
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
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24
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
    modalView: {
        backgroundColor: colors.grayLight,
        width: 380,
        height: 200,
        marginLeft: 15,
        marginRight: 15,
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
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.white
    },
    textItem: {
        color: colors.white,
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24
    },
})