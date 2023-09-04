import { ReportStaffActions } from "../actions/reportStaffAction";
import moment from "moment";
import { getMonday } from "../../components/generalConvert/conVertMonDay";
type AppState = {
  fromDate: string;
  endDate: string;
};

let endWeekDay=new Date().setDate(getMonday(new Date()).getDate() + 6);
if(getMonday(new Date()).getMonth()<new Date().getMonth()){
  //check ngày đầu tuần và ngày hiện tại khác tháng
  endWeekDay = new Date(new Date().setMonth(new Date().getMonth()-1)).setDate(getMonday(new Date()).getDate() + 6);
} 
const initialState: AppState = {
  fromDate: moment(getMonday(new Date())).format("YYYY-MM-DD 00:00"),
  endDate: moment(endWeekDay).format("YYYY-MM-DD 23:59"),
};
const reducer = (state: AppState = initialState, action: ReportStaffActions) => {
  switch (action.type) {
    case "CHANGE_DATE":
      return {
        ...state,
        fromDate: action.payload.fromDate,
        endDate: action.payload.endDate,
      };
    default:
      return state;
  }
};
export default reducer;
