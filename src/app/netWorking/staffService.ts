import { Environment } from "../environment";
import { _getToken } from "./authService";
import { IResponseModel } from "../models/IResponseModel";
import { IWorkingScheduleRequest, ICreateStaffRequest } from "../models/staffModel";
import { fetchAPIGet, fetchAPIPost } from "./baseService";
let url = Environment.apiPost;
export class StaffService {
  public static async getStaffInfo(
    StaffId: number,
    PositionId: number,
    RecordAreaId: number,
    WorkplaceId:number,
    PageNum: number,
    PageSize: number
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetStaffInfo`,
      body: { StaffId, PositionId, RecordAreaId, WorkplaceId, PageNum, PageSize },
    })) as IResponseModel;
    return data;
  }
  public static async createStaff(req: ICreateStaffRequest): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/Create`,
      body: {
        FirstName: req.firstName,
        LastName: req.lastName,
        Phone: req.phone,
        Email: req.email,
        PositionId: req.positionId,
        RecordAreaId: req.recordAreaId,
        DutyId: req.dutyId,
        TitleId: req.titleId,
        WorkplaceId: req.WorkplaceId,
      },
    })) as IResponseModel;
    return data;
  }
  public static async updateStaff(req: ICreateStaffRequest): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/Update`,
      body: {
        Id: req.id,
        IsEnabled: req.isEnabled,
        FirstName: req.firstName,
        LastName: req.lastName,
        Phone: req.phone,
        Email: req.email,
        PositionId: req.positionId,
        RecordAreaId: req.recordAreaId,
        DutyId: req.dutyId,
      },
    })) as IResponseModel;
    return data;
  }
  public static async createWorking(
    StaffData: { StaffId: number; WorkingScheduleData: IWorkingScheduleRequest }[]
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/CreateWorking`,
      body: { StaffData },
    })) as IResponseModel;
    return data;
  }
  public static async getAllWorkingTimeByStaff(StaffId: number, DateTime: string): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetWorkingTimeByStaff`,
      body: { StaffId, DateTime },
    })) as IResponseModel;
    return data;
  }
  public static async getAllDuty(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Staff/GetAllDuty` })) as IResponseModel;
    return data;
  }
  public static async getAllPosition(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Staff/GetAllPosition` })) as IResponseModel;
    return data;
  }
  public static async getAllRecordArea(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Staff/GetAllRecordArea` })) as IResponseModel;
    return data;
  }
  public static async getAllLegend(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Staff/GetAllLegend` })) as IResponseModel;
    return data;
  }
  public static async getAllWorkingTime(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Staff/GetAllWorkingTime` })) as IResponseModel;
    return data;
  }
  public static async GetListOfStarf(
    DateFrom: string,
    DateTo: string,
    ListStaff: { StaffId: number }[]
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetListOfStarf`,
      body: {
        DateFrom,
        DateTo,
        ListStaff,
      },
    })) as IResponseModel;
    return data;
  }
  //part time
  public static async getAllWorkingTimeFreeStaff(): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Staff/GetAllWorkingTimeFreeStaff` })) as IResponseModel;
    return data;
  }
  public static async getFreeStaff(DateFrom: string, DateTo: string, RecordAreaId: number): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetFreeStaff`,
      body: {
        DateFrom,
        DateTo,
        RecordAreaId,
      },
    })) as IResponseModel;
    return data;
  }
  public static async createStaffFreeTime(
    StaffFreeTimesList: {
      StaffId: number;
      StaffFreeTimes: { Rank: string; FreeDate: string; WorkingTimeId: number[] }[];
    }[]
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/CreateStaffFreeTime`,
      body: { StaffFreeTimesList },
    })) as IResponseModel;
    return data;
  }
  public static async updateStaffFreeTime(
    StaffId: number,
    StaffFreeTimesList: { Rank: string; FreeDate: string; WorkingTimeId: number[] }[]
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/UpdateStaffFreeTime`,
      body: { StaffId, StaffFreeTimesList },
    })) as IResponseModel;
    return data;
  }
  public static async getTitle(
    SearchText: string,
    PageNum: number,
    PageSize: number,
    ClientId: number,
    WorkplaceId: number
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Title/GetTitle`,
      body: {
        SearchText,
        PageNum,
        PageSize,
        ClientId,
        WorkplaceId,
      },
    })) as IResponseModel;
    return data;
  }
}
export class ReportStaffService {
  // WeeklyCrewSchedule
  public static async getHourStoreService(DateTime: any, RecordAreaId: number): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetHourStoreService`,
      body: { DateTime, RecordAreaId },
    })) as IResponseModel;
    return data;
  }
  public static async getStaffByRecordArea(RecordAreaId: number): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetStaffByRecordArea`,
      body: { RecordAreaId },
    })) as IResponseModel;
    return data;
  }
  public static async getWeeklyDynamicCrewScheduleByStaff(
    StaffId: number,
    DateTime: any,
    RecordAreaId: number
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetWeeklyDynamicCrewScheduleByStaff`,
      body: { StaffId, DateTime, RecordAreaId },
    })) as IResponseModel;
    return data;
  }

  // WeeklyDynamicCrewSchedule
  public static async getListStaffWeeklyDynamicCrewSchedule(
    RecordAreaId: number = null,
    DateFrom: string,
    DateTo: string
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetListStaffWeeklyDynamicCrewSchedule`,
      body: { RecordAreaId, DateFrom, DateTo },
    })) as IResponseModel;
    return data;
  }
  // OfficeAttendanceRecord
  public static async getListOfficeAttendanceRecord(
    DateFrom: string,
    DateTo: string,
    PositionId: number
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetListOfficeAttendanceRecord`,
      body: { DateFrom, DateTo, PositionId },
    })) as IResponseModel;
    return data;
  }
  public static async updateOfficeAttendanceRecord(
    PositionId: number,
    ListWorkingSchedule: { workingScheduleId: number; LegendId: number }[]
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/UpdateOfficeAttendanceRecord`,
      body: { PositionId, ListWorkingSchedule },
    })) as IResponseModel;
    return data;
  }
  // OverTimeOTRecord
  public static async getOverTimeOTRecordInfo(DateFrom: string, DateTo: string, RecordAreaId: number): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetOverTimeOTRecordInfo`,
      body: { DateFrom, DateTo, RecordAreaId },
    })) as IResponseModel;
    return data;
  }
  public static async getOverTimeOTRecord(DateTime: string, RecordAreaId: number): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetOverTimeOTRecord`,
      body: { DateTime, RecordAreaId },
    })) as IResponseModel;
    return data;
  }
  public static async updateOverTimeOTRecordByDay(
    OverTimeOTRecordByDayInfo: { WorkingScheduleId: number; NotExtra: string; CheckNotExtra: number }[]
  ): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/UpdateOverTimeOTRecordByDay`,
      body: { OverTimeOTRecordByDayInfo },
    })) as IResponseModel;
    return data;
  }
  //part time
  public static async GetWeeklyPartTimeSchedule(DateFrom: string, DateTo: string): Promise<IResponseModel> {
    let data = (await fetchAPIPost({
      url: `/api/Staff/GetWeeklyPartTimeSchedule`,
      body: { DateFrom, DateTo },
    })) as IResponseModel;
    return data;
  }
}
export class MailStaffService {
  public static async sendMailWorkingTimeByStaff(
    ListMail: {
      DateTime: string;
      StaffId: number;
      Description: string;
      Mail: string;
    }[]
  ): Promise<IResponseModel> {
    const token = await _getToken();
    try {
      let response = await fetch(url + `/api/Staff/SendMailWorkingTimeByStaff`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ ListMail }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  public static async sendMailWeeklyCrewsCheduleAndOTForecastSample(
    DateTime: string,
    Description: string,
    Mail: string
  ): Promise<IResponseModel> {
    const token = await _getToken();
    try {
      let response = await fetch(url + `/api/Staff/SendMailWeeklyCrewsCheduleAndOTForecastSample`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          DateTime,
          Description,
          Mail,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  public static async sendMailWeeklyDynamicCrewSchedule(
    Description: string,
    Mail: string,
    StringDateFrom: string,
    StringDateTo: string
  ): Promise<IResponseModel> {
    const token = await _getToken();
    try {
      let response = await fetch(url + `/api/Staff/SendMailWeeklyDynamicCrewSchedule`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          Description,
          Mail,
          StringDateFrom,
          StringDateTo,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  public static async sendMailOfficeAttendanceRecord(
    Description: string,
    Mail: string,
    Preparedby: string,
    Verifiedby: string,
    DateFrom: string,
    DateTo: string,
    PositionId: number
  ): Promise<IResponseModel> {
    const token = await _getToken();
    try {
      let response = await fetch(url + `/api/Staff/SendMailOfficeAttendanceRecord`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          Description,
          Mail,
          Preparedby,
          Verifiedby,
          DateFrom,
          DateTo,
          PositionId,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  public static async sendMailOverTimeOTRecord(
    Description: string,
    Mail: string,
    DateFrom: string,
    DateTo: string
  ): Promise<IResponseModel> {
    const token = await _getToken();
    try {
      let response = await fetch(url + `/api/Staff/SendMailOverTimeOTRecord`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          Description,
          Mail,
          DateFrom,
          DateTo,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  public static async sendMailStaffPartTime(
    Description: string,
    Mail: string,
    DateFrom: string,
    DateTo: string
  ): Promise<IResponseModel> {
    const token = await _getToken();
    try {
      let response = await fetch(url + `/api/Staff/SendMailStaffPartTime`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          Description,
          Mail,
          DateFrom,
          DateTo,
        }),
      });
      let json = await response.json();
      return json;
    } catch (error) {
      console.error(error);
      return error;
    }
  }
}
