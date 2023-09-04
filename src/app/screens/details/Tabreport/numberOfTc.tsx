import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableHighlight,
} from "react-native";
import {
  useEffect,
  useState
} from "react";
import moment from "moment";
import { colors } from "../../../utils/Colors";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "../../../components/datetimepicker";
import PickerModel from "../../../components/picker/PickerModel";
import ModalSendEmail from "../../../components/management/items/modalSendEmail";
import SendSuccess from "../../../components/modalNotification/SendSuccess";
import SendFail from "../../../components/modalNotification/SendFail";
import {
  Table,
  Row,
  Cell
} from "react-native-table-component";
import { getMonday } from "../../../components/generalConvert/conVertMonDay";
import { FilterViewModel } from "../../../models/filterViewModel";
import { ReportService } from "../../../netWorking/SpeedposService";
import { TableNumberOfTCModel } from "../../../models/tableNumberOfTCModel";
import { NumberOfTCModel } from "../../../models/numberOfTCModel";
import DialogAwait from "../../../components/dialogs/Loading";

export default function numberOfTc() {
  const [isLoading, setIsLoading] = useState(false);

  const toDate = new Date();
  const [fromDateTime, setFromDateTime] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD 00:00")
  );
  const [endDateTime, setEndDateTime] = useState(
    moment(new Date().setDate(getMonday(toDate).getDate() + 6)).format(
      "YYYY-MM-DD 23:59"
    )
  );
  const [monDay, setMonDay] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD")
  )
  const [modalSendMail, setModalSendMail] = useState(false);
  const [sentStatus, setSentStatus] = useState("");
  //
  let model: FilterViewModel = {};
  //
  const [checKLoadDefault, setChecKLoadDefault] = useState(true);
  //
  const tableNumberOfTC: TableNumberOfTCModel[] = [];
  const [dataNumberOfTC, setNumberOfTC] = useState(tableNumberOfTC);
  //
  const [dateSendMail, setDateSendMail] = useState(
    moment(getMonday(toDate)).format("YYYY-MM-DD 00:00")
  );

  const [totalSale, setTotalSale] = useState(0);
  const handleSendMail = () => {
    setModalSendMail(!modalSendMail);
    setSentStatus("success");
  };
  const [outlet, setoutlet] = useState(2);
  const [droplistOutlet, setDroplistOutlet] = useState("");
  const onchangeOutlet = async (data: any) => {
    setoutlet(data);
    setDroplistOutlet(data);
  };
  const dataTable = {
    tableHead: ["Item", moment(monDay).format("dddd[\n](DD-MM-YYYY)"), moment(new Date(monDay).setDate(new Date(monDay).getDate() + 1)).format("dddd[\n](DD-MM-YYYY)"),
      moment(new Date(monDay).setDate(new Date(monDay).getDate() + 2)).format("dddd[\n](DD-MM-YYYY)"), moment(new Date(monDay).setDate(new Date(monDay).getDate() + 3)).format("dddd[\n](DD-MM-YYYY)"),
      moment(new Date(monDay).setDate(new Date(monDay).getDate() + 4)).format("dddd[\n](DD-MM-YYYY)"), moment(new Date(monDay).setDate(new Date(monDay).getDate() + 5)).format("dddd[\n](DD-MM-YYYY)"),
      moment(new Date(monDay).setDate(new Date(monDay).getDate() + 6)).format("dddd[\n](DD-MM-YYYY)")],
    widthArr: [150, 165, 165],
  };
  //
  const loadnumberOfTc = async (dateTimeFrom) => {
    setIsLoading(true);
    model.DateTime = dateTimeFrom;
    const res = await ReportService.getNumberOfTC(model);
    let data = [];
    let datamap = [];
    let total = 0;
    if (res.isSuccess == 1) {
      data = res.data;
      setNumberOfTC(res.data);
      datamap = res.data as TableNumberOfTCModel[];
      datamap.map(map => {
        total += map.total
      })
      setTotalSale(total);
    }
    setChecKLoadDefault(false);
    setIsLoading(false);
  }

  const OnchangeFromDateTime = (date: any) => {
    const dateTime = new Date(date);
    const fromDate = moment(getMonday(dateTime)).format("YYYY-MM-DD 00:00");
    const toDate = moment(dateTime.setDate(getMonday(dateTime).getDate() + 6)).format("YYYY-MM-DD 23:59");
    const monDay = moment(getMonday(dateTime)).format("YYYY-MM-DD");
    setDateSendMail(fromDate);
    setMonDay(monDay);
    setFromDateTime(fromDate);
    setEndDateTime(toDate);
    loadnumberOfTc(fromDate);
  }

  useEffect(() => {
    if (checKLoadDefault) {
      loadnumberOfTc(fromDateTime);
    }
  }, [])
  return (
    <View style={styles.container}>
      <PickerModel
        defaultValue="Ola Restaurant"
        onSelectedValue={value => {
          onchangeOutlet(value.value);
        }}
      ></PickerModel>
      <View><Text style={{marginLeft:15, fontStyle: "normal",
                  fontWeight: "600",
                  fontSize: 12,
                  lineHeight: 18,
                  color: "#A4A4A4",}}>Weekly Display - Choose a day to start</Text></View>
      <DateTimePicker
        onSubmitFromDate={date => OnchangeFromDateTime(date)}
        onSubmitEndDate={date => setEndDateTime(date)}
        isShowTime={false}
        checkkNotEndDate={false}
      ></DateTimePicker>
      <View style={styles.line}></View>
      {isLoading ? <DialogAwait></DialogAwait> :
      <ScrollView>
        <View
          style={{
            flex: 1,
            paddingVertical: 15,
            paddingHorizontal: 15,
          }}
        >
          <ScrollView horizontal={true}>
            <View style={{ backgroundColor: "#414141", borderRadius: 4 }}>
              <Table style={{ borderRadius: 4 }}>
                <Row
                  data={dataTable.tableHead}
                  style={{
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                    height: 60,
                    backgroundColor: "#878787",
                    paddingLeft: 0,
                  }}
                  textStyle={[styles.text, { textAlign: "center" }]}
                />
                {dataNumberOfTC.map((item, indexTable) => {
                  return (
                    <View
                      key={indexTable}
                    >
                      <Row
                        data={[item.name]}
                        style={[
                          styles.styleRowTable,
                          { backgroundColor: "#17151C" },
                          { paddingLeft: 10 },
                        ]}
                        flexArr={[1]}
                        textStyle={[styles.text600, { backgroundColor: "#ff0" }]}
                      />
                      <Table>
                        {
                          item.data?.map((row, indexdata) => (
                            <View key={indexdata} style={[{ flexDirection: 'row', height: 50 }, indexdata % 2 == 0 ? { backgroundColor: '#8D7550' } : {}]}>
                              <Cell key={0}
                                data={row.prodName ? row.prodName : "---"}
                                style={{ width: dataTable.widthArr[0] }}
                                textStyle={styles.textRowTable} />
                              {
                                row.dayData?.map((row, indexDay) => (
                                  <Cell key={indexDay}
                                    data={row.countProdNum ? row.countProdNum : "---"}
                                    style={{ width: dataTable.widthArr[1] }}
                                    textStyle={styles.textRowTable} />
                                ))
                              }
                            </View>
                          ))
                        }
                      </Table>
                      <Table>
                        <View style={{ flexDirection: 'row', height: 50 }}>
                          <Cell key={0}
                            data={"Total"}
                            style={{ width: dataTable.widthArr[0] }}
                            textStyle={styles.textRowTable} />
                          <Cell key={1}
                            data={item.total ? item.total : 0}
                            style={{ width: dataTable.widthArr[1] }}
                            textStyle={styles.textRowTable} />
                        </View>
                      </Table>
                    </View>
                  );
                })}
                <Table>
                  <View style={{ flexDirection: 'row', height: 50, backgroundColor: '#8D7550' }}>
                    <Cell key={0}
                      data={"Total sale"}
                      style={{ width: dataTable.widthArr[0] }}
                      textStyle={styles.textRowTable} />
                    <Cell key={1}
                      data={totalSale}
                      style={{ width: dataTable.widthArr[1] }}
                      textStyle={styles.textRowTable} />
                  </View>
                </Table>
              </Table>
            </View>
          </ScrollView>
        </View>

        <View style={styles.line}></View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 32,
          }}
        >
          <LinearGradient
            style={styles.buttonSubmit}
            colors={["#DAB451", "#988050"]}
          >
            <TouchableHighlight
              underlayColor={colors.yellowishbrown}
              onPress={() => {
                setModalSendMail(!modalSendMail);
              }}
            >
              <View
                style={{
                  height: 36,
                  width: 150,
                  justifyContent: "center",
                }}
              >
                <Text style={[styles.title, { textAlign: "center" }]}>
                  Send
                </Text>
              </View>
            </TouchableHighlight>
          </LinearGradient>
        </View>
        <ModalSendEmail
          title={"Number Of TC (Item)"}
          visible={modalSendMail}
          dateTime={dateSendMail}
          isPickType={true}
          onRequestClose={() => {
            setModalSendMail(!modalSendMail);
          }}
          onRequestSend={() => {
            handleSendMail();
          }}
        ></ModalSendEmail>
        <SendSuccess
          visible={sentStatus === "success"}
          onRequestClose={() => setSentStatus("")}
        ></SendSuccess>
        <SendFail
          visible={sentStatus === "fail"}
          onRequestClose={() => setSentStatus("")}
        ></SendFail>
      </ScrollView>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  line: {
    height: 10,
    backgroundColor: colors.backgroundTab,
  },
  buttonSubmit: {
    height: 36,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.white,
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.white,
  },
  text600: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  styleRowTable: {
    height: 36,
  },
  textRowTable: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
  },
});
