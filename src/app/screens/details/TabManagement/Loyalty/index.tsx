import { RouteProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableHighlight, Text } from "react-native";
import PickerModel from "../../../../components/picker/PickerModel";
import { TabManageParamList } from "../../../../types";
import { colors } from "../../../../utils/Colors";
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from "react-native-gesture-handler";
import SvgUri from "react-native-svg-uri";
import { Icons } from "../../../../assets";
import { StackNavigationProp } from "@react-navigation/stack";

export interface Props {
    // route: RouteProp<TabManageParamList, "LoyaltyScreen">;
    navigation: StackNavigationProp<TabManageParamList>
}

export function LoyaltyScreen(props: Props) {
    const [isExpan, setIsExpan] = useState(false);
    return (
        <View style={styles.container}>
            <PickerModel
                defaultValue="Ola Restaurant"
                onSelectedValue={value => {
                    
                }}
            >
            </PickerModel>
            <View style={styles.line}></View>
            <ScrollView>
                <View>
                    <TouchableHighlight
                        underlayColor={colors.mainColor}
                        onPress={
                            () => {
                                props.navigation.navigate("MemberShipScreen")
                            }
                        }
                    >
                        <View style={[styles.expansionPanel]}>
                            <Text style={styles.title}>MEMBERSHIP</Text>
                        </View>
                    </TouchableHighlight >

                    <TouchableHighlight
                        underlayColor={colors.mainColor}
                        onPress={
                            () => {
                                props.navigation.navigate("LisOfPromotion")
                            }
                        }
                    >
                        <View style={[styles.expansionPanel]}>
                            <Text style={styles.title}>LIST OF PROMOTION</Text>
                        </View>
                    </TouchableHighlight >

                    <TouchableHighlight
                        underlayColor={colors.mainColor}
                        onPress={
                            () => {
                                props.navigation.navigate("ListOfOlaMember")
                            }
                        }
                    >
                        <View style={[styles.expansionPanel]}>
                            <Text style={styles.title}>LIST OF OLA MEMBER</Text>
                        </View>
                    </TouchableHighlight >

                    <TouchableHighlight
                        underlayColor={colors.mainColor}
                        onPress={
                            () => {
                                setIsExpan(!isExpan);
                            }
                        }
                    >
                        <View style={[styles.expansionPanel, isExpan ? styles.boderLeft7 : null]}>
                            <Text style={styles.title}>REPORT</Text>
                            <View style={{}}>
                                <SvgUri
                                    source={
                                        isExpan
                                            ? Icons.iconChevronDown
                                            : Icons.right_chevron
                                    }
                                />
                            </View>
                        </View>
                    </TouchableHighlight >
                    {
                        isExpan &&
                        <View style={{ backgroundColor: colors.grayLight }}>
                            <TouchableHighlight
                                underlayColor={colors.yellowishbrown}
                                onPress={
                                    () => {
                                        props.navigation.navigate("PromotionReport")
                                    }
                                }
                            >
                                <View style={[styles.item, { borderBottomColor: colors.colorLine, borderBottomWidth: 1 }]}>
                                    <Text style={styles.text}>Promotion Report</Text>
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight
                                underlayColor={colors.yellowishbrown}
                                onPress={
                                    () => {
                                        props.navigation.navigate("OlaMemberReport")
                                    }
                                }
                            >
                                <View style={styles.item}>
                                    <Text style={styles.text}>Ola Member Report</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    }
                </View>
            </ScrollView>
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
        fontWeight: '500',
        color: colors.white
    },
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600'
    },
    line: {
        height: 10,
        backgroundColor: colors.backgroundTab,
    },
    expansionPanel: {
        flex: 1,
        height: 60,
        paddingLeft: 24,
        paddingRight: 25,
        paddingTop: 18,
        paddingBottom: 18,
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.backgroundApp
    },
    boderLeft7: {
        borderLeftColor: colors.mainColor,
        borderLeftWidth: 7,
    },
    item: {
        flex: 1,
        marginLeft: 15,
        height: 41,
        justifyContent: 'center',
        marginRight: 15,
    }
});