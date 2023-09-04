import { Environment } from "../environment";
import { FilterViewModel } from "../models/filterViewModel";
import { IResponseModel } from "../models/IResponseModel";
import { _getToken, _getUserId } from "./authService";
import { fetchAPIPost } from "./baseService";
let url = Environment.apiPost;


export class SalesByPaymentmMethodService {

    public static async getSalesCASH(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Speedpos/GetSalesCASH`, body: model }) as IResponseModel;
        return data;
    }

    public static async getSalesDEBT(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Speedpos/GetSalesDEBT`, body: model }) as IResponseModel;
        return data;
    }
}

export class ReportService {
    public static async getAwareness(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Speedpos/GetAwarenesDayByWeek`, body: model }) as IResponseModel;
        return data;
    }

    public static async GetAwarenessWeek(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Speedpos/GetAwarenessWeek`, body: model }) as IResponseModel;
        return data;
    }

    public static async getSalesAndTCHour(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/GetSalesAndTCHour`, body: model }) as IResponseModel;
        return data;
    }

    public static async getNumberOfTC(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/GetNumberOfTC`, body: model }) as IResponseModel;
        return data;
    }
    public static async sendMailAwareness(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/SendMailAwareness`, body: model }) as IResponseModel;
        return data;
    }
    public static async sendMailSalesAndTC(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/SendMailSalesAndTC`, body: model }) as IResponseModel;
        return data;
    }

    public static async sendMailRevenueManagament(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/SendMailRevenueManagament`, body: model }) as IResponseModel;
        return data;
    }

    public static async sendMailNumberOfTC(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/SendMailNumberOfTC`, body: model }) as IResponseModel;
        return data;
    }
    public static async getRevenueManagement(DateTime: string): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/GetRevenueManagement`, body: { DateTime } }) as IResponseModel;
        return data;
    }
    public static async getRevenueManagementItem(DateTime: string): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/GetRevenueManagementItem`, body: { DateTime } }) as IResponseModel;
        return data;
    }
    public static async getRevenueSummary(DateFrom: string, DateTo: string, DateTime: string): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/GetRevenueSummary`, body: {DateFrom, DateTo, DateTime} }) as IResponseModel;
        return data;
    }
    public static async sendRevenueSummary(model: FilterViewModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Report/SendRevenueSummary`, body: model }) as IResponseModel;
        return data;
    }
}

export const getRevenueBySubCategory = async (_stringDateFrom: any, _stringDateTo: any) => {
    const token = await _getToken();
    const userId = await _getUserId();
    try {
        let response = await fetch(url + '/api/Speedpos/GetRevenueBySubCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom: _stringDateFrom,
                StringDateTo: _stringDateTo,
                UserId: userId
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const revenueBySubCategory = async (_stringDateFrom: any, _stringDateTo: any, _dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/RevenueBySubCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom: _stringDateFrom,
                StringDateTo: _stringDateTo,
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

export const getFocAndDiscount = async (_dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetFocAndDiscount', {
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

export const getHomeFocAndDiscountDetail = async (_dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetHomeFocAndDiscountDetail', {
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

export const getRevenueAndTCPERHour = async (_dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetRevenueAndTCPERHour', {
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

export const getTopBest = async (_top: any, _dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetTopBest', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                Top: _top,
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


export const getTopWorst = async (_top: any, _dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetTopWorst', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                Top: _top,
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
export const getTop = async (_top: any, _dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetTop', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                Top: _top,
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

export const getSalesByPaymentmMethod = async (_dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetSalesByPaymentmMethod', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom: _dateFrom,
                StringDateTo: _dateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getTotalRevenueAndQuality = async (ReportNo: any, DateFrom: any, DateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetTotalRevenueAndQuanlity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                ReportNo,
                DateFrom,
                DateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getProductByReportNo = async (ReportNo: any, DateFrom: any, DateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetProductByReportNo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                ReportNo,
                DateFrom,
                DateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getNoSalesAtAllByCategory = async (ReportNo: any, DateFrom: any, DateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Speedpos/GetNoSalesAtAllByCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                ReportNo,
                DateFrom,
                DateTo
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}
