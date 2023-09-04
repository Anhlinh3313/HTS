import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const getListTable = async () => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/TableSetups", {
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
export const getTableSetupsGroundFloor = async () => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/TableSetupsGroundFloor", {
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
export const getSections = async () => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/GetSections", {
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
export const getTransactionDetail = async (
  _stringDateFrom: any,
  _stringDateTo: any,
  _memCode: any,
  _transact: any
) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/TransactionDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        StringDateFrom: _stringDateFrom,
        StringDateTo: _stringDateTo,
        MemCode: _memCode,
        Transact: _transact,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
