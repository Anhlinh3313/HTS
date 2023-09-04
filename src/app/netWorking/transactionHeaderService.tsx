import { Environment } from "../environment";
import { _getToken } from "./authService";
let url = Environment.apiPost;

export const transactionHeader = async (_stringDateFrom: any, _stringDateTo: any, _memCode: any, _transact: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/TransactionHeader', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom: _stringDateFrom,
                StringDateTo: _stringDateTo,
                MemCode: _memCode,
                Transact: _transact
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getTotalTransactionHeader = async (_dateFrom: any, _dateTo: any) => {
    const token = await _getToken()
    try {
        let response = await fetch(url + '/api/Estimate/GetTotalTransactionHeader', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                DateFrom: _dateFrom,
                DateTo: _dateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}