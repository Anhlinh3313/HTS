import * as React from 'react';
import { View, Text, ActivityIndicator, Modal,Alert } from 'react-native';
import { Image, StyleSheet, TextInput, Keyboard, TouchableNativeFeedback, Platform, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Images,Icons } from '../assets';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthorStackParamList } from '../types';
import { colors } from '../utils/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { loginAsync, _getAccount } from '../netWorking/authService'
import { UserService } from '../netWorking/userService'
import { getToken } from '../netWorking/eohService'
import { ScrollView } from 'react-native-gesture-handler';
import SvgUri from "react-native-svg-uri";
import DialogAwait from '../components/dialogs/dialogAwait';
import * as LocalAuthentication from 'expo-local-authentication'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
interface Props {
    navigation: StackNavigationProp<AuthorStackParamList>
}

export default function LoginScreen(props: Props) {
    const dispatch = useDispatch();
    
    const [typeBiometric, setTypeBiometric] = useState([]);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [isSecurity, setIsSecurity] = useState(false);

    const [isSubmit, setIssubmit] = useState(false);
    const [isShowPass, setShowPass] = useState(false);
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');
    const [txtErrorPhone, setTxtErrorPhone] = useState('');
    const [txtErrorPass, setTxtErrorPass] = useState('');
    const [isFocusPhone, setIsFocusPhone] = useState(false);
    const [isFocusPass, setIsFocusPass] = useState(false);

    
    async function registerForPushNotificationsAsync() {
        let token;
        let tokenDevice;
        if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        tokenDevice = (await Notifications.getDevicePushTokenAsync()).data;
        } else {
        alert("Must use physical device for Push Notifications");
        }
    
        if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
        }
    
        return token;
    }

    async function _getAsyncStorage() {
        try {
            let res= await AsyncStorage.getItem('security');
            if(res !== null) setIsSecurity(!!+res)
        } catch (error) {
            return error;
        }
    }
    const onChangePhoneNumber = (value: string) => {
        setPhonenumber(value)
        if (value && phonenumber) {
            setTxtErrorPhone('');
        }
    }

    const onChangePass = (value: string) => {
        setPassword(value)
        if (value && password) {
            setTxtErrorPass('');
        }
    }

    const clearInput = () => {
        setPhonenumber('');
        setPassword('');
        setTxtErrorPhone('');
        setTxtErrorPass('');
    }

    const onSubmit = async () => {
        // setIssubmit(true);
        // clearInput();
        // props.navigation.replace("Main");
        // setIssubmit(false);

        let validate = validateForm()
        if (validate) {
            setIssubmit(true);
            const res = await loginAsync(phonenumber, password);
            if (res) {
                if (res?.isSuccess == '1') { 
                    const auth =await getToken('0399338390','RgWhhm^xC@xdQ68N')
                    if(auth){dispatch({ type: "GET_ACCOUNT", payload: auth })}
                    let tokenDevice = await registerForPushNotificationsAsync()
                    let resFireBase = await UserService.updateFireBaseToken({FireBaseToken:tokenDevice})
                    onGetMenuAccess(res.data.userId)
                    
                    clearInput();
                    props.navigation.replace("Main");
                }
                else {
                    setTxtErrorPhone(res?.message);
                }
            }
            setIssubmit(false);
        }
    }

    const validateForm = () => {
        if (phonenumber === '') {
            setTxtErrorPhone("PhoneNumber or Email cannot be blank!")
            return false
        }
        if (password === '') {
            setTxtErrorPass("Password cannot be blank!")
            return false

        }
        if (password.length < 6) {
            setTxtErrorPass("Invalid password!")
            return false
        }
        return (true)
    }
    const onGetMenuAccess= async(id)=>{
        const response = await UserService.getMenuByUserId(id);
            if (response.isSuccess == 1){
                let _payload=[]
                response.data.map(item=>{
                    if(item.isEnabled && item.isAccess){
                        _payload.push(item)
                    }
                })
                dispatch({ type: "GET_ACCESS", payload: _payload });
            }
    }
    const onAuth = async () => {
        const acc= await _getAccount()
        if(acc.password ==null ||acc.username==null){
            alert('Please login for the first time to use TouchId / FaceId.')
            return
        }
        if(!isEnrolled){
            alert('Biometric record not found, please verify your identity with your password.')
            return
        }
        
        try {
            const results = await LocalAuthentication.authenticateAsync();
            if (results.success) {
                setIssubmit(true);
                const res = await loginAsync(acc.username, acc.password);
                if (res) {
                    if (res?.isSuccess == 1) {
                        const auth =await getToken('0399338390','RgWhhm^xC@xdQ68N')
                        if(auth){dispatch({ type: "GET_ACCOUNT", payload: auth })}
                        let tokenDevice = await registerForPushNotificationsAsync()
                        let resFireBase = await UserService.updateFireBaseToken({FireBaseToken:tokenDevice})
                        onGetMenuAccess(res.data.userId)
                        clearInput();
                        props.navigation.replace("Main");
                    }
                    else {
                        setTxtErrorPhone(res?.message);
                    }
                }
                setIssubmit(false);
            } else {
               
            }
        } catch (e) {
            console.log(e);
        }
        
    }
    const handleBiometricAuth = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        if(compatible){
        const type = await LocalAuthentication.supportedAuthenticationTypesAsync();
          setTypeBiometric(type)
        }
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(savedBiometrics)
    }
    
    useEffect(() => {
        handleBiometricAuth()
        _getAsyncStorage()
      },[]);
    useEffect(() => {
        if(isSecurity && typeBiometric.length > 0 && isEnrolled){
            onAuth()
        }
      },[isSecurity, typeBiometric, isEnrolled]);
    
    return (
        <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={Images.logo}
                    />
                </View>
                <View style={styles.rowlogin}>
                    <View style={styles.formlogin}>
                        <Text style={styles.title}>Sign In</Text>
                        <View style={{ height: 56 }}>
                            <View style={{ height: 15 }}>
                                {txtErrorPhone == '' ? <></> : <Text style={styles.errorText}>{txtErrorPhone}</Text>}
                            </View>
                            <View style={[styles.viewInput, {
                                borderColor: isFocusPhone ? colors.mainColor : (txtErrorPhone == '' ? 'rgba(242, 243, 245, 0.2)' : "red"),
                                borderWidth: 1.5
                            }]}>
                                <TextInput style={styles.textInput}
                                    onFocus={() => setIsFocusPhone(true)}
                                    onBlur={() => setIsFocusPhone(false)}
                                    value={phonenumber}
                                    onChangeText={onChangePhoneNumber}
                                    placeholder="Telephone or Email"
                                    placeholderTextColor="white">
                                </TextInput>
                            </View>
                        </View>
                        <View style={{ height: 56, marginTop: 5 }}>
                            <View style={{ height: 15 }}>
                                {txtErrorPass == '' ? <></> : <Text style={styles.errorText}>{txtErrorPass}</Text>}
                            </View>
                            <View style={[styles.viewInput, {
                                borderColor: isFocusPass ? colors.mainColor : (txtErrorPass == '' ? 'rgba(242, 243, 245, 0.2)' : "red"),
                                borderWidth: 1.5
                            }]}>
                                <TextInput
                                    style={styles.textInput}
                                    onFocus={() => setIsFocusPass(true)}
                                    onBlur={() => setIsFocusPass(false)}
                                    value={password}
                                    onChangeText={onChangePass}
                                    placeholder="Password"
                                    placeholderTextColor="#fff"
                                    secureTextEntry={!isShowPass}>
                                </TextInput>
                                <Ionicons style={styles.showPass} name={!isShowPass ? 'eye-off' : 'eye'} size={20} color="#fff"
                                    onPress={() => {
                                        setShowPass((isShowPass) => !isShowPass)
                                    }} />
                            </View>
                        </View>
                        <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => { props.navigation.navigate("Forgot"); }}
                            >
                                <Text style={{ textAlign: 'center', fontSize: 14, color: colors.mainColor }}>
                                    Forgot password?
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', width:'100%', justifyContent:'space-between', marginTop:36}}>
                            <LinearGradient style={[styles.button,{width:isSecurity&&typeBiometric.length>0?'80%':'100%'}]} colors={['#DAB451', '#988050']}>
                                <TouchableOpacity onPress={() => { onSubmit();}}>
                                    <Text style={styles.textButton}>Sign In</Text>
                                </TouchableOpacity>
                            </LinearGradient>
                            {isSecurity &&typeBiometric.length>0&&<TouchableOpacity onPress={()=>onAuth()} style={{}}>
                                <SvgUri source={typeBiometric[0]==1?Icons.icon_TouchID:Icons.icon_FaceID} fill={'#DAB451'} />
                            </TouchableOpacity> }

                        </View>
                       

                    </View>
                    <View style={{ zIndex: 1, width:Dimensions.get("window").width, alignItems: 'center', position:'absolute', bottom:0}}>
                        <Image
                            style={styles.imageBottom}
                            source={Images.image_bottom}
                        />
                    </View>
                </View>
                <DialogAwait
                    isShow={isSubmit}
                ></DialogAwait>
            </View>
        </TouchableNativeFeedback >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.backgroundLogin,
    },
    title: {
        color: '#DAB451',
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '600'
    },
    textButton: {
        textAlign: 'center',
        color: 'white',
        fontSize: 17,
        lineHeight:25.5
    },
    logo: {
        width: 113,
        height: 85,
    },
    logoContainer: {
        marginTop: 102,
        alignItems: "center",
    },
    rowlogin: {
        flex: 7,
        // justifyContent: 'space-between',
        justifyContent: 'flex-start',
        paddingTop: 60,
        paddingBottom: 0
    },
    formlogin: {
        zIndex: 4,
        justifyContent: 'flex-start',
        paddingTop: 0,
        paddingRight: 30,
        paddingLeft: 30
    },
    viewInput: {
        flexDirection: 'row',
        backgroundColor: 'rgba(242, 243, 245, 0.2)',
        height: 46,
        borderRadius: 4,
        // marginBottom: 20,
        zIndex: 1,
    },
    textInput: {
        color: 'white',
        opacity: 1,
        zIndex: 3,
        width: '100%',
        paddingLeft: 15,
        fontSize: 14,
        fontWeight: '400'
    },
    button: {
        width: '80%',
        paddingVertical:9,
        borderRadius: 4,
        justifyContent: 'center'
    },
    imageBottom: {
        width: '100%',
        // alignItems:'center',
        // justifyContent:'flex-start'
        // position: 'absolute',
        // bottom: 0
    },
    showPass: {
        justifyContent: 'center',
        position: 'absolute',
        right: 10,
        bottom: 12,
        zIndex: 4
    },
    errorText: {
        color: colors.red,
        marginLeft: 5,
        fontWeight: '500',
        fontSize: 12,
        marginStart: 15
    },
})