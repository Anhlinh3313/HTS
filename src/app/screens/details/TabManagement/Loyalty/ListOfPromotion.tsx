import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Switch, Modal, ScrollView, Dimensions, TextInput, FlatList } from "react-native";
import { TouchableHighlight } from "react-native-gesture-handler";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../../assets";
import DropDown from "../../../../components/dropDown/DropDown";
import PickerModel from "../../../../components/picker/PickerModel";
import { IModal } from "../../../../models/Imodal";
import { Imodel } from "../../../../models/Imodel";
import { PromotionModel } from "../../../../models/promotionModel";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";
import DatePickerCustom from "../../../../components/DatePickerCustom";

import moment from "moment";
import DialogAwait from "../../../../components/dialogs/Loading";
import { GetPromotionType, getListPromotion } from "../../../../netWorking/loyaltyService";
import { PromotionTypeModal, PromotionModal } from "../../../../models/royaltyModel";
import PickerInput from "../../../../components/PickerInput";
import { Money } from "../../../../components/generalConvert/conVertmunberToMoney";

export function LisOfPromotion() {
  const PAGE_SIZE = 30;
  const [isLoading, setIsLoading] = useState(false);
  const [outlet, setOutlet] = useState(2);
  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  const initPromotion = {
    isShow: null,
    promoNum: null,
    promoName: null,
    promoType: null,
    promoValue: null,
    rangeStart: null,
    rangeEnd: null,
    isActive: null,
  };
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const windowWidth = dimensions.width;
  const modalNull: IModal = { isShow: false, title: "", isEdit: false };
  const [modalPromotion, setModalPromotion] = useState(modalNull);
  const [promotionModel, setPromotionModel] = useState<PromotionModal>(initPromotion);
  const [listPromotion, setListPromotion] = useState<PromotionModal[]>([]);
  const [typePromotion, setTypePromotion] = useState<Imodel[]>([]);
  const [page, setPage] = useState(1);
  const [disableLoadMore, setDisableLoadMore] = useState(false);
  const loadPromotionType = async () => {
    const res = await GetPromotionType();
    if (res.isSuccess == 1 && res.data) {
      let dataList = res.data as PromotionTypeModal[];
      let _typePromotion = [];
      dataList.map(item => {
        if (item.isEnabled) {
          _typePromotion.push({ label: item.typeName, value: item.typeId });
        }
      });
      setTypePromotion(_typePromotion);
    }
  };
  const loadListPromotion = async () => {
    setIsLoading(true);
    const res = await getListPromotion(page, PAGE_SIZE);
    if (res.isSuccess == 1) {
      if (res.data.length == 0) {
        setDisableLoadMore(true);
      } else {
        setDisableLoadMore(false);
      }
      let dataList = res.data as PromotionModal[];
      let _typePromotion = listPromotion;
      dataList.map(item => {
        _typePromotion.push({
          isShow: false,
          promoNum: item.promoNum,
          promoName: item.promoName,
          promoType: item.promoType,
          promoValue: item.promoValue,
          rangeStart: item.rangeStart,
          rangeEnd: item.rangeEnd,
          isActive: item.isActive,
        });
      });

      setListPromotion(_typePromotion);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadPromotionType();
  }, []);
  useEffect(() => {
    loadListPromotion();
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

      <View>
        <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
          <View style={[styles.titleHeader, { justifyContent: "center" }]}>
            <View style={{ alignSelf: "center" }}>
              <Text style={[styles.textTitleHeader, { textAlign: "center" }]}>LIST OF PROMOTION</Text>
            </View>
            {/* <View style={{  alignItems: "flex-end", justifyContent: "center" }}>
              <TouchableHighlight
                underlayColor={colors.yellowishbrown}
                onPress={() => {
                  setModalPromotion({ isShow: true, isEdit: false, title: "Add New" });
                  setPromotionModel(initPromotion);
                }}
              >
                <View>
                  <SvgUri source={Icons.iconAdd_elip}></SvgUri>
                </View>
              </TouchableHighlight>
            </View> */}
          </View>
        </View>
      </View>
      <View style={{ marginTop: 15, flex: 1, paddingHorizontal: 15 }}>
        <FlatList
          style={{ flex: 1 }}
          nestedScrollEnabled={true}
          horizontal={false}
          data={listPromotion}
          onEndReached={() => {
            if (!disableLoadMore) {
              setPage(prevState => prevState + 1);
            }
          }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={[styles.itemPromotion, { zIndex: 9999 - index }]}>
              <View style={styles.itemPromotionRow}>
                <View style={{ flexDirection: "row" }}>
                  <View>
                    <SvgUri source={Icons.iconPromotion}></SvgUri>
                  </View>
                  <View style={{ justifyContent: "center", marginLeft: 15 }}>
                    <Text style={styles.text16}>{item.promoName}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <View>
                    <TouchableHighlight
                      onPress={() => {
                        setPromotionModel(item);
                        setModalPromotion({ isShow: true, isEdit: true, title: "Edit Promotion" });
                      }}
                    >
                      <SvgUri source={Icons.iconEditPrice}></SvgUri>
                    </TouchableHighlight>
                  </View> */}
                  <View style={{ marginLeft: 15 }}>
                    <TouchableHighlight
                      onPress={() => {
                        item.isShow = !item.isShow;
                        setListPromotion([...listPromotion]);
                      }}
                    >
                      <Ionicons name={item.isShow ? "caret-up" : "caret-down"} size={20} color="#fff" />
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
              <View style={styles.itemPromotionRow}>
                <View style={{}}>
                  <Text style={styles.textItemGray}>Valid From:</Text>
                </View>

                <View style={{}}>
                  <Text style={styles.textItem}>{item.rangeStart ? moment(item.rangeStart).format("DD/MM/YYYY") : ""}</Text>
                </View>
              </View>
              <View
                style={[styles.itemPromotionRow, item.isShow && { borderBottomWidth: 0.5, borderBottomColor: colors.black05 }]}
              >
                <View style={{}}>
                  <Text style={styles.textItemGray}>Valid To:</Text>
                </View>

                <View style={{}}>
                  <Text style={styles.textItem}>{item.rangeEnd ? moment(item.rangeEnd).format("DD/MM/YYYY") : ""}</Text>
                </View>
              </View>
              {item.isShow && (
                <View style={{ marginTop: 5, zIndex: 2 }}>
                  <View style={styles.itemPromotionRow}>
                    <View style={{}}>
                      <Text style={styles.textItemGray}>Description:</Text>
                    </View>

                    <View style={{}}>
                      <Text style={styles.textItem}>{item.promoName}</Text>
                    </View>
                  </View>
                  <View style={[styles.itemPromotionRow, { zIndex: 2 }]}>
                    <View style={{}}>
                      <Text style={styles.textItemGray}>Type:</Text>
                    </View>

                    {/* <View style={{ width: 144 }}>
                      <PickerInput
                        value={typePromotion.length > 0 ? typePromotion.find(element => element.value === item.promoType).label : ""}
                        items={typePromotion.map(item => item["label"])}
                        onChoose={value => {
                          
                        }}
                      ></PickerInput>
                    </View> */}
                     <View style={{}}>
                      <Text style={styles.textItem}>{typePromotion.length > 0 ? typePromotion.find(element => element.value === item.promoType).label : ""}</Text>
                    </View>
                  </View>

                  <View style={styles.itemPromotionRow}>
                    <View style={{}}>
                      <Text style={styles.textItemGray}>Value:</Text>
                    </View>

                    <View style={{}}>
                      <Text style={styles.textItem}>{Money(item.promoValue)}</Text>
                    </View>
                  </View>

                  {/* <View style={styles.itemPromotionRow}>
                    <View style={{}}>
                      <Text style={styles.textItemGray}>Number of promotion issued:</Text>
                    </View>

                    <View style={{}}>
                      <Text style={styles.textItem}></Text>
                    </View>
                  </View>

                  <View style={styles.itemPromotionRow}>
                    <View style={{}}>
                      <Text style={styles.textItemGray}>Promotion Usage Count:</Text>
                    </View>

                    <View style={{}}>
                      <Text style={styles.textItem}></Text>
                    </View>
                  </View> */}

                  <View style={styles.itemPromotionRow}>
                    <View style={{}}>
                      <Text style={styles.textItemGray}>Status</Text>
                    </View>

                    <View style={{}}>
                      <View style={[styles.buttonActive, { backgroundColor: item.isActive ? "#76D146" : "#FF3232" }]}>
                        <Text style={[styles.text, { textAlign: "center" }]}>{item.isActive ? "Active" : "Inactive"}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}
        ></FlatList>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalPromotion.isShow}>
        <View style={[styles.centeredView, { justifyContent: "flex-start", height: windowHeight }]}>
          <View
            style={[
              styles.modalForm,
              { marginTop: 115, backgroundColor: "#414141", justifyContent: "space-between", paddingLeft: 15, paddingRight: 15 },
            ]}
          >
            <ScrollView>
              <View style={{ zIndex: 2 }}>
                <View style={styles.titleModal}>
                  <Text style={[styles.text16, { color: colors.mainColor }]}>{modalPromotion.title}</Text>
                </View>

                <View>
                  <View style={{ marginTop: 10 }}>
                    <View>
                      <Text style={styles.titleInput}>Valid From</Text>
                    </View>
                    <View>
                      <TextInput
                        placeholder="Valid from"
                        placeholderTextColor={colors.gray}
                        editable={false}
                        style={styles.textInput}
                        value={
                          promotionModel.rangeStart
                            ? moment(promotionModel.rangeStart).format("DD/MM/YYYY HH:mm")
                            : moment(new Date()).format("DD/MM/YYYY HH:mm")
                        }
                      />
                      <View style={{ position: "absolute", right: 15, top: 15 }}>
                        <DatePickerCustom
                          onSubmit={date => {
                            setPromotionModel(prevState => ({
                              ...prevState,
                              rangeStart: date,
                            }));
                          }}
                          isShowLable={false}
                          isShowTime={true}
                        ></DatePickerCustom>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <View>
                      <Text style={styles.titleInput}>Valid To</Text>
                    </View>
                    <View>
                      <TextInput
                        placeholder="Valid to"
                        placeholderTextColor={colors.gray}
                        editable={false}
                        style={styles.textInput}
                        value={
                          promotionModel.rangeEnd
                            ? moment(promotionModel.rangeEnd).format("DD/MM/YYYY HH:mm")
                            : moment(new Date()).format("DD/MM/YYYY HH:mm")
                        }
                      />
                      <View style={{ position: "absolute", right: 15, top: 15 }}>
                        <DatePickerCustom
                          onSubmit={date => {
                            setPromotionModel(prevState => ({
                              ...prevState,
                              rangeEnd: date,
                            }));
                          }}
                          isShowLable={false}
                          isShowTime={true}
                        ></DatePickerCustom>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 10, zIndex: 99 }}>
                    <View>
                      <Text style={styles.titleInput}>Type</Text>
                    </View>
                    <DropDown
                      data={typePromotion}
                      heightContent={120}
                      defaultLabel={
                        promotionModel.promoType !== null
                          ? typePromotion.find(element => element.value === promotionModel.promoType).label
                          : "Choose.."
                      }
                      onSelected={data => {
                        setPromotionModel(prevState => ({
                          ...prevState,
                          promoType: data.value,
                        }));
                      }}
                    ></DropDown>
                  </View>

                  <View style={{ marginTop: 10 }}>
                    <View>
                      <Text style={styles.titleInput}>Value</Text>
                    </View>
                    <View>
                      <TextInput
                        onChangeText={text => {
                          setPromotionModel(prevState => ({
                            ...prevState,
                            promoValue: +text,
                          }));
                        }}
                        placeholder="Value"
                        keyboardType="numeric"
                        placeholderTextColor={colors.gray}
                        style={styles.textInput}
                        value={promotionModel?.promoValue?.toString()}
                      />
                    </View>
                  </View>

                  {/* <View style={{ marginTop: 10 }}>
                    <View>
                      <Text style={styles.titleInput}>Number Of Promotion</Text>
                    </View>
                    <View>
                      <TextInput
                        // onChangeText={text => {
                        //   setPromotionModel(prevState => ({
                        //     ...prevState,
                        //     promoValue: +text,
                        //   }));
                        // }}
                        placeholder="Number Of Promotion"
                        keyboardType="numeric"
                        placeholderTextColor={colors.gray}
                        style={styles.textInput}
                        value={promotionModel?.promoValue?.toString()}
                      />
                    </View>
                  </View> */}

                  <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                      <Text style={styles.titleInput}>Active</Text>
                    </View>
                    <View>
                      <Switch
                        trackColor={{ false: colors.gray63, true: colors.mainColor }}
                        thumbColor={promotionModel.isActive ? colors.white : colors.white}
                        ios_backgroundColor={colors.white}
                        onValueChange={() =>
                          setPromotionModel(prevState => ({
                            ...prevState,
                            isActive: !promotionModel.isActive,
                          }))
                        }
                        value={promotionModel?.isActive}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ marginTop: 20, marginBottom: 0, flexDirection: "row", alignItems: "center" }}>
                <View style={styles.rowButton}>
                  <TouchableHighlight
                    style={{ borderRadius: 4 }}
                    underlayColor={colors.yellowishbrown}
                    onPress={() => {
                      setModalPromotion({ isShow: false });
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
                      // if (!modalItem.isEdit) {

                      //     createProducItem();
                      // }
                      // else {
                      //     updateProducItem();
                      // }
                      setModalPromotion({ isShow: false });
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
      </Modal>
      {isLoading && <DialogAwait></DialogAwait>}
      
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
    textAlign: "center",
  },
  textGray: {
    color: colors.colorLine,
    fontWeight: "400",
    fontSize: 14,
  },
  textItem: {
    color: colors.white,
    fontWeight: "400",
    fontSize: 14,
    margin: 5,
  },
  textItemGray: {
    color: colors.colorLine,
    fontWeight: "400",
    fontSize: 14,
    margin: 5,
  },
  titleInput: {
    fontSize: 12,
    color: colors.gray,
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
    flexDirection: "row",
  },

  textTitleHeader: {
    color: colors.colorText,
    fontWeight: "500",
    fontSize: 16,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  itemPromotion: {
    borderRadius: 4,
    marginBottom: 10,
    padding: 15,
    backgroundColor: colors.grayLight,
  },
  itemPromotionRow: {
    paddingVertical: 2,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonActive: {
    height: 25,
    width: 76,
    justifyContent: "center",
    borderRadius: 4,
    backgroundColor: "#76D146",
  },
});
