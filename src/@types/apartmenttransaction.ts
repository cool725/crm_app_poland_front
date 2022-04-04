export type ApartmentTransaction = {
  RowID: number | string;
  RoomName?: string;
  DateFrom: string;
  DateTo: string;
  Nights: number;
  PriceAccomodation: number;
  BookingSource: string;
  PriceMinusSourceCommision: number;
  PriceMinusTax: number;
  PriceMinusBreakfast: number;
  PriceMinusBHCommision: number;
  PriceAccomodationPerNight: number;
  PriceMinusSourceCommisionPerNight: number;
  PriceMinusTaxPerNight: number;
  BreakfastQty: number;
  BreakFastUnitPrice: number;
  PriceMinusBreakfastPerNight: number;
};

export type ApartmentOtherItems = {
  ItemName: string;
  Fee: number;
  Count: number;
  FeeMinusBHCommission: number;
  Total: number;
};
