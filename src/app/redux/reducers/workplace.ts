import { PlaceActions } from "../actions/workplace";
type AppState = {
  workPlace: {value:number, label:string};
};
const initialState: AppState = {
  workPlace: { value: 0, label: "" },
};
const reducer = (state: AppState = initialState, action: PlaceActions) => {
  switch (action.type) {
    case "PICK_WORKPLACE":
      return {
        ...state,
        workPlace: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
