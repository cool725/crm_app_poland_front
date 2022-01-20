import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, DatePicker, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { ApartmentTransaction } from "../../@types/apartmenttransaction";
import moment, { Moment } from "moment";
import axios from "axios";

const columns: ColumnsType<ApartmentTransaction> = [
  {
    title: "ID",
    dataIndex: "RowID",
    defaultSortOrder: "ascend",
    width: 70,
    sorter: (a, b) => ((a.RowID as string) > (b.RowID as string) ? 1 : -1),
  },
  {
    title: <div className="whitespace-nowrap">Date from</div>,
    dataIndex: "DateFrom",
    sorter: (a, b) =>
      (a.DateFrom as string) > (b.DateFrom as string) ? 1 : -1,
    render: (DateFrom: string) => {
      return (
        <span className="whitespace-nowrap">
          {moment(DateFrom).format("YYYY-MM-DD")}
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
          {moment(DateTo).format("YYYY-MM-DD")}
        </span>
      );
    },
  },
  {
    title: "Nights",
    dataIndex: "Nights",
    sorter: (a, b) => (a.Nights > b.Nights ? 1 : -1),
  },
  {
    title: <div className="whitespace-nowrap">Price Accomodation</div>,
    dataIndex: "PriceAccomodation",
    sorter: (a, b) => (a.PriceAccomodation > b.PriceAccomodation ? 1 : -1),
    render: (PriceAccomodation) => {
      return <span>{Number(PriceAccomodation).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Booking Src</div>,
    dataIndex: "BookingSource",
    sorter: (a, b) =>
      (a.BookingSource as string) > (b.BookingSource as string) ? 1 : -1,
  },
  {
    title: <div className="whitespace-nowrap">Price minus src com-n</div>,
    dataIndex: "PriceMinusSourceCommision",
    sorter: (a, b) =>
      a.PriceMinusSourceCommision > b.PriceMinusSourceCommision ? 1 : -1,
    render: (PriceMinusSourceCommision) => {
      return <span>{Number(PriceMinusSourceCommision).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Price minus tax</div>,
    dataIndex: "PriceMinusTax",
    sorter: (a, b) => (a.PriceMinusTax > b.PriceMinusTax ? 1 : -1),
    render: (PriceMinusTax) => {
      return <span>{Number(PriceMinusTax).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Price minus breakfast</div>,
    dataIndex: "PriceMinusBreakfast",
    sorter: (a, b) => (a.PriceMinusBreakfast > b.PriceMinusBreakfast ? 1 : -1),
    render: (PriceMinusBreakfast) => {
      return <span>{Number(PriceMinusBreakfast).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Price minus BH com-n</div>,
    dataIndex: "PriceMinusBHCommision",
    sorter: (a, b) =>
      a.PriceMinusBHCommision > b.PriceMinusBHCommision ? 1 : -1,
    render: (PriceMinusBHCommision) => {
      return <span>{Number(PriceMinusBHCommision).toFixed(2)}</span>;
    },
  },
];

const ApartmentTransactions: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Moment | null>(null);
  const [dateTo, setDateTo] = useState<Moment | null>(null);

  const [apartmentTransactions, setApartmentTransactions] = useState([]);

  const fetchApartmentTransactions = async () => {
    try {
      const res = await axios
        .get("/apartment-transactions/list", {
          params: {
            from: dateFrom ? dateFrom.format("YYYY-MM-DD") : "",
            to: dateTo ? dateTo.format("YYYY-MM-DD") : "",
            apartment: "",
          },
        })
        .then((res) => res.data);

      setApartmentTransactions(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchApartmentTransactions();
  }, []);

  const onDateChange = (dates: any) => {
    setDateFrom(dates ? dates[0] : null);
    setDateTo(dates ? dates[1] : null);
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <div className="mt-8 border-b mb-2 border-gray-400 flex justify-between">
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
            onClick={() => fetchApartmentTransactions()}
          >
            Submit
          </Button>
        </div>

        <div className="flex font-bold text-xl text-c-blue">
          <Link
            to={`/transactions/apartments`}
            className="border-b-4 px-3 border-c-blue cursor-pointer mr-6"
          >
            Apartment Transactions
          </Link>
          <Link
            to={`/transactions/parkings`}
            className="border-b-4 px-3 border-transparent cursor-pointer"
          >
            Parking Transactions
          </Link>
        </div>
      </div>

      <Table
        rowKey="RowID"
        columns={columns}
        dataSource={apartmentTransactions}
        rowClassName="hover:bg-white hover:bg-opacity-10"
        className="border flex-grow"
        summary={(pageData) => {
          let summaryData = {
            Nights: 0,
            PriceAccomodation: 0,
            PriceMinusSourceCommision: 0,
            PriceMinusTax: 0,
            PriceMinusBreakfast: 0,
            PriceMinusBHCommision: 0,
          };
          pageData.forEach((row) => {
            summaryData.Nights += Number(row.Nights);
            summaryData.PriceAccomodation += Number(row.PriceAccomodation);
            summaryData.PriceMinusSourceCommision += Number(
              row.PriceMinusSourceCommision
            );
            summaryData.PriceMinusTax += Number(row.PriceMinusTax);
            summaryData.PriceMinusBreakfast += Number(row.PriceMinusBreakfast);
            summaryData.PriceMinusBHCommision += Number(
              row.PriceMinusBHCommision
            );
          });

          return (
            <Table.Summary fixed={"bottom"}>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={3} className="font-bold">
                  Final Total
                </Table.Summary.Cell>

                <Table.Summary.Cell index={1} className="font-bold">
                  {summaryData.Nights}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={2} className="font-bold">
                  {Number(summaryData.PriceAccomodation).toFixed(2)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={3}></Table.Summary.Cell>

                <Table.Summary.Cell index={4} className="font-bold">
                  {Number(summaryData.PriceMinusSourceCommision).toFixed(2)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={5} className="font-bold">
                  {Number(summaryData.PriceMinusTax).toFixed(2)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={6} className="font-bold">
                  {Number(summaryData.PriceMinusBreakfast).toFixed(2)}
                </Table.Summary.Cell>

                <Table.Summary.Cell index={7} className="font-bold">
                  {Number(summaryData.PriceMinusBHCommision).toFixed(2)}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />

      <div className="flex justify-end my-6">
        <Button className="btn-default hvr-float-shadow h-10 w-40 ml-3">
          EXPORT XLS
        </Button>
      </div>
    </div>
  );
};

export default ApartmentTransactions;
