export interface StockInventoryFastModel {
    category?: any;
    dateFrom?: any;
    dateTo?: any;
    itemCode?: any;
    itemName?: any;
    price?: any;
    quotationDate?: any;
    unit?: any;
    minPrice?: any;
    maxPrice?: any;
    checkNoti?: any;
    supplier?: any;
    supplierName?: any;
    supplierCode?: any;
    uom?: any;
    checkPurchasecontract?: any
}
export interface StockInventoryByItemModel {
    id?: number,
    fromDate?: any,
    toDate?: any,
    itemCode?: string,
    supplier?: string,
    price?: number,
    announceDate?: any,
    createdWhen?: any,
    createdBy?: number,
    modifiedWhen?: any,
    modifiedBy?: number,
    concurrencyStamp?: string,
    isEnabled?: boolean,
    foodCost?: any,
    prodNum?: any,
}