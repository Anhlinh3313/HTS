import { Environment } from "../environment";
import { _getToken, _getUserId } from "./authService";

let url = Environment.apiPost;
export const getAllSore = async () => {
    const token = await _getToken();
    const userId = await _getUserId();
    try {
        let response = await fetch(url + '/api/Store/GetAllSoreByUserId?userId='+ userId, {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

