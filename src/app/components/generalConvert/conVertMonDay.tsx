export const getMonday = (d: Date | number) => {
  let date = new Date(d);
  var day = date.getDay(),
    diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
};

export function get12HourTime(string: string) {
  var date = new Date("1/1/2021 " + string);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let amPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let _hours = hours < 10 ? "0" + hours : hours;
  let _minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = _hours + ":" + _minutes + " " + amPm;
  return strTime;
}
