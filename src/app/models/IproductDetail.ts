export interface IproductDetail {
  id?: number;
  productId?: number;
  name?: string;
  code?: string;
  amount?: any;
  unit?: any;
  cost?: any;
  percent?: any;
}
export interface IRecipeSpeedPos {
  prodNum: number;
  prodName: string;
  stockNum: number;
  stockName: string;
  usage: number;
  unitDesc: string;
  costPerUnit: number;
}
