import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const getListBooking = async (
  stringDateFrom: any,
  stringDateTo: any,
  memCode?: any,
  resNum?: any
) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/Reservations", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        StringDateFrom: stringDateFrom,
        StringDateTo: stringDateTo,
        MemCode: memCode,
        ResNum: resNum,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
