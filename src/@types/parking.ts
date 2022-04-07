export type Parking = {
  OwnerID?: number;
  ParkingName: null | string;
  Type: "Commission" | "Non Commission";
  BusinessSegment: string;
  BHCommision: number;
  SourceCommision: number;
  Address: null | string;
  City: null | string;
  AgreementStart: null | string;
  AgreementFinish: null | string;
  IsDeleted?: boolean;
};
