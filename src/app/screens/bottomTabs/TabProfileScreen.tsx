import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Modal,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { StyleSheet } from "react-native";
import { TabProfileParamList } from "../../types";
import { colors } from "../../utils/Colors";
import { Icons } from "../../assets";
import SvgUri from "react-native-svg-uri";
import moment from "moment";
import * as ImagePicker from "expo-image-picker";
import { UserService } from "../../netWorking/userService";
import { _getUserId, _removeToken } from "../../netWorking/authService";
import { Environment } from "../../environment";
import { RouteProp } from "@react-navigation/native";
import Constants from "expo-constants"
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
interface Props {
  navigation: StackNavigationProp<TabProfileParamList>;
  route: RouteProp<TabProfileParamList, "TabProfileScreen">;
}

function TabProfileScreen(props: Props) {
  const { profile } = useSelector((state: RootState) => state.profile);

  const dispatch = useDispatch();
  const dimensions = Dimensions.get('window');
  const windowHeight = dimensions.height;

  const [image, setImage] = useState("");
  const logOut = async () => {
    setIsLogout(true);
  };

  const conformLogout = async () => {
    const res = await _removeToken();
    if (res == true) {
      props.navigation.replace("Author");
    }
  }
  const [isLogout, setIsLogout] = useState(false);
  const editProfile = () => {
    props.navigation.navigate("EmployeeEditProfile");
  };
  const setting = async () => {
    props.navigation.navigate("Setting");
  };
  const changePassword = async () => {
    props.navigation.navigate("ChangePassword");
  };
  function ItemInfo(title: string, value: string) {
    return (
      <View style={styles.itemInfo}>
        <Text style={{ fontWeight: "500", color: colors.gray }}>{title}</Text>
        <Text style={{ fontWeight: "600", color: colors.colorText }}>
          {value}
        </Text>
      </View>
    );
  }

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });
    if (!result.cancelled) {
      setImage(result.uri);
      const res = await UserService.uploadAvatar(result.base64);
      if (res != null) {
        setImage(`${Environment.apiPost}/${res.url}`);
      }
    }
  };

  async function loadDataUser() {
    let userId = await _getUserId();
    const res = await UserService.getUserById(userId);
    if (res) {
      dispatch({ type: "UPDATE_PROFILE", payload: res[0] });
      if (res[0].avatarBase64) {
        setImage(`${Environment.apiPost}/${res[0].avatarBase64}`);
      }
    }

  }
  useEffect(() => {
    loadDataUser();
  }, [])
  return (
    <View style={styles.profile}>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <Image
              style={styles.avatarImg}
              source={image ? { uri: image } : Icons.avatar}
            />

            <TouchableOpacity
              onPress={pickImage}
              style={{
                position: "absolute",
                width: 30,
                height: 30,
                bottom: 0,
                right: 10,
              }}
            >
              <Image source={Icons.camera}></Image>
            </TouchableOpacity>
          </View>
          <Text style={styles.textName}>{profile?.fullName}</Text>
          <TouchableOpacity onPress={editProfile}>
            <Text style={styles.textButtonEdit}>Employee Edit Profile </Text>
          </TouchableOpacity>

          <View style={styles.containerInfo}>
            {ItemInfo("BirthDay", moment(profile?.birthday).format('MM/DD/YYYY'))}
            {ItemInfo("Telephone", profile?.phoneNumber ?? '')}
            {ItemInfo("Employee Code", profile?.code ?? '')}
            {ItemInfo("Gender", (profile?.gender ? 'Male' : 'Female'))}
            {ItemInfo("Email", profile?.email ?? '')}
            {ItemInfo("Attached File", profile?.avatarBase64 ?? '')}
            {ItemInfo("Title", profile?.title ?? '')}
            {ItemInfo("Position", profile?.namePosition ?? '')}
            {ItemInfo("Workplace", profile?.workplace ?? '')}
          </View>
        </View>
        <TouchableOpacity
          onPress={changePassword}
          style={[styles.button, { justifyContent: "space-between" }]}
        >
          <View style={{ flexDirection: "row" }}>
            <SvgUri source={Icons.iconLock} />
            <Text style={styles.textButton}>Change password</Text>
          </View>
          <SvgUri source={Icons.right_chevron} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={setting}
          style={[styles.button, { justifyContent: "space-between" }]}
        >
          <View style={{ flexDirection: "row" }}>
            <SvgUri source={Icons.iconSetting} />
            <Text style={styles.textButton}>Setting</Text>
          </View>
          <SvgUri source={Icons.right_chevron} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={logOut}
          style={[
            styles.button,
            { marginBottom: 24, backgroundColor: "#636363" },
          ]}
        >
          <SvgUri source={Icons.logout} />
          <Text style={styles.textButton}>Logout</Text>
        </TouchableOpacity>
        <View style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 74, }}><Text style={{ color: '#A4A4A4' }}>Ver: {Constants.manifest.version}</Text></View>
      </ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isLogout}
      >
        <View style={[styles.centeredView, styles.modelCategory, { justifyContent: 'flex-start', paddingTop: 200, height: windowHeight, }]}>
          <View style={[styles.modalView, { backgroundColor: "#414141", paddingLeft: 15, paddingRight: 15 }]}>

            <View style={{}}>
              <Text style={{}}></Text>
            </View>

            <View style={{ paddingTop: 0 }}>
              <Text style={[styles.title, { textAlign: 'center' }]}>Do you want to Logout?</Text>
            </View>
            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.rowButton}>
                <TouchableHighlight
                  style={{ borderRadius: 4 }}
                  underlayColor={colors.yellowishbrown}
                  onPress={() => {
                    setIsLogout(false);
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
                    conformLogout();
                    setIsLogout(false);
                  }}
                >
                  <View style={styles.buttonSend}>
                    <Text style={styles.text}>Logout</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default TabProfileScreen;
const styles = StyleSheet.create({
  profile: {
    flex: 1,
    backgroundColor: colors.backgroundApp,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    color: colors.white
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600'
  },
  container: {
    backgroundColor: colors.grayLight,
    width: "100%",
    alignItems: "center",
    borderRadius: 4,
    padding: 15,
  },
  body: {
    paddingHorizontal: 15,
    paddingTop: 40,
    height: "100%",
  },
  avatarImg: {
    width: 140,
    height: 140,
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 100,
  },
  textName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 15,
  },
  textButtonEdit: {
    color: "#DAB451",
    marginTop: 5,
  },
  containerInfo: {
    width: "100%",
    paddingVertical: 5,
    borderColor: colors.gray,
    borderTopWidth: 1,
    marginTop: 20,
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: {
    height: 46,
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: '#636363',
    width: "100%",
    borderRadius: 4,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  textButton: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modelCategory: {
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 190,
  },
  modalView: {
    backgroundColor: colors.white,
    width: 360,
    height: 200,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    paddingBottom: 20,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalForm: {
    width: 360,
    marginBottom: 95,
    backgroundColor: "#414141",
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 4,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  titleModal: {
    // borderBottomWidth: 1,
    // borderBottomColor: colors.gray,
    alignItems: 'center',
    padding: 15
  },
  rowButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonClose: {
    height: 36,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#636363',
    borderRadius: 4,
  },
  buttonSend: {
    height: 36,
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DAB451',
    borderRadius: 4,
  },
});

