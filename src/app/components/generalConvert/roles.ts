import { accessModel } from "../../models/accessModel";
export const checkRole = (access: accessModel[], name: string) => {
  if (access.findIndex(e => e.name.toLowerCase() == name.toLowerCase()) !== -1) {
    return true;
  } else {
    return false;
  }
};
