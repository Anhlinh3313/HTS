import { ImageProps } from "react-native";

import { Icons, Images } from "../../assets";
export type weekdayProps = {
  date: string;
  value: string;
  from: string;
  to: string;
  arrangedTime:string;
};
export interface ITimeAndLegendModel {
  id: string;
  date: string;
  time: string|string[];
  legend: string;
  remark: string;
}
export interface IStaffModel {
  id: number;
  avatar: ImageProps;
  fullName: string;
  title: string;
  position: string;
  email: string;
  phone: string;
  isConfirm: false;
  timeAndLegend: ITimeAndLegendModel[];
}
export const dataWeekDays: weekdayProps[] = [
  {
    date: "2021-08-02T00:00:00.000Z",
    value: "09:30 AM to 08:00 PM",
    from: "2021-08-02T09:30:00.000Z",
    to: "2021-08-02T20:00:00.000Z",
    arrangedTime:'',
  },
  {
    date: "2021-08-03T00:00:00.000Z",
    value: "12:00 PM to 10:00 PM",
    from: "2021-08-03T12:00:00.000Z",
    to: "2021-08-03T22:00:00.000Z",
    arrangedTime:'',
  },
  {
    date: "2021-08-04T00:00:00.000Z",
    value: "11:00 AM to 10:00 PM",
    from: "2021-08-03T11:00:00.000Z",
    to: "2021-08-03T22:00:00.000Z",
    arrangedTime:'',
  },
  {
    date: "2021-08-05T00:00:00.000Z",
    value: "NO AVAILABILITY",
    from: "",
    to: "",
    arrangedTime:'',
  },
  {
    date: "2021-08-06T00:00:00.000Z",
    value: "NO RESTRICTION",
    from: "",
    to: "",
    arrangedTime:'',
  },
  {
    date: "2021-08-07T00:00:00.000Z",
    value: "09:00 AM to 08:00 PM",
    from: "2021-08-07T09:00:00.000Z",
    to: "2021-08-07T20:00:00.000Z",
    arrangedTime:'',
  },
  {
    date: "2021-08-08T00:00:00.000Z",
    value: "01:00 PM to 09:00 PM",
    from: "2021-08-07T13:00:00.000Z",
    to: "2021-08-07T21:00:00.000Z",
    arrangedTime:'',
  },
];

export const dataTeam = [
  {
    id: "OVT0001",
    fullName: "Nguyễn Phúc Thiện",
    roster: "Business Development",
  },
  {
    id: "OVT0002",
    fullName: "Nguyễn Thanh Dũng",
    roster: "Business Development",
  },
  { id: "OVT0003", fullName: "Trần Văn Quy", roster: "Business Development" },
  { id: "OVT0004", fullName: "Han Min Hiếu", roster: "Business Development" },
  { id: "OVT0005", fullName: "Phan Nhật Minh", roster: "Business Development" },
  { id: "OVT0006", fullName: "Nguyễn Kim Anh", roster: "Business Development" },
  { id: "OVT0007", fullName: "Lê Hồng Sơn", roster: "Business Development" },
];

export const dataListStaff: IStaffModel[] = [
  {
    id: 1,
    avatar: Icons.avatar,
    fullName: "Nguyen Thanh Tung",
    title: "Business Development",
    position: "Full time",
    email: "Thanhtungdev@gmail.com",
    phone: "0973647638",
    isConfirm: false,
    timeAndLegend: [
      {
        id: "1",
        date: "Monday, 12 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "2",
        date: "Tuesday, 13 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
    ],
  },
  {
    id: 2,
    avatar: Icons.avatar,
    fullName: "Nguyen Phuc Thien",
    title: "Bar Manager",
    position: "Full time",
    email: "",
    phone: "",
    isConfirm: false,
    timeAndLegend: [
      {
        id: "1",
        date: "Monday, 12 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "2",
        date: "Tuesday, 13 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
    ],
  },
  {
    id: 3,
    avatar: Icons.avatar,
    fullName: "Ho Vu Nhi",
    title: "Assistant Restaurant Manager",
    position: "Full time",
    email: "",
    phone: "0973647638",
    isConfirm: false,
    timeAndLegend: [
      {
        id: "1",
        date: "Monday, 12 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
    ],
  },
  {
    id: 4,
    avatar: Icons.avatar,
    fullName: "Ho Vu Nhi",
    title: "Assistant Restaurant Manager",
    position: "Part-time",
    email: "",
    phone: "0973647638",
    isConfirm: false,
    timeAndLegend: [
      {
        id: "1",
        date: "Monday, 12 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "2",
        date: "Tuesday, 13 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "3",
        date: "Wednesday, 14 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "4",
        date: "Thursday, 15 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "5",
        date: "Friday, 16 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "6",
        date: "Saturday, 17 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "7",
        date: "Sunday, 18 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
    ],
  },
  {
    id: 5,
    avatar: Icons.avatar,
    fullName: "Han Min Hiếu",
    title: "Business Development",
    position: "Part-time",
    email: "",
    phone: "0973647638",
    isConfirm: false,
    timeAndLegend: [
      {
        id: "1",
        date: "Monday, 12 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "2",
        date: "Tuesday, 13 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "3",
        date: "Wednesday, 14 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "4",
        date: "Thursday, 15 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "5",
        date: "Friday, 16 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "6",
        date: "Saturday, 17 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
      {
        id: "7",
        date: "Sunday, 18 July 2021",
        time: "",
        legend: "",
        remark: "",
      },
    ],
  },
];
