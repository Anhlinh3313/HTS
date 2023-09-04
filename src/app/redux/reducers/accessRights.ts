import { AccessActions } from "../actions/accessAction";
type AppState = {
  access: any[];
};
const initialState: AppState = {
  access: [],
};
const reducer = (state: AppState = initialState, action: AccessActions) => {
  switch (action.type) {
    case "GET_ACCESS":
      return {
        ...state,
        access: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
