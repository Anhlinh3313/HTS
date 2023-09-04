import React, { useState ,useEffect} from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";

import moment from "moment";
import { colors } from "../../utils/Colors";
import HandleTime from "../../components/management/TimePicker/HandleTime";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
const index = ({
  data,
  onChangeTime,
}: {
  data?: number[];
  onChangeTime?: (times:number[]) => void;
}) => {
  
  const workingPartTimes = useSelector((state: RootState) => state.staff.workingPartTimes);
  interface ITime {
    hour: number;
    minute: number;
    period: string;
  }
  const InitTime= {
    hour: 0,
    minute: 0,
    period: 'am',
  }

  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [timeFromObj, setTimeFromObj] = useState<ITime>(InitTime);
  const [timeToObj, setTimeToObj] = useState<ITime>(InitTime);
  useEffect(() => {
    let req=[]
    const idFromTime = timeFromObj.hour * 2 + (timeFromObj.minute === 0 ? 1 : 2);
    const idToTime = timeToObj.hour * 2 + (timeToObj.minute === 0 ? 0 : 1);
    const workingTimeId = Array.from({ length: idToTime - idFromTime + 1 }, (_, i) => idFromTime + i);
    workingPartTimes.map(item=>{
      if( workingTimeId.includes(item.timeOrder)){
        req.push(item.id)
      }
    })
    onChangeTime(req)
  }, [timeFromObj,timeToObj])
  
  return (
        <View style={[styles.dateTimeContainer, {}]}>
          <HandleTime
            value={data.length>0?workingPartTimes.find(item=>item.id===data[0]).timeRange.slice(0, 5):''}
            title="From"
            onChange={time => {
              setTimeFrom(time);
            }}
            onChangeOBJ={time => {
              setTimeFromObj(time);
            }}
          ></HandleTime>
          <HandleTime
            value={data.length>0?workingPartTimes.find(item=>item.id===data[data.length-1]).timeRange.slice(8,13):''}
            title="To"
            onChange={time => {
              setTimeTo(time);
            }}
            onChangeOBJ={time => {
              setTimeToObj(time);
            }}
          ></HandleTime>
        </View>
  );
};

export default index;

const styles = StyleSheet.create({
  dateTimeContainer: {
    width: "100%",
    alignSelf: "center",
    backgroundColor: "#414141",
    marginTop:8
  },
  
});
