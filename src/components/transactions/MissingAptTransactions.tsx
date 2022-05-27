import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, DatePicker, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { RootState } from "../../store";

import { MissingAptTransaction } from "../../@types/missingapttransaction";
import moment, { Moment } from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";

const MissingAptTransactions: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Moment | null>(
    moment().startOf("year")
  );
  const [dateTo, setDateTo] = useState<Moment | null>(moment());
  const user = useSelector((state: RootState) => state.auth.user);

  const [missingAptTransactions, setMissingAptTransactions] = useState([]);
  const [t] = useTranslation("common");

  const columns: ColumnsType<MissingAptTransaction> = [
    {
      title: t("transactions.Parking Transactions.table.RowID"),
      dataIndex: "RowId",
      defaultSortOrder: "ascend",
      width: 70,
      sorter: (a, b) => ((a.RowId as string) > (b.RowId as string) ? 1 : -1),
    },
    {
      title: t("transactions.Parking Transactions.table.Reservation ID"),
      dataIndex: "ReservationID",
      width: 90,
      sorter: (a, b) =>
        (a.ReservationID as string) > (b.ReservationID as string) ? 1 : -1,
    },
    {
      title: <div>{t("apartments.table.Room name")}</div>,
      dataIndex: "RoomName",
      sorter: (a, b) => (a.RoomName > b.RoomName ? 1 : -1),
    },
    {
      title: <div>{t("transactions.Duplicate Parkings.table.DateFrom")}</div>,
      dataIndex: "DateFrom",
      sorter: (a, b) =>
        (a.DateFrom as string) > (b.DateFrom as string) ? 1 : -1,
      render: (DateFrom: string) => {
        return (
          <span className="whitespace-nowrap">
            {DateFrom ? moment(DateFrom).format("YYYY-MM-DD") : ""}
          </span>
        );
      },
    },
    {
      title: <div>{t("transactions.Duplicate Parkings.table.DateTo")}</div>,
      dataIndex: "DateTo",
      sorter: (a, b) => ((a.DateTo as string) > (b.DateTo as string) ? 1 : -1),
      render: (DateTo: string) => {
        return (
          <span className="whitespace-nowrap">
            {DateTo ? moment(DateTo).format("YYYY-MM-DD") : ""}
          </span>
        );
      },
    },
    {
      title: <div>{t("apartments.sourceCommission.Booking Source")}</div>,
      dataIndex: "BookingSource",
      sorter: (a, b) =>
        (a.BookingSource as string) > (b.BookingSource as string) ? 1 : -1,
    },
    {
      title: t("parkings.table.Type"),
      dataIndex: "Type",
      sorter: (a, b) => ((a.Type as string) > (b.Type as string) ? 1 : -1),
      render: (Type: string) => {
        return <span className="whitespace-nowrap">{Type}</span>;
      },
    },
  ];

  const fetchMissingAptTransactions = async () => {
    try {
      const res = await axios
        .get("/apartment-transactions/missing-list", {
          params: {
            from: dateFrom ? dateFrom.format("YYYY-MM-DD") : "",
            to: dateTo ? dateTo.format("YYYY-MM-DD") : "",
          },
        })
        .then((res) => res.data);

      setMissingAptTransactions(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMissingAptTransactions();
  }, []);

  const onDateChange = (dates: any) => {
    setDateFrom(dates ? dates[0] : null);
    setDateTo(dates ? dates[1] : null);
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment("2021-12-31").endOf("day");
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 flex flex-col">
      <div className="mt-8 border-b mb-2 border-gray-400 lg:flex justify-between">
        <div className="flex items-center mb-2">
          <span className="font-bold mr-4">{t("transactions.Period")}:</span>

          <DatePicker.RangePicker
            ranges={{
              "This Month": [
                moment().startOf("month"),
                moment().endOf("month"),
              ],
            }}
            value={[dateFrom, dateTo]}
            onChange={onDateChange}
            disabledDate={user?.Role === "admin" ? () => {} : disabledDate}
          />

          <Button
            className="btn-default h-8 ml-2"
            onClick={() => fetchMissingAptTransactions()}
          >
            {t("Submit")}
          </Button>
        </div>

        <div className="flex font-bold text-base text-c-blue">
          <Link
            to={`/transactions/apartments`}
            className="border-b-4 px-3 border-transparent cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.Apartment Transactions.Apartment Transactions")}
          </Link>
          <Link
            to={`/transactions/parkings`}
            className="border-b-4 px-3 border-transparent cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.Parking Transactions.Parking Transactions")}
          </Link>
          <Link
            to={`/transactions/duplicate-parkings`}
            className="border-b-4 px-3 border-transparent cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.Duplicate Parkings.Duplicate Parkings")}
          </Link>
          <Link
            to={`/transactions/missing-apartments`}
            className="border-b-4 px-3 border-transparent cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.Apartment Transactions.Missing Apartments")}
          </Link>
          <Link
            to={`/transactions/missing-parkings`}
            className="border-b-4 px-3 border-transparent cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.Parking Transactions.Missing Parkings")}
          </Link>
          <Link
            to={`/transactions/missing-apttransactions`}
            className="border-b-4 border-c-blue cursor-pointer py-2 lg:py-0"
          >
            <div className="bg-c-light rounded-md px-3 py-1 -mt-1">
              {t("transactions.MissingAptTransactions")}
            </div>
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-auto">
        <Table
          rowKey="RowID"
          columns={columns}
          dataSource={missingAptTransactions}
          rowClassName="hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 100,
          }}
        />
      </div>
    </div>
  );
};

export default MissingAptTransactions;
