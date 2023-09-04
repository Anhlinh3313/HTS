import { Environment } from "../environment";
import { _getToken } from "./authService";
import { IResponseModel } from "../models/IResponseModel";
import { fetchAPIGet } from "./baseService";
let url = Environment.apiPost;
export class SystemService {
  public static async getSysInfoSpeedPos(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Speedpos/GetSysInfoSpeedpos` })) as IResponseModel;
    return data;
  }
  public static async getWorkplaceByUserId(id:number): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Workplace/GetWorkplaceByUserId?userId=${id}` })) as IResponseModel;
    return data;
  }
}
