import React, { useEffect, useState } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, FlatList } from "react-native";

import { Money } from "../../../components/generalConvert/conVertmunberToMoney";
import { getNoSalesAtAllByCategory, getProductByReportNo, getTotalRevenueAndQuality } from "../../../netWorking/SpeedposService";
import { INoSalesAtAllByCategory, IProductByReportNo, ITotalRevenueAndQuality } from "../../../models/revenueModel";
import HomeDateTimePicker from "../../../components/homeDatetimePicker";
import PickerModel from "../../../components/picker/PickerModel";
import { colors } from "../../../utils/Colors";
import { Icons } from "../../../assets";
import { Table, Row, Cell, TableWrapper } from "react-native-table-component";
import SvgUri from "react-native-svg-uri";
import DropDownPickerLine from "../../../components/DropDownPickerLine";
import { Imodel, IModalPicker } from "../../../models/Imodel";
import { TabHomeParamList } from "../../../types";
import DialogAwait from "../../../components/dialogs/Loading";
import moment from "moment";
export interface Props {
  route: RouteProp<TabHomeParamList, "RevenueBySubCategory">;
  navigation: StackNavigationProp<TabHomeParamList>;
}
const RevenueBySubCategory = (props: Props) => {
  const { dataRevenue, id } = props.route.params.data;
  const [isLoading, setIsLoading] = useState(false);
  const [itemSold, setItemSold] = useState([]);
  const [noSales, setNoSales] = useState([]);
  const [total, setTotal] = useState<ITotalRevenueAndQuality>({ quanlity: 0, revenueProductGroup: 0 });
  const [category, setCategory] = useState(dataRevenue[id - 1]);
  const [sort, setSort] = useState(false);
  //set date time default
  const [checDateDefault, setChecDateDefault] = useState(true);
  // const [fromDateTime, setFromDateTime] = useState('2021-07-21 08:06:39');
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD 00:00:00"));
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD 23:59:00")
  );
  const onchangeOutlet = async (data: any) => { };

  const OnchangeFromDateTime = async (dateTime: any) => {
    setFromDateTime(moment(dateTime).format("YYYY-MM-DD HH:mm:ss"));
  };

  const OnchangeEndDateTime = async (dateTime: any) => {
    setEndDateTime(moment(dateTime).format("YYYY-MM-DD HH:mm:ss"));
  };

  const checkFromdateAnDateEndHome = () => {
    //check fromdate từ home qua
    if (dataRevenue[id - 1].fromdate) {
      setFromDateTime(dataRevenue[id - 1].fromdate);
    }
    //check enddate từ home qua
    if (dataRevenue[id - 1].enddate) {
      setEndDateTime(dataRevenue[id - 1].enddate);
    }
    setChecDateDefault(false);
  }

  const sortItemSold = () => {
    let _itemSold = itemSold;
    if (sort) {
      _itemSold.sort((a, b) => a[1] - b[1]);
    } else _itemSold.sort((a, b) => b[1] - a[1]);
    setItemSold(_itemSold);
    setSort(!sort);
  };
  const ViewCellSort = () => {
    return (
      <TouchableOpacity onPress={sortItemSold} style={[{ flexDirection: "row", alignItems: "center" }]}>
        <Text style={styles.text14}>Quantity</Text>
        <SvgUri source={Icons.iconSoft} />
      </TouchableOpacity>
    );
  };
  const getListNoSales = async () => {
    setIsLoading(true);
    const res = await getNoSalesAtAllByCategory(category.value, fromDateTime, endDateTime);
    if (res.isSuccess == 1) {
      let _noSales = [];
      let dataRes = res.data as INoSalesAtAllByCategory[];
      dataRes.map(map => {
        _noSales.push([map.prodName]);
      });
      setNoSales(_noSales);
    }
    setIsLoading(false);
  };
  const getListItemSold = async () => {
    const res = await getProductByReportNo(category.value, fromDateTime, endDateTime);
    if (res.isSuccess == 1) {
      let _itemSold = [];
      let dataRes = res.data as IProductByReportNo[];
      dataRes.map(map => {
        _itemSold.push([map.prodName, map.quantity, map.revenueProductGroup ? Money(map.revenueProductGroup) : 0]);
      });

      setItemSold(_itemSold);
    }
  };
  const getRevenueAndQuality = async () => {
    const res = await getTotalRevenueAndQuality(category.value, fromDateTime, endDateTime);
    if (res.isSuccess === 1 && res.data.length > 0) {
      setTotal(res.data[0]);
    } else {
      setTotal({ quanlity: 0, revenueProductGroup: 0 })
    }
  };
  useEffect(() => {
    if (checDateDefault) {
      checkFromdateAnDateEndHome();
    }
  }, []);

  useEffect(() => {
    getListNoSales();
    getListItemSold();
    getRevenueAndQuality();
  }, [category, fromDateTime, endDateTime]);

  return (
    <View style={styles.mainBody}>
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View>
            <PickerModel
              defaultValue="Ola Restaurant"
              onSelectedValue={value => {
                onchangeOutlet(value.value);
              }}
            ></PickerModel>
            <HomeDateTimePicker
              fromDate={dataRevenue[id - 1].fromdate}
              endDate={dataRevenue[id - 1].enddate}
              onSubmitFromDate={date => OnchangeFromDateTime(date)}
              onSubmitEndDate={date => OnchangeEndDateTime(date)}
            ></HomeDateTimePicker>
          </View>
          <View style={styles.viewLine}></View>
          <DropDownPickerLine
            data={[...new Map(dataRevenue.map(item => [item['value'], item])).values()]}
            onSelected={value => {
              setCategory(value);
            }}
            itemSelected={category}
          ></DropDownPickerLine>
          <View style={{ flexDirection: "row", padding: 15 }}>
            <View style={[styles.viewTotalRevenue, { marginRight: 15 }]}>
              <Text style={[styles.textGray, { marginBottom: 8 }]}>Total Revenue</Text>
              <Text style={styles.text16}>{Money(total.revenueProductGroup) ?? 0} VND</Text>
            </View>
            <View style={styles.viewTotalRevenue}>
              <Text style={[styles.textGray, { marginBottom: 8 }]}>Quanlity</Text>
              <Text style={styles.text16}>{total.quanlity ?? 0}</Text>
            </View>
          </View>
          <View style={{ padding: 15 }}>
            <Text style={[styles.textGray, { marginBottom: 8 }]}>Revenue Item Sold By Category</Text>
            <Table style={{ backgroundColor: "#414141" }}>
              <TableWrapper
                style={{
                  flexDirection: "row",
                  height: 36,
                  backgroundColor: "#878787",
                  paddingLeft: 10,

                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              >
                <Cell key={1} data={"Product"} style={{ flex: 3 }} textStyle={styles.text14} />
                <Cell key={2} data={ViewCellSort()} style={{ flex: 2 }} textStyle={styles.text14} />
                <Cell key={3} data={"Total"} style={{ flex: 2 }} textStyle={styles.text14} />
              </TableWrapper>
              {itemSold.map((item, index) => {
                return (
                  <Row
                    key={index}
                    data={item}
                    style={[styles.styleRowTable, index % 2 === 0 && { backgroundColor: "#8D7550" }, { paddingLeft: 10 }]}
                    flexArr={[3, 2, 2]}
                    textStyle={[styles.text14, { backgroundColor: "#ff0", alignSelf: "flex-start" }]}
                  />
                );
              })}
            </Table>
          </View>
          <View style={{ padding: 15, marginBottom: 15 }}>
            <Text style={[styles.textGray, { marginBottom: 8 }]}>No Sales At All By Category</Text>
            <Table
              style={{
                backgroundColor: "#414141",
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
              }}
            >
              <Row
                data={["Product"]}
                style={{
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  height: 36,
                  backgroundColor: "#878787",
                  paddingLeft: 10,
                }}
                flexArr={[1]}
                textStyle={styles.text14}
              />
              <View style={{ maxHeight: 300 }}>
                <FlatList
                  style={{ maxHeight: 300 }}
                  data={noSales}
                  keyExtractor={(item, index) => item.id}
                  renderItem={({ item, index }) => {
                    return (
                      <Row
                        key={index}
                        data={item}
                        style={[styles.styleRowTable, index % 2 === 0 && { backgroundColor: "#8D7550" }, { paddingLeft: 10 }]}
                        flexArr={[1]}
                        textStyle={[styles.text14, { backgroundColor: "#ff0", alignSelf: "flex-start" }]}
                      />
                    );
                  }}
                ></FlatList>
              </View>

              {/* {noSales.map((item, index) => {
                return (
                  <Row
                    key={index}
                    data={item}
                    style={[styles.styleRowTable, index % 2 === 0 && { backgroundColor: "#8D7550" }, { paddingLeft: 10 }]}
                    flexArr={[1]}
                    textStyle={[styles.text14, { backgroundColor: "#ff0", alignSelf: "flex-start" }]}
                  />
                );
              })} */}
            </Table>
          </View>
        </View>
      </ScrollView>
     {isLoading &&<DialogAwait></DialogAwait>} 
    </View>
  );
};

export default RevenueBySubCategory;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },

  viewLine: {
    height: 10,
    backgroundColor: "#414141",
  },
  textGray: {
    color: colors.gray,
  },
  text16: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.colorText,
  },
  text14: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.colorText,
  },
  viewTotalRevenue: {
    flex: 1,
    backgroundColor: "#414141",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    paddingVertical: 12,
  },
  styleRowTable: {
    height: 36,
  },
});
