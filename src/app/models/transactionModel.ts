export interface transactionHeaderModel {
  sNum?: any;
  transact?: number;
  timeStart?: any;
  timeEnd?: any;
  openDate?: any;
  tableNum?: number;
  numCust?: number;
  memCode?: number;
  netTotal?: number;
  tax1?: number;
  tax2?: number;
  tax3?: number;
  tax4?: number;
  tax5?: number;
  finalTotal?: number;
}
export interface transactionDetailModel {
  costEach?: number;
  descript?: string;
  lineDes?: any;
  memCode?: number;
  netCostEach?: number;
  openDate?: any;
  prodNum?: number;
  prodType?: number;
  quan?: number;
  sNum?: any;
  timeOrd?: any;
  transact?: number;
  uniqueId?: number;
}
export interface transactionPaymentModel {
  sNum?: any;
  transact?: number;
  memCode?: number;
  howPaidLink?: number;
  openDate?: any;
  methodNum?: number;
  descript?: string;
  tender?: number;
  change?: number;
  exchangeRate?: number;
  transDate?: any;
}
