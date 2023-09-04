import { EohActions } from "../actions/eohAction";
import { IAccount } from "../../models/eohModel";
type AppState = {
  account: any;
};
const initialState: AppState = {
  account: {},
};
const reducer = (state: AppState = initialState, action: EohActions) => {
  switch (action.type) {
    case "GET_ACCOUNT":
      return {
        ...state,
        account: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
