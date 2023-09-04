import moment from "moment";
export function getMonday(d: Date | number) {
  let date = new Date(d);
  var day = date.getDay(),
    diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(date.setDate(diff));
}
export function getDaysArray(start: Date, end: Date) {
  for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(moment(new Date(dt)).format("YYYY-MM-DD 00:00:00"));
  }
  return arr;
}
export function getDayInWeekArray(start: Date, end: Date, format: string = "DD") {
  for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(moment(new Date(dt)).format(format));
  }
  return arr;
}

export function ValidateEmail(email: string) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}
export function isPhoneNumber(number: string) {
  return /([0])+([0-9]{9,10})\b/.test(number);
}
export function formatTime(time: string) {
  let arrayTime = time.split(" ");
  if (arrayTime.length === 5) {
    let times1 = arrayTime[0].split(":");
    let times2 = arrayTime[3].split(":");
    if (times1[0].length === 1) {
      times1[0] = `0${times1[0]}`;
    }
    if (times1[1].length === 1) {
      times1[1] = `0${times1[1]}`;
    }
    if (times2[0].length === 1) {
      times2[0] = `0${times2[0]}`;
    }
    if (times2[1].length === 1) {
      times2[1] = `0${times2[1]}`;
    }
    arrayTime[0] = times1.join(":");
    arrayTime[3] = times2.join(":");
  }
  return arrayTime.join(" ");
}
