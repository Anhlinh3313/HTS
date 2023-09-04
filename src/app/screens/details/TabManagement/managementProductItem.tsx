import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
  Modal,
  TouchableOpacity,
  Image,
  Keyboard,
  TouchableNativeFeedback,
  TextInput,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../utils/Colors";
import moment from "moment";
import { Icons, Images } from "../../../assets";
import { RouteProp } from "@react-navigation/native";
import { TabManageParamList } from "../../../types";
import SvgUri from "react-native-svg-uri";
import {
  VictoryAxis,
  VictoryChart,
  VictoryScatter,
  VictoryArea,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryLabel,
  VictoryBar,
} from "victory-native";
import SelectMultiple from "react-native-select-multiple";
import { IModal } from "../../../models/Imodal";
import PickerModel from "../../../components/picker/PickerModel";
import DateTimePicker from "../../../components/datetimepicker";
import { getAllCategory } from "../../../netWorking/categoryService";
import { CategoryModel } from "../../../models/categoryModel";
import { getStockInventory } from "../../../netWorking/stockInventoryService";
import { StockInventoryModel } from "../../../models/stockInventoryModel";
import { updatePrice } from "../../../netWorking/priceService";
import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import { Imodel } from "../../../models/Imodel";
// import { getProductItem, updatePriceProduct } from "../../../netWorking/productService";
import { ProductService } from "../../../netWorking/productService";
import { ProductModel } from "../../../models/ProductModel";
import DialogAwait from "../../../components/dialogs/dialogAwait";
import Loading from "../../../components/dialogs/Loading";

export interface Props {
  route: RouteProp<TabManageParamList, "ManagementProductItem">;
}

export interface ListItemModel {
  id?: Number;
  isShow?: Boolean;
  pathImage?: any;
  title?: String;
  actualPrice?: any;
  fixPrice?: any;
  createdWhen?: any;
  maxPrice?: any;
  minPrice?: any;
  salesPrice?: any;
  profitMargin?: any;
  profitMarginPercent?: any;
  foodCostPercent?: any;
  foodCost?: any;
  dataChart: { foodCost: number; prodNum: number; announceDate: string }[];
}

export default function ManagementProductItem(router: Props) {
  const PAGE_SIZE = 10;
  const [isLoading, setIsLoading] = useState(false);
  //
  const dataModel: Imodel[] = [];
  const [dataCategory, setDataCategory] = useState([]);
  const [selectedCategory, setselectedCategoryValue] = useState(dataModel);
  //
  const listCategory = Array();
  const [dataListCategory, setListCategory] = useState(listCategory);
  //
  const [pickerValueCheckBox, setPickerValueCheckBox] = useState("Category");
  const [modalCheckBox, setModalCheckBox] = useState(false);
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(moment(toDate).format("YYYY-MM-DD 00:00"));
  const [endDateTime, setEndDateTime] = useState(moment(toDate).format("YYYY-MM-DD 23:59"));
  // set color
  const whiteStyle = {
    axis: { stroke: "#A4A4A4" },
    tickLabels: { fill: colors.colorText, fontSize: 10, padding: 10 },
  };
  const whiteStyleBottom = {
    axis: { stroke: "#303030" },
    tickLabels: { fontSize: 10, fill: colors.colorText },
  };
  const whiteStyleBottomLine = {
    axis: { stroke: "#414141" },
    tickLabels: { fontSize: 10, fill: colors.colorChartLine },
  };
  const modalNull: IModal = { isShow: false, title: "", isEdit: false };
  const [modalEditPrice, setModalEditPrice] = useState(modalNull);
  const [isPriceMax, setIsPriceMax] = useState(false);
  const [outlet, setoutlet] = useState(1);
  //
  const dataStockInventory: ListItemModel[] = [];
  const [listData, setListData] = useState(dataStockInventory);
  let data: ProductModel[] = [];
  //
  const [dataMaxPrice, setMaxPrice] = useState(Number);
  const [dataMinPrice, setMinPrice] = useState(Number);
  const [dataPriceId, setDataPriceId] = useState(Number);
  //chart

  const unitX = 70;
  const MonthNumber = 12;
  const heightChart = 300;
  // set pagenum and pagesize
  const [pageNum, setPageNum] = useState(1);
  //
  const [checkLoadDefault, setCheckLoadDefault] = useState(true);
  //
  const [checPageNum, setChecPageNum] = useState(true);

  async function loadDataCategory() {
    let dataModelBox: Imodel[] = [{ label: "Select All", value: 0 }];
    const res = await getAllCategory();
    if(res.isSuccess ===1){
      let dataStoreProduct = res.data as CategoryModel[];
      dataStoreProduct.map(map => {
        dataModelBox.push({ label: map.reportName, value: map.reportNo });
      });
    }
    
    setDataCategory(dataModelBox);
    setselectedCategoryValue(dataModelBox);
  }

  const onSelectionsChange = (data: Imodel[], item: Imodel) => {
    let selectedAll = data.find(x => x.value == 0);
    if (selectedAll && item.value == 0) {
      setselectedCategoryValue(dataCategory);
      dataCategory.map(data => {
        listCategory.push(data.value);
      });
      setListCategory(listCategory);
    } else {
      setListCategory([]);
      setselectedCategoryValue(dataModel);
    }
    if (item.value != 0) {
      if (!selectedAll && data.length == dataCategory.length - 1) {
        setselectedCategoryValue(dataCategory);
        dataCategory.map(data => {
          listCategory.push(data.value);
        });
        setListCategory(listCategory);
      } else {
        let indexAll = selectedCategory.findIndex(x => x.value == 0);
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
    loadDataProductItem(listCategory, 1, fromDateTime, endDateTime);
  };

  const onchangeOutlet = (data: any) => {
    setoutlet(data);
  };

  const OnchangeFromDateTime = (dateTime: any) => {
    setFromDateTime(dateTime);
    if(endDateTime !== null){
      loadDataProductItem(listCategory, 1, dateTime, endDateTime);
    }
  };

  const OnchangeEndDateTime = (dateTime: any) => {
    setEndDateTime(dateTime);
    if(fromDateTime !== null){
      loadDataProductItem(listCategory, 1, fromDateTime, dateTime);
    }
  };

  const loadDataProductItem = async (listCategory, pageNum, fromDateTime, endDateTime) => {
    setIsLoading(true);
    const res = await ProductService.getProductItem(listCategory, pageNum, PAGE_SIZE, fromDateTime, endDateTime);
    let productItems: ListItemModel[] = listData;
    if (pageNum === 1) {
      setListData([]);
      productItems = [];
    }
    if (res.isSuccess == 1) {
      data = res.data as ProductModel[];
      if (data) {
        const rangeInfos = data.map(t => loadRangeOfFoodCostByProd(t.prodNum));
        const infos = await Promise.all(rangeInfos);
        data.map((map, index) => {
          productItems.push({
            id: map.prodNum,
            isShow: false,
            pathImage: null,
            salesPrice: map.salesPrice,
            foodCost: map.foodCost,
            foodCostPercent: map.salesPrice ? Math.round((map.foodCost / map.salesPrice) * 100) : 0,
            title: map.prodName,
            profitMargin: map.profitMargin,
            profitMarginPercent: map.salesPrice ? Math.round((map.profitMargin / map.salesPrice) * 100) : 0,
            maxPrice: map.maxPrice ? map.maxPrice : 0,
            minPrice: map.minPrice ? map.minPrice : 0,
            dataChart: infos[index],
          });
        });
        setListData(productItems);
      }
    }
    setCheckLoadDefault(false);
    setIsLoading(false);
  };

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

  async function loadUpdatePrice() {
    if (dataMaxPrice <= dataMinPrice) {
      alert("Max Price must be more than Min Price!");
      return;
    }
    const res = await ProductService.updatePriceProduct(dataPriceId, dataMaxPrice, dataMinPrice);
    if (res.isSuccess == 1) {
      setModalEditPrice({ isShow: false });
      let index = listData.findIndex(item => item.id === dataPriceId);
      let _listData = [...listData];
      _listData[index].maxPrice = dataMaxPrice;
      _listData[index].minPrice = dataMinPrice;
      setListData(_listData);
    } else {
      alert("Edit Fail!");
    }
  }
  async function loadRangeOfFoodCostByProd(prodNum: number) {
    const res = await ProductService.getRangeOfFoodCostByProd(prodNum);
    if (res.isSuccess == 1) {
      return res.data;
    } else {
      return [];
    }
  }

  const handleDataScatter = (data: any, max: number, min: number) => {
    if (data && data.length > 0 && max > 0 && max > min) {
      let arrChart = [];
      data.map((item, index) => {
        const month = +moment(new Date(item.announceDate)).format("MM");
        const day = +moment(new Date(item.announceDate)).format("DD");
        let data_y = ((item.foodCost - min) / (max - min)) * 0.25 * 100 + 37.5;
        if (data_y > 80) {
          data_y = 80;
        }
        arrChart.push({
          x: month - 1 + day / 31,
          y: data_y,
          date: moment(new Date(item.announceDate)).format("DD/MM/YYYY"),
          money: `${Money(item.foodCost) ?? 0} VND`,
        });
      });
      return arrChart;
    } else {
      return [];
    }
  };

  const onChangePage = () => {
    if (!checPageNum) {
      setPageNum(prevState => prevState + 1);
      setChecPageNum(true);
    }
  };

  useEffect(() => {
    if (checkLoadDefault) {
      loadDataCategory();
      loadDataProductItem(dataListCategory, pageNum, fromDateTime, endDateTime);
    }
  }, []);
  useEffect(() => {
    if (pageNum > 1) {
      if(fromDateTime!==null &&endDateTime!==null){
        loadDataProductItem(dataListCategory, pageNum, fromDateTime, endDateTime);
      }
    }
  }, [pageNum]);
  return (
    <View style={styles.container}>
      <PickerModel
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>
      <View style={styles.line}></View>
      <View style={{ backgroundColor: colors.backgroundApp }}>
        <DateTimePicker
          onSubmitFromDate={date => OnchangeFromDateTime(date)}
          onSubmitEndDate={date => OnchangeEndDateTime(date)}
          fromDate={fromDateTime}
          endDate={endDateTime}
        ></DateTimePicker>
        <View>
          <View style={styles.containerPickerCheck}>
            <View style={styles.viewPicker}>
              <TouchableWithoutFeedback
                onPress={() => {
                  setModalCheckBox(true);
                }}
              >
                <View style={styles.pickerModal}>
                  <Text style={styles.text}>{pickerValueCheckBox}</Text>
                </View>
              </TouchableWithoutFeedback>
              <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff" onPress={() => {}} />
            </View>
          </View>
        </View>
      </View>
      {/* {isLoading ? (
        <Loading></Loading>
      ) : ( */}
      <FlatList
        onEndReached={onChangePage}
        onEndReachedThreshold={0.7}
        onMomentumScrollBegin={() => setChecPageNum(false)}
        data={listData}
        style={styles.listItem}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View>
            <TouchableHighlight
              key={index}
              underlayColor={colors.yellowishbrown}
              onPress={() => {
                item.isShow = !item.isShow;
                setListData([...listData]);
              }}
            >
              <View style={[styles.contenItem, index == listData.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                {/* <View style={styles.imageItem}>
                                        <Image style={{ width: 100, height: 70 }} source={Images.chicken} />
                                    </View> */}
                <View style={styles.TittleItem}>
                  <View style={{ width: "70%" }}>
                    <Text numberOfLines={1} style={styles.title}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={{}}>
                    <SvgUri source={item.isShow ? Icons.iconChevronDown : Icons.right_chevron} />
                  </View>
                </View>
              </View>
            </TouchableHighlight>
            {item.isShow ? (
              <View style={styles.expansionPanelContent}>
                <View style={styles.pickerShow}>
                  <View>
                    <Text style={styles.text}>Margin & Cost Per Item</Text>
                  </View>
                  <View style={{ backgroundColor: "#303030", marginTop: 5, borderRadius: 4 }}>
                    <VictoryChart horizontal padding={{ top: 30, bottom: 70, left: 80, right: 50 }} domainPadding={55}>
                      <VictoryLabel
                        y={50}
                        x={90}
                        style={{
                          fontSize: 10,
                          fontStyle: "normal",
                          fill: colors.colorText,
                        }}
                        text={item.profitMarginPercent + "%"}
                      />
                      <VictoryLabel
                        y={105}
                        x={90}
                        style={{
                          fontSize: 10,
                          fontStyle: "normal",
                          fill: colors.colorText,
                        }}
                        text={item.foodCostPercent + "%"}
                      />
                      <VictoryLabel
                        y={250}
                        x={70}
                        style={{
                          fontSize: 10,
                          fontStyle: "normal",
                          fill: colors.colorText,
                        }}
                        text={"VND\n 0"}
                      />
                      <VictoryAxis
                        dependentAxis={true}
                        tickValues={["VND\n 200.000", "VND\n 400.000", "VND\n 600.000", "VND\n 800.000"]}
                        style={whiteStyleBottom}
                        orientation="bottom"
                      />
                      <VictoryAxis style={whiteStyle} orientation="left" />
                      <VictoryBar
                        labels={({ datum }) => datum.x0}
                        labelComponent={<VictoryLabel dx={2} dy={10} />}
                        barWidth={() => 29}
                        style={{
                          data: { fill: "#5BCBF6" },
                          labels: {
                            fill: colors.white,
                            color: colors.white,
                            fontSize: 10,
                          },
                        }}
                        // (item.salesPrice/200000) chia đề vừa với biểu đồ
                        data={[
                          { x: "", y: 0, x0: "" },
                          {
                            x: "Sales Price",
                            y: item.salesPrice / 200000,
                            x0: (item.salesPrice ? Money(item.salesPrice) : 0) + " VND",
                          },
                          {
                            x: "Food Cost",
                            y: item.foodCost / 200000,
                            x0: (item.foodCost ? Money(item.foodCost) : 0) + " VND",
                          },
                          {
                            x: "Profit Margin",
                            y: item.profitMargin / 200000,
                            x0: (item.profitMargin ? Money(item.profitMargin) : 0) + " VND",
                          },
                        ]}
                      />
                    </VictoryChart>
                  </View>

                  <View style={{ paddingTop: 16 }}>
                    <View style={styles.lineData}></View>
                    <View style={{ paddingTop: 11 }}>
                      <Text style={styles.textRange}>Range Of Food Cost</Text>
                      <View style={styles.editPrice}>
                        <Text style={styles.editPriceText}>Max Price: {item.maxPrice ? Money(item.maxPrice) : 0} VND</Text>
                        <Text style={styles.editIcon}>
                          <TouchableOpacity
                            onPress={() => {
                              setModalEditPrice({ isShow: true, title: "Change Max Price" });
                              setMaxPrice(item.maxPrice);
                              setMinPrice(item.minPrice);
                              setDataPriceId(+item.id);
                              setIsPriceMax(true);
                            }}
                          >
                            <SvgUri source={Icons.iconEditPrice} />
                          </TouchableOpacity>
                        </Text>
                      </View>
                      <View style={styles.editPrice}>
                        <Text style={styles.editPriceText}>Min Price: {item.minPrice ? Money(item.minPrice) : 0} VND</Text>
                        <Text style={styles.editIcon}>
                          <TouchableOpacity
                            onPress={() => {
                              setModalEditPrice({ isShow: true, title: "Change Min Price" });
                              setMaxPrice(item.maxPrice);
                              setMinPrice(item.minPrice);
                              setDataPriceId(+item.id);
                              setIsPriceMax(false);
                            }}
                          >
                            <SvgUri source={Icons.iconEditPrice} />
                          </TouchableOpacity>
                        </Text>
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
                                  // domainPadding={{y:50}}
                                  height={heightChart}
                                  width={unitX * MonthNumber}
                                  padding={{
                                    left: 10,
                                    right: 0,
                                    bottom: 0,
                                    top: 0,
                                  }}
                                  containerComponent={<VictoryVoronoiContainer />}
                                  // theme={VictoryTheme.material}
                                >
                                  <VictoryAxis //line max
                                    // orientation="top"
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
                                    // orientation="bottom"
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
                                      data: { fill: "#6979F8", opacity: 0.3, stroke: "rgba(105, 121, 248, 1)", strokeWidth: 3 },
                                    }}
                                    data={[
                                      ...[{ x: 0, y: 0 }],
                                      ...handleDataScatter(item.dataChart, item.maxPrice, item.minPrice),
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
                                    data={handleDataScatter(item.dataChart, item.maxPrice, item.minPrice)}
                                    labels={({ datum }) => `Date: ${datum.date} \n AFC: ${datum.money}`}
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
                  </View>
                </View>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        )}
      ></FlatList>
      {/* )} */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalCheckBox}
        onRequestClose={() => {
          setModalCheckBox(false);
        }}
      >
        <TouchableHighlight
          style={{ borderRadius: 4, height: windowHeight }}
          onPressIn={() => {
            setModalCheckBox(false);
          }}
        >
          <View
            style={[
              styles.centeredView,
              styles.modelCategory,
              { justifyContent: "flex-start", paddingTop: 260, height: windowHeight },
            ]}
          >
            <View style={[styles.modalView, { height: 220, backgroundColor: "#414141", marginTop: 0 }]}>
              <View>
                <SelectMultiple
                  rowStyle={{ backgroundColor: colors.grayLight, borderBottomWidth: 0 }}
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
            { justifyContent: "flex-start", paddingTop: 200, height: windowHeight },
          ]}
        >
          <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.modalView, { backgroundColor: "#414141", paddingLeft: 15, paddingRight: 15 }]}>
              <View style={styles.titleModal}>
                <Text style={[styles.title, { color: colors.mainColor }]}>{modalEditPrice.title}</Text>
              </View>

              <View style={{ paddingTop: 15 }}>
                <Text style={{ fontSize: 12, color: colors.gray, fontWeight: "600" }}>
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
              <View style={{ marginTop: 20, flexDirection: "row", alignItems: "center" }}>
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
      {/* <DialogAwait isShow={isLoading}></DialogAwait> */}
      {isLoading && <Loading></Loading>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    color: colors.white,
    fontSize: 20,
  },
  texListDatat: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
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
  pickerShow: {
    padding: 10,
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
  lineData: {
    height: 0.5,
    backgroundColor: colors.colorLine,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  modalView: {
    backgroundColor: colors.white,
    width: 380,
    height: 210,
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

  containerPickerCheck: {
    backgroundColor: colors.backgroundApp,
  },
  listData: {
    flex: 1,
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 90,
    paddingTop: 11,
    paddingBottom: 10,
    backgroundColor: colors.backgroundApp,
  },
  imgListData: {
    flex: 3,
  },
  textListData: {
    flex: 6,
    color: colors.white,
    paddingTop: 28,
    lineHeight: 24,
    fontSize: 16,
  },
  iconListData: {
    paddingTop: 28,
  },
  textModalBox: {
    flex: 9,
    color: colors.black,
    fontWeight: "500",
    fontSize: 16,
    paddingTop: 5,
  },
  BoxModal: {
    flex: 1,
    paddingLeft: 10,
  },
  checkBox: {
    alignSelf: "center",
  },
  expansionPanel: {
    flex: 1,
    height: 60,
    paddingLeft: 8,
    paddingRight: 25,
    paddingTop: 18,
    paddingBottom: 15,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.backgroundApp,
  },
  expansionPanelContent: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.backgroundApp,
  },
  textRange: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  editPrice: {
    flex: 1,
    flexDirection: "row",
    paddingTop: 5,
    paddingLeft: 15,
  },
  editPriceText: {
    flex: 9,
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  editIcon: {
    flex: 1,
    position: "absolute",
    right: 0,
    top: 5,
  },
  cssFood: {
    flex: 5,
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",
    bottom: -8,
  },
  lineItem: {
    height: 0.5,
    backgroundColor: colors.colorLine,
  },
  lablechart: {
    flex: 6,
    flexDirection: "column",
  },
  columtext: {
    flex: 3,
    paddingTop: 5,
    paddingLeft: 5,
  },
  textClumn: {
    fontSize: 12,
    color: "#FEFFFF",
  },
  columtextPdding: {
    flex: 3,
    paddingTop: 10,
    paddingLeft: 5,
  },
  modelCategory: {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
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
  performance: {
    height: 100,
    paddingTop: 28,
  },
  performanceText: {
    fontSize: 10,
    color: colors.colorText,
    borderRadius: 6,
    borderStyle: "solid",
    backgroundColor: colors.colorChartLine,
    borderWidth: 1,
    borderColor: "#fff",
    textAlign: "center",
  },
  titleModal: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    alignItems: "center",
    padding: 15,
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
});
