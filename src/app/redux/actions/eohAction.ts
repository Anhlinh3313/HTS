import { IAccount } from '../../models/eohModel'
export interface IGetAuthAction {
  readonly type: "GET_ACCOUNT";
  payload: IAccount;
}
export type EohActions = IGetAuthAction;
