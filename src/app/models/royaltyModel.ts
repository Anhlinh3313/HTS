export interface memberShipment {
  lastName?: string;
  memCode?: number;
  homeTele?: any;
  email?: any;
  totalPoints?: any;
  memRate?: number;
  level?: string;
}
export interface MemberShipModal {
  totalCount?: number;
  totalNewMember?: number;
  totalLevelGold?: number;
  totalLevelBronze?: number;
  totalLevelSliver?: number;
  listMemberShipment?: memberShipment[];
}
export interface PromotionModal {
  isShow?:boolean;
  promoNum?: number;
  promoName?: string;
  promoType?: number;
  promoValue?: number;
  rangeStart?: any;
  rangeEnd?: any;
  isActive?: boolean;
}
export interface OlaMemberModal {
  memCode?: number;
  lastName?: string;
  email?: string;
  homeTele?: string;
  firstName?: string;
}
export interface PromotionTypeModal {
  typeName?: string;
  typeId?: number;
  id?: number;
  createdWhen?: any;
  createdBy?: any;
  modifiedWhen?: any;
  modifiedBy?: any;
  concurrencyStamp?: any;
  isEnabled?: boolean;
}
