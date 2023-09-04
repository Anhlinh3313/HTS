import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  Modal,
  TouchableOpacity,
  Image,
  TextInput,
  TouchableNativeFeedback,
  Keyboard,
} from "react-native";
import { colors } from "../../../../../../utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Icons } from "../../../../../../assets";
import { LinearGradient } from "expo-linear-gradient";
import SvgUri from "react-native-svg-uri";
import ItemFullTimev2 from "./itemFullTimev2";
import ItemFullTime from "./itemFullTime";
import ItemPartTime from "./itemPartTime";

import { ValidateEmail, isPhoneNumber } from "../../../../../../components/management/utils";
import { IStaff, IPicker } from "../../../../../../models/staffModel";
import { StaffService } from "../../../../../../netWorking/staffService";
import Loading from "../../../../../../components/dialogs/Loading";
import SendSuccess from "../../../../../../components/modalNotification/SendSuccess";
import SendFail from "../../../../../../components/modalNotification/SendFail";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../../../redux/reducers";

import { checkRole } from "../../../../../../components/generalConvert/roles";
import moment from "moment";
export interface IModal {
  isShow?: boolean;
  type?: string;
}
interface Props {
  data: IStaff;
}
const itemTimeAndLegendStaff = (props: Props) => {
  const { workingPartTimes } = useSelector((state: RootState) => state.staff);
  const { staffs } = useSelector((state: RootState) => state.staff);
  const { access } = useSelector((state: RootState) => state.accesses);
  const dispatch = useDispatch();
  const { data } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState("");
  const [statusSent, setStatusSent] = useState("");
  const inputChangeInfo = {
    email: data.email,
    phone: data.phone,
  };
  const modalNull: IModal = { isShow: false, type: "" };
  const dimensions = Dimensions.get("window");
  const windowHeight = dimensions.height;
  const [isShowTimeAndLegend, setIsShowTimeAndLegend] = useState(false);
  const [modalItem, setModalItem] = useState(modalNull);
  const [schedules, setSchedules] = useState({});
  const [schedulesFulltime, setSchedulesFulltime] = useState({});
  const [schedulesFulltimeTemp, setSchedulesFulltimeTemp] = useState({});
  const [inputChangeEmailPhone, setInputChangeEmailPhone] = useState(inputChangeInfo);
  const [isChange, setIsChange] = useState(false);
  const handleChangePartTime = (data: number[], id: string) => {
    if (data) {
      setSchedules({ ...schedules, ...{ [id]: data } });
    }
  };
  const handleChangeFullTime = (id: string, data: any, isChangeOT?: boolean, isSaved?: boolean) => {
    if (data) {
      if (data.legend == 0 && data.time.length == 0 && !isChangeOT) {
        return
      }
      setSchedulesFulltime({ ...schedulesFulltime, ...{ [id]: data } });
      setIsChange(true)
      if (isSaved) {
        if (isChange) {
          setSchedulesFulltimeTemp({ ...schedulesFulltimeTemp, ...{ [id]: data } })
        }
      } else {
        setSchedulesFulltimeTemp({ ...schedulesFulltimeTemp, ...{ [id]: data } })
      }

    }
  };
  
  const handleChangeEmailPhone = (key: string, value: string) => {
    setInputChangeEmailPhone({ ...inputChangeEmailPhone, ...{ [key]: value } });
  };
  const handleCloseModalChangeInfo = () => {
    setInputChangeEmailPhone(inputChangeInfo);
    setModalItem({ isShow: false });
  };
  const handleConfirmModalChangeInfo = async (type: string) => {
    if (type === "email") {
      if (inputChangeEmailPhone.email === "") {
        alert("Email cannot be blank!");
        return;
      }
      if (!ValidateEmail(inputChangeEmailPhone.email)) {
        alert("Email invalid!");
        return;
      }
    }
    if (type === "phone") {
      if (inputChangeEmailPhone.phone === "") {
        alert("Phone cannot be blank!");
        return;
      }
      if (!isPhoneNumber(inputChangeEmailPhone.phone)) {
        alert('Phone must start with "0" and have 10 to 11 characters!');
        return;
      }
    }
    const req = {
      id: data.id,
      isEnabled: true,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: inputChangeEmailPhone.phone,
      email: inputChangeEmailPhone.email,
      positionId: data.positionId,
      recordAreaId: data.recordAreaId,
      dutyId: data.dutyId,
      titleId: data.dutyId,
    };
    setIsLoading(true);
    const res = await StaffService.updateStaff(req);
    setIsLoading(false);
    if (res.isSuccess === 1) {
      dispatch({ type: "UPDATE_STAFF", payload: req });
    } else {
      setSent("fail");
      setStatusSent("Edit info staff fail!");
    }

    setModalItem({ isShow: false });
  };

  const onConfirmWorkingTime = async () => {
    let req = {
      StaffId: data.id,
      isConfirm: true,
      WorkingScheduleData: [],
    };
    let isWarn = '';
    Object.keys(schedulesFulltimeTemp).map(item => {
      if (schedulesFulltimeTemp[item].time.length > 0) {
        let arr2 = staffs.find(staff => staff.id === data.id).workingScheduleData.find(data => +new Date(data.WorkingDate) == +new Date(item));
        if (arr2) {
          let intersection = schedulesFulltimeTemp[item].time.filter(x => arr2.WorkingWeekTime[0].WorkingWeekTimeId.includes(x));
          if (intersection && intersection.length > 0) {
            isWarn = item
          }
        }

        let _WorkingWeekTimev2 = [];
        [...new Set([...schedulesFulltimeTemp[item].time, ...schedulesFulltimeTemp[item].timeSplit])].map(_item => {
          _WorkingWeekTimev2.push({
            isOT: schedulesFulltimeTemp[item].isOT,
            workingTimeId: _item,
          })
        })
        req.WorkingScheduleData.push({
          IsSplit: schedulesFulltimeTemp[item].timeSplit.length > 0 ? 1 : 0,
          LegendId: null,
          IsCheckIn: 0,
          Remark: null,
          WorkingDate: item,
          TotalWorkingTime: [...new Set([...schedulesFulltimeTemp[item].time, ...schedulesFulltimeTemp[item].timeSplit])].length,
          WorkingWeekTime: [
            {
              WorkingWeekTimeId: [...new Set([...schedulesFulltimeTemp[item].time, ...schedulesFulltimeTemp[item].timeSplit])],
              timeId: schedulesFulltimeTemp[item].time,
              timeSplitId: schedulesFulltimeTemp[item].timeSplit,
              OT: +schedulesFulltimeTemp[item].isOT,
            },
          ],
          staffWorkingDayTimeData: _WorkingWeekTimev2,
        });
      }
      if (schedulesFulltimeTemp[item].time.length == 0 && schedulesFulltimeTemp[item].legend !== 0) {
        req.WorkingScheduleData.push({
          IsSplit: 0,
          LegendId: schedulesFulltimeTemp[item].legend,
          IsCheckIn: 0,
          Remark: schedulesFulltimeTemp[item].remark,
          WorkingDate: item,
          TotalWorkingTime: 0,
          WorkingWeekTime: null,
          staffWorkingDayTimeData: null,
        });
      }

    });
    if (isWarn.length > 0) {
      alert(`The time of the schedule for ${isWarn.split('T')[0]} has been created!`)
      return
    }
    if (req.WorkingScheduleData.length === 0) {
      alert('You have not scheduled!')
      return
    }
    dispatch({ type: "CREATE_WORKING_TIME_BY_STAFF", payload: req });

  };
  const onConfirmWorkingTimePartTime = async () => {
    let req = {
      StaffId: data.id,
      StaffFreeTimes: [],
    };
    Object.keys(schedules).map(item => {
      req.StaffFreeTimes.push({
        Rank: moment(item).format("dddd"),
        FreeDate: item,
        WorkingTimeId: schedules[item],
      });
    });
    setIsLoading(true);

    const res = await StaffService.createStaffFreeTime([req]);
    setIsLoading(false);
    if (res.isSuccess === 1) {
      dispatch({ type: "RESET_STAFFS" });
    } else {
      setSent("fail");
      setStatusSent("Create schedule fail!");
    }
  };

  return (
    <View>
      <View style={styles.staff}>
        <View style={[styles.headerStaff, { justifyContent: "space-between" }]}>
          <View style={[styles.headerStaff, { marginBottom: 0 }]}>
            <Image source={Icons.avatar} style={styles.avatarStaff}></Image>
            <Text style={styles.textNameStaff}>{`${data.firstName} ${data.lastName}`}</Text>
          </View>
          {checkRole(access, "Staff Management Detail (Schedule/ Legend/OT/Attendance)") ||
            checkRole(access, "Part Time Roster/Schedule (Part TIme Users Log In)") ? (
            <TouchableOpacity style={{}} onPress={() => setIsShowTimeAndLegend(!isShowTimeAndLegend)}>
              {isShowTimeAndLegend ? (
                <Ionicons name="remove-circle-outline" size={20} color={colors.colorLine} />
              ) : (
                <Ionicons name="add-circle-outline" size={20} color={colors.colorLine} />
              )}
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        <View style={styles.bodyStaff}>
          <View style={styles.itemInfo}>
            <Text style={styles.textInfoStaff}>Title: {data.title}</Text>
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.textInfoStaff}>Position: {data.positionName}</Text>
          </View>
          <View style={[styles.itemInfo, styles.infoEdit]}>
            <Text style={styles.textInfoStaff}>Email: {data.email}</Text>
            {checkRole(access, "Edit Staff") && (
              <TouchableOpacity
                onPress={() => {
                  setModalItem({
                    isShow: true,
                    type: "email",
                  });
                }}
              >
                <SvgUri source={Icons.iconEdit} />
              </TouchableOpacity>
            )}
          </View>
          <View style={[styles.itemInfo, styles.infoEdit]}>
            <Text style={styles.textInfoStaff}>Phone: {data.phone}</Text>
            {checkRole(access, "Edit Staff") && (
              <TouchableOpacity
                onPress={() => {
                  setModalItem({
                    isShow: true,
                    type: "phone",
                  });
                }}
              >
                <SvgUri source={Icons.iconEdit} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {isShowTimeAndLegend && (
        <View>
          {data.workingScheduleData.map((item, index) => {
            return (
              <View key={index}>
                {data.positionName === "Full-Time" ? (
                  <ItemFullTimev2
                    isSaved={data.saved}
                    data={item}
                    index={index}
                    onChangeTime={(data, id, isSaved) => {
                      handleChangeFullTime(data, id, false, isSaved);
                    }}
                    onChangeOT={
                      (data, id) => {
                        handleChangeFullTime(data, id, true);
                      }
                    }
                  ></ItemFullTimev2>
                ) : (
                  <ItemPartTime
                    data={item}
                    onChangeTime={(data, id) => {
                      handleChangePartTime(data, id);
                    }}
                    onChangeIsNo={(data, id) => {
                      handleChangePartTime(data, id);
                    }}
                  ></ItemPartTime>
                )}
              </View>
            );
          })}
          <View
            style={{
              height: 70,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <LinearGradient style={[styles.buttonConfirmSchedule]} colors={["#DAB451", "#988050"]}>
              <TouchableOpacity
                onPress={() => {
                  data.positionName === "Full-Time" ? onConfirmWorkingTime() : onConfirmWorkingTimePartTime();
                }}
              >
                <Text style={styles.textButtonForm}>Confirm</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      )}
      {/* Modal Edit */}
      <Modal animationType="fade" transparent={true} visible={modalItem.isShow}>
        <View
          style={[
            styles.centeredView,
            styles.modelCategory,
            {
              height: windowHeight,
            },
          ]}
        >
          <TouchableNativeFeedback onPress={Keyboard.dismiss}>
            <View
              style={[
                styles.modalView,
                {
                  backgroundColor: "#414141",
                  paddingLeft: 15,
                  paddingRight: 15,
                },
              ]}
            >
              <View style={styles.titleModal}>
                <Text style={[styles.title, { color: colors.mainColor }]}>
                  {modalItem.type === "email" ? "Change Email" : "Change Phone Number"}
                </Text>
              </View>

              <View style={{ paddingTop: 15 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: colors.gray,
                    fontWeight: "600",
                  }}
                >
                  {modalItem.type === "email" ? "Email" : "Phone Number"}
                </Text>
                <TextInput
                  placeholder={modalItem.type === "email" ? "Type Email" : "Type Phone Number"}
                  keyboardType={modalItem.type === "email" ? "email-address" : "number-pad"}
                  placeholderTextColor={colors.gray}
                  style={styles.textInput}
                  onChangeText={text => handleChangeEmailPhone(modalItem.type === "email" ? "email" : "phone", text)}
                  value={modalItem.type === "email" ? inputChangeEmailPhone.email : inputChangeEmailPhone.phone}
                />
              </View>
              <View
                style={{
                  marginTop: 20,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.rowButton}>
                  <TouchableHighlight
                    style={{ borderRadius: 4 }}
                    underlayColor={colors.yellowishbrown}
                    onPress={() => {
                      handleCloseModalChangeInfo();
                    }}
                  >
                    <View style={styles.buttonClose}>
                      <Text style={styles.text}>Close</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                    style={{ borderRadius: 4 }}
                    underlayColor={colors.yellowishbrown}
                    onPress={() => {
                      handleConfirmModalChangeInfo(modalItem.type === "email" ? "email" : "phone");
                    }}
                  >
                    <View style={styles.buttonConfirm}>
                      <Text style={styles.text}>Confirm</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
        </View>
      </Modal>
      <SendSuccess
        title={statusSent}
        visible={sent === "success"}
        onRequestClose={() => {
          setSent("");
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
};
export default itemTimeAndLegendStaff;

const styles = StyleSheet.create({
  text: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "600",
  },
  textInfoStaff: {
    color: colors.colorText,
    fontSize: 14,
    fontWeight: "400",
  },
  buttonForm: {
    flex: 1,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },

  textButtonForm: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "400",
  },

  buttonConfirmSchedule: {
    width: 150,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  staff: {
    backgroundColor: colors.grayLight,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  headerStaff: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarStaff: {
    width: 44,
    height: 44,
    borderRadius: 30,
    backgroundColor: "#c4c4c4",
    marginRight: 15,
  },
  textNameStaff: {
    color: colors.colorText,
    fontSize: 16,
    fontWeight: "500",
  },
  bodyStaff: {},
  itemInfo: {
    marginVertical: 1,
  },
  itemInfoDone: {
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  //modal
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
  },

  //modal Edit

  modelCategory: {
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    paddingTop: 190,
  },
  titleModal: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
    alignItems: "center",
    paddingBottom: 15,
  },
  textInput: {
    marginTop: 5,
    fontSize: 14,
    paddingLeft: 11,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#303030",
    color: colors.white,
  },
  rowButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonClose: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#636363",
    borderRadius: 4,
  },

  buttonConfirm: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DAB451",
    borderRadius: 4,
  },
  modalView: {
    backgroundColor: colors.white,
    width: 354,
    padding: 15,
    borderRadius: 4,
    paddingBottom: 20,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
});
