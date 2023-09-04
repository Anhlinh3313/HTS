export interface IRevenue {
    workplaceName: string,
    estimatedDailySales: number,
    userWorkingHour: number,
    payrollVND: number,
    payrollPercent: number,
    customercount: number,
    checkave: number,
    spmh: number
}
export interface IRevenueSummary {
    totalEstimatedDailySales: number,
    totalUserWorkingHour: number,
    totalPayrollVND: number,
    totalPayrollPercent: number,
    totalCustomercount: number,
    totalCheckave: number,
    totalSPMH: number,
    dataRevenue: IRevenue[]
}