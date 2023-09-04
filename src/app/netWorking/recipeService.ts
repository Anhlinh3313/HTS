import { Environment } from "../environment";
import { _getToken } from "./authService";
let url = Environment.apiPost;
export const getRecipeSpeedPos = async (ProdNum: number) => {
  const token = await _getToken();
  try {
    let response = await fetch(url + "/api/Speedpos/GetRecipeSpeedpos", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({
        ProdNum,
      }),
    });
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(error);
    return error;
  }
};
