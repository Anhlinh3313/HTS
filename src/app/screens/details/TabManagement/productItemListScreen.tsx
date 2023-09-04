import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableHighlight,
    Modal,
    FlatList,
    Dimensions,
    TouchableNativeFeedback,
    Keyboard,
    TextInput,
} from "react-native";
import { colors } from "../../../utils/Colors";
import { Ionicons } from '@expo/vector-icons';
import SelectMultiple from 'react-native-select-multiple'
import {
    Table,
    Row,
    TableWrapper,
    Cell
} from 'react-native-table-component';
import SvgUri from "react-native-svg-uri";
import {
    Icons,
    Images
} from "../../../assets";
import { TabManageParamList } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import PickerModel from "../../../components/picker/PickerModel";
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
    CategoryService,
    getAllCategory,
    updateCategory
} from "../../../netWorking/categoryService";
import { Imodel } from "../../../models/Imodel";
import { IModal } from "../../../models/Imodal";
import { ICategoryModel } from "../../../models/IcategoryModel";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import { IProductModel } from "../../../models/IproductModel";
import {
    ProductService
} from "../../../netWorking/productService";
import DialogAwait from "../../../components/dialogs/dialogAwait";
import DropDown from "../../../components/dropDown/DropDown";
import { CategoryModel } from "../../../models/categoryModel";
import { DataTable } from 'react-native-paper'
import ModalDropdown from "react-native-modal-dropdown";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Loading from "../../../components/dialogs/Loading";

export interface Props {
    route: RouteProp<TabManageParamList, "ProductItemListScreen">;
    navigation: StackNavigationProp<TabManageParamList>
}

export default function ProductItemListScreen(props: Props) {
    const dataModel: Imodel[] = [];
    const modalNull: IModal = { isShow: false, title: '', isEdit: false };
    const dimensions = Dimensions.get('window');
    const windowHeight = dimensions.height;
    const windowWidth = dimensions.width;
    const headerTitle = {
        tableHead: [' ', 'Product Name', 'Product Num', 'RefCode', 'Sales Price', 'Food Cost (VND)', 'Food Cost (%)', 'Recipe Management'],
        widthArr: [40, 150, 150, 150, 150, 150, 150, 150]
    }
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const dataPageSize = ["10", "20", "50", "100"];
    const [dataCount, setDataCount] = useState(0);
    const [page, setPage] = useState(0);
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    const [categoryModel, setCategoryModel] = useState<Imodel[]>([]);
    const [outLetId, setOutLetId] = useState<any>();
    const [listCategory, setListCategory] = useState<ICategoryModel[]>([]);
    const [isSubmit, setIssubmit] = useState(false);

    const iProductModel: IProductModel[] = [];
    const [listProductItem, setListProductItem] = useState(iProductModel)
    const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
    const [modalCategory, setModalCategory] = useState(modalNull);
    const [modalItem, setModalItem] = useState(modalNull);
    const [productModel, setproductModel] = useState<IProductModel>();
    const [categorySelectedLabel, setCategorySelectedLabel] = useState<string>();
    const [selectedCategory, setselectedCategoryValue] = useState(dataModel);
    const [modalTypeCreate, setModalTypeCreate] = useState(false);
    const [categoryName, setCategoryName] = useState('');
    let model: ICategoryModel = {};
    let modelProductItem: IProductModel = {};
    //
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    //
    const listValueCategory = Array();
    const [dataListValueCategory, setListValueCategory] = useState(listValueCategory);
    //
    const [checkLoadDefault, setCheckLoadDefault] = useState(true);

    const getDataCategory = async () => {
        setIssubmit(true);
        const res = await CategoryService.getAllCategory();
        setIssubmit(false);
        if (res) {
            setListCategory(res);
            let dataModel: Imodel[] = [];
            dataModel.push({ label: 'Select All', value: 0 },)
            res.map(map => {
                dataModel.push({ label: map.reportName, value: map.reportNo });
            })
            setCategoryModel(dataModel);
            setselectedCategoryValue(dataModel)
            setCategorySelectedLabel("All");
        }
    }

    const getDataProduct = async (pageNumber: number = 1, pageSize: number = 10) => {
        
        let categoryIds = [];
        selectedCategory.map(map => {
            categoryIds.push(map.value);
        })
        setIssubmit(true);
        let model: any = {
            "ListReportNo": categoryIds.toString(),
            "PageNum": pageNumber,
            "PageSize": pageSize
        }
        const res = await ProductService.getProductItemList(model);
        setIssubmit(false);
        if (res) {
            if (res.length !== 0) {
                setDataCount(res[0].totalCount);
            }else setDataCount(0);
            setListProductItem(res)
        }
        setCheckLoadDefault(false);
    }

    const createCategory = async () => {
        model.storeId = outLetId;
        model.name = categoryName;
        setIssubmit(true);
        const res = await CategoryService.cteateCategory(model);
        if (res) {
            getDataCategory();
            setCategoryName('');
            alert('Add Category Successful');
        }
        setIssubmit(false);
    }

    const updateCategoryProductItemList = async () => {
        setIssubmit(true);
        await selectedCategory.map(async (map) => {
            const categoryName = map.label;
            const categoryId = map.value;
            const res = await updateCategory(categoryId, categoryName);
            if (res.isSuccess == 1) {
                setListValueCategory(null);
            }
        })
        await getDataCategory();
        await resetCategory();
        alert('Update Category Successful');
        setIssubmit(false);
    }
    const resetCategory = async () => {
        setCategorySelectedLabel("Choose Category");
        setselectedCategoryValue(dataModel);
        getDataProduct();

    }

    const createProducItem = async () => {
        setIssubmit(true);
        if (productModel) {
            productModel.prodNum = 2313;
            productModel.foodCost = 300000;
            setproductModel(productModel);
            const res = await ProductService.create(productModel);
            if (res) {
                setproductModel(modelProductItem);
                setModalItem({ isShow: false });
                alert('Add Produc Item Successful');
                getDataProduct();
            }
        }
        setIssubmit(false);
    }

    const updateProducItem = async () => {
        setIssubmit(true);
        if (productModel) {
            const res = await ProductService.update(productModel);
            if (res) {
                setproductModel(modelProductItem);
                setModalItem({ isShow: false });
                alert('Update Produc Item Successful');
                getDataProduct();
            }
        }
        setIssubmit(false);
    }
    // onchange select category
    const onSelectionsChange = async (data: Imodel[], item: Imodel) => {
        let selectedAll = data.find(x => x.value == 0);
        if (selectedAll && item.value == 0) {
            setselectedCategoryValue(categoryModel);
            setCategorySelectedLabel("All");
            categoryModel.map(data => {
                listValueCategory.push(data.value)
            })
            setListValueCategory(listValueCategory)
        }
        else {
            setListValueCategory([])
            setselectedCategoryValue(dataModel);
            setCategorySelectedLabel("Choose Category");
        }
        if (item.value != 0) {
            Promise.all(data).then(res => {
                if (!selectedAll && data.length == categoryModel.length - 1) {
                    setselectedCategoryValue(categoryModel);
                    categoryModel.map(data => {
                        listValueCategory.push(data.value);
                    })
                    setListValueCategory(listValueCategory);
                }
                else {
                    let indexAll = selectedCategory.findIndex(x => x.value == 0);
                    if (indexAll >= 0) {
                        data.splice(indexAll, 1);
                    }
                    setselectedCategoryValue(data);
                    data.map(x => {
                        listValueCategory.push(x.value);
                    })
                    setListValueCategory(listValueCategory)
                }
                let labelSeleted = "";
                res.map((map, index) => {
                    if (map.value != 0)
                        labelSeleted += index != (data.length - 1) ? `${map.label},` : `${map.label}`;
                })
                setCategorySelectedLabel(labelSeleted);
            });
        }
    }
    // load data setModalCategory
    const onchangeModalCategory = (isShow: any, title: any, isEdit: any) => {
        setModalCategory({ isShow: isShow, title: title, isEdit: isEdit });
    }

    useEffect(() => {
        if (checkLoadDefault) {
            getDataCategory();
            getDataProduct();
        }
    }, [])
    const buttonEdit = (data: IProductModel) => (
        <TouchableOpacity
            onPress={() => {
                setModalItem({ isShow: true, title: 'Change Item', isEdit: true })
                setproductModel(data);
            }}>
            <View style={{ alignItems: 'center' }}>
                <SvgUri source={Icons.iconEdit} />
            </View>
        </TouchableOpacity>
    );
    const viewItem = (data: IProductModel) => (
        <TouchableOpacity
            onPress={() => {
                if (props.route.params.callBackRecipe) {
                    props.route.params.callBackRecipe(data)
                    props.navigation.goBack();
                }
                else {
                    props.navigation.navigate("RecipeManagementScreen", {
                        title: "BACK OFFICE - RECIPE MANAGEMENT",
                        product: data,
                    })
                }
            }}>
            <View style={{ alignItems: 'center' }}>
                <SvgUri source={Icons.iconEye} />
            </View>
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
            <PickerModel
                defaultValue="Outlet"
                onSelectedValue={data => {
                    setOutLetId(data.value);
                }}
            ></PickerModel>
            <View style={styles.line}></View>
            <View style={{ flexDirection: 'row', zIndex: 8 }}>
                <View style={[styles.containerPicker, { paddingBottom: 0, flex: 6 }]}>
                    <TouchableWithoutFeedback
                        onPress={
                            () => {
                                setModalCategoryVisible(true);
                            }
                        }
                    >
                        <View style={styles.viewPicker}>
                            <View style={styles.pickerModal}>
                                <Text numberOfLines={1} style={[styles.title,{width:'85%'}]}>{categorySelectedLabel ?? 'Choose Category'}</Text>
                            </View>
                            <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff"

                                onPress={() => {
                                    setModalCategoryVisible(true);
                                }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    {/* ẩn theo yêu cầu của BA(http://redmine.rnt.vn/issues/7733) */}
                    {/* <TouchableOpacity
                        onPress={() => {
                            // edit category
                            if (selectedCategory.length > 0) {
                                onchangeModalCategory(true, 'Change Category', true);
                            }
                            else {
                                alert("Please choose Category!")
                            }
                        }}
                    >
                        <SvgUri height="28" width="28" source={Icons.iconEditMedium} />
                    </TouchableOpacity> */}
                </View>
                <View style={{ flex: 1, justifyContent: 'center', paddingTop: 5 }}>
                    {/* ẩn theo yêu cầu của BA(http://redmine.rnt.vn/issues/7733) */}
                    {/* <TouchableOpacity
                    onPress={() => { setModalTypeCreate(!modalTypeCreate) }}
                    >
                        <SvgUri source={Icons.iconAdd} />
                    </TouchableOpacity> */}
                </View>
                {modalTypeCreate &&
                    <View style={{ backgroundColor: '#414141', borderRadius: 4, padding: 18, position: 'absolute', zIndex: 9, right: 23, top: 58 }}>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalCategory({ isShow: true, title: 'Create Category', isEdit: false });
                                    setModalTypeCreate(!modalTypeCreate)
                                }}
                                style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <SvgUri source={Icons.iconCirclePlus}></SvgUri>
                                <Text style={[styles.textRowTable, { marginLeft: 10 }]}>Create category</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setModalItem({ isShow: true, title: 'Create New Item', isEdit: false });
                                    setproductModel(modelProductItem);
                                    setModalTypeCreate(!modalTypeCreate)
                                }}
                                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                                <SvgUri source={Icons.iconCirclePlus}></SvgUri>
                                <Text style={[styles.textRowTable, { marginLeft: 10 }]}>Create new item</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
            <ScrollView horizontal={true} style={{ borderTopRightRadius: 4 }}>
                <View style={{ marginBottom: 60 }}>
                    <View style={styles.tableProduct}>
                        <View>
                            <Table>
                                <ScrollView>
                                    <Row data={headerTitle.tableHead} widthArr={headerTitle.widthArr} style={styles.rowheaderTable} textStyle={styles.textRowHeader} />
                                    {
                                        listProductItem.map((rowData, index) => (
                                            <View key={index} style={[{ flexDirection: 'row', height: 36 }, index % 2 == 0 ? { backgroundColor: '#8D7550' } : {}]}>
                                                <Cell key={1}
                                                    // ẩn theo yêu cầu của BA(http://redmine.rnt.vn/issues/7733)
                                                    // data={buttonEdit(rowData)}
                                                    style={{ width: headerTitle.widthArr[0] }}
                                                    textStyle={styles.textRowTable} />

                                                <Cell key={2}
                                                    data={rowData.prodName}
                                                    style={{ width: headerTitle.widthArr[1] }}
                                                    textStyle={styles.textRowTable} />

                                                <Cell key={3}
                                                    data={rowData.prodNum}
                                                    style={{ width: headerTitle.widthArr[1] }}
                                                    textStyle={styles.textRowTable} />

                                                <Cell key={4}
                                                    data={rowData.refCost}
                                                    style={{ width: headerTitle.widthArr[2] }}
                                                    textStyle={styles.textRowTable} />
                                                <Cell key={5}
                                                    data={rowData.priceA ? Money(rowData.priceA) : 0}
                                                    style={{ width: headerTitle.widthArr[3] }}
                                                    textStyle={styles.textRowTable} />
                                                <Cell key={6}
                                                    data={rowData.foodPrice ? Money(rowData.foodPrice) : 0}
                                                    style={{ width: headerTitle.widthArr[1] }}
                                                    textStyle={styles.textRowTable} />

                                                <Cell key={7}
                                                    data={rowData.foodPrice && rowData.priceA ? Math.round(rowData.foodPrice * 100 / rowData.priceA): 0}
                                                    style={{ width: headerTitle.widthArr[2] }}
                                                    textStyle={styles.textRowTable} />
                                                <Cell key={8}
                                                    data={viewItem(rowData)}
                                                    style={{ width: headerTitle.widthArr[3] }}
                                                    textStyle={styles.textRowTable} />

                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            </Table>
                        </View>
                    </View>
                    <View style={styles.rowFooterTable}>
                        <View style={{ justifyContent: 'center' }}>
                            <Text style={{ fontSize: 12, color: colors.black05 }}>Rows:</Text>
                        </View>
                        <View style={{ justifyContent: 'center', marginLeft: 15 }}>

                            <ModalDropdown
                                defaultValue={"10"}
                                dropdownStyle={{
                                    backgroundColor: "#303030",
                                    borderWidth: 0,
                                    width: 50,
                                    height: 100,
                                    borderRadius: 4,

                                }}
                                textStyle={[{ fontSize: 14, color: colors.black, width: 40, }]}
                                dropdownTextStyle={{
                                    color: colors.gray,
                                    backgroundColor: "#303030",
                                    fontSize: 12,
                                }}

                                dropdownTextHighlightStyle={{ color: colors.white }}
                                showsVerticalScrollIndicator={true}
                                options={dataPageSize}
                                renderRightComponent={() => (
                                    <Ionicons name="chevron-down" size={20} color={colors.black} />
                                )}
                                onSelect={(index, value) => {
                                    setPage(1);
                                    setItemsPerPage(value);
                                    getDataProduct(1, value);

                                }}
                            />
                        </View>
                        <View>
                            <DataTable.Pagination
                                page={page}
                                style={{ justifyContent: 'flex-start' }}
                                numberOfPages={Math.floor(dataCount / itemsPerPage) + 1}
                                showFastPaginationControls
                                onPageChange={page => {
                                    setPage(page)
                                    getDataProduct(page + 1, itemsPerPage)

                                }}
                                label={dataCount > 0 ? `${from + 1}-${to} of ${dataCount}` : ''}
                            />
                        </View>

                    </View>
                </View>
            </ScrollView>

            {/* List Category */}
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
                        setModalCategoryVisible(false);
                        getDataProduct();
                    }}
                >
                    <View style={[styles.centeredView, styles.modelCategory, { height: windowHeight, }]}>
                        <View style={[styles.modalView, { backgroundColor: "#414141", marginTop: 0, paddingBottom: 5 }]}>
                            <View>
                                <SelectMultiple
                                    style={{ borderRadius: 4 }}
                                    rowStyle={{ backgroundColor: colors.grayLight, borderBottomWidth: 0, }}
                                    labelStyle={{ color: colors.white, fontSize: 16 }}
                                    checkboxStyle={{ tintColor: colors.white }}
                                    selectedCheckboxStyle={{ tintColor: colors.white }}
                                    selectedCheckboxSource={Icons.iconChecked}
                                    items={categoryModel}
                                    selectedItems={selectedCategory}
                                    onSelectionsChange={onSelectionsChange} />
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
            </Modal>

            {/* Form edit Category */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalCategory.isShow}
            >
                <View style={[styles.centeredView, styles.modelCategory, { justifyContent: 'flex-start', paddingTop: 200, height: windowHeight, }]}>
                    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                        <View style={[styles.modalForm, { backgroundColor: "#414141", paddingLeft: 15, paddingRight: 15 }]}>
                            <ScrollView>
                                <View style={styles.titleModal}>
                                    <Text style={[styles.title, { color: colors.mainColor }]}>{modalCategory.title}</Text>
                                </View>
                                {modalCategory.isEdit == false ?
                                    <View style={{ paddingTop: 15 }}>
                                        <Text style={{ fontSize: 12, color: colors.gray, fontWeight: '600' }}>Category</Text>
                                        <TextInput placeholder="Description"
                                            placeholderTextColor={colors.gray}
                                            style={styles.textInput}
                                            onChangeText={(text) => setCategoryName(text)}
                                            value={categoryName} />
                                    </View>
                                    :
                                    <View style={{ paddingTop: 15 }}>
                                        {selectedCategory.map((map, index) => (
                                            <View key={index}>
                                                <Text style={{ fontSize: 12, color: colors.gray, fontWeight: '600' }}>Category</Text>
                                                <TextInput placeholder="Description"
                                                    placeholderTextColor={colors.gray}
                                                    style={styles.textInput}
                                                    onChangeText={(text) => {
                                                        map.label = text;
                                                        setselectedCategoryValue([...selectedCategory])
                                                    }}
                                                    value={map.label} />
                                            </View>
                                        ))}
                                    </View>
                                }
                                <View style={{ marginTop: 20, marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.rowButton}>
                                        <TouchableHighlight
                                            style={{ borderRadius: 4 }}
                                            underlayColor={colors.yellowishbrown}
                                            onPress={() => {
                                                setModalCategory({ isShow: false });
                                            }}
                                        >
                                            <View style={styles.buttonClose}>
                                                <Text style={styles.text}>Close</Text>
                                            </View>
                                        </TouchableHighlight>
                                        <TouchableHighlight
                                            style={{ borderRadius: 4 }}
                                            underlayColor={colors.yellowishbrown}
                                            onPress={() => {
                                                if (modalCategory.isEdit) {
                                                    updateCategoryProductItemList();
                                                }
                                                else {
                                                    createCategory();
                                                }
                                                setModalCategory({ isShow: false });
                                            }
                                            }
                                        >
                                            <View style={styles.buttonSend}>
                                                <Text style={styles.text}>Confirm</Text>
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modal>

            {/* Form ProducItem */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalItem.isShow}
            >
                <View style={[styles.centeredView, { justifyContent: 'flex-start', height: windowHeight, }]}>
                    <View style={[styles.modalForm, { marginTop: 115, backgroundColor: "#414141", justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15 }]}>
                        <ScrollView>
                            <View>
                                <View style={styles.titleModal}>
                                    <Text style={[styles.title, { color: colors.mainColor }]}>{modalItem.title}</Text>
                                </View>

                                <View>
                                    <View style={{ marginTop: 10, zIndex: 10 }}>
                                        <View>
                                            <Text style={styles.titleInput}>Category</Text>
                                        </View>
                                        <DropDown
                                            data={categoryModel}
                                            defaultLabel={productModel?.categoryName}
                                            onSelected={(data) => {
                                                if (productModel) {
                                                    productModel.reportNo = Number(data.value)
                                                }
                                            }}
                                        ></DropDown>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View>
                                            <Text style={styles.titleInput}>Name</Text>
                                        </View>
                                        <View>
                                            <TextInput placeholder="Description"
                                                placeholderTextColor={colors.gray}
                                                style={styles.textInput}
                                                onChangeText={(text) => setproductModel({
                                                    ...productModel,
                                                    prodName: text
                                                })}
                                                value={productModel?.prodName} />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View>
                                            <Text style={styles.titleInput}>Number</Text>
                                        </View>
                                        <View>
                                            <TextInput placeholder="Updated on POS automatically"
                                                editable={modalItem.isEdit}
                                                keyboardType="numeric"
                                                placeholderTextColor={colors.gray}
                                                style={[styles.textInput, !modalItem.isEdit && { backgroundColor: '#8C8C8C' }]}
                                                onChangeText={(text) => {
                                                    if (productModel)
                                                        productModel.prodNum = new Number(text);
                                                }}
                                                value={productModel?.prodNum?.toString()} />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View>
                                            <Text style={styles.titleInput}>RefCode</Text>
                                        </View>
                                        <View>
                                            <TextInput placeholder="Number"
                                                placeholderTextColor={colors.gray}
                                                style={styles.textInput}
                                                onChangeText={(text) => {
                                                    if (productModel)
                                                        productModel.refCost = text
                                                }}

                                                value={productModel?.refCost} />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View>
                                            <Text style={styles.titleInput}>Sales Price</Text>
                                        </View>
                                        <View>
                                            <TextInput placeholder="Number"
                                                keyboardType="numeric"
                                                placeholderTextColor={colors.gray}
                                                style={styles.textInput}
                                                onChangeText={(text) => {
                                                    if (productModel)
                                                        productModel.priceA = Number(text)
                                                }}
                                                value={Money(productModel?.priceA?.toString())} />
                                        </View>
                                    </View>

                                    <View style={{ marginTop: 10 }}>
                                        <View>
                                            <Text style={styles.titleInput}>Food Cost (Performance in FAST and POS)</Text>
                                        </View>
                                        <View>
                                            <TextInput placeholder="API Fast"
                                                placeholderTextColor={colors.gray}
                                                editable={modalItem.isEdit}
                                                style={[styles.textInput, !modalItem.isEdit && { backgroundColor: '#8C8C8C' }]}
                                                onChangeText={(text) => {
                                                    if (productModel)
                                                        productModel.foodCost = new Number(text)
                                                }}
                                                value={productModel?.foodCost?.toString()} />
                                        </View>
                                    </View>
                                    {
                                        modalItem.isEdit ?
                                            <View style={{ marginTop: 10 }}>
                                                <View>
                                                    <Text style={styles.titleInput}>Reason For change</Text>
                                                </View>
                                                <View>
                                                    <TextInput placeholder="Reason"
                                                        placeholderTextColor={colors.gray}
                                                        style={styles.textInput}
                                                        onChangeText={(text) => {
                                                            if (productModel)
                                                                productModel.reason = text;
                                                        }}
                                                        value={productModel?.reason} />
                                                </View>
                                            </View>
                                            :
                                            <View></View>
                                    }
                                </View>
                            </View>
                            <View style={{ marginTop: 20, marginBottom: 0, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.rowButton}>
                                    <TouchableHighlight
                                        style={{ borderRadius: 4 }}
                                        underlayColor={colors.yellowishbrown}
                                        onPress={() => {
                                            setproductModel(modelProductItem);
                                            setModalItem({ isShow: false });
                                        }}
                                    >
                                        <View style={styles.buttonClose}>
                                            <Text style={styles.text}>Close</Text>
                                        </View>
                                    </TouchableHighlight>
                                    <TouchableHighlight
                                        style={{ borderRadius: 4 }}
                                        underlayColor={colors.yellowishbrown}
                                        onPress={() => {
                                            if (!modalItem.isEdit) {

                                                createProducItem();
                                            }
                                            else {
                                                updateProducItem();
                                            }
                                        }}
                                    >
                                        <View style={styles.buttonSend}>
                                            <Text style={styles.text}>Confirm</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal >
            {/* <DialogAwait
                isShow={isSubmit}
            ></DialogAwait> */}
            {isSubmit&&<Loading></Loading>}
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundApp
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 24,
        color: colors.white
    },
    titleInput: {
        fontSize: 12,
        color: colors.gray,
        fontWeight: '600'
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600'
    },
    textItem: {
        color: colors.white, fontWeight: '500', fontSize: 16
    },

    textInput: {
        marginTop: 5,
        fontSize: 14,
        paddingLeft: 11,
        height: 40,
        borderRadius: 4,
        backgroundColor: '#303030',
        color: colors.white,
        // fontStyle: 'italic'
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
    viewPickCategory: {
        marginTop: 5,
        backgroundColor: '#303030',
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

    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modelCategory: {
        zIndex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
        paddingTop: 190,
    },
    modalView: {
        backgroundColor: colors.white,
        width: 360,
        maxHeight: 230,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
        paddingBottom: 15,
        paddingTop: 5,
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
    modalForm: {
        width: 360,
        marginBottom: 95,
        backgroundColor: "#414141",
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
    checkbox: {
        alignSelf: "center",
    },

    tableProduct: {
        // maxHeight: 400,
        // marginBottom: 200,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
        backgroundColor: colors.grayLight
    },
    hedertable: {
        marginTop: 15,
        backgroundColor: colors.backgroundLogin,
    },
    rowTable: {
        flexDirection: 'row',
        height: 36,
    },
    textRowTable: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '400',
        textAlign: 'center',
    },
    textRowHeader: {
        color: '#DFDFDF',
        fontSize: 12,
        fontWeight: '400',
        lineHeight: 18,
        textAlign: 'center',
    },
    rowheaderTable: {
        height: 36,
        backgroundColor: '#878787',
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    rowPagginTable: {
        backgroundColor: '#878787',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },
    rowFooterTable: {
        backgroundColor: '#878787',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderTopWidth: 1,
        borderBottomColor: colors.black05,
        marginHorizontal: 15,
        flexDirection: 'row',
        paddingHorizontal: 15
    },
    buttonCreate: {
        height: 36,
        width: 150,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor: colors.mainColor
    },
    titleModal: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        alignItems: 'center',
        padding: 15
    },
    rowButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonClose: {
        height: 36,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#636363',
        borderRadius: 4,
    },
    buttonSend: {
        height: 36,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DAB451',
        borderRadius: 4,
    },
});