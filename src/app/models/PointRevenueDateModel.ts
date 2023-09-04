export interface PoitRevenueDateModel{
    lineNet:PoitRevenue[],
    lineGross:PoitRevenue[],
    customerBar:PoitRevenue[],
    transactionBar:PoitRevenue[]
}

export interface PoitRevenue{
    x:any,
    y:any,
    date:any,
    revenue:any
}