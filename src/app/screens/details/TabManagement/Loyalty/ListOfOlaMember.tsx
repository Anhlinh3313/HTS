import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, Image } from "react-native";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../../assets";
import PickerModel from "../../../../components/picker/PickerModel";
import { OlaMember } from "../../../../models/olaMember";
import { colors } from "../../../../utils/Colors";
import DialogAwait from "../../../../components/dialogs/dialogAwait";
import { getListOlaMember } from "../../../../netWorking/loyaltyService";
import { OlaMemberModal } from "../../../../models/royaltyModel";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";
export function ListOfOlaMember() {
  const PAGE_SIZE = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<OlaMemberModal[]>([]);
  const [totalMembers, setTotalMembers] = useState(PAGE_SIZE);
  const [page, setPage] = useState(1);
  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  const loadMemberShips = async () => {
    setIsLoading(true);
    const res = await getListOlaMember(page, PAGE_SIZE);
    if (res.isSuccess === 1) {
      setTotalMembers(res.dataCount);
      let dataList = res.data as OlaMemberModal[];
      setMembers(prevState => [...prevState, ...dataList]);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    loadMemberShips();
  }, [page]);
  return (
    <View style={styles.container}>
      {/* -----------------Picker Outlet------------- */}
      <PickerModel
        data={null}
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>

      <View style={styles.line}></View>
      <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
        <View style={styles.titleHeader}>
          <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>LIST OF OLA MEMBER</Text>
        </View>
        <View style={styles.rowPerson}>
          <Text style={styles.text16}>
            {Money(totalMembers)} <Text style={styles.textGray}>Person</Text>
          </Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 15, marginBottom: 200 }}>
        <FlatList
          data={members}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            if (page * PAGE_SIZE <= totalMembers) {
              setPage(prevState => prevState + 1);
            }
          }}
          renderItem={({ item, index }) => (
            <View style={styles.itemMember}>
              <View style={styles.itemMemberHeader}>
                <View style={{ width: 54, justifyContent: "center" }}>
                  <Image style={styles.avatarImg} source={Icons.avatar} />
                </View>
                <View style={{ marginLeft: 8, justifyContent: "center" }}>
                  <Text numberOfLines={1} style={[styles.text16]}>
                    {item.lastName}
                  </Text>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View style={{}}>
                  <Text style={styles.textGray}>FullName:</Text>
                </View>
                <View style={{ width: "75%", alignItems: "flex-end" }}>
                  <Text numberOfLines={1} style={styles.text}>{`${item.firstName} - ${item.lastName}`}</Text>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View style={{}}>
                  <Text style={styles.textGray}>Phone:</Text>
                </View>
                <View style={{}}>
                  <Text numberOfLines={1} style={styles.text}>
                    {item.homeTele}
                  </Text>
                </View>
              </View>
              <View style={styles.itemRow}>
                <View style={{}}>
                  <Text style={styles.textGray}>Email:</Text>
                </View>
                <View style={{ width: "80%", alignItems: "flex-end" }}>
                  <Text numberOfLines={1} style={styles.text}>
                    {item.email}
                  </Text>
                </View>
              </View>
            </View>
          )}
        ></FlatList>
      </View>
      <DialogAwait isShow={isLoading}></DialogAwait>
    </View>
  );
}

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
  text: {
    color: colors.white,
    fontWeight: "400",
    fontSize: 14,
  },
  titleHeader: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginLeft: 25,
    marginRight: 25,
    borderBottomColor: colors.colorLine,
  },

  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 16,
  },
  rowPerson: {
    height: 40,
    backgroundColor: colors.yellowishbrown,
    marginHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  itemMember: {
    height: 155,
    borderRadius: 4,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.grayLight,
  },
  itemMemberHeader: {
    height: 44,
    flexDirection: "row",
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  itemRow: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
