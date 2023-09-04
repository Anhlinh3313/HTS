import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, FlatList, SafeAreaView, Modal, TouchableNativeFeedback, Dimensions } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../../assets";
import DateTimePicker from "../../../../components/datetimepicker";
import PickerModel from "../../../../components/picker/PickerModel";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Imodel } from "../../../../models/Imodel";
import { LinearGradient } from "expo-linear-gradient";
import { IModal } from "../../../../models/Imodal";
import { MemberShipModal, memberShipment } from "../../../../models/royaltyModel";
import { ProgressBar } from "react-native-paper";
import { getGetMemberShip } from "../../../../netWorking/loyaltyService";
import moment from "moment";
import DialogAwait from "../../../../components/dialogs/dialogAwait";

export function MemberShipScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const dataMemberType: Imodel[] = [
    { label: "Member Group - All", value: 0 },
    { label: "Gold", value: 1 },
    { label: "Silver", value: 2 },
    { label: "Bronze", value: 3 },
  ];

  const [memberModel, setMemberModel] = useState<memberShipment>(null);
  const [dataMemberShip, setDataMemberShip] = useState<MemberShipModal>({});
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const modalNull: IModal = { isShow: false, title: "", isEdit: false };
  const [modalView, setModalView] = useState(modalNull);
  const [outlet, setOutlet] = useState(2);
  const [isShowDropdow, setIsShowDropdow] = useState(false);
  const [memberType, setMemberType] = useState(dataMemberType[0].label);
  //--------datetime picker
  const [fromDateTime, setFromDateTime] = useState(moment(new Date().setDate(new Date().getDate()-1)).format("YYYY-MM-DD"));
  const [endDateTime, setEndDateTime] = useState(moment(new Date().setDate(new Date().getDate())).format("YYYY-MM-DD"));
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  const onSelectedMemberType = (data: Imodel) => {
    setMemberType(data.label);
  };
  const loadMemberShips = async () => {
    setIsLoading(true);
    const res = await getGetMemberShip(fromDateTime, endDateTime);
    if (res.isSuccess == 1 && res.data) {
      setDataMemberShip(res.data);
    }

    setIsLoading(false);
  };
  useEffect(() => {
    loadMemberShips();
  }, [fromDateTime, endDateTime]);
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
      {/* ----------------------------------------------- */}

      <View style={styles.line}></View>
      <DateTimePicker
        onSubmitFromDate={date => setFromDateTime(moment(date).format("YYYY-MM-DD"))}
        onSubmitEndDate={date => setEndDateTime(moment(date).format("YYYY-MM-DD"))}
        isShowTime={false}
        fromDate={fromDateTime}
        endDate={endDateTime}
      ></DateTimePicker>
      {/* ---------------------Title------------------- */}
      <ScrollView>
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={styles.titleHeader}>
            <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>MEMBERSHIP</Text>
          </View>
        </View>
        {/* -------------------------------------------------------- */}
        <View style={{ marginLeft: 15, marginRight: 15 }}>
          <View style={styles.rowPerson}>
            <View style={styles.itemPerson}>
              <Text style={styles.textGray}>New Member</Text>
              <View>
                <Text>
                  <View style={{ paddingRight: 8, paddingBottom: 2 }}>
                    <SvgUri source={Icons.icondaily} />
                  </View>
                  <Text style={styles.text16}>
                    {dataMemberShip.totalNewMember ?? 0}
                    <Text style={styles.text}> Person</Text>
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.itemPerson}>
              <Text style={styles.textGray}>Member</Text>
              <View>
                <Text>
                  <View style={{ paddingRight: 8 }}>
                    <SvgUri source={Icons.iconPerson_Group} />
                  </View>
                  <Text style={styles.text16}>
                    {dataMemberShip.totalCount ?? 0}
                    <Text style={styles.text}> Person</Text>
                  </Text>
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.rowPerson}>
            <View style={styles.itemPerson}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ paddingRight: 8, paddingBottom: 2 }}>
                  <SvgUri source={Icons.iconGold_elip} />
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.textGray}>Gold</Text>
                </View>
              </View>
              <Text style={styles.text16}>
                {dataMemberShip.totalLevelGold ?? 0}
                <Text style={styles.text}> Person</Text>
              </Text>
            </View>
            <View style={styles.itemPerson}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ paddingRight: 8, paddingBottom: 2 }}>
                  <SvgUri source={Icons.iconWhite_elip} />
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.textGray}>Silver</Text>
                </View>
              </View>
              <Text style={styles.text16}>
                {dataMemberShip.totalLevelSliver ?? 0}
                <Text style={styles.text}> Person</Text>
              </Text>
            </View>
            <View style={styles.itemPerson}>
              <View style={{ flexDirection: "row" }}>
                <View style={{ paddingRight: 8, paddingBottom: 2 }}>
                  <SvgUri source={Icons.iconPink_elip} />
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Text style={styles.textGray}>Bronze</Text>
                </View>
              </View>
              <Text style={styles.text16}>
                {dataMemberShip.totalLevelBronze ?? 0}
                <Text style={styles.text}> Person</Text>
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 15, zIndex: 2 }}>
            <TouchableHighlight
              style={{ height: 40 }}
              underlayColor={colors.backgroundApp}
              onPress={() => {
                setIsShowDropdow(!isShowDropdow);
              }}
            >
              <View style={styles.dropDowns}>
                <View style={{ height: 40, justifyContent: "center" }}>
                  <Text style={{ color: colors.white, fontSize: 16, paddingLeft: 10 }}>{memberType}</Text>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Ionicons name="caret-down" size={20} color="#fff" />
                </View>
              </View>
            </TouchableHighlight>
            {isShowDropdow && (
              <View style={styles.dropDowBody}>
                {dataMemberType.map((item, index) => (
                  <TouchableHighlight
                    key={index}
                    underlayColor={colors.yellowishbrown}
                    onPress={() => {
                      onSelectedMemberType(item);
                      setIsShowDropdow(!isShowDropdow);
                    }}
                    style={[styles.itemDropDown, item.label == memberType && { backgroundColor: colors.yellowishbrown }]}
                  >
                    <Text style={styles.text16}>{item.label}</Text>
                  </TouchableHighlight>
                ))}
              </View>
            )}
          </View>
          <View style={{ minHeight: 200 }}>
            <SafeAreaView style={{ flex: 1 }}>
              <FlatList
                style={{ flex: 1 }}
                nestedScrollEnabled={true}
                horizontal={false}
                data={dataMemberShip.listMemberShipment}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.itemMember}>
                    <View style={styles.itemMemberHeader}>
                      <View style={{ flex: 4, justifyContent: "space-around" }}>
                        <Text style={[styles.text16, { fontWeight: "700" }]}>{item.lastName}</Text>
                        <Text style={styles.textGray}>Level:</Text>
                      </View>
                      <View style={{ flex: 2, justifyContent: "space-around", alignItems: "flex-end" }}>
                        <LinearGradient
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.gradient}
                          colors={
                            (item.level == "Gold" && ["#DBA419", "#B57B0F", "#DCAC2F", "#FFCE1E", "#D8A52C", "#EECC37"]) ||
                            (item.level == "Bronze" && ["#FBDBC4", "#FBB392", "#E3784C", "#DD8E6D", "#FFD7B7", "#FEC3A7"]) ||
                            (item.level == "Silver" && ["#C4C4C4", "#ACACAC", "#EDEDED", "#929292", "#E3E3E3"]) ||
                            (item.level == "" && ["#FBDBC4", "#FBB392", "#E3784C", "#DD8E6D", "#FFD7B7", "#FEC3A7"])
                          }
                        >
                          <Text style={[styles.text16, { textAlign: "center" }]}>{item.totalPoints}</Text>
                        </LinearGradient>
                        <Text style={[styles.textGray, { textAlign: "right" }]}>{item.level}</Text>
                      </View>
                    </View>
                    <View style={{ borderWidth: 0.9, borderStyle: "dashed", borderRadius: 1, borderColor: colors.white }}></View>
                    <View style={{ flex: 1, justifyContent: "space-around", padding: 22, alignItems: "center" }}>
                      <TouchableHighlight
                        onPress={() => {
                          setModalView({ isShow: true, title: "Account information", isEdit: true });
                          setMemberModel(item);
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: colors.gray63,
                            width: 233,
                            height: 37,
                          }}
                        >
                          <View style={{ paddingRight: 8, paddingBottom: 0 }}>
                            <SvgUri source={Icons.icon_account} />
                          </View>
                          <Text style={styles.text}>Account information</Text>
                        </View>
                      </TouchableHighlight>
                      <TouchableHighlight
                        onPress={() => {
                          setModalView({ isShow: true, title: "Membership policy", isEdit: false });
                          setMemberModel(item);
                        }}
                      >
                        <View
                          style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: colors.gray63,
                            width: 233,
                            height: 37,
                          }}
                        >
                          <View style={{ paddingRight: 8, paddingBottom: 0 }}>
                            <SvgUri source={Icons.icon_docx} />
                          </View>
                          <Text style={styles.text}>Membership Policy</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </View>
                )}
              ></FlatList>
            </SafeAreaView>
          </View>
        </View>
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={modalView.isShow}>
        <View style={[styles.centeredView, styles.modelCategory, { justifyContent: "flex-start", height: windowHeight }]}>
          <View style={[styles.modalForm, { backgroundColor: "#414141", paddingLeft: 15, paddingRight: 15 }]}>
            <ScrollView>
              <View style={styles.titleModal}>
                <Text style={[styles.text16, { color: colors.mainColor }]}>{modalView.title}</Text>
              </View>
              {modalView.isEdit ? (
                <View style={{ paddingTop: 15, flexDirection: "row" }}>
                  <View style={{ flex: 2 }}>
                    <Text style={[styles.textGray, { margin: 4 }]}>Customer Code:</Text>
                    <Text style={[styles.textGray, { margin: 4 }]}>Full Name:</Text>
                    <Text style={[styles.textGray, { margin: 4 }]}>Phone:</Text>
                    <Text style={[styles.textGray, { margin: 4 }]}>Email:</Text>
                    <Text style={[styles.textGray, { margin: 4 }]}>Member Group:</Text>
                  </View>
                  <View style={{ flex: 2, alignItems: "flex-end" }}>
                    <Text style={[styles.text, { margin: 4 }]}>{memberModel?.memCode}</Text>
                    <Text style={[styles.text, { margin: 4 }]}>{memberModel?.lastName}</Text>
                    <Text style={[styles.text, { margin: 4 }]}>{memberModel?.homeTele}</Text>
                    <Text style={[styles.text, { margin: 4 }]}>{memberModel?.email}</Text>
                    <Text style={[styles.text, { margin: 4 }]}>{memberModel?.level}</Text>
                  </View>
                </View>
              ) : (
                <View style={{ marginTop: 24 }}>
                  <View>
                    <Text style={styles.text16}>
                      {memberModel?.lastName} - {memberModel?.level}
                    </Text>
                  </View>
                  <View style={{ marginTop: 24, flexDirection: "row" }}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.textGray}>Points Rate:</Text>
                    </View>
                    <View style={{ flex: 2, alignItems: "flex-end" }}>
                      <Text style={styles.text}>{memberModel?.totalPoints} point</Text>
                    </View>
                  </View>
                  <View style={{ marginTop: 24 }}>
                    <ProgressBar
                      style={{ height: 12, borderRadius: 4 }}
                      progress={memberModel?.totalPoints / 20000}
                      //   color={memberModel?.totalPoints}
                      color={"#E5B227"}
                    />
                    <View style={{ marginTop: 5, flexDirection: "row" }}>
                      <View style={{ flex: 2 }}>
                        <Text style={styles.textGray}>0</Text>
                      </View>
                      <View style={{ flex: 2, alignItems: "flex-end" }}>
                        <Text style={styles.text}>20000 point</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 24, flexDirection: "row" }}>
                    <View style={{ flex: 3, flexDirection: "row", alignItems: "center" }}>
                      <View style={{ borderRadius: 5, height: 10, width: 10, backgroundColor: "#DF855F" }}></View>
                      <View style={{ justifyContent: "center", marginLeft: 8 }}>
                        <Text style={styles.text}>Bronze</Text>
                      </View>
                    </View>
                    <View style={{ flex: 3, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                      <View style={{ borderRadius: 5, height: 10, width: 10, backgroundColor: "#E4E4E4" }}></View>
                      <View style={{ justifyContent: "center", marginLeft: 8 }}>
                        <Text style={styles.text}>Silver</Text>
                      </View>
                    </View>
                    <View style={{ flex: 3, flexDirection: "row", justifyContent: "flex-end", alignItems: "center" }}>
                      <View style={{ borderRadius: 5, height: 10, width: 10, backgroundColor: "#E5B227" }}></View>
                      <View style={{ justifyContent: "center", marginLeft: 8 }}>
                        <Text style={styles.text}>Gold</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              <View style={{ marginTop: 20, marginBottom: 0, justifyContent: "center", alignItems: "center" }}>
                <View style={styles.rowButton}>
                  <TouchableHighlight
                    style={{ borderRadius: 4 }}
                    underlayColor={colors.gray}
                    onPress={() => {
                      setModalView({ isShow: false });
                    }}
                  >
                    <View style={styles.buttonClose}>
                      <Text style={styles.text}>Close</Text>
                    </View>
                  </TouchableHighlight>
                  {/* <TouchableHighlight
                                            style={{ borderRadius: 4 }}
                                            underlayColor={colors.yellowishbrown}
                                            onPress={() => {
                                                
                                            }
                                            }
                                        >
                                            <View style={styles.buttonSend}>
                                                <Text style={styles.text}>Confirm</Text>
                                            </View>
                                        </TouchableHighlight> */}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
    paddingBottom: 8,
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
    flexDirection: "row",
    height: 90,
  },
  itemPerson: {
    flex: 3,
    borderRadius: 4,
    margin: 5,
    backgroundColor: colors.grayLight,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 12,
  },
  iconDown: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 12,
    zIndex: 4,
  },
  itemDropDown: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dropDowns: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
  },
  dropDowBody: {
    backgroundColor: colors.grayLight,
    position: "absolute",
    zIndex: 1000,
    right: 0,
    left: 0,
    top: 40,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemMember: {
    borderRadius: 4,
    height: 240,
    marginTop: 10,
    backgroundColor: colors.grayLight,
  },
  itemMemberHeader: {
    height: 109,
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  buttonClose: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#636363",
    borderRadius: 4,
  },
  buttonCreate: {
    height: 36,
    width: 150,
    borderRadius: 4,
    justifyContent: "center",
    backgroundColor: colors.mainColor,
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
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modelCategory: {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 190,
  },
  modalForm: {
    width: 360,
    marginBottom: 95,
    backgroundColor: "#414141",
    marginLeft: 15,
    marginRight: 15,
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
  gradient: {
    justifyContent: "center",
    height: 32,
    width: 88,
    borderRadius: 8,
  },
});
