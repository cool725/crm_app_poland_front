export type ParkingTransaction = {
  RowId: number | string;
  ParkingId: number | string;
  ParkingName: string;
  DateFrom: string;
  DateTo: string;
  ReservationId: number | string;
  ParkingNights: number;
  ParkingPrice: number;
  ParkingPriceMinusTax: number;
  ParkingPriceMinusBHCommision: number;
  DataSource: string;
  AddDate: string;
  Nights?: number;
  PriceMinusTax?: number;
  PriceMinusBHCommision?: number;
};
