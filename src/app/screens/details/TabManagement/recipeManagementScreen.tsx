import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { TabManageParamList } from "../../../types";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Modal,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Keyboard,
  FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../../../utils/Colors";
import SvgUri from "react-native-svg-uri";
import { Ionicons } from "@expo/vector-icons";
import { IModal } from "../../../models/Imodal";
import { ICategoryModel } from "../../../models/IcategoryModel";
import { Icons, Images } from "../../../assets";
import SelectMultiple from "react-native-select-multiple";
import { IproductDetail, IRecipeSpeedPos } from "../../../models/IproductDetail";
import PickerModel from "../../../components/picker/PickerModel";
import { Imodel } from "../../../models/Imodel";
import { Table, Row, Col, TableWrapper, Cell } from "react-native-table-component";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import PickerInput from "../../../components/PickerInput";

import { CategoryService } from "../../../netWorking/categoryService";
import { getRecipeSpeedPos } from "../../../netWorking/recipeService";
import { ProductService } from "../../../netWorking/productService";
import DialogAwait from "../../../components/dialogs/dialogAwait";
import Loading from "../../../components/dialogs/Loading";
export interface Props {
  route: RouteProp<TabManageParamList, "RecipeManagementScreen">;
  navigation: StackNavigationProp<TabManageParamList>;
}

export interface Iproduct {
  id: number;
  name: any;
  isEdit?: boolean;
  detail?: IproductDetail[];
  foodCost?: any;
  priceA?: any;
  priceB?: any;
  priceC?: any;
  totalCost?: any;
}

export default function RecipeManagementScreen(props: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const outletModel: Imodel[] = [
    { label: "Outlet 1", value: 1 },
    { label: "Outlet 2", value: 2 },
    { label: "Outlet 3", value: 3 },
    { label: "Outlet 4", value: 4 },
    { label: "Outlet 5", value: 5 },
  ];
  const [categoryModel, setCategoryModel] = useState<Imodel[]>([]);
  const [listCategory, setListCategory] = useState<ICategoryModel[]>([]);

  const [categorySelectedLabel, setCategorySelectedLabel] = useState<string>();
  const getDataCategory = async () => {
    const res = await CategoryService.getAllCategory();
    if (res) {
      setListCategory(res);
      let dataModel: Imodel[] = [];
      dataModel.push({ label: "Select All", value: 0 });
      res.map(map => {
        dataModel.push({ label: map.reportName, value: map.reportNo });
      });
      setCategoryModel([...dataModel]);
      setselectedCategoryValue(dataModel);
      setCategorySelectedLabel("All");
    }
  };
  // ----------------
  const headerTitle = {
    tableHead: [
      "Product",
      "Recipe code",
      "Unit",
      "Price/Unit",
      "Cost (VND)",
      "Food Cost A (%)",
      "Price A (VND)",
      "Food Cost B (%)",
      "Price B (VND)",
      "Food Cost C (%)",
      "Price C (VND)",
    ],
    widthArr: [150, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  };

  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;

  const dataModel: Imodel[] = [];
  const modalNull: IModal = { isShow: false, title: "", isEdit: false };
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [categoryValue, setCategoryValue] = useState("Category");
  const [selectedCategory, setselectedCategoryValue] = useState(dataModel);
  const [listProduct, setVlaueListProduct] = useState([]);
  const [numberPage, setNumberPage] = useState(1);

  const onSelectionsChange = async (data: Imodel[], item: Imodel) => {
    let selectedAll = data.find(x => x.value == 0);
    if (selectedAll && item.value == 0) {
      setselectedCategoryValue(categoryModel);
      setCategorySelectedLabel("All");
    } else {
      setselectedCategoryValue(dataModel);
      setCategorySelectedLabel("Choose Category");
    }
    if (item.value != 0) {
      Promise.all(data).then(res => {
        if (!selectedAll && data.length == categoryModel.length - 1) {
          setselectedCategoryValue(categoryModel);
        } else {
          let indexAll = selectedCategory.findIndex(x => x.value == 0);
          if (indexAll >= 0) {
            data.splice(indexAll, 1);
          }
          setselectedCategoryValue(data);
        }

        let labelSeleted = "";
        res.map((map, index) => {
          if (map.value != 0) labelSeleted += index != data.length - 1 ? `${map.label},` : `${map.label}`;
        });
        setCategorySelectedLabel(labelSeleted);
      });
    }
  };
  // useEffect(()=>{
  //     setVlaueListProduct(dataProduct);
  // },[dataProduct])

  const callBackRecipe = (val: any) => {
    let dataProduct = [];
    let listProductD: IproductDetail[] = [];
    listProductD.push(val);
    dataProduct = [
      {
        id: 2,
        name: "Heineken",
        foodCost: 4.7,
        priceA: 20000,
        priceB: 20000,
        priceC: 20000,
        totalCost: 19000,
        detail: listProductD,
      },
    ];
    setVlaueListProduct(dataProduct);
  };
  const fetchRecipeSpeedPos = async (prodNum: number) => {
    const res = await getRecipeSpeedPos(prodNum);
    if (res.isSuccess === 1) {
      return res.data;
    }
  };
  const getDataProduct = async (pageNumber: number) => {
    setIsLoading(true);
    let categoryIds = [];
    selectedCategory.map(map => {
      categoryIds.push(map.value);
    });

    let model: any = {
      ListReportNo: categoryIds.toString(),
      PageNum: pageNumber,
      PageSize: 10,
    };
    const res = await ProductService.getProductItemList(model);
    setIsLoading(false);
    if (res) {
      let products = res;
      if (products.length > 0) {
        setIsLoading(true);
        const recipeInfos = products.map(t => fetchRecipeSpeedPos(t.prodNum));
        const infos = await Promise.all(recipeInfos);
        setIsLoading(false);
        products.forEach((t, i) => {
          infos.forEach((payment, index) => {
            if (i === index) {
              let totalCost = 0;
              payment.map(item => {
                totalCost = totalCost + Math.round(item.costPerUnit * item.usage);
              });
              t["recipe"] = payment;
              t["totalCost"] = totalCost;
            }
          });
        });
      }

      if (pageNumber === 1) {
        setVlaueListProduct(products);
      } else setVlaueListProduct([...listProduct, ...products]);
    }
  };
  const getDataProductFromProp = async () => {
    setIsLoading(true);
    let dataProduct = [];
    dataProduct.push({ ...props.route.params.product, isEdit: false });
    const res = await getRecipeSpeedPos(props.route.params.product.prodNum);
    if (res.isSuccess === 1) {
      const indexProduct = dataProduct.findIndex(item => item.prodNum == props.route.params.product.prodNum);
      if (indexProduct !== -1) {
        let totalCost = 0;
        res.data.map(item => {
          totalCost = totalCost + Math.round(item.costPerUnit * item.usage);
        });
        dataProduct[indexProduct] = { ...dataProduct[indexProduct], recipe: res.data, totalCost: totalCost };
      }
    }
    setVlaueListProduct(dataProduct);
    setIsLoading(false);
  };
  useEffect(() => {
    if (props.route.params.product) {
      getDataProductFromProp();
    } else {
      getDataProduct(numberPage);
    }
    getDataCategory();
  }, []);
  useEffect(() => {
    if (listProduct.length > 0) {
      getDataProduct(numberPage);
    }
  }, [numberPage]);

  return (
    <View style={styles.container}>
      <PickerModel
        data={outletModel}
        defaultValue="Outlet"
        onSelectedValue={value => {
          
        }}
      ></PickerModel>
      <View style={styles.line}></View>
      <View style={[styles.containerPicker, { paddingBottom: 0 }]}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalCategoryVisible(true);
          }}
        >
          <View style={styles.viewPicker}>
            <View style={styles.pickerModal}>
              <Text style={[styles.title, { width: "90%" }]}>{categorySelectedLabel ?? "Choose Category"}</Text>
            </View>
            <Ionicons
              style={styles.iconDown}
              name="caret-down"
              size={20}
              color="#fff"
              onPress={() => {
                setModalCategoryVisible(true);
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <FlatList
        data={listProduct}
        style={styles.listItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={() => { !props.route.params.product && setNumberPage(prevState => prevState + 1) }}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.item}>
            <View style={{ flexDirection: "row", paddingLeft: 16, paddingRight: 16, justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => {
                  //   props.navigation.navigate("ProductItemListScreen", {
                  //     title: "BACK OFFICE - PRODUCT ITEM LIST",
                  //     callBackRecipe: callBackRecipe,
                  //   });
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {/* <View style={{ justifyContent: "center" }}>
                    <Image source={Images.heineken} />
                  </View> */}
                  <View style={{ marginLeft: 10, justifyContent: "center", alignItems: "flex-start", width: "90%" }}>
                    <Text numberOfLines={1} style={[styles.title, {}]}>
                      {item.prodName}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {/* <View style={{ justifyContent: "flex-start" }}>
                <View style={{ alignItems: "flex-start" }}>
                  <TouchableHighlight
                    underlayColor={colors.grayLight}
                    onPress={() => {
                      item.isEdit = true;
                      setVlaueListProduct([...listProduct]);
                    }}
                  >
                    <SvgUri source={Icons.iconEdit} />
                  </TouchableHighlight>
                </View>
              </View> */}
            </View>
            {item.isEdit ? (
              <View style={{ marginTop: 16, paddingBottom: 5, paddingLeft: 15 }}>
                <View style={{ paddingTop: 15, paddingRight: 15 }}>
                  <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Price A</Text>
                  <TextInput
                    placeholder="Price A"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray}
                    style={styles.textInput}
                    // onChangeText={(text) => setCategoryName(text)}
                    value={Money(item.priceA.toString())}
                  />
                </View>
                <View style={{ paddingTop: 15, paddingRight: 15 }}>
                  <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Price B</Text>
                  <TextInput
                    placeholder="Price B"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray}
                    style={styles.textInput}
                    // onChangeText={(text) => setCategoryName(text)}
                    value={Money(item.priceB.toString())}
                  />
                </View>
                <View style={{ paddingTop: 15, paddingRight: 15 }}>
                  <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Price C</Text>
                  <TextInput
                    placeholder="Price C"
                    keyboardType="numeric"
                    placeholderTextColor={colors.gray}
                    style={styles.textInput}
                    // onChangeText={(text) => setCategoryName(text)}
                    value={Money(item.priceC.toString())}
                  />
                </View>
                <TouchableHighlight
                  underlayColor={colors.grayLight}
                  style={{ marginTop: 15 }}
                  onPress={() => {
                    item.recipe?.push({});
                    setVlaueListProduct([...listProduct]);
                  }}
                >
                  <Text style={[styles.text, { color: colors.mainColor, justifyContent: "center" }]}> +Add new</Text>
                </TouchableHighlight>
              </View>
            ) : null}
            {!item.isEdit ? (
              <View style={{ alignItems: "center", marginTop: 16 }}>
                <ScrollView horizontal={true}>
                  <Table style={{ flexDirection: "row" }}>
                    <View>
                      <Row
                        data={headerTitle.tableHead}
                        widthArr={headerTitle.widthArr}
                        style={styles.rowheaderTable}
                        textStyle={styles.textRowHeader}
                      />
                      <View style={{ flexDirection: "row" }}>
                        <View>
                          {item.recipe?.length !== 0 ? (
                            item.recipe?.map((rowData, index) => (
                              <View
                                key={index}
                                style={[
                                  { flexDirection: "row", height: 36 },
                                  index % 2 == 0 ? { backgroundColor: "#8D7550" } : {},
                                ]}
                              >
                                <Cell
                                  key={1}
                                  data={rowData.stockName}
                                  style={{ width: headerTitle.widthArr[0] }}
                                  textStyle={styles.textRowTable}
                                />

                                <Cell
                                  key={2}
                                  data={rowData.stockNum}
                                  style={{ width: headerTitle.widthArr[1] }}
                                  textStyle={styles.textRowTable}
                                />

                                <Cell
                                  key={3}
                                  data={`${rowData.usage} ${rowData.unitDesc}`}
                                  style={{ width: headerTitle.widthArr[2] }}
                                  textStyle={styles.textRowTable}
                                />

                                <Cell
                                  key={4}
                                  data={`${Money(Math.round(rowData.costPerUnit)) ?? 0}`}
                                  style={{ width: headerTitle.widthArr[1] }}
                                  textStyle={styles.textRowTable}
                                />
                                <Cell
                                  key={5}
                                  data={Money(Math.round(rowData.costPerUnit * rowData.usage))}
                                  style={{ width: headerTitle.widthArr[3] }}
                                  textStyle={styles.textRowTable}
                                />
                              </View>
                            ))
                          ) : (
                            <View
                              key={index}
                              style={[{ flexDirection: "row", height: 36 }, index % 2 == 0 ? { backgroundColor: "#8D7550" } : {}]}
                            >
                              <Cell key={1} style={{ width: headerTitle.widthArr[0] }} textStyle={styles.textRowTable} />

                              <Cell key={2} style={{ width: headerTitle.widthArr[1] }} textStyle={styles.textRowTable} />

                              <Cell key={3} style={{ width: headerTitle.widthArr[1] }} textStyle={styles.textRowTable} />

                              <Cell key={4} style={{ width: headerTitle.widthArr[2] }} textStyle={styles.textRowTable} />
                              <Cell key={5} style={{ width: headerTitle.widthArr[3] }} textStyle={styles.textRowTable} />
                            </View>
                          )}
                        </View>
                        <TableWrapper>
                          <Col
                            data={[item.priceA ? `${Math.round(((item.totalCost * 100) / item.priceA) * 100) / 100} %` : 0]}
                            style={styles.columns}
                            textStyle={[styles.text, { textAlign: "center" }]}
                          />
                        </TableWrapper>
                        <TableWrapper style={{ flex: 1 }}>
                          <Col
                            data={[`${Money(item.priceA) ?? 0}`]}
                            style={styles.columns}
                            textStyle={[styles.text, { textAlign: "center" }]}
                          />
                        </TableWrapper>
                        <TableWrapper>
                          <Col
                            data={[item.priceB ? `${Math.round(((item.totalCost * 100) / item.priceB) * 100) / 100} %` : 0]}
                            style={styles.columns}
                            textStyle={[styles.text, { textAlign: "center" }]}
                          />
                        </TableWrapper>
                        <TableWrapper style={{ flex: 1 }}>
                          <Col
                            data={[`${Money(item.priceB) ?? 0}`]}
                            style={styles.columns}
                            textStyle={[styles.text, { textAlign: "center" }]}
                          />
                        </TableWrapper>
                        <TableWrapper>
                          <Col
                            data={[item.priceC ? `${Math.round(((item.totalCost * 100) / item.priceC) * 100) / 100} %` : 0]}
                            style={styles.columns}
                            textStyle={[styles.text, { textAlign: "center" }]}
                          />
                        </TableWrapper>
                        <TableWrapper style={{ flex: 1 }}>
                          <Col
                            data={[`${Money(item.priceC) ?? 0}`]}
                            style={styles.columns}
                            textStyle={[styles.text, { textAlign: "center" }]}
                          />
                        </TableWrapper>
                      </View>
                      <TableWrapper style={{ flex: 1 }}>
                        <View key={index} style={{ flexDirection: "row", height: 36, backgroundColor: "#878787" }}>
                          <Cell
                            key={1}
                            data={""}
                            style={{ width: headerTitle.widthArr[3] * 3 + 50 }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={2}
                            data={"Total:"}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={3}
                            data={Money(item.totalCost)}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={4}
                            data={item.priceA ? `${Money(`${Math.round(((item.totalCost * 100) / item.priceA) * 100) / 100}`)} %` : 0}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={5}
                            data={`${Money(item.priceA) ?? 0}`}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={6}
                            data={item.priceB ?`${ Money(`${Math.round(((item.totalCost * 100) / item.priceB) * 100) / 100} `)}%` : 0}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={7}
                            data={`${Money(item.priceB) ?? 0}`}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={8}
                            data={item.priceC ? `${Money(`${Math.round(((item.totalCost * 100) / item.priceC) * 100) / 100}`)}%` : 0}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                          <Cell
                            key={9}
                            data={`${Money(item.priceC) ?? 0}`}
                            style={{ width: headerTitle.widthArr[3] }}
                            textStyle={styles.textRowTable}
                          />
                        </View>
                      </TableWrapper>
                    </View>
                  </Table>
                </ScrollView>
              </View>
            ) : (
              <View>
                {item.recipe?.map((mapDetail, indexDetail) => (
                  <View key={indexDetail} style={[styles.itemEditDetail, { zIndex: 9999 - indexDetail }]}>
                    <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingRight: 9, paddingTop: 9 }}>
                      <TouchableHighlight
                        underlayColor={colors.grayLight}
                        onPress={() => {
                          item.recipe?.splice(indexDetail, 1);
                          setVlaueListProduct([...listProduct]);
                        }}
                      >
                        <SvgUri source={Icons.iconClose} />
                      </TouchableHighlight>
                    </View>
                    <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                      <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Product</Text>
                      <TextInput
                        placeholder="Type Product"
                        placeholderTextColor={colors.gray}
                        style={styles.textInput}
                        // onChangeText={(text) => setCategoryName(text)}
                        value={mapDetail.prodName}
                      />
                    </View>
                    <View style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
                      <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Recipe Code</Text>
                      <TextInput
                        placeholder="Type Recipe Code"
                        placeholderTextColor={colors.gray}
                        style={styles.textInput}
                        // onChangeText={(text) => setCategoryName(text)}
                        value={mapDetail.prodNum.toString()}
                      />
                    </View>
                    <View style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15, zIndex: 2 }}>
                      <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Unit</Text>
                      <View style={{ flexDirection: "row", flex: 1 }}>
                        <TextInput
                          placeholder="Type Unit"
                          placeholderTextColor={colors.gray}
                          style={[styles.textInput, { flex: 1, marginRight: 24 }]}
                          // onChangeText={(text) => setCategoryName(text)}
                          value={mapDetail.usage ? mapDetail.usage.toString() : ""}
                        />

                        <PickerInput
                          value={mapDetail.unitDesc ? mapDetail.unitDesc : ""}
                          items={["g", "ml", "Peace", "Spoon", "Teaspoon", "Order"]}
                          onChoose={value => {
                            
                          }}
                        ></PickerInput>
                      </View>
                    </View>

                    <View style={{ paddingTop: 15, paddingLeft: 15, paddingRight: 15 }}>
                      <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>Cost</Text>
                      <TextInput
                        placeholder="Cost"
                        keyboardType="numeric"
                        placeholderTextColor={colors.gray}
                        style={styles.textInput}
                        // onChangeText={(text) => setCategoryName(text)}
                        value={mapDetail.costPerUnit.toString()}
                      />
                    </View>
                  </View>
                ))}
                <View style={{ marginTop: 20, paddingRight: 15, paddingLeft: 15, flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.rowButton}>
                    <TouchableHighlight
                      style={{ borderRadius: 4 }}
                      underlayColor={colors.yellowishbrown}
                      onPress={() => {
                        item.isEdit = false;
                        let maxLength = item.recipe ? item.recipe.length : 0;
                        let index = item.recipe ? item.recipe?.findIndex(x => x.id == null) : -1;
                        if (index >= 0) {
                          item.recipe?.splice(index, maxLength - index);
                        }

                        setVlaueListProduct([...listProduct]);
                      }}
                    >
                      <View style={styles.buttonClose}>
                        <Text style={styles.text}>Close</Text>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={{ borderRadius: 4 }} underlayColor={colors.yellowishbrown} onPress={() => { }}>
                      <View style={styles.buttonSend}>
                        <Text style={styles.text}>Confirm</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      ></FlatList>
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
            getDataProduct(1);
            setNumberPage(1);
          }}
        >
          <View style={[styles.centeredView, styles.modelCategory, { height: windowHeight }]}>
            <View style={[styles.modalView, { backgroundColor: "#414141", marginTop: 0, paddingTop: 0, paddingBottom: 0 }]}>
              <View>
                <SelectMultiple
                  style={{ borderRadius: 4 }}
                  rowStyle={{ backgroundColor: colors.grayLight, borderBottomWidth: 0 }}
                  labelStyle={{ color: colors.white, fontSize: 16 }}
                  checkboxStyle={{ tintColor: colors.white }}
                  selectedCheckboxStyle={{ tintColor: colors.white }}
                  selectedCheckboxSource={Icons.iconChecked}
                  items={categoryModel}
                  selectedItems={selectedCategory}
                  onSelectionsChange={onSelectionsChange}
                />
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </Modal>
      {/* <DialogAwait isShow={isLoading}></DialogAwait> */}
      {isLoading && <Loading/>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  listItem: {
    paddingLeft: 15,
    marginTop: 10,
    paddingRight: 15,
  },
  item: {
    marginBottom: 10,
    paddingTop: 16,
    paddingBottom: 30,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
  },
  itemDetail: {
    justifyContent: "flex-start",
    paddingTop: 5,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 5,
    borderBottomColor: colors.white,
    borderBottomWidth: 0.5,
  },
  itemEditDetail: {
    justifyContent: "flex-start",
    marginTop: 5,
    marginBottom: 5,
    paddingBottom: 16,
    backgroundColor: "#535353",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  textInput: {
    marginTop: 5,
    fontSize: 14,
    paddingLeft: 11,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#303030",
    color: colors.white,
    // fontStyle: 'italic'
  },
  textItem: {
    color: colors.white,
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
  },

  containerPicker: {
    marginTop: 10,
    backgroundColor: colors.backgroundApp,
    paddingBottom: 15,
  },

  viewPicker: {
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
  },
  viewPickCategory: {
    marginRight: 15,
    backgroundColor: "#303030",
    borderRadius: 4,
  },
  pickerModal: {
    height: 46,
    borderRadius: 4,
    justifyContent: "center",
    backgroundColor: colors.grayLight,
    color: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },
  iconDown: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 12,
    zIndex: 4,
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
  },
  modelCategory: {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 190,
  },
  modalView: {
    backgroundColor: colors.white,
    width: 360,
    maxHeight: 230,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    paddingTop: 5,
    paddingBottom: 5,
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

  checkbox: {
    alignSelf: "center",
  },
  titleModal: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    alignItems: "center",
    padding: 15,
  },
  rowButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonClose: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#636363",
    borderRadius: 4,
  },
  buttonSend: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DAB451",
    borderRadius: 4,
  },
  textRowHeader: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "center",
  },
  rowheaderTable: {
    height: 36,
    backgroundColor: "#878787",
    borderTopEndRadius: 4,
    borderTopStartRadius: 4,
  },
  textRowTable: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
  },
  columns: {
    backgroundColor: "#735E3F",
    width: 100,
    borderLeftColor: colors.white,
    borderLeftWidth: 1,
  },
  inputUnit: {
    height: 40,
    flex: 1,
    borderRadius: 4,
    backgroundColor: "#303030",
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    marginLeft: 12,
  },
  pickUnit: {
    backgroundColor: "#414141",
    borderRadius: 4,
    position: "absolute",
    width: 152,
    right: 0,
    top: 50,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
