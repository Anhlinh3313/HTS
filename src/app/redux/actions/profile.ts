export interface IGetProfileAction {
    readonly type: "GET_PROFILE";
    payload: UserModel;
}
export interface IGetInfoAccountAction {
    readonly type: "GET_INFO_ACCOUNT";
    payload: InfoAccountModel;
}
export interface IUpdateProfileAction {
    readonly type: "UPDATE_PROFILE";
    payload: UserModel;
}
export type ProfileActions = IGetProfileAction | IUpdateProfileAction | IGetInfoAccountAction;