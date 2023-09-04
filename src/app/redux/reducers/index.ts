import { combineReducers } from "redux";
import staffReducer from "./staffReducer";
import reportStaffReducer from "./reportStaffReducer";
import accessRights from "./accessRights";
import workplace from "./workplace";
import eoh from "./eoh";
import profile from "./profile";

export const rootReducer = combineReducers({
  staff: staffReducer,
  reports: reportStaffReducer,
  accesses: accessRights,
  workplace: workplace,
  eoh: eoh,
  profile: profile,
});

export type RootState = ReturnType<typeof rootReducer>;
