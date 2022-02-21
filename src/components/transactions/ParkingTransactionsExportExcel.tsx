import { Button } from "antd";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { ParkingTransaction } from "../../@types/parkingtransaction";
import { useTranslation } from "react-i18next";

import moment, { Moment } from "moment";

type CProps = {
  rows: Array<ParkingTransaction>;
  dateFrom: Moment | null;
  dateTo: Moment | null;
};

const ParkingTransactionsExportExcel: React.FC<CProps> = (props) => {
  const parkingTransactions = props.rows;
  const [t] = useTranslation("common");

  let summaryData = {
    RowId: t("transactions.Final Total"),
    ParkingPrice: 0,
  };

  const excelData = parkingTransactions.map((row) => {
    summaryData.ParkingPrice += Number(row.ParkingPrice);

    return {
      RowId: row.RowId,
      ParkingId: row.ParkingId,
      ParkingName: row.ParkingName,
      DateFrom: row.DateFrom ? moment(row.DateFrom).format("YYYY-MM-DD") : "",
      DateTo: row.DateTo ? moment(row.DateTo).format("YYYY-MM-DD") : "",
      ReservationId: row.ReservationId,
      ParkingPrice: Number(row.ParkingPrice).toFixed(2),
      DataSource: row.DataSource,
      AddDate: row.AddDate ? moment(row.AddDate).format("YYYY-MM-DD") : "",
    };
  });

  const exportExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Parking Transactions", {
        views: [{ state: "frozen", ySplit: 1 }],
      });

      worksheet.columns = [
        { header: t("transactions.Parking Transactions.table.RowID"), key: "RowId", width: 10 },
        { header: t("transactions.Parking Transactions.table.ID prk"), key: "ParkingId", width: 10 },
        { header: t("transactions.Parking Transactions.table.Parking name"), key: "ParkingName", width: 20 },
        { header: t("transactions.Parking Transactions.table.Date From"), key: "DateFrom", width: 15 },
        { header: t("transactions.Parking Transactions.table.Date To"), key: "DateTo", width: 15 },
        { header: t("transactions.Parking Transactions.table.Reservation ID"), key: "ReservationId", width: 20 },
        { header: t("transactions.Parking Transactions.table.Parking Price"), key: "ParkingPrice", width: 20 },
        { header: t("transactions.Parking Transactions.table.Data Src"), key: "DataSource", width: 20 },
        { header: t("transactions.Parking Transactions.table.Add date"), key: "AddDate", width: 15 },
      ];

      worksheet.getColumn(1).alignment = {
        vertical: "bottom",
        horizontal: "left",
      };
      worksheet.getColumn(2).alignment = {
        vertical: "bottom",
        horizontal: "left",
      };

      worksheet.getRow(1).font = { bold: true, size: 14 };
      worksheet.getRow(1).height = 20;

      worksheet.addRows(excelData);

      worksheet.addRow(summaryData);
      worksheet.getRow(excelData.length + 2).font = { bold: true, size: 12 };

      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        `ParkingTransactions${
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
      {t("EXPORT XLS")}
    </Button>
  );
};

export default ParkingTransactionsExportExcel;
