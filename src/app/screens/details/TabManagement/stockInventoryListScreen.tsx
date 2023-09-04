import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableWithoutFeedback, Modal, TouchableHighlight, Dimensions, ScrollView, TouchableOpacity } from "react-native";
import PickerModel from "../../../components/picker/PickerModel";
import { colors } from "../../../utils/Colors";
import { Ionicons } from '@expo/vector-icons';
import SelectMultiple from 'react-native-select-multiple'
import { Icons } from "../../../assets";
import { Table, Row, Cell } from 'react-native-table-component';
import { TabManageParamList } from "../../../types";
import { IStockInventoryItem } from "../../../models/IstockInventoryItem";
import SvgUri from "react-native-svg-uri";
import { StackNavigationProp } from "@react-navigation/stack";
import { getAllCategory, getCategoryFast } from "../../../netWorking/categoryService";
import { CategoryModel, CategoryFastModel } from "../../../models/categoryModel";
import { getStockInventoryFast, getStockInventoryList } from "../../../netWorking/stockInventoryService";
import { StockInventoryListModel } from "../../../models/stockInventoryListModel";
import { RouteProp } from "@react-navigation/native";
import { Imodel, IModalPicker } from "../../../models/Imodel";
import { StockInventoryFastModel } from "../../../models/stockInventoryFastModel";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import Loading from "../../../components/dialogs/Loading";
import moment from "moment";

export interface Props {
    route: RouteProp<TabManageParamList, "StockInventoryListScreen">;
    navigation: StackNavigationProp<TabManageParamList>
}

export default function StockInventoryListScreen(props: Props) {
    const [isLoading, setIsLoading] = useState(false);

    const [outlet, setoutlet] = useState(1);
    const toDate = new Date();

    const onchangeOutlet = (data: any) => {
        setoutlet(data);
        loadStockInventoryList();
    }

    const categoryModel: IModalPicker[] = [
        { label: 'Select All', value: 0 },
    ]

    const [dataCategory, setDataCategory] = useState(categoryModel);
    const [checkLoadDataCategory, setLoadDataCategory] = useState(true);

    async function loadDataCategory() {
        setIsLoading(true)
        const res = await getCategoryFast();
        setIsLoading(false)
        if(res.isSuccess===1){
            let dataStoreProduct = res.data as CategoryFastModel[];
            dataStoreProduct.map(map => {
                categoryModel.push({ label: map.itemGroupName, value: map.itemGroupCode });
            })
            setDataCategory(categoryModel);
            setLoadDataCategory(false);
        }
        
    }
    const headerTitle = {
        tableHead: ['Noti', 'Stock Inventory', 'StockName', 'StockCode', 'Unit', 'Price/Unit', 'Supplier'],
        widthArr: [50, 100, 100, 100, 100, 100, 100]
    }

    const dimensions = Dimensions.get('window');
    const windowHeight = dimensions.height;
    const dataModel: IModalPicker[] = []
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
    const [categoryValue, setCategoryValue] = useState("Category");
    const [selectedCategory, setselectedCategoryValue] = useState(dataModel);

    const viewItem = (data: StockInventoryFastModel, index: Number) => (
        
        <TouchableOpacity
            onPress={() => {
                props.navigation.replace('StockInventoryScreen',
                    {
                        title: 'BACK OFFICE - STOCK INVENTORY',
                        product: {
                            itemCode: data.itemCode, itemName: data.itemName, category: data.category, quotationDate: data.quotationDate,
                            dateFrom: data.dateFrom, dateTo: data.dateTo, unit: data.unit, price: data.price, minPrice : data.minPrice,
                            maxPrice: data.maxPrice, checkNoti: data.checkNoti, supplier:data.supplier, checkPurchasecontract:data.checkPurchasecontract
                        },
                    }
                );
            }}>
            <View style={{ alignItems: 'center' }}>
                <SvgUri source={Icons.iconEye} />
            </View>
        </TouchableOpacity>
    );

    const notifyError = () => (
        <View style={{ alignItems: 'center' }}>
            <SvgUri source={Icons.iconNotifyError} />
        </View>
    );

    const listCategory = Array();
    const [dataListCategory, setListCategory] = useState(listCategory);
    const onSelectionsChange = (data: IModalPicker[], item: IModalPicker) => {
        let selectedAll = data.find(x => x.value == '0');
        if (selectedAll && item.value == '0') {
            setselectedCategoryValue(dataCategory);
            dataCategory.map(data => {
                listCategory.push(data.value)
            })
            setListCategory(listCategory)
        }
        else {
            setListCategory([]);
            setselectedCategoryValue(dataModel);
        }
        if (item.value != '0') {
            if (!selectedAll && data.length == dataCategory.length - 1) {
                setselectedCategoryValue(dataCategory);
                dataCategory.map(data => {
                    listCategory.push(data.value)
                })
                setListCategory(listCategory)
            }
            else {
                let indexAll = selectedCategory.findIndex(x => x.value == '0');
                if (indexAll >= 0) {
                    data.splice(indexAll, 1);
                }
                setselectedCategoryValue(data);
                data.map(x => {
                    listCategory.push(x.value)
                })
                setListCategory(listCategory)
            }
        }
        loadStockInventoryList();
    }

    const listData: StockInventoryFastModel[] = [];
    const [dataInventoryList, setInventoryList] = useState(listData);
    let dataList: StockInventoryFastModel[] = [];

    const loadStockInventoryList = async () => {
        const formatEndDateTime = moment(new Date(toDate)).format("YYYY-MM-DD");
        setInventoryList([]);
        setIsLoading(true)
        const res = await getStockInventoryFast("",formatEndDateTime, "");
        setIsLoading(false)
        dataList = [];
        if (res.isSuccess == 1) {
            dataList = res.data as StockInventoryFastModel[];
            dataList.map(map => {
                listData.push({
                    itemCode: map.itemCode, itemName: map.itemName, category: map.category, quotationDate: map.quotationDate,
                    dateFrom: map.dateFrom, dateTo: map.dateTo, unit: map.uom, price: map.price, minPrice : map.minPrice, 
                    maxPrice: map.maxPrice, checkNoti: map.checkNoti, supplier:map.supplierName, checkPurchasecontract:map.checkPurchasecontract
                });
            });
            setInventoryList(listData);
        }
    }

    useEffect(() => {
        if (checkLoadDataCategory) {
            loadDataCategory();
        }
    }, []);

    return (
        <View style={styles.container}>
            <PickerModel
                defaultValue="Ola Restaurant"
                onSelectedValue={value => {
                    onchangeOutlet(value.value);
                }}
            ></PickerModel>
            <View style={styles.line}></View>
            <View style={[styles.containerPicker, { paddingBottom: 10 }]}>
                <View style={styles.viewPicker}>
                    <TouchableWithoutFeedback
                        onPress={
                            () => {
                                setModalCategoryVisible(true);
                            }
                        }
                    >
                        <View style={styles.pickerModal}>
                            <Text style={styles.textItem}>{categoryValue}</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff"

                        onPress={() => {

                        }} />
                </View>
            </View>

            <View style={{ alignItems: 'center', marginTop: 15, paddingLeft: 15, paddingRight: 15 }}>
                <ScrollView >
                    <ScrollView horizontal={true}>
                        <Table>
                            <Row data={headerTitle.tableHead} widthArr={headerTitle.widthArr} style={styles.rowheaderTable} textStyle={styles.textRowHeader} />
                            {
                                dataInventoryList?.map((rowData, index) => (
                                    <View key={index} style={[{ flexDirection: 'row', height: 36 },
                                    index % 2 == 0 ? { backgroundColor: '#8D7550' } : { backgroundColor: '#414141' },
                                    index == (listData.length - 1) ? { borderBottomRightRadius: 4, borderBottomLeftRadius: 4 } : {}
                                    ]}>
                                        <Cell key={1}
                                            data={rowData.checkNoti? notifyError() : ''}
                                            style={{ width: headerTitle.widthArr[0] }}
                                            textStyle={styles.textRowTable} />
                                        <Cell key={2}
                                            data={viewItem(rowData, index)}
                                            style={{ width: headerTitle.widthArr[1] }}
                                            textStyle={styles.textRowTable} />
                                        <Cell key={3}
                                            data={rowData.itemName}
                                            style={{ width: headerTitle.widthArr[2] }}
                                            textStyle={styles.textRowTable}
                                            numberOfLines={2} />
                                        <Cell key={4}
                                            data={rowData.itemCode}
                                            style={{ width: headerTitle.widthArr[3] }}
                                            textStyle={styles.textRowTable} />
                                        <Cell key={5}
                                            data={rowData.unit}
                                            style={{ width: headerTitle.widthArr[4] }}
                                            textStyle={styles.textRowTable} />
                                        <Cell key={7}
                                            data={Money(rowData.price)}
                                            style={{ width: headerTitle.widthArr[5] }}
                                            textStyle={styles.textRowTable} />
                                        <Cell key={8}
                                            data={rowData.supplier}
                                            style={{ width: headerTitle.widthArr[6] }}
                                            textStyle={styles.textRowTable} />
                                    </View>
                                )
                                )
                            }
                        </Table>
                    </ScrollView>
                    <View style={{height:150}}></View>
                </ScrollView>

            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCategoryVisible}
                onRequestClose={() => {
                    setModalCategoryVisible(false);
                }}
            >
                <TouchableHighlight
                    style={{ borderRadius: 4, height: windowHeight }}
                    onPressIn={() => {
                        setModalCategoryVisible(false)
                    }}
                >
                    <View style={[styles.centeredView, styles.modelCategory, { justifyContent: 'flex-start', paddingTop: 200, height: windowHeight, }]}>
                        <View style={[styles.modalView, { height: 220, backgroundColor: "#414141", marginTop: 0, paddingTop: 5, paddingBottom: 5 }]}>
                            <View>
                                <SelectMultiple
                                    rowStyle={{ backgroundColor: colors.grayLight, borderBottomWidth: 0 }}
                                    labelStyle={{ color: colors.white }}
                                    checkboxStyle={{ tintColor: colors.white }}
                                    selectedCheckboxSource={Icons.iconChecked}
                                    items={dataCategory}
                                    selectedItems={selectedCategory}
                                    onSelectionsChange={onSelectionsChange} />
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </Modal>

            {isLoading && <Loading></Loading>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundApp
    },
    listItem: {
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: colors.backgroundApp
    },
    line: {
        height: 10,
        backgroundColor: colors.backgroundTab,
    },
    contenItem: {
        flex: 1,
        height: 90,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: colors.white,
        backgroundColor: colors.backgroundApp
    },
    imageItem: {
        width: 100,
    },
    TittleItem: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 12,
        paddingRight: 2
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.white
    },
    titleModal: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        alignItems: 'center',
        padding: 15
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600'
    },
    textItem: {
        color: colors.white,
        fontWeight: '500',
        fontSize: 16
    },
    containerPicker: {
        marginTop: 10,
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
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    modelCategory: {
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: colors.white,
        width: 380,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
        paddingBottom: 15,
        paddingTop: 15,
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }, textRowHeader: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 24,
        textAlign: 'center',
    },
    rowheaderTable: {
        height: 36,
        backgroundColor: '#878787',
        borderTopEndRadius: 4,
        borderTopStartRadius: 4
    },
    textRowTable: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
    },
});
