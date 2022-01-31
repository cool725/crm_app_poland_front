import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, DatePicker, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { ParkingTransaction } from "../../@types/parkingtransaction";
import moment, { Moment } from "moment";
import axios from "axios";
import ParkingTransactionsExportExcel from "./ParkingTransactionsExportExcel";

const columns: ColumnsType<ParkingTransaction> = [
  {
    title: "RowId",
    dataIndex: "RowId",
    defaultSortOrder: "ascend",
    width: 70,
    sorter: (a, b) => ((a.RowId as string) > (b.RowId as string) ? 1 : -1),
  },
  {
    title: "ID prk",
    dataIndex: "ParkingId",
    width: 90,
    sorter: (a, b) =>
      (a.ParkingId as string) > (b.ParkingId as string) ? 1 : -1,
  },
  {
    title: <div className="whitespace-nowrap">Parking name</div>,
    dataIndex: "ParkingName",
    sorter: (a, b) => (a.ParkingName > b.ParkingName ? 1 : -1),
  },
  {
    title: <div className="whitespace-nowrap">Date from</div>,
    dataIndex: "DateFrom",
    sorter: (a, b) =>
      (a.DateFrom as string) > (b.DateFrom as string) ? 1 : -1,
    render: (DateFrom: string) => {
      return (
        <span className="whitespace-nowrap">
          {moment(DateFrom).format("YYYY-MM-DD HH:mm")}
        </span>
      );
    },
  },
  {
    title: <div className="whitespace-nowrap">Date to</div>,
    dataIndex: "DateTo",
    sorter: (a, b) => ((a.DateTo as string) > (b.DateTo as string) ? 1 : -1),
    render: (DateTo: string) => {
      return (
        <span className="whitespace-nowrap">
          {moment(DateTo).format("YYYY-MM-DD HH:mm")}
        </span>
      );
    },
  },
  {
    title: "Reservation ID",
    dataIndex: "ReservationId",
    sorter: (a, b) =>
      (a.ReservationId as string) > (b.ReservationId as string) ? 1 : -1,
  },
  {
    title: <div className="whitespace-nowrap">Parking price</div>,
    dataIndex: "ParkingPrice",
    sorter: (a, b) => (a.ParkingPrice > b.ParkingPrice ? 1 : -1),
    render: (ParkingPrice) => {
      return <span>{Number(ParkingPrice).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Data src</div>,
    dataIndex: "DataSource",
    sorter: (a, b) =>
      (a.DataSource as string) > (b.DataSource as string) ? 1 : -1,
  },
  {
    title: <div className="whitespace-nowrap">Add date</div>,
    dataIndex: "AddDate",
    sorter: (a, b) => ((a.AddDate as string) > (b.AddDate as string) ? 1 : -1),
    render: (AddDate: string) => {
      return (
        <span className="whitespace-nowrap">
          {moment(AddDate).format("YYYY-MM-DD HH:mm")}
        </span>
      );
    },
  },
];

const ParkingTransactions: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Moment | null>(
    moment().startOf("year")
  );
  const [dateTo, setDateTo] = useState<Moment | null>(moment());

  const [parkingTransactions, setParkingTransactions] = useState([]);

  const fetchParkingTransactions = async () => {
    try {
      const res = await axios
        .get("/parking-transactions/list", {
          params: {
            from: dateFrom ? dateFrom.format("YYYY-MM-DD") : "",
            to: dateTo ? dateTo.format("YYYY-MM-DD") : "",
            parking: "",
          },
        })
        .then((res) => res.data);

      setParkingTransactions(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchParkingTransactions();
  }, []);

  const onDateChange = (dates: any) => {
    setDateFrom(dates ? dates[0] : null);
    setDateTo(dates ? dates[1] : null);
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <div className="mt-8 border-b mb-2 border-gray-400 lg:flex justify-between">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-4">Period</span>

          <DatePicker.RangePicker
            ranges={{
              "This Month": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
            }}
            value={[dateFrom, dateTo]}
            onChange={onDateChange}
          />

          <Button
            className="btn-default h-8 ml-2"
            onClick={() => fetchParkingTransactions()}
          >
            Submit
          </Button>
        </div>

        <div className="flex font-bold text-xl text-c-blue">
          <Link
            to={`/transactions/apartments`}
            className="border-b-4 px-3 border-transparent cursor-pointer mr-6 py-2 lg:py-0"
          >
            Apartment Transactions
          </Link>
          <Link
            to={`/transactions/parkings`}
            className="border-b-4 px-3 border-c-blue cursor-pointer py-2 lg:py-0"
          >
            Parking Transactions
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-auto">
        <Table
          rowKey="RowId"
          columns={columns}
          dataSource={parkingTransactions}
          rowClassName="hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          summary={() => {
            let summaryData = {
              ParkingPrice: 0,
            };
            parkingTransactions.forEach((row: ParkingTransaction) => {
              summaryData.ParkingPrice += Number(row.ParkingPrice);
            });

            return (
              <Table.Summary fixed={"bottom"}>
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    index={0}
                    colSpan={6}
                    className="font-bold"
                  >
                    Final Total
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={1} className="font-bold">
                    {Number(summaryData.ParkingPrice || 0).toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </div>

      <div className="flex justify-between items-center my-6">
        <div className="font-bold text-lg">
          Total amount the period:{" "}
          {parkingTransactions
            .reduce(
              (pVal, cVal: ParkingTransaction) =>
                Number(pVal) + Number(cVal.ParkingPrice),
              0
            )
            .toFixed(2)}
        </div>

        <ParkingTransactionsExportExcel
          rows={parkingTransactions}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
    </div>
  );
};

export default ParkingTransactions;
