export interface accessModel {
  parentPageId: number;
  isAccess: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  childrenPage: any;
  code: string;
  name: string;
  id: number;
  createdWhen: string;
  createdBy: number;
  modifiedWhen: string;
  modifiedBy: number;
  concurrencyStamp: any;
  isEnabled: boolean;
}
