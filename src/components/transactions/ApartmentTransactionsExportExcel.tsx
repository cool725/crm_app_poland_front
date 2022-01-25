import { Button } from "antd";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { ApartmentTransaction } from "../../@types/apartmenttransaction";

import moment, { Moment } from "moment";

type CProps = {
  rows: Array<ApartmentTransaction>;
  dateFrom: Moment | null;
  dateTo: Moment | null;
};

const ApartmentTransactionsExportExcel: React.FC<CProps> = (props) => {
  const apartmentTransactions = props.rows;

  let summaryData = {
    RowID: "Final Total",
    Nights: 0,
    PriceAccomodation: 0,
    PriceMinusSourceCommision: 0,
    PriceMinusTax: 0,
    PriceMinusBreakfast: 0,
    PriceMinusBHCommision: 0,
  };

  const excelData = apartmentTransactions.map((row) => {
    summaryData.Nights += Number(row.Nights);
    summaryData.PriceAccomodation += Number(row.PriceAccomodation);
    summaryData.PriceMinusSourceCommision += Number(
      row.PriceMinusSourceCommision
    );
    summaryData.PriceMinusTax += Number(row.PriceMinusTax);
    summaryData.PriceMinusBreakfast += Number(row.PriceMinusBreakfast);
    summaryData.PriceMinusBHCommision += Number(row.PriceMinusBHCommision);

    return {
      RowID: row.RowID,
      DateFrom: row.DateFrom ? moment(row.DateFrom).format("YYYY-MM-DD") : "",
      DateTo: row.DateTo ? moment(row.DateTo).format("YYYY-MM-DD") : "",
      Nights: row.Nights,
      PriceAccomodation: Number(row.PriceAccomodation).toFixed(2),
      BookingSource: row.BookingSource,
      PriceMinusSourceCommision: Number(row.PriceMinusSourceCommision).toFixed(
        2
      ),
      PriceMinusTax: Number(row.PriceMinusTax).toFixed(2),
      PriceMinusBreakfast: Number(row.PriceMinusBreakfast).toFixed(2),
      PriceMinusBHCommision: Number(row.PriceMinusBHCommision).toFixed(2),
    };
  });

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Apartment Transactions", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: "ID", key: "RowID", width: 9 },
        { header: "Date from", key: "DateFrom", width: 15 },
        { header: "Date to", key: "DateTo", width: 15 },
        { header: "Nights", key: "Nights", width: 12 },
        { header: "Price Accomodation", key: "PriceAccomodation", width: 24 },
        { header: "Booking src", key: "BookingSource", width: 20 },
        {
          header: "Price minus src com-n",
          key: "PriceMinusSourceCommision",
          width: 28,
        },
        { header: "Price minus tax", key: "PriceMinusTax", width: 25 },
        {
          header: "Price minus breakfast",
          key: "PriceMinusBreakfast",
          width: 28,
        },
        {
          header: "Price minus BH com-n",
          key: "PriceMinusBHCommision",
          width: 28,
        },
      ];

      for (let i = 1; i <= worksheet.columnCount; i++) {
        worksheet.getColumn(i).alignment = {
          vertical: "bottom",
          horizontal: "left",
        };
      }

      worksheet.getRow(1).font = { bold: true, size: 14 };
      worksheet.getRow(1).height = 20;

      worksheet.addRows(excelData);

      worksheet.addRow(summaryData);
      worksheet.getRow(excelData.length + 2).font = { bold: true, size: 12 };

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `ApartmentTransactions${
          props.dateFrom || props.dateTo
            ? `(${props.dateFrom?.format(
                "YYYY.MM.DD"
              )} - ${props.dateTo?.format("YYYY.MM.DD")})`
            : ""
        }.xlsx`
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button
      className="btn-default hvr-float-shadow h-10 w-40 ml-3"
      onClick={exportExcel}
    >
      EXPORT XLS
    </Button>
  );
};

export default ApartmentTransactionsExportExcel;
