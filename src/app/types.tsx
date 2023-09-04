import { IproductDetail } from "./models/IproductDetail";
import { IProductModel } from "./models/IProductModel";
import { StockInventoryFastModel } from "./models/stockInventoryFastModel";
import { StockInventoryModel } from "./models/stockInventoryModel";

export type RootStackParamList = {
  Author: undefined;
  Main: undefined;
}
export type AuthorStackParamList = {
  Login: undefined;
  Main: undefined;
  Forgot: undefined;
  Verification: { input?: string, otp?:string };
  CreateNewPassword: { otp?:string };
};

export type BottomTabParamList = {
  Home: undefined;
  OwnerHighLV: undefined;
  Manager: undefined;
  Report: undefined;
  Profile: undefined;
  BottomTab: undefined;
};

export type TabHomeParamList = {
  TabHomeScreen: undefined;
  RevenueBySubCategory: { data?:any };
};

export type TabOwnerHighLVParamList = {
  TabOwnerHighLVScreen: undefined;
  ReportDetail: { title: string, id: number };
};

export type TabManageParamList = {
  TabManageScreen: undefined;
  ManagementDetail: { title: string, id: number, methodName?: string };
  ManagementProductItem: { title: string, id: number, methodName?: string };
  StockInventoryScreen: {
    title?: string,
    id?: number,
    product?: StockInventoryFastModel,
    callBackProduct?: (val: IproductDetail) => void
  };
  StockInventoryListScreen: {
    title: string,
    categoryName?: string,
    callBackRecipe?: (val: StockInventoryModel) => void
  };
  StaffManagementScreen: { title: string };
  ListOfStaff: { title: string };
  Reports: { title: string; id: number; data?:any };
  ProductItemListScreen: {
    title: string,
    categoryName?: string,
    callBackRecipe?: (val: IProductModel) => void
  };
  RecipeManagementScreen: {
    title: string
    product?: IProductModel,
    categoryName?: string
    // callBackProduct?: (val: IproductDetail) => void
  };
  OnlineSystemScreen: { title: string };
  OnlineFoodDeliveryRevenue: { title: string };
  OnlinePaymentMethod: { title: string };
  ReportOnlineSystem: { title: string; data?:any  };
  BookingSystem: { title: string };
  BookingSystemScreen: { title: string };
  ReportBookingSystem: { title: string };
  TableManagementScreen: { title: string };
  LoyaltyScreen: { title: string };
  MemberShipScreen: {title: string};
  LisOfPromotion: {title: string};
  ListOfOlaMember: {title: string};
  PromotionReport: {title: string};
  OlaMemberReport: {title: string};
  HTSStack: {title: string};
};

export type TabReportParamList = {
  TabReportScreen: undefined;
  ReportDetail: { title: string, id: number };
  SaleTCHourly: undefined;
  Awareness: undefined;
  Revenue: undefined;
  NumberOfTc: undefined;
  RevenueSummary: undefined;
  RevenueItemSoldByCategory: undefined;
};

export type TabProfileParamList = {
  TabProfileScreen: undefined;
  EmployeeEditProfile: undefined;
  Setting: undefined;
  Author: undefined;
  ChangePassword: undefined;
}