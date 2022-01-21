import { Button } from "antd";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { ParkingTransaction } from "../../@types/parkingtransaction";

import moment, { Moment } from "moment";

type CProps = {
  rows: Array<ParkingTransaction>;
  dateFrom: Moment | null;
  dateTo: Moment | null;
};

const ParkingTransactionsExportExcel: React.FC<CProps> = (props) => {
  const parkingTransactions = props.rows;

  const excelData = parkingTransactions.map((row) => {
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
      const worksheet = workbook.addWorksheet("Parking Transactions");

      worksheet.columns = [
        { header: "RowId", key: "RowId", width: 10 },
        { header: "ID prk", key: "ParkingId", width: 10 },
        { header: "Parking name", key: "ParkingName", width: 20 },
        { header: "Date from", key: "DateFrom", width: 15 },
        { header: "Date to", key: "DateTo", width: 15 },
        { header: "Reservation ID", key: "ReservationId", width: 20 },
        { header: "Parking price", key: "ParkingPrice", width: 20 },
        { header: "Data src", key: "DataSource", width: 20 },
        { header: "Add date", key: "AddDate", width: 15 },
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
      EXPORT XLS
    </Button>
  );
};

export default ParkingTransactionsExportExcel;
