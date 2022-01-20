export type Apartment = {
  OwnerId: number;
  RoomName: null | string;
  Type: "Commission" | "Non-Commission";
  Period: "Monthly" | "Quarterly" | "Bi-Annually" | "Annually";
  CleaningFee: null | string;
  OwnerCleaningFee: null | string;
  BHCommission: null | string;
  ServiceFee: null | string;
  Address: null | string;
  City: null | string;
  AgreementNumber: null | string;
  AgreementStart: null | string;
  AgreementFinish: null | string;
  BusinessSegment: null | string;
  IsDeleted: boolean;
};
