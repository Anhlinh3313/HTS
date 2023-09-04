import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableHighlight,
  Modal,
  Dimensions,
  TouchableOpacity,
  TouchableNativeFeedback,
  Keyboard,
  TextInput,
  FlatList,
} from "react-native";
import { TabManageParamList } from "../../../types";
import { colors } from "../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../assets";
import SelectMultiple from "react-native-select-multiple";
import { VictoryAxis, VictoryChart, VictoryScatter, VictoryArea, VictoryTooltip, VictoryVoronoiContainer } from "victory-native";
import { IModal } from "../../../models/Imodal";
import ModalDropdown from "react-native-modal-dropdown";
import DateTimePicker from "../../../components/datetimepicker";
import PickerModel from "../../../components/picker/PickerModel";
import { getCategoryFast } from "../../../netWorking/categoryService";
import { ProductService } from "../../../netWorking/productService";
import { StockInventoryService } from "../../../netWorking/stockInventoryService";
import { CategoryFastModel } from "../../../models/categoryModel";
import { IModalPicker } from "../../../models/Imodel";
import { getStockInventoryFast, getStockInventoryByItem } from "../../../netWorking/stockInventoryService";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import { updatePrice } from "../../../netWorking/priceService";
import { getSupplier } from "../../../netWorking/fastService";
import { StockInventoryFastModel, StockInventoryByItemModel } from "../../../models/stockInventoryFastModel";
import Loading from "../../../components/dialogs/Loading";

export interface Props {
  route: RouteProp<TabManageParamList, "StockInventoryScreen">;
}

export interface ICategoryModel {
  label?: string;
  value?: number;
}

export interface ListItemModel {
  IsShow?: Boolean;
  Title?: String;
  ActualPrice?: any;
  FixPrice?: any;
  MaxPrice?: any;
  MinPrice?: any;
  ItemCode?: any;
  ItemName?: any;
  Category?: any;
  QuotationDate?: any;
  DateFrom?: any;
  DateTo?: any;
  Unit?: any;
  Price?: any;
  supplier?: any;
  checkPurchaseContract?: any;
  dataChart?: any;
}

export default function StockInventoryScreen(props: Props) {
  const PAGE_SIZE = 20
  const [isLoading, setIsLoading] = useState(false);
  const unitX = 70;
  const MonthNumber = 12;
  const heightChart = 300;

  let dataStockInventory: ListItemModel[] = [];
  const [listData, setListData] = useState([...dataStockInventory]);
  const [dataMaxPrice, setMaxPrice] = useState(0);
  const [dataMinPrice, setMinPrice] = useState(0);
  const [dataItemCode, setItemCode] = useState("");
  const [itemCodeChange, setItemCodeChange] = useState("");
  let data: StockInventoryFastModel[] = [];
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;
  const modalNull: IModal = { isShow: false, title: "", isEdit: false };
  const [categoryValue, setCategoryValue] = useState("Category");
  const [modalCategoryVisible, setModalCategoryVisible] = useState(false);
  const [modalEditPrice, setModalEditPrice] = useState(modalNull);
  const [isPriceMax, setIsPriceMax] = useState(false);
  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY/MM/DD 00:00"));
  const [endDateTime, setEndDateTime] = useState(moment(toDate).format("YYYY/MM/DD 23:59"));
  const [outlet, setoutlet] = useState(1);
  const categoryModel: IModalPicker[] = [{ label: "Select All", value: "0" }];
  const [dataCategory, setDataCategory] = useState(categoryModel);
  const [checkLoadDataCategory, setLoadDataCategory] = useState(true);
  const dataModel: IModalPicker[] = [];
  const [selectedCategory, setselectedCategoryValue] = useState(dataModel);

  const listCategory = Array();
  const [dataListCategory, setListCategory] = useState(listCategory);
  const [checRefresh, setChecRefresh] = useState(true);
  const [checkProps, setcheckProps] = useState(true);
  const [checkLoadData, setcheckLoadData] = useState(true);
  const [supplierFilter, setSupplierFilter] = useState(["BHXANH", "DONGDUONG"]);
  const [products, setProducts] = useState([]);

  const [numPage, setNumPage] = useState(1);
  const [isFinalPage, setIsFinalPage] = useState(false);

  // GetStockInventoryByItemCode

  const GetStockInventoryByItemCode = async (itemCode: number | string) => {
    setIsLoading(true)
    const res = await getStockInventoryFast(fromDateTime, endDateTime, itemCode);
    if (res.isSuccess === 1 && res.data !== null) {
      let _products = [...products]
      const iListData = products.findIndex(e => e.itemCode == itemCode);
      _products[iListData].detail = res.data;
      const dataChart = await getStockInventoryByItem(itemCode);
      if (dataChart.isSuccess === 1 && dataChart.data !== null) {
        _products[iListData].dataChart = dataChart.data;
      }
      setProducts(_products);
    }
    setIsLoading(false)
  };

  async function loadDataCategory() {
    const res = await getCategoryFast();
    if (res.isSuccess === 1) {
      let dataStoreProduct = res.data as CategoryFastModel[];
      dataStoreProduct.map(map => {
        categoryModel.push({ label: map.itemGroupName, value: map.itemGroupCode });
      });
      setDataCategory(categoryModel);
    }
    setLoadDataCategory(false);
  }
  //onchange category
  const onSelectionsChange = (data: IModalPicker[], item: IModalPicker) => {
    let selectedAll = data.find(x => x.value == "0");
    if (selectedAll && item.value == "0") {
      setselectedCategoryValue(dataCategory);
      dataCategory.map(data => {
        listCategory.push(data.value);
      });
      setListCategory(listCategory);
    } else {
      setListCategory([]);
      setselectedCategoryValue(dataModel);
    }
    if (item.value != "0") {
      if (!selectedAll && data.length == dataCategory.length - 1) {
        setselectedCategoryValue(dataCategory);
        dataCategory.map(data => {
          listCategory.push(data.value);
        });
        setListCategory(listCategory);
      } else {
        let indexAll = selectedCategory.findIndex(x => x.value == "0");
        if (indexAll >= 0) {
          data.splice(indexAll, 1);
        }
        setselectedCategoryValue(data);
        data.map(x => {
          listCategory.push(x.value);
        });
        setListCategory(listCategory);
      }
    }


    setIsFinalPage(false);
    setNumPage(1)
    // loadDataStockInventory();
  };

  const onchangeOutlet = (data: any) => {
    setoutlet(data);
  };

  const OnchangeFromDateTime = (dateTime: any) => {
    setNumPage(1)
    setIsFinalPage(false);
    setFromDateTime(moment(dateTime).format("YYYY/MM/DD 00:00"));
    setChecRefresh(false);
  };

  const OnchangeEndDateTime = (dateTime: any) => {
    setNumPage(1)
    setIsFinalPage(false);
    setEndDateTime(moment(dateTime).format("YYYY/MM/DD 23:59"));
    setChecRefresh(false);
  };

  //set price min max
  const onChangeNumberText = (data: any) => {
    if (data) {
      const number = parseInt(data);
      if (isPriceMax) {
        setMaxPrice(number);
      } else {
        setMinPrice(number);
      }
    } else {
      if (isPriceMax) {
        setMaxPrice(0);
      } else {
        setMinPrice(0);
      }
    }
  };
  //update price
  async function loadUpdatePrice() {
    if (dataMaxPrice <= dataMinPrice) {
      alert("Max Price must be more than Min Price!");
      return;
    }
    const res = await updatePrice(dataItemCode, dataMaxPrice, dataMinPrice);
    if (res.isSuccess == 1) {
      setModalEditPrice({ isShow: false });
      GetStockInventoryByItemCode(itemCodeChange)
      setItemCode("");
    }
  }
  //refresh load all
  const refreshIcon = () => {
    const fromDate = "";
    const formatEndDateTime = moment(new Date(toDate)).format("YYYY-MM-DD");
    // loadData(fromDate, formatEndDateTime);
  };
  const handleDataScatter = (data: any, max: number, min: number) => {
    if (data && data.length > 0 && max > 0 && max > min) {
      let arrChart = [];
      data.map((item, index) => {
        const month = +moment(new Date(item.announceDate)).format("MM");
        const day = +moment(new Date(item.announceDate)).format("DD");
        let data_y = ((item.price - min) / (max - min)) * 0.25 * 100 + 37.5;
        if (data_y > 80) {
          data_y = 80;
        }
        arrChart.push({
          x: month - 1 + day / 31,
          y: data_y,
          date: moment(new Date(item.announceDate)).format("DD/MM/YYYY"),
          money: `${Money(item.price) ?? 0} VND`,
        });
      });
      return arrChart;
    } else {
      return [];
    }
  };
  const handleGetSupplier = async () => {
    const res = await getSupplier("", moment(new Date()).format("YYYY/MM/DD 00:00"), '');
    let data = [];
    if (res.isSuccess == 1) {
      if (data) {
        res.data.map(item => {
          data.push(item.supplierName)
        })
        setSupplierFilter(data);
      }
    }
  };
  const FetchAllProduct = async () => {
    if (!props.route.params?.product) {
      setIsLoading(true)
      const res = await StockInventoryService.GetAllProd(numPage, PAGE_SIZE, dataListCategory);
      setIsLoading(false)
      let data = products;
      if (res.isSuccess == 1) {
        if (res.data.length === 0) {
          setIsFinalPage(true);
          return
        }
        if (numPage === 1) {
          data = [];
          setProducts([])
        }

        res.data.map(item => {
          data.push({ ...item, ...{ IsShow: false, detail: [], dataChart: [] } })
        })
        setProducts(data);
      }
    }

  };
  const onLoadMore = () => {
    if (!isFinalPage) {
      setNumPage(prevState => prevState + 1)
    }
  }

  useEffect(() => {
    loadDataCategory();
    handleGetSupplier();
    FetchAllProduct();
    if (props.route.params?.product) {
      let item =
      {
        "year": null,
        "month": null,
        "itemCode": props.route.params.product.itemCode,
        "itemName": props.route.params.product.itemName,
        "unit": props.route.params.product.unit ?? '',
        "price": props.route.params.product.price ?? '',
        "category": props.route.params.product.category ?? '', IsShow: false, detail: [], dataChart: []
      }
      setProducts([item]);
    }

  }, []);
  useEffect(() => {
    FetchAllProduct();
  }, [fromDateTime, endDateTime]);
  useEffect(() => {
    FetchAllProduct();
  }, [dataListCategory, numPage]);
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: colors.backgroundApp, paddingBottom: 10 }}>
        <PickerModel
          defaultValue="Ola Restaurant"
          onSelectedValue={value => {
            onchangeOutlet(value.value);
          }}
        ></PickerModel>
        <View style={styles.line}></View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 9 }}>
            <DateTimePicker
              onSubmitFromDate={date => OnchangeFromDateTime(date)}
              onSubmitEndDate={date => OnchangeEndDateTime(date)}
              isShowTime={true}
              formatDate={"DD/MM/YYYY"}
              fromDate={fromDateTime}
              endDate={endDateTime}
            ></DateTimePicker>
          </View>
          {/* <View style={{ flex: 1, paddingTop: 35 }}>
            <TouchableWithoutFeedback
              onPress={() => {
                FetchAllProduct();
                setChecRefresh(true);
              }}
            >
              <Text>
                <SvgUri source={Icons.iconRefresh}></SvgUri>
              </Text>
            </TouchableWithoutFeedback>
          </View> */}
        </View>
        <View style={[styles.containerPicker, { paddingBottom: 10 }]}>
          <View style={styles.viewPicker}>
            <TouchableWithoutFeedback
              onPress={() => {
                !props.route.params?.product ? setModalCategoryVisible(true) : undefined;
              }}
            >
              <View style={styles.pickerModal}>
                <Text style={styles.textItem}>{categoryValue}</Text>
              </View>
            </TouchableWithoutFeedback>
            <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff" onPress={() => { }} />
          </View>
        </View>
      </View>
      <FlatList
        onEndReached={() => onLoadMore()}
        onEndReachedThreshold={0.1}
        data={products}
        style={styles.listItem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TouchableHighlight
              key={index}
              underlayColor={colors.yellowishbrown}
              onPress={async () => {
                if (!item.IsShow) await GetStockInventoryByItemCode(item.itemCode);
                item.IsShow = !item.IsShow;
                setProducts([...products]);
              }}
            >
              <View style={[styles.contenItem, index == products.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                <View style={styles.TittleItem}>
                  <View style={{}}>
                    <Text style={styles.title}>{item.itemName}</Text>
                  </View>
                  <View style={{}}>
                    <SvgUri source={item.IsShow ? Icons.iconChevronDown : Icons.right_chevron} />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            {item.IsShow ? (
              <View style={{ backgroundColor: colors.grayLight }}>
                <TouchableWithoutFeedback>
                  {item.detail.length !== 0 ? <View
                    style={{
                      paddingBottom: 17,
                      paddingLeft: 14,
                      paddingRight: 16,
                    }}
                  >
                    <View style={[styles.itemModelChar, { borderBottomWidth: 0.5 }]}>
                      <Text style={styles.textItem}>Actual Price: {item.detail[0]?.price ? Money(item.detail[0]?.price) : 0} VND</Text>
                    </View>
                    <View style={[styles.itemModelChar, { borderBottomWidth: 0.5 }]}>
                      <View style={{ height: 40, justifyContent: "center" }}>
                        <ModalDropdown
                          defaultValue={item.detail[0]?.supplierName ?? "Supplier"}
                          dropdownStyle={{
                            backgroundColor: "#303030",
                            borderWidth: 0,
                            width: windowWidth - 60,
                            height: 85,
                            borderRadius: 4,
                          }}
                          textStyle={[styles.textItem, { width: windowWidth - 75 }]}
                          dropdownTextStyle={{
                            color: colors.gray,
                            backgroundColor: "#303030",
                            fontSize: 16,
                          }}
                          dropdownTextHighlightStyle={{ color: colors.white }}
                          showsVerticalScrollIndicator={true}
                          options={supplierFilter}
                          renderRightComponent={() => <SvgUri source={Icons.iconChevronDown} />}
                        />
                      </View>
                    </View>
                    <View style={[styles.itemModelChar, { borderBottomWidth: 0 }]}>
                      <Text style={styles.textItem}>Range Of Purchasing Price</Text>
                    </View>
                    <View style={{ paddingLeft: 16, paddingRight: 3 }}>
                      <View style={{ height: 24 }}>
                        <View style={styles.itemPrice}>
                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "400",
                                color: colors.white,
                              }}
                            >
                              Max Price: {item.detail[0]?.maxPrice ? Money(item.detail[0]?.maxPrice) : 0} VND
                            </Text>
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                setModalEditPrice({
                                  isShow: true,
                                  title: "Change Max Price",
                                });
                                setIsPriceMax(true);
                                setMaxPrice(item.detail[0]?.maxPrice);
                                setMinPrice(item.detail[0]?.minPrice);
                                setItemCode(item.itemCode);
                                setItemCodeChange(item.itemCode);
                              }}
                            >
                              <SvgUri source={Icons.iconEdit} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                      <View style={{ height: 24, marginTop: 10 }}>
                        <View style={styles.itemPrice}>
                          <View>
                            <Text
                              style={{
                                fontSize: 16,
                                fontWeight: "400",
                                color: colors.white,
                              }}
                            >
                              Min Price: {item.detail[0]?.minPrice ? Money(item.detail[0]?.minPrice) : 0} VND
                            </Text>
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                setModalEditPrice({
                                  isShow: true,
                                  title: "Change Min Price",
                                });
                                setIsPriceMax(false);
                                setMaxPrice(item.detail[0]?.maxPrice);
                                setMinPrice(item.detail[0]?.minPrice);
                                setItemCode(item.itemCode);
                                setItemCodeChange(item.itemCode);
                              }}
                            >
                              <SvgUri source={Icons.iconEdit} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={{ paddingTop: 15, paddingRight: 16 }}>
                      <View>
                        <ScrollView horizontal>
                          <View style={{}}>
                            <View style={{ flexDirection: "row" }}>
                              <View style={{ width: unitX * MonthNumber }}>
                                <VictoryChart
                                  domain={{
                                    x: [0, MonthNumber - 1],
                                    y: [0, 100],
                                  }}
                                  height={heightChart}
                                  width={unitX * MonthNumber}
                                  padding={{
                                    left: 10,
                                    right: 0,
                                    bottom: 0,
                                    top: 0,
                                  }}
                                  containerComponent={<VictoryVoronoiContainer />}
                                >
                                  <VictoryAxis //line max
                                    offsetY={heightChart - (heightChart / 8) * 3}
                                    width={unitX * MonthNumber}
                                    style={{
                                      axis: { stroke: "red" },
                                      tickLabels: {
                                        fontSize: 15,
                                        fill: "#414141",
                                      },
                                      axisLabel: {
                                        fontSize: 16,
                                        stroke: "white",
                                        padding: 2,
                                      },
                                    }}
                                  />
                                  <VictoryAxis //line min
                                    offsetY={(heightChart / 8) * 3}
                                    width={unitX * MonthNumber}
                                    style={{
                                      axis: { stroke: "red" },
                                      tickLabels: {
                                        fontSize: 15,
                                        fill: "#414141",
                                      },
                                      axisLabel: {
                                        fontSize: 16,
                                        stroke: "white",
                                        padding: 0,
                                      },
                                    }}
                                  />
                                  <VictoryArea
                                    style={{
                                      data: {
                                        fill: "#6979F8",
                                        opacity: 0.3,
                                        stroke: "rgba(105, 121, 248, 1)",
                                        strokeWidth: 3,
                                      },
                                    }}
                                    data={[
                                      ...[{ x: 0, y: 0 }],
                                      ...handleDataScatter(item.dataChart, item.detail[0]?.maxPrice, item.detail[0]?.minPrice),
                                    ]}
                                  />
                                  <VictoryScatter
                                    style={{
                                      data: {
                                        fill: "rgba(105, 121, 248, 0.6)",
                                        stroke: "white",
                                        strokeWidth: 2,
                                      },
                                    }}
                                    size={5}
                                    data={handleDataScatter(item.dataChart, item.detail[0]?.maxPrice, item.detail[0]?.minPrice)}
                                    labels={({ datum }) =>
                                      `Date: ${datum.date} \n ${item.checkPurchaseContract ? "Fixed Price" : "Actual"}: ${datum.money
                                      }`
                                    }
                                    labelComponent={
                                      <VictoryTooltip
                                        renderInPortal={false}
                                        style={{
                                          fontSize: 10,
                                          fill: "#5F8BFC",
                                        }}
                                        flyoutStyle={{
                                          stroke: "#C4C4C4",
                                          fill: "#5B5B5B",
                                        }}
                                        cornerRadius={6}
                                      />
                                    }
                                  />
                                </VictoryChart>
                              </View>
                            </View>

                            <VictoryAxis
                              offsetY={50}
                              width={unitX * 12}
                              height={50}
                              style={{
                                tickLabels: { fontSize: 15, fill: "#999999" },
                              }}
                              padding={{ left: 10, right: 20, top: 0 }}
                              tickValues={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]}
                            />
                          </View>
                        </ScrollView>
                        <View
                          style={{
                            position: "absolute",
                            right: 40,
                            flexDirection: "row",
                            width: 1,
                            height: heightChart,
                            backgroundColor: "grey",
                            zIndex: -1,
                          }}
                        ></View>
                        <View
                          style={{
                            position: "absolute",
                            right: 0,
                            top: (heightChart / 8) * 3 - 20,
                            zIndex: -1,
                          }}
                        >
                          <View
                            style={{
                              height: heightChart - (heightChart / 8) * 3 - 72,
                              justifyContent: "space-between",
                            }}
                          >
                            <View>
                              <Text style={[styles.text, { marginLeft: -10 }]}>Max</Text>
                            </View>
                            <View>
                              <Text style={[styles.text, { marginLeft: -10 }]}>Min</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View> : (<View
                    style={{
                      paddingBottom: 17,
                      paddingLeft: 14,
                      paddingRight: 16,
                      paddingTop: 17,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ color: '#fff' }}>No receipt found for this period of time.</Text>
                  </View>)}

                </TouchableWithoutFeedback>
              </View>
            ) : null}
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
          }}
        >
          <View
            style={[
              styles.centeredView,
              styles.modelCategory,
              {
                justifyContent: "flex-start",
                paddingTop: 260,
                height: windowHeight,
              },
            ]}
          >
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor: "#414141",
                  marginTop: 0,
                  paddingTop: 0,
                  paddingBottom: 0,
                },
              ]}
            >
              <View>
                <SelectMultiple
                  rowStyle={{
                    backgroundColor: colors.grayLight,
                    borderBottomWidth: 0,
                  }}
                  labelStyle={{ color: colors.white }}
                  checkboxStyle={{ tintColor: colors.white }}
                  selectedCheckboxSource={Icons.iconChecked}
                  items={dataCategory}
                  selectedItems={selectedCategory}
                  onSelectionsChange={onSelectionsChange}
                />
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </Modal>

      {/* Form EditPrice */}
      <Modal animationType="fade" transparent={true} visible={modalEditPrice.isShow}>
        <View
          style={[
            styles.centeredView,
            styles.modelCategory,
            {
              justifyContent: "flex-start",
              paddingTop: 200,
              height: windowHeight,
            },
          ]}
        >
          <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor: "#414141",
                  paddingLeft: 15,
                  paddingRight: 15,
                },
              ]}
            >
              <View style={styles.titleModal}>
                <Text style={[styles.title, { color: colors.mainColor }]}>{modalEditPrice.title}</Text>
              </View>

              <View style={{ paddingTop: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.gray,
                    fontWeight: "600",
                  }}
                >
                  {isPriceMax ? "Max Price" : "Min Price"}
                </Text>
                <TextInput
                  placeholder="Price"
                  placeholderTextColor={colors.gray}
                  keyboardType="numeric"
                  style={styles.textInput}
                  onChangeText={value => {
                    onChangeNumberText(value);
                  }}
                  value={isPriceMax ? dataMaxPrice.toString() : dataMinPrice.toString()}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.rowButton}>
                  <TouchableHighlight
                    style={{ borderRadius: 4 }}
                    underlayColor={colors.yellowishbrown}
                    onPress={() => {
                      setModalEditPrice({ isShow: false });
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
                      loadUpdatePrice();
                    }}
                  >
                    <View style={styles.buttonSend}>
                      <Text style={styles.text}>Confirm</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Modal>
      {isLoading && <Loading></Loading>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2A2731",
  },
  listItem: {
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: colors.backgroundApp,
  },
  contenItem: {
    flex: 1,
    height: 90,
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    backgroundColor: colors.backgroundApp,
  },
  imageItem: {
    width: 100,
  },
  TittleItem: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 12,
    paddingRight: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
    color: colors.white,
  },
  titleModal: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    alignItems: "center",
    padding: 15,
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
  textTime: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 8,
  },
  textItem: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 16,
  },

  containerPicker: {
    marginTop: 10,
    backgroundColor: colors.backgroundApp,
    paddingBottom: 15,
  },
  itemModelChar: {
    height: 46,
    justifyContent: "center",
    borderBottomColor: colors.colorLine,
  },
  itemPrice: {
    height: 24,
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewPicker: {
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    backgroundColor: colors.grayLight,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingRight: 15,
    paddingLeft: 15,
  },
  rowFromDate: {
    flex: 1,
    height: 65,
    backgroundColor: colors.backgroundApp,
    paddingRight: 5,
  },
  textFromDate: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18,
    color: "#A4A4A4",
  },
  fromDate: {
    flex: 1,
    borderRadius: 4,
    backgroundColor: "#414141",
    fontSize: 14,
    paddingTop: 5,
    paddingLeft: 8,
  },
  endDate: {
    fontStyle: "normal",
    fontWeight: "600",
    fontSize: 12,
    lineHeight: 18,
    color: "#A4A4A4",
  },
  rowEndDate: {
    flex: 1,
    height: 65,
    backgroundColor: colors.backgroundApp,
    paddingLeft: 5,
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
  },
  modalView: {
    backgroundColor: colors.white,
    width: 380,
    maxHeight: 240,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    paddingBottom: 15,
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
  modalChartView: {
    // height: 500,
    // width: 360,
    marginBottom: 150,
    backgroundColor: "#414141",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    paddingBottom: 0,
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
  dateTimeModal: {
    flex: 1,
    width: "100%",
    position: "absolute",
    backgroundColor: " rgba(0, 0, 0, 0.5)",
  },
  dateTimeContainer: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#414141",
    borderRadius: 5,
  },
  dateTimeHeader: {
    width: "100%",
    justifyContent: "center",
    marginTop: 14,
  },
  dateTimeHeaderText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 17,
  },
  timeContainer: {
    flexDirection: "row",
    padding: 30,
    height: 150,
  },
  timeHourView: {
    flex: 4,
    backgroundColor: "#595959",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-around",
  },
  timeArrow: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 17,
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
});
