import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardTypeOptions,
  ImageProps,
  Platform,
  Dimensions,
} from "react-native";

import { Icons, Images } from "../../../../assets";
import DropDownPickerLine from "../../../../components/DropDownPickerLine";
import { IModalPicker, Imodel } from "../../../../models/Imodel";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import PickerModel from "../../../../components/picker/PickerModel";
import DateTimePicker from "../../../../components/datetimepicker";
import { Table, Row } from "react-native-table-component";
import { GetMemberFilter } from "../../../../netWorking/memberService";
import { getListBooking } from "../../../../netWorking/bookingService";
import { bookingModel } from "../../../../models/bookingModel";
import { getTransactionDetail, getTransactionPayment } from "../../../../netWorking/transactionService";
import { transactionDetailModel, transactionPaymentModel } from "../../../../models/transactionModel";
import DialogAwait from "../../../../components/dialogs/dialogAwait";
import moment from "moment";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";
const ReportBookingSystem = () => {
  interface IMemberData {
    id?: number;
    data?: any[];
    revenue?: any[];
  }
  const [isLoading, setIsLoading] = useState(false);
  // ----Outlet
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };

  // -----DateTime picker

  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate() - 1)).format("YYYY-MM-DD"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD"));
  //

  const [bookingList, setBookingList] = useState([]);
  const [memberBooking, setMemberBooking] = useState({});

  const loadInfoMember = async memCode => {
    const res = await GetMemberFilter(memCode);
    if (res.isSuccess == 1 && res.data) {
      return res.data[0];
    } else return null;
  };
  const loadBookingList = async () => {
    setBookingList([]);
    const res = await getListBooking(fromDateTime, endDateTime, null, null);

    let dataList = [];
    let memberList: IMemberData[] = [];

    if (res.isSuccess == 1 && res.data) {
      dataList = res.data as bookingModel[];
      dataList.map(item => {
        if (item.memCode) {
          const member = memberList.find(i => i["id"] == item.memCode);
          if (!member) {
            memberList.push({ id: item.memCode, data: [item] });
          } else {
            let objIndex = memberList.findIndex(obj => obj.id == item.memCode);
            memberList[objIndex].data.push(item);
          }
        }
      });
      const memberInfos = memberList.map(t => loadInfoMember(t["id"]));
      const infos = await Promise.all(memberInfos);
      memberList.map(t => {
        const info = infos.find(i => i.memberMemCode == t.id);
        let objIndex = memberList.findIndex(obj => obj.id == info.memberMemCode);
        if (info) {
          // memberList[t][0].fullName = `${info.memberSalut ? info.memberSalut : ""} ${
          //   info.memberFirstName ? info.memberFirstName : ""
          // } ${info.memberLastName ? info.memberLastName : ""}`;
          memberList[objIndex].data[0].fullName = info.memberLastName;
        }
      });
      const memberPayment = memberList.map(t => getTransactionPayment(fromDateTime, endDateTime, t["id"], null));
      const payments = await Promise.all(memberPayment);
      memberList.forEach((t, i) => {
        payments.forEach((payment, index) => {
          if (i === index) {
            t["revenue"] = payment.data;
          }
        });
      });
      setMemberBooking(memberList);
    }
  };

  useEffect(() => {
    loadBookingList();
  }, [fromDateTime, endDateTime]);
  const handleDataTable = (item: IMemberData[]) => {
    let countCancel = 0;
    let countRevenue = 0;
    item.data.map(item => {
      if (item.isActive === 0) {
        countCancel++;
      }
    });
    item.revenue.map(item => {
      if (item.tender !== 0) {
        countRevenue = countRevenue + item.tender;
      }
    });
    return [item.data[0].fullName, item.data.length, countCancel, Money(Math.round(countRevenue)) ?? 0];
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* -----------------Picker Outlet------------- */}
        <PickerModel
          data={outletModel}
          defaultValue="Ola Restaurant"
          onSelectedValue={value => {
            onchangeOutlet(value.value);
          }}
        ></PickerModel>
        {/* ----------------------------------------------- */}

        <View style={styles.line}></View>
        <DateTimePicker
          onSubmitFromDate={date => setFromDateTime(moment(date).format("YYYY-MM-DD"))}
          onSubmitEndDate={date => setEndDateTime(moment(date).format("YYYY-MM-DD"))}
          fromDate={fromDateTime}
          endDate={endDateTime}
          isShowTime={false}
        ></DateTimePicker>
        {/* ---------------------------------------- */}
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={styles.titleHeader}>
            <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>REPORT BOOKING SYSTEM</Text>
          </View>
        </View>
        {/* ---------------------------------------- */}
        <ScrollView horizontal style={{ paddingLeft: 15 }} indicatorStyle="white">
          <View
            style={{
              backgroundColor: "#414141",
              borderRadius: 4,
              marginRight: 30,
            }}
          >
            <Table style={{ borderRadius: 4 }}>
              <Row
                data={["Customer", "Number of book", "Number of cancel", "Revenue"]}
                style={{
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  height: 36,
                  backgroundColor: "#878787",
                  paddingLeft: 10,
                  alignItems: "center",
                }}
                widthArr={[150, 150, 150, 150]}
                textStyle={[styles.text12, { alignSelf: "center" }]}
              />
              {Object.values(memberBooking).map((item, index) => {
                return (
                  <Row
                    key={index}
                    data={handleDataTable(item)}
                    style={[
                      styles.styleRowTable,
                      { paddingLeft: 10, paddingVertical: 4 },
                      index % 2 !== 0 && { backgroundColor: "#8D7550" },
                    ]}
                    widthArr={[150, 150, 150, 150]}
                    textStyle={[styles.textTitleHeader400, { alignSelf: "center" }]}
                  />
                );
              })}
            </Table>
          </View>
        </ScrollView>
      </ScrollView>
      <DialogAwait isShow={isLoading}></DialogAwait>
    </View>
  );
};

export default ReportBookingSystem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  text16: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 16,
  },
  textGray: {
    color: colors.colorLine,
    fontWeight: "400",
    fontSize: 14,
  },

  titleHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.colorLine,
  },

  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 14,
  },
  text12: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 12,
  },
  styleRowTable: {
    height: 36,
    alignItems: "center",
  },
  textTitleHeader400: {
    color: colors.colorText,
    fontWeight: "400",
    fontSize: 14,
  },
});
