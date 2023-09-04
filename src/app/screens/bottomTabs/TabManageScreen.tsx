import * as React from "react";
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableHighlight,
  Alert,
  Modal,
  Dimensions,
  TouchableNativeFeedback,
  ImageProps,
} from "react-native";
import { colors } from "../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Icons } from "../../assets";
import { StackNavigationProp } from "@react-navigation/stack";
import { TabManageParamList } from "../../types";
import SvgUri from "react-native-svg-uri";
import PickerModel from "../../components/picker/PickerModel";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
interface Props {
  navigation: StackNavigationProp<TabManageParamList>;
}

export default function TabManageScreen(props: Props) {
  const { access } = useSelector((state: RootState) => state.accesses);
  const [isOperation, setOperation] = useState(false);
  const [isBackOffice, setBackOffice] = useState(false);
  const [isMarketing, setMarketing] = useState(false);
  const checkRole = (name: string) =>{
    if(access.findIndex(e => e.name.toLowerCase() == name.toLowerCase()) !== -1 ){
      return true
    }else{
      return false
    }
  }
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: colors.backgroundApp }}>
        <PickerModel defaultValue="Ola Restaurant" onSelectedValue={value => {}}></PickerModel>
      </View>
      <View style={styles.line}></View>
      <ScrollView>
        <View style={{ flex: 1 }}>
          {checkRole('OPERATION MANAGEMENT') && (
            <TouchableHighlight
              underlayColor={colors.mainColor}
              onPress={() => {
                setOperation(!isOperation);
              }}
            >
              <View style={[styles.expansionPanel, isOperation ? styles.boderLeft7 : null]}>
                <Text style={styles.title}>OPERATION MANAGEMENT</Text>
                <View style={{}}>
                  <SvgUri source={isOperation ? Icons.iconChevronDown : Icons.right_chevron} />
                </View>
              </View>
            </TouchableHighlight>
          )}

          {isOperation ? (
            <View style={styles.expansionPanelContent}>
              {checkRole('Booking System Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("BookingSystem", {
                      title: "OPERATION-BOOKING SYSTEM",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.calender} />
                    </View>
                    <View>
                      <Text style={styles.text}>Booking System</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              {checkRole('Table Management Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("TableManagementScreen", {
                      title: "OPERATION-TABLE MANAGEMENT",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.tableGrid} />
                    </View>
                    <View>
                      <Text style={styles.text}>Table Management</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}

              {checkRole('Revenue Management Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("ManagementDetail", {
                      title: "OPERATION-REVENUE",
                      id: 3,
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.growth} />
                    </View>
                    <View>
                      <Text style={styles.text}>Real Time Revenue Management</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}

              {checkRole('Online System Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("OnlineSystemScreen", {
                      title: "OPERATION - ONLINE SYSTEM",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.global} />
                    </View>
                    <View>
                      <Text style={styles.text}>Online System</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}

              {checkRole('Loyalty Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("LoyaltyScreen");
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.handShake} />
                    </View>
                    <View>
                      <Text style={styles.text}>Loyalty</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            </View>
          ) : (
            <View></View>
          )}
          {checkRole('BACK OFFICE MANAGEMENT') && (
            <TouchableHighlight
              underlayColor={colors.mainColor}
              onPress={() => {
                setBackOffice(!isBackOffice);
              }}
            >
              <View style={[styles.expansionPanel, isBackOffice ? styles.boderLeft7 : null]}>
                <Text style={styles.title}>BACK OFFICE MANAGEMENT</Text>
                <View style={{}}>
                  <SvgUri source={isBackOffice ? Icons.iconChevronDown : Icons.right_chevron} />
                </View>
              </View>
            </TouchableHighlight>
          )}

          {isBackOffice ? (
            <View style={styles.expansionPanelContent}>
              {checkRole('Staff Management Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("StaffManagementScreen", {
                      title: "BACK OFFICE - STAFF MANAGEMENT",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.management} />
                    </View>
                    <View>
                      <Text style={styles.text}>Staff Management</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              {checkRole('Cost Management Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("StockInventoryScreen", {
                      title: "BACK OFFICE - COST MANAGEMENT",
                      id: 10,
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.compliance} />
                    </View>
                    <View>
                      <Text style={styles.text}>Cost Management</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              {checkRole('Stock Inventory List Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("StockInventoryListScreen", {
                      title: "",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.iconList} />
                    </View>
                    <View>
                      <Text style={styles.text}>Stock Inventory List</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              {checkRole('Product Margin Management Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("ManagementProductItem", {
                      title: "BACK OFFICE - PRODUCT MANAGEMENT",
                      id: 11,
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.supply} />
                    </View>
                    <View>
                      <Text style={styles.text}>Product Margin Management</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
              {checkRole('Product Item List Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("ProductItemListScreen", {
                      title: "BACK OFFICE - PRODUCT ITEM LIST",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.package} />
                    </View>
                    <View>
                      <Text style={styles.text}>Product Item List</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}

              {checkRole('Recipe Management Screen') && (
                <TouchableHighlight
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    props.navigation.navigate("RecipeManagementScreen", {
                      title: "BACK OFFICE - Recipe Management",
                    });
                  }}
                >
                  <View style={styles.expansionPanelItem}>
                    <View style={styles.icon}>
                      <SvgUri source={Icons.receipt} />
                    </View>
                    <View>
                      <Text style={styles.text}>Recipe Management</Text>
                    </View>
                  </View>
                </TouchableHighlight>
              )}
            </View>
          ) : (
            <View></View>
          )}
          {checkRole('IOT MANAGEMENT') && <TouchableHighlight
            underlayColor={colors.mainColor}
            onPress={() => {
              props.navigation.navigate("HTSStack", {
                title: "HTSStack",
              });
            }}
          >
            <View style={[styles.expansionPanel, isMarketing ? styles.boderLeft7 : null]}>
              <Text style={styles.title}>IOT MANAGEMENT</Text>
              <View style={{}}>
                <SvgUri source={isMarketing ? Icons.iconChevronDown : Icons.right_chevron} />
              </View>
            </View>
          </TouchableHighlight>}
         
          {<View></View>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundTab,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
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
  boderLeft7: {
    borderLeftColor: colors.mainColor,
    borderLeftWidth: 7,
  },
  expansionPanelContent: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.grayLight,
  },
  expansionPanelItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 15,
  },
  icon: {
    marginRight: 8,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },
  modalView: {
    backgroundColor: colors.white,
    width: 354,
    height: 200,
    padding: 15,
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
});
