import { Environment } from "../environment";

let url = Environment.apiPost;
export const getRevenueHour = async (_storeId: any, _dateFrom: any, _dateTo: any) => {
    try {
        let response = await fetch(url + '/api/Estimate/GetRevenueHour', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                storeId: _storeId,
                dateFrom: _dateFrom,
                dateTo: _dateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getFocAndDiscountDetail = async (_storeId: any, _dateFrom: any, _dateTo: any) => {
    try {
        let response = await fetch(url + '/api/Estimate/GetFocAndDiscountDetail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                storeId: _storeId,
                dateFrom: _dateFrom,
                dateTo: _dateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getEstimate = async (_storeId: any, _dateFrom: any, _dateTo: any) => {
    try {
        let response = await fetch(url + '/api/Estimate/GetEstimate', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                storeId: _storeId,
                dateFrom: _dateFrom,
                dateTo: _dateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}


export const reportStoreProductCombo = async (_storeId: any, _dateFrom: any, _dateTo: any) => {
    try {
        let response = await fetch(url + '/api/Report/ReportStoreProductCombo', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                storeId: _storeId,
                dateFrom: _dateFrom,
                dateTo: _dateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

