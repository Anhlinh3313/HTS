import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableHighlight, Image, TouchableOpacity, Modal, Alert, Pressable, TextInput, TouchableNativeFeedback, Keyboard, TouchableWithoutFeedback, Dimensions, ImageProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import moment from 'moment';
import { Icons } from '../../../assets';
import { colors } from '../../../utils/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import SvgUri from 'react-native-svg-uri';
import DateTimePicker from '../../../components/datetimepicker';
import PickerModel from '../../../components/picker/PickerModel';

export default function TabReportDetail() {
    const dataModel = [
        { label: 'Outlet 1', value: 1 },
        { label: 'Outlet 2', value: 2 },
        { label: 'Outlet 3', value: 3 },
        { label: 'Outlet 4', value: 4 },
        { label: 'Outlet 5', value: 5 },
    ]
    const [modalVisible, setModalVisible] = useState(false);
    const [modalFailsVisible, setModalFailsVisible] = useState(false);
    const [modalSuccessVisible, setModalSuccessVisible] = useState(false);

    const [description, setDesCription] = useState('');
    const [email, setEmail] = useState('');

    const toDate = new Date();
    const [fromDateTime, setFromDateTime] = useState(
        moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD")
    );
    const [endDateTime, setEndDateTime] = useState(
        moment(new Date().setDate(toDate.getDate() - 1)).format("YYYY-MM-DD")
    );
    return (
        <View style={styles.container}>
             <PickerModel
                data={dataModel}
                defaultValue="Outlet"
                onSelectedValue={value => {
                    
                }}
            >
            </PickerModel>
            <DateTimePicker
                onSubmitFromDate={date => setFromDateTime(date)}
                onSubmitEndDate={date => setEndDateTime(date)}
            ></DateTimePicker>
            <View style={styles.line}></View>

            <ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={styles.body}>
                        <View style={styles.rowHeader}>
                            <Text style={{ fontSize: 14, color: colors.white, fontWeight: '500' }}>NET REVENUE </Text>
                        </View>
                        <View style={{ height: 37 }}>

                        </View>
                        <View style={styles.rowItem}>

                        </View>
                        <View style={{ height: 37 }}>

                        </View>
                        <View style={styles.rowItem}>

                        </View>
                        <View style={{ height: 37 }}>

                        </View>
                    </View>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LinearGradient style={styles.buttonSubmit}
                        colors={['#DAB451', '#988050']}>
                        <TouchableHighlight
                            underlayColor={colors.yellowishbrown}
                            onPress={
                                () => {
                                    setModalVisible(true);
                                    setDesCription('');
                                    setEmail('');
                                }}
                        >
                            <View style={{
                                height: 36,
                                width: 150,
                                justifyContent: 'center'
                            }}>
                                <Text style={[styles.title, { textAlign: 'center' }]}>Send</Text>
                            </View>
                        </TouchableHighlight>
                    </LinearGradient>

                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>

                    <TouchableNativeFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalView}>

                            <View style={styles.titleModal}>
                                <Text style={[styles.title, { color: colors.mainColor }]}>Sales & TC - Hourly</Text>
                            </View>

                            <View style={{ paddingTop: 15 }}>
                                <Text style={{ fontSize: 12, color: colors.gray }}>Description</Text>
                                <TextInput style={styles.textInputArea}
                                    multiline={true}
                                    placeholder="Enter text"
                                    placeholderTextColor={colors.gray}
                                    onChangeText={(text) => setDesCription(text)}
                                    value={description} />
                            </View>

                            <View style={{ paddingTop: 15 }}>
                                <Text style={{ fontSize: 12, color: colors.gray }}>Send to email</Text>
                                <TextInput placeholder="Enter email"
                                    placeholderTextColor={colors.gray}
                                    style={styles.textInput}
                                    onChangeText={(text) => setEmail(text)}
                                    value={email} />
                            </View>
                            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={styles.rowButton}>
                                    <TouchableHighlight
                                        style={{ borderRadius: 4 }}
                                        underlayColor={colors.yellowishbrown}
                                        onPress={() => {
                                            setModalVisible(!modalVisible)
                                            setModalSuccessVisible(true);
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
                                            setModalVisible(!modalVisible);
                                            // setModalSuccessVisible(true);
                                            setModalFailsVisible(true);
                                        }}
                                    >
                                        <View style={styles.buttonSend}>
                                            <Text style={styles.text}>Send</Text>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalFailsVisible}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <TouchableHighlight
                        underlayColor='#414141'
                        style={{ borderRadius: 4 }}
                        onPress={() => {
                            setModalFailsVisible(false)
                        }}>
                        <View style={{ height: 200, borderRadius: 4, backgroundColor: '#414141' }}>
                            <SvgUri height="150" source={Icons.iconModelFails} />
                            <Text style={[styles.textConfirm, { color: colors.red }]}>Fails to send</Text>
                        </View>
                    </TouchableHighlight>

                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalSuccessVisible}
            >
                <View style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                }}>
                    <TouchableHighlight
                        underlayColor='#414141'
                        style={{ borderRadius: 4 }}
                        onPress={() => {
                            setModalSuccessVisible(false)
                        }}
                    >
                        <View style={{ height: 200, borderRadius: 4, backgroundColor: '#414141' }}>
                            <SvgUri height="150" source={Icons.iconModelSuccess} />
                            <Text style={styles.textConfirm}>Send Success</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundApp,
    },
    body: {
        flex: 1,
        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 4,
        backgroundColor: colors.grayLight
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
    containerPicker: {
        backgroundColor: colors.backgroundApp,
        paddingBottom: 15
    },
    viewPicker: {
        marginLeft: 15,
        marginRight: 15,
        paddingLeft: 15,
        backgroundColor: colors.grayLight,
        borderRadius: 4
    },
    pickerModal: {
        height: 46,
        borderRadius: 4,
        justifyContent: 'center',
        backgroundColor: colors.grayLight,
        color: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
    },
    rowFromDate: {
        flex: 1,
        height: 65,
        backgroundColor: colors.backgroundApp,
        paddingRight: 5,
    },
    textFromDate: {
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 18,
        color: '#A4A4A4'
    },
    fromDate: {
        flex: 1,
        borderRadius: 4,
        backgroundColor: '#414141',
        fontSize: 14,
        paddingTop: 5,
        paddingLeft: 8,
    },
    endDate: {
        fontStyle: 'normal',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 18,
        color: '#A4A4A4'
    },
    rowEndDate: {
        flex: 1,
        height: 65,
        backgroundColor: colors.backgroundApp,
        paddingLeft: 5,
    },
    textDateTime: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: 8,
    },
    iconDown: {
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 12,
        zIndex: 4
    },
    line: {
        height: 10,
        backgroundColor: colors.backgroundTab,
    },
    rowHeader: {
        flex: 1,
        flexDirection: 'row',
        height: 37,
        paddingLeft: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#878787',
        borderTopStartRadius: 4,
        borderTopEndRadius: 4
    },
    rowItem: {
        flex: 1,
        height: 37,
        justifyContent: 'flex-start',
        backgroundColor: '#8D7550',
    },
    buttonSubmit: {
        height: 36,
        width: 150,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        backgroundColor: '#414141',
        width: 354,
        height: 437,
        margin: 15,
        borderRadius: 4,
        paddingBottom: 20,
        justifyContent: 'flex-start',
        paddingLeft: 15,
        paddingRight: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalViewConform: {
        backgroundColor: '#414141',
        width: 354,
        height: 437,
        margin: 15,
        borderRadius: 4,
        paddingBottom: 20,
        justifyContent: 'flex-start',
        paddingLeft: 15,
        paddingRight: 15,
    },
    titleModal: {
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
        alignItems: 'center',
        padding: 15
    },
    textInput: {
        marginTop: 5,
        fontSize: 14,
        paddingLeft: 11,
        height: 40,
        backgroundColor: '#303030',
        color: colors.white,
        fontStyle: 'italic'
    },
    textInputArea: {
        marginTop: 5,
        fontSize: 14,
        padding: 11,
        height: 170,
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        backgroundColor: '#303030',
        textAlignVertical: "top",
        color: colors.white,
        fontStyle: 'italic'
    },
    rowButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonClose: {
        height: 36,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#636363',
        borderRadius: 4,
    },
    buttonSend: {
        height: 36,
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#DAB451',
        borderRadius: 4,
    },
    centeredViewPicker: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 15,
        paddingRight: 15,
    },
    modalViewPicker: {
        backgroundColor: colors.white,
        width: 354,
        height: 200,
        padding: 15,
        borderRadius: 4,
        paddingBottom: 20,
        justifyContent: 'flex-start',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textConfirm: {
        color: colors.mainColor, fontSize: 20, textAlign: 'center'
    },
    dateTimeModal: {
        flex: 1,
        width: "100%",
        position: "absolute",
        backgroundColor: " rgba(0, 0, 0, 0.5)",
    },
    dateTimeContainer: {
        width: "90%",
        alignSelf: 'center',
        backgroundColor: "#414141",
        borderRadius: 5,
    },
    dateTimeHeader: {
        width: "100%", justifyContent: "center", marginTop: 14
    },
    dateTimeHeaderText: {
        color: "#fff", textAlign: "center", fontSize: 17
    },
    timeContainer: {
        flexDirection: "row", padding: 30, height: 150
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
        alignItems: 'center',
        justifyContent: 'center'
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
        color: "#fff", textAlign: "center", fontSize: 17
    }
});
