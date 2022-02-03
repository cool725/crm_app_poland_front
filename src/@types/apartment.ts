export type Apartment = {
  OwnerID?: number;
  RoomName: string;
  Type: "Commission" | "Non Commission";
  Period: "Monthly" | "Quarterly" | "Bi Annually" | "Annually";
  CleaningFee: number;
  OwnerCleaningFee: number;
  BHCommission: number;
  ServiceFee: number;
  Address: string;
  City: string;
  AgreementNumber: string;
  AgreementStart: string;
  AgreementFinish: string;
  BusinessSegment: string;
  IsDeleted?: boolean;
  SourceCommission?: String;
};
