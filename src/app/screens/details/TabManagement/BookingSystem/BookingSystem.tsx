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
  ViewStyle,
  Image,
} from "react-native";

import moment from "moment";
import { Icons, Images } from "../../../../assets";
import DropDownPickerLine from "../../../../components/DropDownPickerLine";
import { IModalPicker, Imodel } from "../../../../models/Imodel";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import PickerModel from "../../../../components/picker/PickerModel";
import DatePickerCustom from "../../../../components/DatePickerCustom";
import { GetMemberFilter } from "../../../../netWorking/memberService";
import { getListBooking } from "../../../../netWorking/bookingService";
import { bookingModel } from "../../../../models/bookingModel";
import Loading from "../../../../components/dialogs/Loading";
const BookingSystem = () => {
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
  // ----Picker
  const dataTopPicker = [
    { label: "All Booking", value: "all" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "By membership", value: "byMembership" },
  ];
  const [pickerTopValue, setPickerTopValue] = useState<IModalPicker>(dataTopPicker[0]);
  const [bookingList, setBookingList] = useState([]);
  const handlePicker = (value: IModalPicker) => {
    setPickerTopValue(value);
  };
  //fetch data
  const loadBookingList = async date => {
    setIsLoading(true)
    const fromDateTime = moment(date).format("YYYY-MM-DD");
    const toDateTime = moment(new Date().setDate(new Date(date).getDate() + 1)).format("YYYY-MM-DD");
    setBookingList([]);
    const res = await getListBooking(fromDateTime, toDateTime, null, null);
    let dataList = [];
    if (res.isSuccess == 1 && res.data) {
      dataList = res.data as bookingModel[];
      dataList.map(item => {
        const time = moment(moment(item.timeStart).format("h:mma"), "h:mma");
        const breakfast = moment("10:59am", "h:mma");
        const lunch = moment("01:59pm", "h:mma");
        const afternoon = moment("05:59pm", "h:mma");
        const dinner = moment("08:59pm", "h:mma");
        const lateDinner = moment("11:59pm", "h:mma");
        if (time.isBefore(breakfast)) {
          item["meal"] = "breakfast";
        }
        if (time.isBetween(breakfast, lunch)) {
          item["meal"] = "lunch";
        }
        if (time.isBetween(lunch, afternoon)) {
          item["meal"] = "afternoon";
        }
        if (time.isBetween(afternoon, dinner)) {
          item["meal"] = "dinner";
        }
        if (time.isAfter(dinner)) {
          item["meal"] = "lateDinner";
        }
      });
      const memberInfos = dataList.map(t => loadInfoMember(t.memCode));
      const infos = await Promise.all(memberInfos);
      dataList.forEach(t => {
        const info = infos.find(i => i.memberMemCode === t.memCode);
        if (info) {
          t.phoneNumber = info.memberCellNum;
          t.email = info.memberEmail;
          t.memberSalut = info.memberSalut;
          t.memberFirstName = info.memberFirstName;
          t.memberLastName = info.memberLastName;
        }
      });
      setBookingList(dataList);
    }
    
    setIsLoading(false)
  };
  const loadInfoMember = async memCode => {
    const res = await GetMemberFilter(memCode);
    if (res.isSuccess == 1 && res.data) {
      return res.data[0];
    } else return null;
  };
  const changeDate = (date: Date) => {
    loadBookingList(date);
  };
  useEffect(() => {
    loadBookingList(new Date());
  }, []);
  const countBooking = (key: string) => {
    let count = 0;
    bookingList.map(item => {
      if (key === "member") {
        if (item.memCode) count++;
      } else if (item.meal === key) count++;
    });
    return count;
  };
  // ViewTopProperty
  const ViewTopProperty = (title: string, value: number, style?: ViewStyle) => {
    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: "#414141",
            height: 70,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 4,
          },
          style,
        ]}
      >
        <Text style={[styles.textGray, { marginBottom: 5, fontSize: 12 }]}>{title}</Text>
        <Text style={styles.text16}>{value}</Text>
      </View>
    );
  };
  //-------------
  const ViewItemBooking = (booking: bookingModel) => {
    return (
      <View
        style={[
          {
            backgroundColor: "#414141",
            borderRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginBottom: 10,
          },
        ]}
      >
        <View style={[styles.styleRow, { marginBottom: 8 }]}>
          <View style={[{ flexDirection: "row", alignItems: "center" }]}>
            <Image source={Icons.avatar} style={styles.avatarStaff}></Image>
            <Text style={[styles.textName, { width: "56%" }]} numberOfLines={2}>
              {booking.memCode
                ? `${booking.memberSalut ? booking.memberSalut : ""} ${booking.memberFirstName ? booking.memberFirstName : ""} ${
                    booking.memberLastName ? booking.memberLastName : ""
                  }`
                : booking.fullName
                ? booking.fullName
                : ""}
            </Text>
          </View>
          <View
            style={[
              styles.styleStatus,
              {
                backgroundColor: booking.used ? "#066AFF" : booking.isActive ? "#FDB441" : "#76D146",
              },
            ]}
          >
            <Text style={[{ color: colors.colorText, lineHeight: 21 }]}>
              {booking.used ? "Arrived" : booking.isActive ? "Confirm" : "New"}
            </Text>
          </View>
        </View>
        <View style={[styles.styleRow, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Date:</Text>
          <Text style={[{ color: colors.colorText }]}>{moment(booking.timeStart).format("DD/MM/YYYY")}</Text>
        </View>
        <View style={[styles.styleRow, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Time:</Text>
          <Text style={[{ color: colors.colorText }]}>{moment(booking.timeStart).format("hh:mm A")}</Text>
        </View>
        <View style={[styles.styleRow, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Phone:</Text>
          <Text style={[{ color: colors.colorText }]}>{booking.phoneNumber ?? "-"}</Text>
        </View>
        <View style={[styles.styleRow, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Email:</Text>
          <Text style={[{ color: colors.colorText }]}>{booking.email ?? "-"}</Text>
        </View>
        <View style={[styles.styleRow, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Note:</Text>
          <Text style={[{ color: colors.colorText }]}>{booking.commentStr ?? "-"}</Text>
        </View>
        <View style={[styles.styleRow, { marginBottom: 10 }]}>
          <Text style={styles.textGray}>Pax:</Text>
          <Text style={[{ color: colors.colorText }]}>{`${booking.numCust ?? "0"} person`} </Text>
        </View>
      </View>
    );
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
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={styles.titleHeader}>
            <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>BOOKING SYSTEM</Text>
          </View>
        </View>
        <DatePickerCustom
          onSubmit={date => {
            changeDate(date);
          }}
          limitMonth={3}
          disablePickPast={true}
        ></DatePickerCustom>
        {/* ---------------------------------------- */}
        <View style={{ padding: 15 }}>
          <View style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}>
            {ViewTopProperty("Lunch Booking", countBooking("lunch"), {
              marginRight: 10,
            })}
            {ViewTopProperty("Dinner Booking", countBooking("dinner"))}
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            {ViewTopProperty("By membership", countBooking("member"), {
              marginRight: 10,
            })}
            {ViewTopProperty("Breakfast Booking", countBooking("breakfast"), {})}
          </View>
        </View>
        {/* ---------------------------------------- */}
        <DropDownPickerLine
          data={dataTopPicker}
          onSelected={value => {
            handlePicker(value);
          }}
          itemSelected={pickerTopValue}
        ></DropDownPickerLine>
        {/* ---------------------------------------- */}
        <View style={{ padding: 15 }}>
          {bookingList.map((item, index) => {
            switch (pickerTopValue.value) {
              case "lunch":
                return item.meal === "lunch" && <View key={index}>{ViewItemBooking(item)}</View>;
              case "dinner":
                return item.meal === "dinner" && <View key={index}>{ViewItemBooking(item)}</View>;
              case "byMembership":
                return item.memCode && <View key={index}>{ViewItemBooking(item)}</View>;

              default:
                return <View key={index}>{ViewItemBooking(item)}</View>;
            }
          })}
        </View>
        <View style={{ height: 200 }}></View>
      </ScrollView>
      {isLoading && <Loading/>}
    </View>
  );
};

export default BookingSystem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  styleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  textName: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "700",
  },
  avatarStaff: {
    width: 44,
    height: 44,
    borderRadius: 30,
    backgroundColor: "#c4c4c4",
    marginRight: 15,
  },
  styleStatus: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    backgroundColor: "#76D146",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
