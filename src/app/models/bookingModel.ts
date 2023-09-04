import {transactionHeaderModel, transactionDetailModel} from './transactionModel'
export interface bookingModel {
  resNum?: any;
  tableNum?: any;
  memCode?: any;
  timeStart?: any;
  timeEnd?: any;
  masterResNum?: any;
  numCust?: any;
  secNum?: any;
  fullName?: any;
  resTypeNum?: any;
  used?: any;
  commentStr?: any;
  empNum?: any;
  timeSeated?: any;
  timeAdded?: any;
  arrived?: any;
  pagerNum?: any;
  isActive?: any;
  meal?: string;
  phoneNumber?: any;
  email?: string;
  memberSalut?: string;
  memberLastName?: string;
  memberFirstName?: string;
  transactionDetail?: transactionDetailModel[];
  transactionHeader?: transactionHeaderModel;
}
