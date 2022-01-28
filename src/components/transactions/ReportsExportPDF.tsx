import {
  ApartmentTransaction,
  ApartmentOtherItems,
} from "../../@types/apartmenttransaction";
import { ParkingTransaction } from "../../@types/parkingtransaction";

import {
  Font,
  Image,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import moment, { Moment } from "moment";
import { User } from "../../@types/user";

const lang = {
  en: {
    apartmentTransactions: "Apartment Transactions",
    apartmentName: "Apartment name",
    dateFrom: "Date from",
    dateTo: "Date to",
    nights: "Nights",
    priceMinusBreakfast: "Price minus breakfast",
    priceMinusBHCommisstion: "Price minus BH commission",
    otherItems: "Other items",
    fee: "Fee",
    count: "Count",
    feeMinusBHCommission: "FeeMinusBHCommission",
    total: "Total",
    finalTotal: "Final Total",
    parkingTransactions: "Parking Transactions",
    parkingName: "Parking name",
    priceMinusTax: "Price minus tax",
    finalTotalTransactions: "Final Total transactions",
    owner: "Owner",
    address: "Address",
    period: "Period",
  },
  po: {
    apartmentTransactions: "Apartmenty",
    apartmentName: "Apartment",
    dateFrom: "Data Od ",
    dateTo: "Data Do",
    nights: "Dni",
    priceMinusBreakfast: "Kwota netto za pobyt",
    priceMinusBHCommisstion: "Kwota netto - prowizja",
    otherItems: "Koszty",
    fee: "Kwota netto",
    count: "Ilość",
    feeMinusBHCommission: "Kwota Netto - prowizja",
    total: "Razem",
    finalTotal: "Suma",
    parkingTransactions: "Miejsca Parkingowe",
    parkingName: "Parking",
    priceMinusTax: "Kwota Netto",
    finalTotalTransactions: "Suma całkowita",
    owner: "Rozliczenie dla",
    address: "Rozliczenie dla",
    period: "Okres",
  },
};

const styles = StyleSheet.create({
  thead: {
    fontFamily: "Roboto-Bold",
    borderBottomColor: "#BACBE3",
    borderBottom: 0.5,
  },
  tbody: {
    borderBottomColor: "#BACBE3",
    borderBottom: 0.5,
  },
  tfoot: {
    fontFamily: "Roboto-Bold",
    borderBottomColor: "#BACBE3",
    borderBottom: 0.5,
    backgroundColor: "#E6EEF9",
  },
  tr: {
    flexDirection: "row",
  },
  td: {
    fontSize: 7.5,
    borderRightColor: "#BACBE3",
    borderRight: 0.5,
    padding: 3,
  },
});

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

Font.register({
  family: "Roboto-Bold",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
});

type CProps = {
  dateFrom: Moment | null;
  dateTo: Moment | null;
  apartmentCalculations: Array<ApartmentTransaction>;
  apartmentOtherItems: Array<ApartmentOtherItems>;
  parkingCalculations: Array<ParkingTransaction>;
  curUser: User | null;
};

const ReportsExportPDF: React.FC<CProps> = (props) => {
  let apartmentFinalTotal = {
    Nights: 0,
    PriceMinusBreakfast: 0,
    PriceMinusBHCommision: 0,
  };

  let apartmentOtherItemsFinalTotal = {
    Fee: 0,
    Count: 0,
    FeeMinusBHCommission: 0,
    Total: 0,
  };

  let parkingFinalTotal = {
    ParkingNights: 0,
    ParkingPriceMinusTax: 0,
    ParkingPriceMinusBHCommision: 0,
  };

  const renderApartmentCalculations = (): any => {
    let result: Array<any> = [];
    let finalTotal = {
      Nights: 0,
      PriceMinusBreakfast: 0,
      PriceMinusBHCommision: 0,
    };

    props.apartmentCalculations.forEach((row) => {
      finalTotal.Nights += Number(row.Nights);
      finalTotal.PriceMinusBreakfast += Number(row.PriceMinusBreakfast);
      finalTotal.PriceMinusBHCommision += Number(row.PriceMinusBHCommision);

      result.push(
        <View style={styles.tr} key={row.RowID}>
          <Text style={{ ...styles.td, width: "20%" }}>{row.RoomName}</Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {moment(row.DateFrom).format("YYYY-MM-DD")}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {moment(row.DateTo).format("YYYY-MM-DD")}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>{row.Nights}</Text>
          <Text style={{ ...styles.td, width: "22%" }}>
            {row.PriceMinusBreakfast
              ? Number(row.PriceMinusBreakfast).toFixed(2)
              : ""}
          </Text>
          <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
            {row.PriceMinusBHCommision
              ? Number(row.PriceMinusBHCommision).toFixed(2)
              : ""}
          </Text>
        </View>
      );
    });

    apartmentFinalTotal = finalTotal;
    return result;
  };

  const renderApartmentOtherItems = (): any => {
    let result: Array<any> = [];
    let finalTotal = {
      Fee: 0,
      Count: 0,
      FeeMinusBHCommission: 0,
      Total: 0,
    };

    props.apartmentOtherItems.forEach((row) => {
      finalTotal.Fee += Number(row.Fee);
      finalTotal.Count += Number(row.Count);
      finalTotal.FeeMinusBHCommission += Number(row.FeeMinusBHCommission);
      finalTotal.Total += Number(row.Total);

      result.push(
        <View style={styles.tr} key={row.ItemName}>
          <Text style={{ ...styles.td, width: "32%" }}>{row.ItemName}</Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {Number(row.Fee).toFixed(2)}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>{row.Count}</Text>
          <Text style={{ ...styles.td, width: "22%" }}>
            {Number(row.FeeMinusBHCommission).toFixed(2)}
          </Text>
          <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
            {Number(row.Total).toFixed(2)}
          </Text>
        </View>
      );
    });

    apartmentOtherItemsFinalTotal = finalTotal;
    return result;
  };

  const renderParkingCalculations = (): any => {
    let result: Array<any> = [];
    let finalTotal = {
      ParkingNights: 0,
      ParkingPriceMinusTax: 0,
      ParkingPriceMinusBHCommision: 0,
    };

    props.parkingCalculations.forEach((row) => {
      finalTotal.ParkingNights += Number(row?.ParkingNights || 0);
      finalTotal.ParkingPriceMinusTax += Number(row?.ParkingPriceMinusTax || 0);
      finalTotal.ParkingPriceMinusBHCommision += Number(
        row?.ParkingPriceMinusBHCommision || 0
      );

      result.push(
        <View style={styles.tr} key={row.RowId}>
          <Text style={{ ...styles.td, width: "20%" }}>{row.ParkingName}</Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {moment(row.DateFrom).format("YYYY-MM-DD")}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {moment(row.DateTo).format("YYYY-MM-DD")}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.ParkingNights}
          </Text>
          <Text style={{ ...styles.td, width: "22%" }}>
            {row.ParkingPriceMinusTax
              ? Number(row.ParkingPriceMinusTax).toFixed(2)
              : ""}
          </Text>
          <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
            {row.ParkingPriceMinusBHCommision
              ? Number(row.ParkingPriceMinusBHCommision).toFixed(2)
              : ""}
          </Text>
        </View>
      );
    });

    parkingFinalTotal = finalTotal;
    return result;
  };

  return (
    <Document>
      <Page
        size="A4"
        style={{
          paddingTop: 30,
          paddingBottom: 30,
          paddingHorizontal: 24,
          color: "#314768",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 30,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: 8,
                marginBottom: 4,
              }}
              fixed
            >
              {`
              Michał Japtok, Daniel Japtok, Małgorzata Jasiukiewicz
              Baltic HOME S.C.
              Ul. Uzdrowiskowa 11/3, 72-600 Świnoujście
              NIP: 8551531507`}
            </Text>

            <Text
              style={{
                fontSize: 8,
                marginBottom: 4,
              }}
              fixed
            >
              {lang["en"].owner}: {props.curUser?.FirstName}{" "}
              {props.curUser?.LastName}
            </Text>

            <Text
              style={{
                fontSize: 8,
                marginBottom: 4,
              }}
              fixed
            >
              {lang["en"].period}:{" "}
              {props.dateFrom ? props.dateFrom.format("YYYY-MM-DD") : ""} -{" "}
              {props.dateTo ? props.dateTo.format("YYYY-MM-DD") : ""}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 77,
                height: 35,
                marginRight: 8,
              }}
              src="images/logo1.png"
            />
            <Image
              style={{
                width: 71.5,
                height: 54,
              }}
              src="images/logo.png"
            />
          </View>
        </View>

        <Text
          style={{
            fontSize: 8,
            fontFamily: "Helvetica-Bold",
            marginBottom: 10,
            color: "#314768",
            borderBottom: "1px solid #314768",
            paddingBottom: 3,
          }}
        >
          {lang["en"].apartmentTransactions}
        </Text>

        <View style={{ marginBottom: 20 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "20%" }}>
                {lang["en"].apartmentName}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].dateFrom}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].dateTo}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].nights}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {lang["en"].priceMinusBreakfast}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {lang["en"].priceMinusBHCommisstion}
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderApartmentCalculations()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "44%" }}>
                {lang["en"].finalTotal}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {apartmentFinalTotal.Nights}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {Number(apartmentFinalTotal.PriceMinusBreakfast).toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {Number(apartmentFinalTotal.PriceMinusBHCommision).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 30 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "32%" }}>
                {lang["en"].otherItems}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].fee}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].count}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {lang["en"].feeMinusBHCommission}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {lang["en"].total}
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderApartmentOtherItems()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "32%" }}>
                {lang["en"].finalTotal}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {Number(apartmentOtherItemsFinalTotal.Fee).toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {apartmentOtherItemsFinalTotal.Count}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {Number(
                  apartmentOtherItemsFinalTotal.FeeMinusBHCommission
                ).toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {Number(apartmentOtherItemsFinalTotal.Total).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={{
            fontSize: 8,
            fontFamily: "Helvetica-Bold",
            marginBottom: 10,
            color: "#314768",
            borderBottom: "1px solid #314768",
            paddingBottom: 3,
          }}
        >
          {lang["en"].parkingTransactions}
        </Text>

        <View style={{ marginBottom: 2 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "20%" }}>
                {lang["en"].parkingName}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].dateFrom}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].dateTo}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {lang["en"].nights}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {lang["en"].priceMinusTax}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {lang["en"].priceMinusBHCommisstion}
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderParkingCalculations()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "44%" }}>
                {lang["en"].finalTotal}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {parkingFinalTotal.ParkingNights}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {Number(parkingFinalTotal.ParkingPriceMinusTax).toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {Number(parkingFinalTotal.ParkingPriceMinusBHCommision).toFixed(
                  2
                )}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 2,
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingTop: 14,
            paddingRight: 15,
            fontFamily: "Roboto-Bold",
            marginBottom: 40,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: 700,
              borderBottom: 1,
              borderStyle: "solid",
            }}
          >
            {lang["en"].finalTotalTransactions}:{" "}
            {Number(
              apartmentFinalTotal.PriceMinusBHCommision -
                apartmentOtherItemsFinalTotal.Total +
                parkingFinalTotal.ParkingPriceMinusBHCommision
            ).toFixed(2)}
          </Text>
        </View>

        <View
          style={{
            fontSize: 6,
          }}
        >
          <Text>Kontakt:</Text>
          <Text>Anna Kamińska</Text>
          <Text>tel. 693 840 893</Text>
          <Text>akaminska@baltichome.pl</Text>
        </View>

        <Text
          style={{
            position: "absolute",
            fontSize: 8,
            bottom: 15,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "grey",
          }}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default ReportsExportPDF;
