import { StaffActions } from "../actions/staffAction";
import { IStaff, IWorkingTime, IPicker, IStaffPartTime } from "../../models/staffModel";
type AppState = {
  staffs: IStaff[];
  part_time_staffs: IStaffPartTime[];
  workingTimes: IWorkingTime[];
  workingPartTimes: IWorkingTime[];
  legends: IPicker[];
  record_area: IPicker[];
  reset: boolean;
};
const initialState: AppState = {
  staffs: [],
  part_time_staffs: [],
  workingTimes: [],
  workingPartTimes: [],
  legends: [],
  record_area: [],
  reset: false,
};
const reducer = (state: AppState = initialState, action: StaffActions) => {
  let _staffs = [...state.staffs];
  switch (action.type) {
    case "RESET_STAFFS":
      return {
        ...state,
        reset: !state.reset,
      };
    case "GET_STAFFS":
      return {
        ...state,
        staffs: action.payload,
      };
    case "UPDATE_STAFF":
      let i = _staffs.findIndex(item => item.id === action.payload.id);
      _staffs[i].phone = action.payload.phone;
      _staffs[i].email = action.payload.email;
      return {
        ...state,
        staffs: _staffs,
      };
    case "GET_ALL_WORKING_TIME":
      return {
        ...state,
        workingTimes: action.payload,
      };
    case "GET_ALL_WORKING_PART_TIME":
      return {
        ...state,
        workingPartTimes: action.payload,
      };
    case "GET_ALL_LEGEND":
      return {
        ...state,
        legends: action.payload,
      };
    case "GET_ALL_RECORD_AREA":
      return {
        ...state,
        record_area: action.payload,
      };
    case "GET_ALL_WORKING_TIME_BY_STAFF":
      // let _i = __staffs.findIndex(item => item.id === action.payload.id);
      // __staffs[_i].workingScheduleData[action.payload.index].WorkingWeekTime = action.payload.data;
      return {
        ...state,
        staffs: _staffs,
      };
    case "CREATE_WORKING_TIME_BY_STAFF":
      let __i = _staffs.findIndex(item => item.id === action.payload.StaffId); // tìm id staff
      let staffSchedule = _staffs[__i].workingScheduleData.slice(); // clone schedule staff
      let staffTimeData = JSON.parse(JSON.stringify(_staffs[__i].staffWorkingDayTimeData)); // clone schedule staff
      action.payload.WorkingScheduleData.map(schedule => {
        let iSchedule = _staffs[__i].staffWorkingDayTimeData.findIndex(item => item.WorkingDate == schedule.WorkingDate);
        if (iSchedule !== -1) {
          staffSchedule[iSchedule] = schedule;
          let _arrStaffTimeData = []
          if(schedule.staffWorkingDayTimeData){
            schedule.staffWorkingDayTimeData.map(time => {
              let check = staffTimeData[iSchedule].staffWorkingDayTimeData.findIndex(i => i.workingTimeId == time.workingTimeId)
              if (check == -1) {
                _arrStaffTimeData.push(time)
              }
            })
          }
          staffTimeData[iSchedule].staffWorkingDayTimeData = [...staffTimeData[iSchedule].staffWorkingDayTimeData, ..._arrStaffTimeData]

        }
      });

      _staffs[__i].isConfirm = action.payload.isConfirm;
      _staffs[__i].edited = true;
      _staffs[__i].workingScheduleData = staffSchedule;
      _staffs[__i].staffWorkingDayTimeData = staffTimeData;

      return {
        ...state,
        staffs: _staffs,
      };
    case "CHANGE_CONFIRM":
      let indexChangeConfirm = _staffs.findIndex(item => item.id === action.payload);
      _staffs[indexChangeConfirm].isConfirm = false;
      return {
        ...state,
        staffs: _staffs,
      };
    case "GET_STAFF_PART_TIME":
      return {
        ...state,
        part_time_staffs: action.payload,
      };
    case "UPDATE_STAFF_PART_TIME":
      let _part_time_staffs = [...state.part_time_staffs];
      let indexStaffPart = _part_time_staffs.findIndex(item => item.staffId === action.payload.StaffId);
      let indexDatePart = _part_time_staffs[indexStaffPart].staffFreeTimeInfo.findIndex(
        item => item.rank === action.payload.dataUpdate.Rank
      );
      _part_time_staffs[indexStaffPart].staffFreeTimeInfo[indexDatePart].staffFreeTimeList.map((item, index) => {
        if (action.payload.dataUpdate.WorkingTimeId.includes(item.timeOrder)) {
          _part_time_staffs[indexStaffPart].staffFreeTimeInfo[indexDatePart].staffFreeTimeList[index].managementAgree = true;
        }
      });
      return {
        ...state,
        part_time_staffs: _part_time_staffs,
      };
    default:
      return state;
  }
};
export default reducer;
