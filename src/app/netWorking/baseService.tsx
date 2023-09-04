import { DeviceEventEmitter } from "react-native";
import { Environment } from "../environment";
import { IResponseModel } from "../models/IResponseModel";
import { _getToken } from "./authService";

interface FetchObject {
    url: string,
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    headers?: object,
    body?: any,
}
const urlApi = Environment.apiPost;
export async function fetchAPIGet(params: FetchObject) {
    let { url, method = 'GET' }: any = params;
    const token = await _getToken();
    let statusCode = 200;
    return new Promise((resolve, reject) => {
        fetch(`${urlApi}/${url}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            method: method,
        }).then(async response => {
            statusCode = response.status;
            if (!response.ok) {
                errorHandler(response.status);
            }
            return await response.json() as IResponseModel;
        }).then(async responseJson => {
            if (responseJson.isSuccess == 0) {
                alert(responseJson.message);
                resolve(responseJson);
            }
            else{
                resolve(responseJson);
            }
        }).catch(error => {
            resolve(null);
            alert(`FETCH API: ${error.message}`);
            reject(error);
        });
    })
}

export async function fetchAPIPost(params: FetchObject) {
    let { url, method = 'POST', body = '' }: any = params;
    const token = await _getToken();
    let statusCode = 200;
    return await new Promise((resolve, reject) => {
        fetch(`${urlApi}/${url}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            method: method,
            body:JSON.stringify(body)
        }).then(async response => {
            statusCode = response.status;
            if (!response.ok) {
                errorHandler(response.status);
            }
            return await response.json() as IResponseModel
        }).then(async responseJson => {
            if (responseJson.isSuccess == 0) {
                alert(responseJson.message);
                resolve(responseJson);
            }
            else{
                resolve(responseJson);
            }
        }).catch(error => {
            resolve(null);
            alert(`FETCH API: ${error.message}`);
            reject(error);
        });
    })
}
async function errorHandler(errorCode: number) {
    switch (errorCode) {
        case 401:
            alert('Authenticate Error');
            break;

        case 500:
            alert('Server Error');
            break;

        default:
            break;
    }
}