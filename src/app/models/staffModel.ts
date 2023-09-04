export const NO_RESTRICTION = 52;
export const NO_AVAILABILITY = 51;
export interface IPicker {
  id: number;
  code: string;
  name: string;
}

export const initDataPicker = { id: 0, code: "", name: "" };
export interface IWorkingScheduleRequest {
  IsSplit: number;
  LegendId: number;
  IsCheckIn: number;
  Remark: string;
  WorkingDate: any;
  TotalWorkingTime: number;
  WorkingWeekTime?: {
    WorkingWeekTimeId: {
      workingTimeId: number;
      timeRange: string;
      isOT: boolean;
    }[];
    timeId: number[];
    timeSplitId: number[];
    OT: number;
  }[]
  staffWorkingDayTimeData?: {
    workingTimeId: number;
    timeRange?: string;
    isOT: boolean;
  }[];
}
export interface IWorkingSchedulePartTime {
  day: number;
  freeDate: string;
  rank: string;
  staffFreeTimeList: {
    managementAgree: boolean;
    staffFreeTimeId: number;
    timeEnd: string;
    timeRange: string;
    timeStart: string;
    workingTimeId: number;
    timeOrder: number;
  }[];
}
export interface IUpdateStaffPartTime {
  FreeDate: string;
  Rank: string;
  WorkingTimeId: number[];
  staffFreeTimeList?: {
    managementAgree: boolean;
    staffFreeTimeId: number;
    timeEnd: string;
    timeRange: string;
    timeStart: string;
    workingTimeId: number;
  }[];
}
export interface IStaffPartTime {
  staffId: number;
  staffName: string;
  positionName: string;
  roster: string;
  staffFreeTimeInfo: IWorkingSchedulePartTime[];
}
export interface ICreateStaffRequest {
  id?: number;
  isEnabled?: boolean;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  positionId: number;
  recordAreaId: number;
  dutyId: number;
  titleId: number;
  WorkplaceId: number;
}
export interface IStaff {
  dutyName: string;
  email: string;
  firstName: string;
  id: number;
  lastName: string;
  phone: string;
  positionName: string;
  totalCount: number;
  positionId: number;
  recordAreaId: number;
  title?: string;
  dutyId?: number;
  isConfirm?: boolean; // đã lưu lại ở local
  saved?: boolean; // đã có data ở server
  edited?: boolean; // đã có data ở server
  workingScheduleData?: IWorkingScheduleRequest[] | IWorkingSchedulePartTime[];
  staffWorkingDayTimeData?: IItemWorkingDayReport[]
}
export interface IHourService {
  totalHoureWorking: number;
  totalHoureWorkingOT: number;
  totalHoure: number;
}
export const InitHourService = {
  totalHoureWorking: 0,
  totalHoureWorkingOT: 0,
  totalHoure: 0,
};

export interface IItemWorkingDayReport {
  WorkingDate: string;
  workingDateDay?: string;
  legendName?: string;
  legendId?: number;
  remark: string;
  staffWorkingDayTimeData: [
    {
      workingTimeId: number;
      timeRange?: string;
      isOT: boolean;
    }
  ];
}
export interface IStaffInfoByRecordArea {
  staffId: number;
  staffName: string;
  positionName?: string;
  positionCode?: number;
  dutyName?: string;
  dutyId?: number;
  totalHoureWorking?: number;
  totalHoureWorkingOT?: number;
  totalHoure?: number;
  staffWorkingDay?: IItemWorkingDayReport[];
  dataTable?: string[];
  dataTableInWeek?: { date: string, data: string[], dataHour: IHourService }[];
}
export interface IWorkingTime {
  timeRange: string;
  note?: string;
  dayId: number;
  code?: number;
  timeOrder?: number;
  name?: string;
  id: number;
  createdWhen?: any;
  createdBy?: any;
  modifiedWhen?: any;
  modifiedBy?: any;
  concurrencyStamp?: any;
  isEnabled: boolean;
  checkFreeTime?: boolean;
}
export interface IItemOfficeAttendanceRecord {
  workingScheduleId: number;
  workingDate: string;
  workingDateDay: string;
  legendId: number;
  legendCode: string;
}
export interface IOfficeAttendanceRecord {
  staffId: number;
  staffName: string;
  dutyName: string;
  positionName: string;
  positionCode: string;
  p: number;
  od: number;
  oil: number;
  ml: number;
  ph: number;
  al: number;
  cl: number;
  mat: number;
  pat: number;
  npl: number;
  mar: number;
  hl: number;
  np: number;
  legendId: number;
  staffWorkingDayInfo: IItemOfficeAttendanceRecord[];
}
export interface IOverTimeOTRecordInfo {
  staffId: number;
  staffCode: number;
  staffName: string;
  dutyName: string;
  hoursOT: number;
  dayNumber: number;
  dayInfo: {
    workingDate: string;
    notExtra: string;
    checkNotExtra: boolean;
    rank: string;
    hoursOTRank: number;
  }[];
}
export interface IOverTimeOTRecord {
  workingScheduleId: number;
  staffId: number;
  staffName: string;
  hoursOT: number;
  notExtra: string;
  manager: number;
  checkNotExtra: boolean;
}
