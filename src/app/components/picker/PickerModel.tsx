import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    TouchableHighlight,
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback
} from "react-native";
import { Imodel } from "../../models/Imodel";
import { colors } from "../../utils/Colors";
import { Ionicons } from '@expo/vector-icons';
import { getAllSore } from "../../netWorking/storeService";
import { SystemService } from "../../netWorking/systemInfo";
import { _getUserId } from "../../netWorking/authService";
import { StoreModel } from "../../models/storeModel";

import { useDispatch } from "react-redux";
const PickerModel = ({
    data,
    defaultValue,
    onSelectedValue,
}: {
    data?: Imodel[],
    defaultValue?: string,
    onSelectedValue: (val: Imodel) => void;
}) => {
    const dispatch = useDispatch();
    const dimensions = Dimensions.get('window');
    const windowHeight = dimensions.height;
    const windowWidth = dimensions.width;
    const [modalVisible, setModalVisible] = useState(false);
    const [pickerValue, setPickerValue] = useState<any>(defaultValue);
    const handleConfirm = (value: Imodel) => {
        dispatch({ type: "PICK_WORKPLACE", payload: value });
        onSelectedValue(value);
        setPickerValue(value.label);
        setModalVisible(false)
    }
    let dataPicker: Imodel[] = [];
    const [dataModel, setDataModel] = useState(dataPicker);

    async function loadDataStore() {
        // const res = await getAllSore();
        // let dataStoreProduct = res.data as StoreModel[];
        const id= await _getUserId()
        const res= await SystemService.getWorkplaceByUserId(+id)
        if(res.isSuccess==1){
            let dataStoreProduct = res.data
            dataStoreProduct.map((map, index) => {
            dataPicker.push({ label: map.workplace, value: map.id });
        })
        }
        setDataModel(dataPicker)
        onSelectedValue(dataPicker[0]);
        setPickerValue(dataPicker[0]?.label??'');
        dispatch({ type: "PICK_WORKPLACE", payload: dataPicker[0] });
    }

    useEffect(() => {
        loadDataStore();
    }, [defaultValue])

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
                                <Text style={[styles.title, { color: colors.white, textAlign: 'center', fontWeight: 'bold' }]}>Choose Outlet</Text>
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

export default PickerModel;

const styles = StyleSheet.create({
    containerPicker: {
        marginTop: 10,
        backgroundColor: colors.backgroundApp,
        paddingBottom: 15
    },
    text: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 24
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
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    modalView: {
        backgroundColor: colors.grayLight,
        width: 380,
        height: 135,
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
});