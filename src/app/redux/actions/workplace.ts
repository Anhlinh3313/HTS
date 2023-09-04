export interface IPickPlaceAction {
    readonly type: "PICK_WORKPLACE";
    payload: {value:number, label:string};
  }
  export type PlaceActions = IPickPlaceAction;