import React, { useState, useEffect } from "react";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardTypeOptions,
  ImageProps,
  Platform,
  Dimensions,
} from "react-native";
import { TabManageParamList } from "../../../../../types";
import { colors } from "../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "../../../../../components/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { Icons, Images } from "../../../../../assets";
import PickerModel from "../../../../../components/picker/PickerModel";
import ModalSendEmail from "../../../../../components/ModalSendEmail";
import ItemStaff from "./items/itemStaff";
import ItemStaffDone from "./items/itemStaffDone";
import { ValidateEmail, isPhoneNumber, getMonday, getDaysArray } from "../../../../../components/management/utils";
import { StaffService, MailStaffService } from "../../../../../netWorking/staffService";
import Loading from "../../../../../components/dialogs/Loading";
import { IStaff, ICreateStaffRequest } from "../../../../../models/staffModel";
import PickerFormInput from "../../../../../components/PickerFormInput";
import SendSuccess from "../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../components/modalNotification/SendFail";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../../../redux/reducers";
import { _getUserId } from "../../../../../netWorking/authService";
import { checkRole } from "../../../../../components/generalConvert/roles";
export interface Props {
  route: RouteProp<TabManageParamList, "ListOfStaff">;
  navigation: StackNavigationProp<TabManageParamList>;
}

export default function ListOfStaff(props: Props) {
  const dimensions = Dimensions.get("window");
  const dispatch = useDispatch();
  const { staffs, legends, record_area, reset } = useSelector((state: RootState) => state.staff);
  const { access } = useSelector((state: RootState) => state.accesses);
  const { workPlace } = useSelector((state: RootState) => state.workplace);
  const { info } = useSelector((state: RootState) => state.profile);
  const PAGE_SIZE = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  interface IPicker {
    id: number;
    code: string;
    name: string;
  }
  const outletModel = [
    { label: "Spa", value: 1 },
    { label: "Ola Restaurant", value: 2 },
  ];
  const [outlet, setOutlet] = useState(2);
  const initDataPicker = { id: 0, code: "", name: "" };
  const inputStaff = {
    firstName: "",
    lastName: "",
    dutyId: null,
    positionId: 0,
    recordAreaId: 0,
    email: "",
    phone: "",
    titleId: null,
    WorkplaceId: 0,
  };
  const [valueRecordArea, setValueRecordArea] = useState<IPicker>(initDataPicker);
  const [recordAreas, setRecordAreas] = useState<IPicker[]>([]);

  const [pickerValuePosition, setPickerValuePosition] = useState<IPicker>(initDataPicker);
  const [positions, setPositions] = useState<IPicker[]>([]);

  const [duties, setDuties] = useState<IPicker[]>([]);
  const [titles, setTitles] = useState<IPicker[]>([]);

  const [visibleModalPicker, setVisibleModalPicker] = useState("");

  const [inputCreateStaff, setInputCreateStaff] = useState(inputStaff);
  const [isShowCreateForm, setIsShowCreateForm] = useState(false);
  const [modalSendMail, setModalSendMail] = useState(false);
  const [dataStaffs, setDataStaffs] = useState<IStaff[]>([]);

  const [isDone, setDone] = useState(false);
  const [isMount, setIsMount] = useState(false);

  const toDate = new Date();
  let endWeekDay = new Date().setDate(getMonday(toDate).getDate() + 6);
  if (getMonday(toDate).getMonth() < toDate.getMonth()) {
    //check ngày đầu tuần và ngày hiện tại khác tháng
    endWeekDay = new Date(new Date().setMonth(toDate.getMonth() - 1)).setDate(getMonday(toDate).getDate() + 6);
  }
  const [fromDateTime, setFromDateTime] = useState(moment(getMonday(toDate)).format("YYYY-MM-DD 00:00"));
  const [endDateTime, setEndDateTime] = useState(
    moment(endWeekDay).format("YYYY-MM-DD 23:59")
  );

  const [DateInWeek, setDateInWeek] = useState(
    getDaysArray(getMonday(toDate), new Date(endWeekDay))
  );
  const handleChangeDate = date => {
    const _date = new Date(moment(date).format("YYYY-MM-DD"));
    let endWeekDay = new Date(_date).setDate(getMonday(_date).getDate() + 6);
    if (getMonday(_date).getMonth() < new Date(endWeekDay).getMonth()) {
      //check ngày đầu tuần và ngày hiện tại khác tháng
      endWeekDay = new Date(new Date().setMonth(_date.getMonth() - 1)).setDate(getMonday(_date).getDate() + 6);
    }
    setDateInWeek(getDaysArray(getMonday(_date), new Date(endWeekDay)));
    setFromDateTime(moment(getMonday(_date)).format("YYYY-MM-DD 00:00"));
    setEndDateTime(moment(endWeekDay).format("YYYY-MM-DD 23:59"));
  };

  const onPickerListStaff = (value: IPicker) => {
    loadStaffInfo(null, pickerValuePosition.id, value.id);
    setValueRecordArea(value);
    setVisibleModalPicker("");
  };
  const onPickerPosition = (value: IPicker) => {
    loadStaffInfo(null, value.id, valueRecordArea.id);
    setPickerValuePosition(value);
    setVisibleModalPicker("");
  };
  const onHandleShowModal = (type: string) => {
    if (visibleModalPicker === "") {
      setVisibleModalPicker(type);
    } else setVisibleModalPicker("");
  };
  const onCreateStaff = () => {
    setInputCreateStaff({
      ...inputStaff,
      ...{ ["positionId"]: positions[0].id, ["recordAreaId"]: recordAreas[0].id, ["titleId"]: titles[0].id, ["WorkplaceId"]: workPlace.value },
    });
    setIsShowCreateForm(true);
  };
  const onHideFormCreateStaff = () => {
    setIsShowCreateForm(false);
  };
  const onSubmitFormCreateStaff = async () => {
    if (inputCreateStaff.firstName === "") {
      alert("First Name cannot be blank!");
      return;
    }
    if (inputCreateStaff.lastName === "") {
      alert("Last Name cannot be blank!");
      return;
    }
    if (inputCreateStaff.email === "") {
      alert("Email cannot be blank!");
      return;
    }
    if (inputCreateStaff.phone === "") {
      alert("Phone cannot be blank!");
      return;
    }
    if (inputCreateStaff.firstName.length === 1) {
      alert("First Name minimum 2 characters!");
      return;
    }
    if (inputCreateStaff.lastName.length === 1) {
      alert("Last Name minimum 2 characters!");
      return;
    }
    if (!ValidateEmail(inputCreateStaff.email)) {
      alert("Email invalid!");
      return;
    }
    if (!isPhoneNumber(inputCreateStaff.phone)) {
      alert('Phone must start with "0" and have 10 to 11 characters!');
      return;
    }
    if (inputCreateStaff.WorkplaceId === 0) {
      alert('No workplace yet, please recreate later!');
      return;
    }
    setIsLoading(true);
    const res = await StaffService.createStaff(inputCreateStaff);
    setIsLoading(false);
    if (res.isSuccess == 1) {
      setSent("success");
      setStatusSent("Created new staff!");
    } else {
      setSent("fail");
      setStatusSent("Create new staff fail!");
    }
    setIsShowCreateForm(false);
  };
  const onChangeFormStaff = (key: string, value: string | number) => {
    setInputCreateStaff({ ...inputCreateStaff, ...{ [key]: value } });
  };

  const handleSendmail = () => {
    setModalSendMail(!modalSendMail);
  };
  //Fetch API
  const loadStaffInfo = async (
    staffId: number = null,
    positionId: number = null,
    recordAreaId: number = null,
    pageNum: number = 1
  ) => {
    setIsMount(true);
    setIsLoading(true);
    let res
    if (checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") &&
      !checkRole(access, "Part TIme Roster/Schedule (Management)") &&
      !checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)")) {
      res = await StaffService.getStaffInfo(info?.staffId, null, null, null, pageNum, PAGE_SIZE);
    } else {
      res = await StaffService.getStaffInfo(staffId, positionId, recordAreaId, workPlace.value, pageNum, PAGE_SIZE);
    }


    if (res.isSuccess == 1 && res.data) {
      let itemWorkingFullTime = []; // các ngày trong tuần của staff fulltime
      let staffWorkingDayTimeDataFullTime = []; // các ngày trong tuần của staff fulltime
      let itemWorkingPartTime = []; // các ngày trong tuần của staff PartTime
      let listStaffId = []; // id các staff để get info working
      let listStaff: IStaff[] = [];
      DateInWeek.map(item => {
        if (positionId === 1) {
          itemWorkingFullTime.push({
            IsSplit: null,
            LegendId: null,
            IsCheckIn: null,
            Remark: null,
            WorkingDate: item,
            TotalWorkingTime: 0,
            WorkingWeekTime: null,
          });
          staffWorkingDayTimeDataFullTime.push({
            WorkingDate: item,
            legendName: null,
            legendId: null,
            remark: null,
            staffWorkingDayTimeData: [],
          });
        }
        if (positionId === 2) {
          itemWorkingPartTime.push({
            rank: moment(item).format("dddd"),
            day: +moment(item).format("DD"),
            freeDate: item,
            staffFreeTimeList: null,
          });
        }
      });

      res.data.map(item => {
        listStaffId.push({ StaffId: item.id });
        listStaff.push({
          ...item,
          isConfirm: false,
          saved: false,
          edited: false,
          workingScheduleData: positionId === 1 ? itemWorkingFullTime : itemWorkingPartTime,
          staffWorkingDayTimeData: positionId === 1 ? staffWorkingDayTimeDataFullTime : []
        });
      });
      if (positionId === 1) {
        /// Full Time
        const resStaffInfo = await StaffService.GetListOfStarf(fromDateTime, endDateTime, listStaffId);
        let listStaffInfo = [];
        if (resStaffInfo.isSuccess == 1 && resStaffInfo.data) {
          if (resStaffInfo.data.length > 0) {
            resStaffInfo.data.map(item => {
              let arrTime = [...itemWorkingFullTime];
              let arrTimeV2 = [...staffWorkingDayTimeDataFullTime];
              item.staffWorkingDay.map(time => {
                //index ngày mà đã booking trong tuần
                let index = arrTime.findIndex(i => i.WorkingDate.slice(0, 10) == time.workingDate.slice(0, 10));
                if (index !== -1) {
                  let WorkingWeekTime = [];
                  let arrStaffWorkingDayTimeData = [];
                  let isOT = false;
                  if (time.staffWorkingDayTimeData && time.staffWorkingDayTimeData[0].workingTimeId) {
                    time.staffWorkingDayTimeData.map(iTime => {
                      if (iTime.workingTimeId !== null) {
                        arrStaffWorkingDayTimeData.push(iTime.workingTimeId);
                        isOT = iTime.isOT;
                      }
                    });
                    WorkingWeekTime = [{
                      WorkingWeekTimeId: arrStaffWorkingDayTimeData,
                      timeId: arrStaffWorkingDayTimeData,
                      timeSplitId: [],
                      OT: isOT
                    }];
                  }

                  arrTime[index] = {
                    IsSplit: null,
                    LegendId: time.legendName
                      ? legends.find(item => item.name == time.legendName)
                        ? legends.find(item => item.name == time.legendName).id
                        : null
                      : null,
                    IsCheckIn: null,
                    Remark: time.remark,
                    WorkingDate: time.workingDate,
                    TotalWorkingTime: time.staffWorkingDayTimeData
                      ? time.staffWorkingDayTimeData[0].workingTimeId
                        ? time.staffWorkingDayTimeData.length
                        : 0
                      : 0,
                    WorkingWeekTime: WorkingWeekTime.length > 0 ? WorkingWeekTime : null,
                  };
                }
                let indexV2 = arrTimeV2.findIndex(i => i.WorkingDate.slice(0, 10) == time.workingDate.slice(0, 10));
                if (indexV2 !== -1) {
                  arrTimeV2[index] = {
                    IsSplit: null,
                    LegendId: time.legendName
                      ? legends.find(item => item.name == time.legendName)
                        ? legends.find(item => item.name == time.legendName).id
                        : null
                      : null,
                    legendName: time.legendName,
                    Remark: time.remark,
                    WorkingDate: time.workingDate,
                    staffWorkingDayTimeData: time.staffWorkingDayTimeData.length > 0 ? time.staffWorkingDayTimeData : null,
                  };
                }
              });
              listStaffInfo.push({
                id: item.staffId,
                isConfirm: true,
                workingScheduleData: arrTime,
                workingScheduleDataV2: arrTimeV2
              });
            });
          }
        }
        listStaffInfo.map(staff => {
          let iStaff = listStaff.findIndex(i => i.id == staff.id);
          if (iStaff !== -1) {
            listStaff[iStaff].isConfirm = staff.isConfirm;
            listStaff[iStaff].saved = true;
            listStaff[iStaff].workingScheduleData = staff.workingScheduleData;
            listStaff[iStaff].staffWorkingDayTimeData = staff.workingScheduleDataV2;
          }
        });
      }
      if (positionId === 2) {
        //Part time
        let listStaffInfo = [];
        const resPartTime = await StaffService.getFreeStaff(fromDateTime, endDateTime, recordAreaId);
        if (resPartTime.isSuccess == 1 && resPartTime.data) {
          if (resPartTime.data.length > 0) {
            resPartTime.data.map(item => {
              let arrPartTime = JSON.parse(JSON.stringify(itemWorkingPartTime));
              item.staffFreeTimeInfo.map(time => {
                // index ngày mà đã booking trong tuần
                let index = arrPartTime.findIndex(i => i.freeDate.slice(0, 10) == time.freeDate.slice(0, 10));
                if (index !== -1) {
                  let _staffFreeTimeList = time.staffFreeTimeList.filter(_item => _item.timeRange !== null);
                  arrPartTime[index].staffFreeTimeList = _staffFreeTimeList;
                  arrPartTime[index].day = time.day;
                  arrPartTime[index].rank = time.rank;
                }
              });

              listStaffInfo.push({
                id: item.staffId,
                isConfirm: true,
                workingScheduleData: arrPartTime,
              });
            });
          }
        }
        listStaffInfo.map(staff => {
          let iStaff = listStaff.findIndex(i => i.id == staff.id);
          if (iStaff !== -1) {
            listStaff[iStaff].isConfirm = staff.isConfirm;
            listStaff[iStaff].saved = true;
            listStaff[iStaff].workingScheduleData = staff.workingScheduleData;
          }
        });
      }

      dispatch({ type: "GET_STAFFS", payload: listStaff });
    }
    setIsLoading(false);
  };
  const loadAllPosition = async () => {
    const res = await StaffService.getAllPosition();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push({ id: item.id, code: item.code, name: item.name });
        }
      });
      setPickerValuePosition(listData[0]);
      setPositions(listData);
    }
  };

  const loadAllDuty = async () => {
    const res = await StaffService.getAllDuty();
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        if (item.isEnabled) {
          listData.push({ id: item.id, code: item.code, name: item.name });
        }
      });
      setDuties(listData);
    }
  };
  const loadAllTitle = async () => {
    const res = await StaffService.getTitle("", 1, 100, null, workPlace.value);
    if (res.isSuccess == 1 && res.data) {
      let listData = [];
      res.data.map(item => {
        listData.push({ id: item.id, code: item.id, name: item.title });
      });
      setTitles(listData);
    }
  };
  const handleSubmitWorking = async () => {
    let req = [];
    staffs.map(staff => {
      if (staff.edited) {
        let listWorking = [];
        staff.workingScheduleData.map(item => {
          if (item.WorkingWeekTime !== null || item.LegendId !== null) {
            listWorking.push(item);
          }
        });
        req.push({ StaffId: staff.id, WorkingScheduleData: listWorking });
      }
    });
    const res = await StaffService.createWorking(req);
    if (res.isSuccess == 1 && res.data) {
      return true;
    } else {
      return false;
    }
  };
  const sendMailWorkingTime = async (description: string, email: string) => {
    setModalSendMail(!modalSendMail);
    setIsLoading(true);
    let submit = false;
    if (pickerValuePosition.id === 1) {
      submit = await handleSubmitWorking();
    }
    if (pickerValuePosition.id === 2) {
      submit = true;
    }

    if (submit) {
      let req = [];
      staffs.map(staff => {
        req.push({
          DateTime: moment(fromDateTime).format("YYYY-MM-DD HH:mm:ss"),
          StaffId: staff.id,
          Description: description,
          Mail: staff.email,
        });
      });
      const res = await MailStaffService.sendMailWorkingTimeByStaff(req);
      setIsLoading(false);
      if (res.isSuccess == 1 && res.data) {
        setSent("success");
        setStatusSent("Email sent successfully!");
      } else {
        setIsLoading(false);
        setSent("fail");
        setStatusSent("Email sent failed!");
      }
    } else {
      setSent("fail");
      setStatusSent("Schedule work failed!");
    }
  };
  const handleViewReport = async () => {
    if (pickerValuePosition.id === 1) {
      props.navigation.navigate("Reports", {
        title: "BACK OFFICE - STAFF MANAGEMENT",
        id: 1,
        data: { valueRecordArea, fromDateTime, endDateTime }
      });
    }
    if (pickerValuePosition.id === 2) {
      props.navigation.navigate("Reports", {
        title: "BACK OFFICE - STAFF MANAGEMENT",
        id: 5,
      });
    }
  };

  //--------------------------------------------
  useEffect(() => {
    setValueRecordArea(record_area[0]);
    setRecordAreas(record_area);
    loadAllPosition();
    loadAllDuty();
  }, []);
  useEffect(() => {
    loadAllTitle();
  }, [workPlace]);
  useEffect(() => {
    if (!isMount && pickerValuePosition.id && valueRecordArea.id) {
      if (
        checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") ||
        checkRole(access, "Part TIme Roster/Schedule (Management)")
      ) {
        if (!checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)")) {
          if (checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") &&
            !checkRole(access, "Part TIme Roster/Schedule (Management)") &&
            !checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)")) {
            loadStaffInfo(null, 2, null);

          } else { loadStaffInfo(null, 2, valueRecordArea.id); }
        } else {
          loadStaffInfo(null, pickerValuePosition.id, valueRecordArea.id);
        }
      } else {
        loadStaffInfo(null, pickerValuePosition.id, valueRecordArea.id);
      }
    }
  }, [pickerValuePosition, valueRecordArea]);
  useEffect(() => {
    if (isMount) {
      if (
        checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") ||
        checkRole(access, "Part TIme Roster/Schedule (Management)")
      ) {
        if (!checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)")) {
          if (checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") &&
            !checkRole(access, "Part TIme Roster/Schedule (Management)") &&
            !checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)")) {
            loadStaffInfo(null, 2, null);

          } else { loadStaffInfo(null, 2, valueRecordArea.id); }
        } else {
          loadStaffInfo(null, pickerValuePosition.id, valueRecordArea.id);
        }
      } else {
        loadStaffInfo(null, pickerValuePosition.id, valueRecordArea.id);
      }
    }
  }, [endDateTime, fromDateTime, reset]);

  useEffect(() => {
    if (staffs.some(item => item.isConfirm === true)) {
      setDone(true);
    } else {
      setDone(false);
    }
    setDataStaffs(staffs);
  }, [staffs]);

  const onchangeOutlet = async (data: any) => {
    setOutlet(data);
  };
  /// View Component
  const ViewPicker = (type: string, data: IPicker[]) => {
    return (
      <View
        style={{
          zIndex: Platform.OS === "ios" ? (type === "list" ? 4 : 3) : undefined,
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            onHandleShowModal(type);
          }}
        >
          <View style={styles.picker}>
            <Text style={styles.text}>{type === "list" ? valueRecordArea?.name ?? "" : pickerValuePosition?.name ?? ""}</Text>
            <Ionicons
              style={styles.iconDownPicker}
              name="caret-down"
              size={20}
              color={colors.colorText}
              onPress={() => {
                onHandleShowModal(type);
              }}
            />
          </View>
        </TouchableWithoutFeedback>
        {visibleModalPicker === type && (
          <View style={styles.listPicker}>
            {data.map(item => {
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemPicker}
                  onPress={type === "list" ? () => onPickerListStaff(item) : () => onPickerPosition(item)}
                >
                  <Text style={styles.textItemPicker}>{item.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  };
  const itemInput = (
    title: string,
    placeholder: string,
    type: KeyboardTypeOptions,
    maxLength: number,
    value: string,
    onChangeText: (text: string) => void
  ) => {
    return (
      <View style={{ marginBottom: 15 }}>
        <Text style={styles.textTitleItemInput}>{title}</Text>
        <TextInput
          style={[styles.itemInput]}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          keyboardType={type}
          maxLength={maxLength}
          value={value}
          onChangeText={text => onChangeText(text)}
        ></TextInput>
        {/* <Text style={{fontSize:12, color:'#E13C3C', textAlign:'right'}}>Validate</Text> */}
      </View>
    );
  };
  const viewFormCreate = () => {
    return (
      <View style={[styles.formCreate, { marginBottom: dataStaffs.length === 0 ? 200 : 12 }]}>
        <View style={styles.itemFormCreate}>
          <Text style={styles.title}>New staff</Text>
          <TouchableOpacity onPress={onHideFormCreateStaff} style={{ position: "absolute", right: 0, top: 9 }}>
            <Ionicons name="close-circle" size={20} color={colors.colorLine} />
          </TouchableOpacity>
        </View>
        {itemInput("First Name", "Type first name", "default", 35, inputCreateStaff.firstName, text =>
          onChangeFormStaff("firstName", text)
        )}
        {itemInput("Last Name", "Type last name", "default", 20, inputCreateStaff.lastName, text =>
          onChangeFormStaff("lastName", text)
        )}
        <PickerFormInput
          items={titles}
          title={"Title"}
          onChoose={value => {
            onChangeFormStaff("titleId", value.id);
          }}
        ></PickerFormInput>
        <PickerFormInput
          items={positions}
          title={"Position"}
          onChoose={value => {
            onChangeFormStaff("positionId", value.id);
          }}
        ></PickerFormInput>
        <PickerFormInput
          items={recordAreas}
          title={"Record Area"}
          onChoose={value => {
            onChangeFormStaff("recordAreaId", value.id);
          }}
        ></PickerFormInput>
        {itemInput("Email", "Type your email", "email-address", 255, inputCreateStaff.email, text =>
          onChangeFormStaff("email", text)
        )}
        {itemInput("Phone", "Type your phone", "number-pad", 11, inputCreateStaff.phone, text =>
          onChangeFormStaff("phone", text)
        )}
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
            marginTop: 10,
            flex: 1,
          }}
        >
          <TouchableOpacity
            onPress={onHideFormCreateStaff}
            style={[styles.buttonForm, { backgroundColor: "#636363", marginRight: 15 }]}
          >
            <Text style={styles.textButtonForm}>Cancel</Text>
          </TouchableOpacity>
          <LinearGradient style={styles.buttonForm} colors={["#DAB451", "#988050"]}>
            <TouchableOpacity onPress={onSubmitFormCreateStaff}>
              <Text style={styles.textButtonForm}>Save</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <PickerModel
          data={outletModel}
          defaultValue="Ola Restaurant"
          onSelectedValue={value => {
            onchangeOutlet(value.value);
          }}
        ></PickerModel>
        <View style={styles.line}></View>
        <DateTimePicker
          onSubmitFromDate={date => handleChangeDate(date)}
          onSubmitEndDate={date => handleChangeDate(date)}
          fromDate={fromDateTime}
          endDate={endDateTime}
          checkkNotEndDate={false}
        ></DateTimePicker>
        <View style={{ paddingHorizontal: 15, minHeight: dimensions.height }}>
          {checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") &&
            !checkRole(access, "Part TIme Roster/Schedule (Management)") &&
            !checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)") ? (
            <View style={{ zIndex: Platform.OS === "ios" ? 2 : undefined }}></View>
          ) : (
            <View style={{ zIndex: Platform.OS === "ios" ? 2 : undefined }}>
              {isDone ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={styles.textListOfStaff}>List Of Staff</Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      onPress={() => {
                        handleSendmail();
                      }}
                      style={[styles.buttonSend, { backgroundColor: "#636363" }]}
                    >
                      <Text style={styles.textButtonCreate}>Send</Text>
                    </TouchableOpacity>
                    {!checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)") ? (
                      <View></View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          handleViewReport();
                        }}
                      >
                        <LinearGradient style={styles.buttonSend} colors={["#DAB451", "#988050"]}>
                          <Text style={styles.textButtonCreate}>View</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ) : (
                <View style={{ zIndex: Platform.OS === "ios" ? 2 : undefined }}>
                  <View style={{ zIndex: Platform.OS === "ios" ? 3 : undefined }}>
                    {ViewPicker("list", recordAreas)}
                    {checkRole(access, "Part TIme Roster/Schedule (Management)") &&
                      checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)") &&
                      ViewPicker("position", positions)}
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    {checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)") && (
                      <View style={{ flexDirection: "row", marginVertical: 10 }}>
                        <TouchableOpacity
                          onPress={() => {
                            handleSendmail();
                          }}
                          style={[styles.buttonSend, { backgroundColor: "#636363", marginLeft: undefined }]}
                        >
                          <Text style={styles.textButtonCreate}>Send</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            handleViewReport();
                          }}
                          style={[styles.buttonSend, { backgroundColor: "#636363" }]}
                        >
                          <Text style={styles.textButtonCreate}>View</Text>
                        </TouchableOpacity>
                      </View>
                    )}

                    {checkRole(access, "Create new Staff") && (
                      <LinearGradient style={[styles.buttonCreate]} colors={["#DAB451", "#988050"]}>
                        <TouchableOpacity onPress={onCreateStaff}>
                          <Text style={styles.textButtonCreate}>Create new staff</Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    )}
                  </View>
                  {isShowCreateForm && viewFormCreate()}
                </View>
              )}
            </View>
          )}

          {dataStaffs.map((staff, indexStaff) => {
            return (
              <View key={indexStaff}>
                {staff.isConfirm ? <ItemStaffDone data={staff}></ItemStaffDone> : <ItemStaff data={staff}></ItemStaff>}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <ModalSendEmail
        visible={modalSendMail}
        onRequestClose={() => {
          setModalSendMail(!modalSendMail);
        }}
        onRequestSend={(description, email) => {
          sendMailWorkingTime(description, email);
        }}
        isVisibleEmail={false}
      ></ModalSendEmail>
      <SendSuccess
        title={statusSent}
        visible={sent === "success"}
        onRequestClose={() => {
          setSent("");
          loadStaffInfo(null, pickerValuePosition.id, valueRecordArea.id);
          if (statusSent == "Email sent successfully!") {
            props.navigation.navigate("Reports", {
              title: "BACK OFFICE - STAFF MANAGEMENT",
              id: pickerValuePosition.id === 2 ? 5 : 1,
            });
          }
        }}
      ></SendSuccess>
      <SendFail
        title={statusSent}
        visible={sent === "fail"}
        onRequestClose={() => {
          setSent("");
        }}
      ></SendFail>
      {isLoading && <Loading />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "600",
  },
  viewPicker: {
    marginLeft: 15,
    marginRight: 15,
    paddingLeft: 15,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
  },
  iconDown: {
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 12,
    zIndex: 4,
  },
  iconDownPicker: {
    zIndex: 4,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },

  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 40,
    alignItems: "center",
    borderBottomColor: colors.colorLine,
    borderBottomWidth: 1,
  },
  listPicker: {
    zIndex: 5,
    position: "absolute",
    backgroundColor: "#414141",
    borderRadius: 4,
    top: 42,
    right: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemPicker: {
    height: 30,
    justifyContent: "center",
  },
  textItemPicker: {
    color: colors.colorText,
  },
  buttonCreate: {
    height: 30,
    paddingHorizontal: 16,
    marginVertical: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
    borderRadius: 4,
  },
  buttonSend: {
    height: 30,
    width: 79,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginLeft: 10,
  },
  textButtonCreate: {
    color: colors.colorText,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  textListOfStaff: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "700",
  },
  staff: {
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  formCreate: {
    paddingHorizontal: 10,
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    marginBottom: 12,
  },
  itemFormCreate: {
    alignItems: "center",
    justifyContent: "center",
    height: 41,
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.colorLine,
    borderRadius: 10,
  },
  textTitleItemInput: {
    color: colors.gray,
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 9,
  },
  itemInput: {
    height: 40,
    borderRadius: 4,
    backgroundColor: "#303030",
    paddingHorizontal: 11,
    color: colors.colorText,
  },
  textButtonForm: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "400",
  },
  buttonForm: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
});
