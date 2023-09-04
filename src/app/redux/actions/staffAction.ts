import {
  IStaff,
  ICreateStaffRequest,
  IWorkingTime,
  IWorkingScheduleRequest,
  IPicker,
  IStaffPartTime,IUpdateStaffPartTime
} from "../../models/staffModel";
export interface IGetStaffsAction {
  readonly type: "GET_STAFFS";
  payload: IStaff[];
}
export interface IUpdateStaffAction {
  readonly type: "UPDATE_STAFF";
  payload: ICreateStaffRequest;
}
export interface IGetWorkingTimeAction {
  readonly type: "GET_ALL_WORKING_TIME";
  payload: IWorkingTime[];
}
export interface IGetWorkingPartTimeAction {
  readonly type: "GET_ALL_WORKING_PART_TIME";
  payload: IWorkingTime[];
}
export interface IGetWorkingTimeByStaffAction {
  readonly type: "GET_ALL_WORKING_TIME_BY_STAFF";
  payload: { data: IWorkingTime[]; scheduled: boolean; id: number; index: number };
}
export interface ICreateWorkingTimeByStaffAction {
  readonly type: "CREATE_WORKING_TIME_BY_STAFF";
  payload: { StaffId: number; WorkingScheduleData: IWorkingScheduleRequest[]; isConfirm: boolean };
}
export interface IGetLegendAction {
  readonly type: "GET_ALL_LEGEND";
  payload: IPicker[];
}
export interface IGetRecordAreaAction {
  readonly type: "GET_ALL_RECORD_AREA";
  payload: IPicker[];
}
export interface IChangeIsConfirmAction {
  readonly type: "CHANGE_CONFIRM";
  payload: number;
}
export interface IResetAction {
  readonly type: "RESET_STAFFS";
}
export interface IGetPartTimeStaffsAction {
  readonly type: "GET_STAFF_PART_TIME";
  payload: IStaffPartTime[];
}
export interface IUpdatePartTimeStaffsAction {
  readonly type: "UPDATE_STAFF_PART_TIME";
  payload:  { StaffId: number; dataUpdate: IUpdateStaffPartTime };
}
export type StaffActions =
  | IGetStaffsAction
  | IUpdateStaffAction
  | IGetWorkingTimeAction
  | IGetWorkingPartTimeAction
  | IGetWorkingTimeByStaffAction
  | ICreateWorkingTimeByStaffAction
  | IGetLegendAction
  | IGetRecordAreaAction
  | IChangeIsConfirmAction
  | IResetAction
  | IGetPartTimeStaffsAction
  | IUpdatePartTimeStaffsAction;
