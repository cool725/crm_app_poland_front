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
    fontFamily: "Helvetica-Bold",
    borderBottomColor: "#BACBE3",
    borderBottom: 0.5,
  },
  tbody: {
    borderBottomColor: "#BACBE3",
    borderBottom: 0.5,
  },
  tfoot: {
    fontFamily: "Helvetica-Bold",
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
  family: "Roboto-Regular",
  src: "http://fonts.gstatic.com/s/roboto/v15/NJ4vxlgWwWbEsv18dAhqnn-_kf6ByYO6CLYdB4HQE-Y.woff2",
});
Font.register({
  family: "Roboto-Bold",
  src: "http://fonts.gstatic.com/s/roboto/v15/77FXFjRbGzN4aCrSFhlh3oX0hVgzZQUfRDuZrPvH3D8.woff2",
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
    Nights: 0,
    PriceMinusTax: 0,
    PriceMinusBHCommision: 0,
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
      Nights: 0,
      PriceMinusTax: 0,
      PriceMinusBHCommision: 0,
    };

    props.parkingCalculations.forEach((row) => {
      finalTotal.Nights += Number(row?.Nights || 0);
      finalTotal.PriceMinusTax += Number(row?.PriceMinusTax || 0);
      finalTotal.PriceMinusBHCommision += Number(
        row?.PriceMinusBHCommision || 0
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
          <Text style={{ ...styles.td, width: "12%" }}>{row.Nights}</Text>
          <Text style={{ ...styles.td, width: "22%" }}>
            {row.PriceMinusTax ? Number(row.PriceMinusTax).toFixed(2) : ""}
          </Text>
          <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
            {row.PriceMinusBHCommision
              ? Number(row.PriceMinusBHCommision).toFixed(2)
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
                fontFamily: "Helvetica-Bold",
                marginBottom: 10,
              }}
              fixed
            >
              Leasing transactions summary report
            </Text>

            <Text
              style={{
                fontSize: 8,
                marginBottom: 4,
              }}
              fixed
            >
              Owner: {props.curUser?.FirstName} {props.curUser?.LastName}
            </Text>

            <Text
              style={{
                fontSize: 8,
                marginBottom: 4,
              }}
              fixed
            >
              {props.dateFrom ? props.dateFrom.format("YYYY-MM-DD") : ""} -{" "}
              {props.dateTo ? props.dateTo.format("YYYY-MM-DD") : ""}
            </Text>
          </View>

          <Image
            style={{
              width: 71.5,
              height: 54,
            }}
            src="images/logo.png"
          />
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
          Apartments transactions
        </Text>

        <View style={{ marginBottom: 20 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "20%" }}>
                Apartments name
              </Text>
              <Text style={{ ...styles.td, width: "12%" }}>Date from</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Date to</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Nights</Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                Price minus breakfast
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                Price minus BH commission
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderApartmentCalculations()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "44%" }}>Final Total</Text>
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
              <Text style={{ ...styles.td, width: "32%" }}>Other items</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Fee</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Count</Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                Fee minus BH Commission
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                Total
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderApartmentOtherItems()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "32%" }}>Final Total</Text>
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
          Parking transactions
        </Text>

        <View style={{ marginBottom: 20 }}>
          <View style={styles.thead}>
            <View style={styles.tr}>
              <Text style={{ ...styles.td, width: "20%" }}>Parking name</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Date from</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Date to</Text>
              <Text style={{ ...styles.td, width: "12%" }}>Nights</Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                Price minus tax
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                Price minus BH commission
              </Text>
            </View>
          </View>

          <View style={styles.tbody}>{renderParkingCalculations()}</View>

          <View style={styles.tfoot}>
            <View style={{ ...styles.tr }}>
              <Text style={{ ...styles.td, width: "44%" }}>Final Total</Text>
              <Text style={{ ...styles.td, width: "12%" }}>
                {parkingFinalTotal.Nights}
              </Text>
              <Text style={{ ...styles.td, width: "22%" }}>
                {Number(parkingFinalTotal.PriceMinusTax).toFixed(2)}
              </Text>
              <Text style={{ ...styles.td, width: "22%", borderRight: 0 }}>
                {Number(parkingFinalTotal.PriceMinusBHCommision).toFixed(2)}
              </Text>
            </View>
          </View>
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
