import { Environment } from "../environment";
import { IProductModel } from "../models/IproductModel";
import { IResponseModel } from "../models/IResponseModel";
import { _getToken, _getUserId } from "./authService";
import { fetchAPIGet, fetchAPIPost } from "./baseService";
let url = Environment.apiPost;

export class ProductService {
  public static async create(model: IProductModel): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Product/Create`,
      body: model,
    })) as IResponseModel;
    return data;
  }

  public static async update(model: IProductModel): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Product/Update`,
      body: model,
    })) as IResponseModel;
    return data;
  }

  public static async getAllProduct(): Promise<IProductModel[]> {
    let data = (await fetchAPIGet({
      url: `/api/Product/GetAllProduct`,
    })) as IResponseModel;
    return data.data;
  }
  public static async getAllProductFast(Month:number, Year:number, ItemCode:string): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Product/GetProductFast`,
      body:{Month,Year,ItemCode}
    })) as IResponseModel;
    return data;
  }
 
  public static async getProductItemList(model:any): Promise<IProductModel[]> {
    let data = (await fetchAPIPost({
      url: "/api/Product/GetProductItemList",
      body: model,
    })) as IResponseModel;
    return data.data;
  }
  
  public static getProductItem = async (
    _listReportNo: any,
    _pageNum: any,
    _pageSize: any,
    _dateFrom:any,
    _dateTo:any
  ) => {
    const token = await _getToken();
    try {
      let response = await fetch(url + "/api/Product/GetProductItem", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ListReportNo: _listReportNo.toString(),
          PageNum: _pageNum,
          PageSize: _pageSize,
          StringDateFrom: _dateFrom,
          StringDateTo: _dateTo,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  public static updatePriceProduct = async (
    _ProdNum: any,
    _maxPrice: any,
    _minPrice: any
  ) => {
    const token = await _getToken();
    const getUserId = await _getUserId();
    try {
      let response = await fetch(url + "/api/Product/UpdatePriceProduct", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          UserId: getUserId,
          ProdNum: _ProdNum,
          maxPrice: _maxPrice,
          minPrice: _minPrice,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

   getProductItemList = async (
    _listReportNo: any,
    _pageNum: any,
    _pageSize: any
  ) => {
    const token = await _getToken();
    try {
      let response = await fetch(url + "/api/Product/GetProductItemList", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ListReportNo: _listReportNo.toString(),
          PageNum: _pageNum,
          PageSize: _pageSize,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  };

  public static getProductItemListByReportNo = async (_listReportNo: any) => {
    const token = await _getToken();
    try {
      let response = await fetch(
        url + "/api/Product/GetProductItemListByReportNo",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            ListReportNo: _listReportNo.toString(),
          }),
        }
      );
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  };
  public static async getProductByCategoryId(
    pageNumber: number = 1,
    pageSize: number = 10,
    listcategoryId: any[]
  ): Promise<IResponseModel> {
    let param = `?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    listcategoryId.map((map, index) => {
      param = param + `&listcategoryId=${map}`;
    });
    let data = (await fetchAPIGet({
      url: `/api/Product/GetProductByCategoryId${param}`,
    })) as IResponseModel;
    return data;
  }
  public static getRangeOfFoodCostByProd = async (ProdNum: number) => {
    const token = await _getToken();
    try {
      let response = await fetch(
        url + "/api/Product/getRangeOfFoodCostByProd",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            ProdNum
          }),
        }
      );
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  };
}
