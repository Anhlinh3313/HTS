import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const getGetMemberShip = async (fromDate: string, toDate: string) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/GetMemberShip?fromDate=${fromDate}&toDate=${toDate}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const GetPromotionType = async () => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/PromotionType/GetAll`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getListPromotion = async (pageNumber: number, pageSize: number) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/GetListPromotion?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getListOlaMember = async (pageNumber: number, pageSize: number) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/ListOlaMember?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getPromotionReport = async (FromDate: any, ToDate: any, PageNumber: number, PageSize: number) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/GetPromotionReport`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        FromDate,
        ToDate,
        PageNumber,
        PageSize,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getListOlaMemberReport = async (FromDate: any, ToDate: any, PageNumber: number, PageSize: number) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/ListOlaMemberReport`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        FromDate,
        ToDate,
        PageNumber,
        PageSize,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getTopOlaMemberReport = async (FromDate: any, ToDate: any, NumberRows: number) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/TopOlaMemberReport`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        FromDate,
        ToDate,
        NumberRows,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getAccumulatedCustomer = async (NumberRows: number, IsTopAccumulated: boolean) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + `/api/Loyalty/AccumulatedCustomer`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        NumberRows,
        IsTopAccumulated,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
