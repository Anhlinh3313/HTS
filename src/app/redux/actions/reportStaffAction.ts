export interface IChangeDateAction {
  readonly type: "CHANGE_DATE";
  payload: { fromDate: string; endDate: string };
}
export type ReportStaffActions = IChangeDateAction;
