import { accessModel } from '../../models/accessModel'
export interface IGetAccessAction {
    readonly type: "GET_ACCESS";
    payload: accessModel[];
  }
  export type AccessActions = IGetAccessAction;