import { Environment } from "../environment";
import { ICategoryModel } from "../models/IcategoryModel";
import { IResponseModel } from "../models/IResponseModel";
import { _getToken, _getUserId } from "./authService";
import { fetchAPIGet, fetchAPIPost } from "./baseService";

export class CategoryService {

    public static async cteateCategory(model:ICategoryModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Category/Create`,body:model}) as IResponseModel;
        return data;
    }

    public static async updateCategory(model:ICategoryModel): Promise<IResponseModel> {
        let data = await fetchAPIPost({ url: `/api/Category/Update`,body:model}) as IResponseModel;
        return data;
    }

    public static async getAllCategory(): Promise<ICategoryModel[]> {
        let data = await fetchAPIGet({ url: `/api/Category/GetAllCategory`}) as IResponseModel;
        return data.data;
    }

}
const url = Environment.apiPost;
export const getAllCategory = async ():Promise<IResponseModel> => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Category/GetAllCategory', {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
        })
        let json = await response.json();
        return json ;
    } catch (error) {
        console.error(error);
        return (error);
    }
}

export const updateCategory = async (_categoryIdEdit: any, _categoryName: any) => {
    const token = await _getToken();
    const getUserId = await _getUserId();
    try {
        let response = await fetch(url + '/api/Category/UpdateCategory', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                UserId: getUserId,
                CategoryIdEdit: _categoryIdEdit,
                CategoryName: _categoryName,
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}
export const getCategoryFast = async () => {
    const token = await _getToken();
    try {
        let response = await fetch(url + '/api/Category/GetCategoryFast', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: JSON.stringify({
                StringDateFrom: "",
                StringDateTo: new Date(new Date().getFullYear(), 11, 31),
                ItemGroupCode: ""
            })
        })
        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return (error);
    }
}
