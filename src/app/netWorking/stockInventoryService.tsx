import { Environment } from "../environment";
import { _getToken } from "./authService";
import { fetchAPIGet, fetchAPIPost } from "./baseService";
import { IResponseModel } from "../models/IResponseModel";

let url = Environment.apiPost;
export class StockInventoryService{
    public static async GetAllProd(PageNum:number, PageSize:number, listCategoryId:string[]): Promise<IResponseModel> {
        let data = (await fetchAPIPost({
          url: `/api/StockInventory/GetAllProd`,
          body:{PageNum,PageSize,listCategoryId}
        })) as IResponseModel;
        return data;
      }
    
}
export const getStockInventory = async (_storeId: any, _categoryId: any, _dateFrom: any, _dateTo: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/StockInventory/GetStockInventory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                storeId: _storeId,
                categoryId: _categoryId,
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

export const getStockInventoryList = async (_storeId: any, _categoryId: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/StockInventory/GetStockInventoryList', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                storeId: _storeId,
                categoryId: _categoryId,
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const getStockInventoryFast = async (_dateFrom: any, _dateTo: any, _itemCode: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/StockInventory/GetStockInventoryFast', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom: _dateFrom,
                StringDateTo: _dateTo,
                ItemCode: _itemCode
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}
export const getStockInventoryByItem = async (_itemCode: any) => {
    const token = await _getToken();
    try {
        let response = await fetch(url + `/api/StockInventory/GetStockInventoryByItemCode?itemCode=${_itemCode}`, {
            method: 'GET',
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