import { IProductModel } from "../models/IproductModel";
import { IResponseModel } from "../models/IResponseModel";
import { PoitRevenueDateModel } from "../models/PointRevenueDateModel";
import { RevenueDateModel } from "../models/revenueDateModel";
import { RevenueMonthlyModel } from "../models/RevenueMonthly";
import { RevenueYearModel } from "../models/revenueYearModel";
import { fetchAPIGet, fetchAPIPost } from "./baseService";

export class OwnerHighLevelService {

    public static async ReportRevenueYear(model:any): Promise<RevenueYearModel[]> {
        let data = await fetchAPIPost({ url: `/api/Report/ReportRevenueYear`,body:model}) as IResponseModel;
        return data.data;
    }
    
    public static async ReportRevenueDate(model:any): Promise<PoitRevenueDateModel> {
        let data = await fetchAPIPost({ url: `/api/Report/ReportRevenueDate`,body:model}) as IResponseModel;
        return data.data;
    }

    public static async ReportRevenueDaily(model:any): Promise<RevenueMonthlyModel> {
        let data = await fetchAPIPost({ url: `/api/Report/ReportRevenueDaily`,body:model}) as IResponseModel;
        return data.data;
    }

    public static async ReportRevenueMonthly(model:any): Promise<RevenueMonthlyModel> {
        let data = await fetchAPIPost({ url: `/api/Report/ReportRevenueMonthly`,body:model}) as IResponseModel;
        return data.data;
    }
}