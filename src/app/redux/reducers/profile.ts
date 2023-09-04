import { ProfileActions } from "../actions/profile";
type AppState = {
    profile: UserModel;
    info: InfoAccountModel;
};
const initialState: AppState = {
    profile: {
        avatarBase64: '',
        birthday: '',
        fullName: '',
        gender: null,
        code: '',
        concurrencyStamp: '',
        email: '',
        id: 0,
        isEnabled: false,
        normalizedEmail: '',
        normalizedUserName: '',
        phoneNumber: '',
        roleId: 0,
        storeId: 0,
        userName: '',
        title: '',
        isFirsttime: false,
        isSendMail: null,
        isSendInApp: null,
        isSendSMS: null,
        currencyMode: 0,
        workingHour: null,
        dob: null,
        firstName: null,
        lastName: null,
        address: null,
        workplace: null,
        clients: null,
        codePosition: null,
        namePosition: null,
        titleId: 0,
        storeName: '',
        position: '',
        securityStamp: '',
        passWord: '',
        passwordHash: '',
        modifiedBy: 0,
        modifiedWhen: '',
    },
    info:{

    }
};
const reducer = (state: AppState = initialState, action: ProfileActions) => {
    switch (action.type) {
        case "UPDATE_PROFILE":
            return {
                ...state,
                profile: action.payload,
            };
        case "GET_INFO_ACCOUNT":
            return {
                ...state,
                info: action.payload,
            };
        default:
            return state;
    }
};
export default reducer;
