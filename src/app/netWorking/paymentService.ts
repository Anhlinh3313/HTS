import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const getAllPaymentType = async () => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/GetPaymentmethod", {
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