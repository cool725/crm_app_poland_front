import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, DatePicker, Table } from "antd";
import { ColumnsType } from "antd/es/table";

import { DuplicateParking } from "../../@types/duplicateparking";
import moment, { Moment } from "moment";
import axios from "axios";
import { useTranslation } from "react-i18next";

const DuplicateParkings: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Moment | null>(
    moment().startOf("year")
  );
  const [dateTo, setDateTo] = useState<Moment | null>(moment());

  const [duplicateParkings, setDuplicateParkings] = useState([]);
  const [t] = useTranslation("common");

  const columns: ColumnsType<DuplicateParking> = [
    {
      title: t("transactions.Duplicate Parkings.table.FRowID"),
      dataIndex: "FRowID",
      defaultSortOrder: "ascend",
      width: 70,
      sorter: (a, b) => ((a.FRowID as string) > (b.FRowID as string) ? 1 : -1),
    },
    {
      title: t("transactions.Duplicate Parkings.table.FParkingID"),
      dataIndex: "FParkingID",
      width: 90,
      sorter: (a, b) =>
        (a.FParkingID as string) > (b.FParkingID as string) ? 1 : -1,
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("transactions.Duplicate Parkings.table.FParkingName")}
        </div>
      ),
      dataIndex: "FParkingName",
      sorter: (a, b) => (a.FParkingName > b.FParkingName ? 1 : -1),
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("transactions.Duplicate Parkings.table.FDateFrom")}
        </div>
      ),
      dataIndex: "FDateFrom",
      sorter: (a, b) =>
        (a.FDateFrom as string) > (b.FDateFrom as string) ? 1 : -1,
      render: (FDateFrom: string) => {
        return (
          <span className="whitespace-nowrap">
            {FDateFrom ? moment(FDateFrom).format("YYYY-MM-DD") : ""}
          </span>
        );
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("transactions.Duplicate Parkings.table.FDateTo")}
        </div>
      ),
      dataIndex: "FDateTo",
      sorter: (a, b) => ((a.FDateTo as string) > (b.FDateTo as string) ? 1 : -1),
      render: (FDateTo: string) => {
        return (
          <span className="whitespace-nowrap">
            {FDateTo ? moment(FDateTo).format("YYYY-MM-DD") : ""}
          </span>
        );
      },
    },
    {
      title: t("transactions.Duplicate Parkings.table.RowId"),
      dataIndex: "RowId",
      defaultSortOrder: "ascend",
      width: 70,
      sorter: (a, b) => ((a.RowId as string) > (b.RowId as string) ? 1 : -1),
    },
    {
      title: t("transactions.Duplicate Parkings.table.ParkingID"),
      dataIndex: "ParkingID",
      width: 90,
      sorter: (a, b) =>
        (a.ParkingID as string) > (b.ParkingID as string) ? 1 : -1,
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("transactions.Duplicate Parkings.table.ParkingName")}
        </div>
      ),
      dataIndex: "ParkingName",
      sorter: (a, b) => (a.ParkingName > b.ParkingName ? 1 : -1),
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("transactions.Duplicate Parkings.table.DateFrom")}
        </div>
      ),
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
      title: (
        <div className="whitespace-nowrap">
          {t("transactions.Duplicate Parkings.table.DateTo")}
        </div>
      ),
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
  ];

  const fetchDuplicateParkings = async () => {
    try {
      const res = await axios
        .get("/parking-transactions/duplicate", {
          params: {
            from: dateFrom ? dateFrom.format("YYYY-MM-DD") : "",
            to: dateTo ? dateTo.format("YYYY-MM-DD") : "",
          },
        })
        .then((res) => res.data);

      setDuplicateParkings(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDuplicateParkings();
  }, []);

  const onDateChange = (dates: any) => {
    setDateFrom(dates ? dates[0] : null);
    setDateTo(dates ? dates[1] : null);
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
          />

          <Button
            className="btn-default h-8 ml-2"
            onClick={() => fetchDuplicateParkings()}
          >
            {t("Submit")}
          </Button>
        </div>

        <div className="flex font-bold text-xl text-c-blue">
          <Link
            to={`/transactions/apartments`}
            className="border-b-4 px-3 border-transparent cursor-pointer mr-6 py-2 lg:py-0"
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
            className="border-b-4 px-3 border-c-blue cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.Duplicate Parkings.Duplicate Parkings")}
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-auto">
        <Table
          rowKey="RowID"
          columns={columns}
          dataSource={duplicateParkings}
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

export default DuplicateParkings;
