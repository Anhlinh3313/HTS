export interface NumberOfTCModel {
  prodNum?: number;                              
  prodName?: string;  
  countProdNum?: number;              
  prodTypeIdSpeedPos?: number;                
  name?: string; 
  dayData?: DayCModel[];                             
  totalNetCostEach?: any;                  
  totalProType0?: any;                     
  totalProType1?: any;                     
  totalProType2?: any;                     
  totalProType3?: any;                     
  totalProType4?: any;                     
  totalProType5?: any;                     
  totalProType6?: any;                     
  totalProType7?: any;                     
  totalProType8?: any;                     
  totalProType9?: any;                     
  totalProType10?: any;                    
  totalProType11?: any;                    
  totalProType12?: any;                    
}
export interface DayCModel {
  day?: number;
  countProdNum?: number;
  totalNetCostEach?: any;
}
