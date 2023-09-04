import { Environment } from "../environment";
import { IResponseModel } from "../models/IResponseModel";
import { _getToken, _getUserId } from "./authService";
import { fetchAPIGet, fetchAPIPost } from "./baseService";
export class UserService {
  public static async getUserById(id: any): Promise<UserModel> {
    let data = (await fetchAPIGet({ url: `/api/Account/GetUserInfoById?id=${id}` })) as IResponseModel;
    return data.data;
  }
  public static async getUserDetailById(id: any): Promise<IResponseModel> {
    let data = (await fetchAPIGet({ url: `/api/Account/Get?id=${id}` })) as IResponseModel;
    return data;
  }

  public static async uploadAvatar(singleFile: any): Promise<any> {
    const token = await _getToken();
    const id = await _getUserId();
    if (singleFile != null) {
      let res = await fetch(`${Environment.apiPost}/api/File/UploadImage`, {
        method: "POST",
        body: JSON.stringify({
          Id: id,
          FileName: "avatar",
          FileExtension: "",
          FileBase64String: singleFile,
        }),
        headers: {
          // 'Content-Type': 'multipart/form-data; ',
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      let responseJson = (await res.json()) as IResponseModel;
      if (responseJson.isSuccess == 1) {
        return responseJson.data;
      } else {
        alert(responseJson.message);
        return;
      }
    } else {
      return;
    }
  }

  public static async updateUser(model: UserModel): Promise<any> {
    const token = await _getToken();
    let res = await fetch(`${Environment.apiPost}/api/Account/Update`, {
      method: "POST",
      body: JSON.stringify({
        avatarBase64: model.avatarBase64,
        birthday: model.birthday,
        code: model.code,
        concurrencyStamp: model.concurrencyStamp,
        createdBy: model.createdBy,
        createdWhen: model.createdWhen,
        email: model.email,
        fullName: model.fullName,
        gender: model.gender == "true" ? true : false,
        id: model.id,
        isEnabled: model.isEnabled,
        isFirsttime: model.isFirsttime,
        modifiedBy: model.modifiedBy,
        modifiedWhen: model.modifiedWhen,
        normalizedEmail: model.normalizedEmail,
        normalizedUserName: model.normalizedUserName,
        passWord: model.passWord,
        passwordHash: model.passwordHash,
        phoneNumber: model.phoneNumber,
        position: model.position,
        roleId: model.roleId,
        securityStamp: model.securityStamp,
        storeId: model.roleId,
        storeName: model.storeName,
        titleId: model.titleId,
        title: model.title,
        userName: model.userName,
        isSendMail: model.isSendMail,
        isSendInApp: model.isSendInApp,
        isSendSMS: model.isSendSMS,
        currencyMode: model.currencyMode,
        workingHour: model.workingHour,
      }),
      headers: {
        // 'Content-Type': 'multipart/form-data; ',
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    let responseJson = (await res.json()) as IResponseModel;
    if (responseJson.isSuccess == 1) {
      // alert("Upload Successful");
      return responseJson.data;
    }
    return;
  }
  public static async getMenuByUserId(id: any): Promise<any> {
    let data = (await fetchAPIGet({ url: `/api/Page/GetMenuByUserId?userId=${id}` })) as IResponseModel;
    return data;
  }
  public static async updateFireBaseToken(token: any): Promise<any> {
    let data = (await fetchAPIPost({ url: `/api/Account/UpdateFireBaseToken`, body: token })) as IResponseModel;
    return data;
  }
  public static async changePassword(body: { userId: number; currentPassWord: string; newPassWord: string }): Promise<any> {
    let data = (await fetchAPIPost({ url: `/api/Account/ChangePassWord`, body })) as IResponseModel;
    return data;
  }
}
