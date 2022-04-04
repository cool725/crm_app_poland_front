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
  family: "Roboto-Regular",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
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
  t: any;
};

const ReportsExportPDFSimple: React.FC<CProps> = (props) => {
  const t = props.t;
  let apartmentFinalTotal = {
    Nights: 0,
    PriceAccomodationPerNight: 0,
    PriceMinusSourceCommisionPerNight: 0,
    PriceMinusTaxPerNight: 0,
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
      PriceAccomodationPerNight: 0,
      PriceMinusSourceCommisionPerNight: 0,
      PriceMinusTaxPerNight: 0,
      PriceMinusBreakfast: 0,
      PriceMinusBHCommision: 0,
    };

    props.apartmentCalculations.forEach((row) => {
      finalTotal.Nights += Number(row.Nights);
      finalTotal.PriceAccomodationPerNight += Number(row.PriceAccomodationPerNight);
      finalTotal.PriceMinusSourceCommisionPerNight += Number(
        row.PriceMinusSourceCommisionPerNight
      );
      finalTotal.PriceMinusTaxPerNight += Number(row.PriceMinusTaxPerNight);
      finalTotal.PriceMinusBreakfast += Number(row.PriceMinusBreakfast);
      finalTotal.PriceMinusBHCommision += Number(row.PriceMinusBHCommision);

      result.push(
        <View style={styles.tr} key={row.RowID}>
          <Text style={{ ...styles.td, width: "20%" }}>{row.RoomName}</Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.DateFrom ? moment(row.DateFrom).format("YYYY-MM-DD") : ""}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.DateTo ? moment(row.DateTo).format("YYYY-MM-DD") : ""}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>{row.Nights}</Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.PriceAccomodationPerNight}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.PriceMinusSourceCommisionPerNight}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.PriceMinusTaxPerNight}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.PriceMinusBreakfast
              ? Number(row.PriceMinusBreakfast).toFixed(2)
              : ""}
          </Text>
          <Text style={{ ...styles.td, width: "12%", borderRight: 0 }}>
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
        <View
          style={{ ...styles.tr, fontFamily: "Roboto-Regular" }}
          key={row.ItemName}
        >
          <Text style={{ ...styles.td, width: "32%" }}>{t(row.ItemName)}</Text>
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
        <View style={styles.tr} key={row.RowID}>
          <Text style={{ ...styles.td, width: "20%" }}>{row.ParkingName}</Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.DateFrom ? moment(row.DateFrom).format("YYYY-MM-DD") : ""}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.DateTo ? moment(row.DateTo).format("YYYY-MM-DD") : ""}
          </Text>
          <Text style={{ ...styles.td, width: "12%" }}>
            {row.ParkingNights ? row.ParkingNights : ""}
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
          fontFamily: "Roboto-Regular",
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
              {t("Owner")}: {props.curUser?.FirstName} {props.curUser?.LastName}
            </Text>

            <Text
              style={{
                fontSize: 8,
                marginBottom: 4,
              }}
              fixed
            >
              {t("apartments.table.Period")}:{" "}
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
          {t("transactions.Apartment Transactions.Apartment Transactions")}
        </Text>

        <View style={{ marginBottom: 20 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "20%" }}>
                {t("transactions.Apartment Transactions.table.Apartment name")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Apartment Transactions.table.Date From")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Apartment Transactions.table.Date To")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Apartment Transactions.table.Nights")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Apartment Transactions.table.Price Accomodation Per Night")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Apartment Transactions.table.Price Minus Src Commission Per Night")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Apartment Transactions.table.Price Minus Tax Per Night")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t(
                  "transactions.Apartment Transactions.table.Price Minus Breakfast"
                )}
              </Text>
              <Text style={{ ...styles.td, width: "12%", borderRight: 0 }}>
                {t(
                  "transactions.Apartment Transactions.table.Price Minus BH Commission"
                )}
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderApartmentCalculations()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "44%" }}>
                {t("transactions.Final Total")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {apartmentFinalTotal.Nights}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {apartmentFinalTotal.PriceAccomodationPerNight.toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {apartmentFinalTotal.PriceMinusSourceCommisionPerNight.toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {apartmentFinalTotal.PriceMinusTaxPerNight.toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {Number(apartmentFinalTotal.PriceMinusBreakfast).toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "12%", borderRight: 0 }}>
                {Number(apartmentFinalTotal.PriceMinusBHCommision).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 30 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "32%" }}>
                {t("transactions.Other items.Other items")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Other items.Fee")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Other items.Count")}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {t("transactions.Other items.Fee Minus BH Commission")}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {t("transactions.Other items.Total")}
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderApartmentOtherItems()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "32%" }}>
                {t("transactions.Final Total")}
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
          {t("transactions.Parking Transactions.Parking Transactions")}
        </Text>

        <View style={{ marginBottom: 2 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "20%" }}>
                {t("transactions.Parking Transactions.table.Parking name")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Parking Transactions.table.Date From")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Parking Transactions.table.Date To")}
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {t("transactions.Parking Transactions.table.Nights")}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {t("transactions.Parking Transactions.table.Price Minus Tax")}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {t(
                  "transactions.Parking Transactions.table.Price Minus BH Commission"
                )}
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderParkingCalculations()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "44%" }}>
                {t("transactions.Final Total")}
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
            {t("Final Total Transactions")}:{" "}
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

export default ReportsExportPDFSimple;
