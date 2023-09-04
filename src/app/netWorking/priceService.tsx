import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const updatePrice = async (_itemCode: any, _maxPrice: any, _minPrice: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Price/UpdatePrice', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                itemCode: _itemCode,
                maxPrice: _maxPrice,
                minPrice: _minPrice,
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}