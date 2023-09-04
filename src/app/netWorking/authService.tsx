
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Environment } from "../environment";
import { IResponseModel } from "../models/IResponseModel";

let url = Environment.apiPost;
export const loginAsync = async (_userName: any, _password: any) => {
    try {
        let response = await fetch(url +'/api/Account/SignIn', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'UserName': _userName,
                'PassWord': _password
            })
        })
        let res = await response.json() as IResponseModel;
        if (res.isSuccess == '1') {
            await _setdataStorage(res.data, _password);
            return res;
        }
        return res;
    } catch (error) {
        alert(error);
        return;
    }
}
const _setdataStorage = async (data?: any, password?:any) => {
    try {
        await AsyncStorage.setItem('password',password);
        await AsyncStorage.setItem('accessToken',data?.token??'');
        await AsyncStorage.setItem('userFullName',data?.userFullName??'');
        await AsyncStorage.setItem('userId',data?.userId??'');
        await AsyncStorage.setItem('userName',data?.userName??'');
        await AsyncStorage.setItem('currencyMode',data?.currencyMode.toString()??'0');
    } catch (error) {
        return (error);
    }
};

export async function _getUserId() {
    try {
         return await AsyncStorage.getItem('userId')
    } catch (error) {
        return null;
    }
}
export async function _getItem(key:string) {
    try {
         return await AsyncStorage.getItem(key)
    } catch (error) {
        return null;
    }
}

export async function _getToken() {
    try {
        return await AsyncStorage.getItem('accessToken');
    } catch (error) {
        return null;
    }
}

export async function _addCurrency(currency:any) {
    try {
        await AsyncStorage.setItem('currencyMode',currency??'');
        return true;
    } catch (error) {
        return false;
    }
}

export async function _getCurrency() {
    try {
        return await AsyncStorage.getItem('currencyMode');
    } catch (error) {
        return error;
    }
}
export async function _getAccount() {
    try {
        const username = await AsyncStorage.getItem('userName');
        const password = await AsyncStorage.getItem('password');
        return {username , password}
    } catch (error) {
        return {username:null , password:null};
    }
}

export async function _removeToken(){
    try {
            await AsyncStorage.removeItem('accessToken');
            await AsyncStorage.removeItem('userFullName');
            await AsyncStorage.removeItem('userId');
            // await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('currencyMode');
            // await AsyncStorage.removeItem('password');
            return true
    } catch (error) {
            return false;
    }
}

export const getOPTCode = async (Email:string) => {
    try {
        let response = await fetch(url +'/api/Account/GetOPTCode', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Email
            })
        })
        let res = await response.json() as IResponseModel;
        return res;
    } catch (error) {
        alert(error);
        return;
    }
}
export const forgotPassword = async (OPT:string, PassWord:string, ConfirmPassword:string) => {
    try {
        let response = await fetch(url +'/api/Account/ForgotPassword', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                OPT,
                PassWord,
                ConfirmPassword
            })
        })
        let res = await response.json() as IResponseModel;
        return res;
    } catch (error) {
        alert(error);
        return;
    }
}
