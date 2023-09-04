import React, { useState, useEffect } from "react";
import { Modal, View, Text, ActivityIndicator, StyleSheet, FlatList, StyleProp, ViewStyle } from "react-native";
import { Imodel } from "../../models/Imodel";
import { colors } from "../../utils/Colors";
import { Ionicons } from '@expo/vector-icons';
import { TouchableHighlight, TouchableOpacity, ScrollView } from "react-native-gesture-handler";
const DropDown = ({
    data,
    defaultLabel = "Choose Item",
    backgroundColor,
    heightContent,
    onSelected,
    value,
}: {
    data: Imodel[];
    defaultLabel?: string;
    backgroundColor?:StyleProp<ViewStyle>
    heightContent?:number
    onSelected: (values: Imodel) => void;
    value?:Imodel
}) => {
    //bỏ đi thằng vừa chọn không load lại bị bug
    // data.splice(0, 1);
    const [isShowDropdow, setIsShowDropdow] = useState(false);
    const [categoryName, setCategoryName] = useState<string>(defaultLabel ?? value.label??'')
    const onSelectedItem = (val: Imodel) => {
        onSelected(val);
        setCategoryName(val.label ?? '');
        setIsShowDropdow(!isShowDropdow);
    }
    useEffect(() => {
        if(value){
            setCategoryName(value.label)
        }
    }, [value])
    return (
        <View>
            <TouchableHighlight
                style={{ height: 50 }}
                underlayColor={'transparent'}
                onPress={() => {
                    setIsShowDropdow(!isShowDropdow);
                }}
            >

                <View style={[styles.viewPickCategory,backgroundColor??{backgroundColor:'#303030'}]}>
                    <View style={{ height: 40, justifyContent: 'center' }}>
                        <Text style={{ color: colors.white, fontSize: 16, paddingLeft: 10, }}>{categoryName}</Text>
                    </View>

                    <Ionicons style={styles.iconDown} name="caret-down" size={20} color="#fff" />
                </View>
            </TouchableHighlight>
            {
                isShowDropdow &&
                <View style={{ backgroundColor: '#303030', borderRadius: 4, paddingVertical: 18, position: 'absolute', zIndex: 1000, right: 0, left: 0, top: 47,
                                shadowColor: "#000",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84, elevation: 5 }}>
                    <View style={[heightContent?{height:heightContent}:{height:150 }]}>
                        <ScrollView
                            nestedScrollEnabled
                        >
                            {
                                data.map((item,index) => (
                                    <TouchableHighlight
                                        key={index}
                                        underlayColor={'#675E50'}
                                        onPress={() => onSelectedItem(item)}
                                        style={styles.itemDropDown}>
                                        <Text numberOfLines={1} style={styles.text}>{item.label}</Text>

                                    </TouchableHighlight>
                                ))
                            }
                        </ScrollView>

                    </View>
                </View>
            }
        </View>
    );
}
export default DropDown;
const styles = StyleSheet.create({
    text: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600'
    },
    itemDropDown: {
        padding: 10,
        paddingLeft:18,
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconDown: {
        justifyContent: 'center',
        position: 'absolute',
        right:5,
        zIndex: 4
    },
    viewPickCategory: {
        marginTop: 5,
        // backgroundColor: '#303030',
        borderRadius: 4, justifyContent:'center'
    },
})