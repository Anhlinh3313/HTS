import { Environment } from "../environment";
import { _getToken } from "./authService";

let url = Environment.apiPost;
export const GetMemberFilter = async (
    MemCode: any,
    PhoneNumber?: any,
    CardNum?: any,
) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/GetMemberFilter", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        PhoneNumber,
        MemCode,
        CardNum,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
