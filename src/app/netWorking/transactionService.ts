import { Environment } from "../environment";
import { _getToken } from "./authService";
let url = Environment.apiPost;
export const getTransactionDetail = async (StringDateFrom: any, StringDateTo: any, MemCode: any, Transact: any) => {
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
        StringDateFrom,
        StringDateTo,
        MemCode,
        Transact,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
export const getTransactionPayment = async (StringDateFrom: any, StringDateTo: any, MemCode: any, Transact: any) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/TransactionPayment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        StringDateFrom,
        StringDateTo,
        MemCode,
        Transact,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
