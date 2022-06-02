import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button, DatePicker, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { RootState } from "../../store";

import { ApartmentTransaction } from "../../@types/apartmenttransaction";
import moment, { Moment } from "moment";
import ApartmentTransactionsExportExcel from "./ApartmentTransactionsExportExcel";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ApartmentTransactions: React.FC = () => {
  const [dateFrom, setDateFrom] = useState<Moment | null>(
    moment().startOf("year")
  );
  const user = useSelector((state: RootState) => state.auth.user);
  const [dateTo, setDateTo] = useState<Moment | null>(moment());

  const [apartmentTransactions, setApartmentTransactions] = useState([]);
  const [t] = useTranslation("common");

  const columns: ColumnsType<ApartmentTransaction> = [
    {
      title: t("transactions.Apartment Transactions.table.ID"),
      dataIndex: "RowID",
      defaultSortOrder: "ascend",
      width: 70,
      sorter: (a, b) => ((a.RowID as string) > (b.RowID as string) ? 1 : -1),
    },
    {
      title: (
        <div>{t("transactions.Apartment Transactions.table.Date From")}</div>
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
        <div>{t("transactions.Apartment Transactions.table.Date To")}</div>
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
    {
      title: t("transactions.Apartment Transactions.table.Nights"),
      dataIndex: "Nights",
      sorter: (a, b) => (a.Nights > b.Nights ? 1 : -1),
    },
    {
      title: (
        <div>
          {t("transactions.Apartment Transactions.table.Price Accomodation")}
        </div>
      ),
      dataIndex: "PriceAccomodation",
      sorter: (a, b) => (a.PriceAccomodation > b.PriceAccomodation ? 1 : -1),
      render: (PriceAccomodation) => {
        return <span>{Number(PriceAccomodation).toFixed(2)}</span>;
      },
    },
    {
      title: (
        <div>{t("transactions.Apartment Transactions.table.Booking Src")}</div>
      ),
      dataIndex: "BookingSource",
      sorter: (a, b) =>
        (a.BookingSource as string) > (b.BookingSource as string) ? 1 : -1,
    },
    {
      title: (
        <div>
          {t(
            "transactions.Apartment Transactions.table.Price Minus Src Commission"
          )}
        </div>
      ),
      dataIndex: "PriceMinusSourceCommision",
      sorter: (a, b) =>
        a.PriceMinusSourceCommision > b.PriceMinusSourceCommision ? 1 : -1,
      render: (PriceMinusSourceCommision) => {
        return <span>{Number(PriceMinusSourceCommision).toFixed(2)}</span>;
      },
    },
    {
      title: (
        <div>
          {t("transactions.Apartment Transactions.table.Price Minus Tax")}
        </div>
      ),
      dataIndex: "PriceMinusTax",
      sorter: (a, b) => (a.PriceMinusTax > b.PriceMinusTax ? 1 : -1),
      render: (PriceMinusTax) => {
        return <span>{Number(PriceMinusTax).toFixed(2)}</span>;
      },
    },
    {
      title: (
        <div>
          {t("transactions.Apartment Transactions.table.Price Minus Breakfast")}
        </div>
      ),
      dataIndex: "PriceMinusBreakfast",
      sorter: (a, b) =>
        a.PriceMinusBreakfast > b.PriceMinusBreakfast ? 1 : -1,
      render: (PriceMinusBreakfast) => {
        return <span>{Number(PriceMinusBreakfast).toFixed(2)}</span>;
      },
    },
    {
      title: (
        <div>
          {t(
            "transactions.Apartment Transactions.table.Price Minus BH Commission"
          )}
        </div>
      ),
      dataIndex: "PriceMinusBHCommision",
      sorter: (a, b) =>
        a.PriceMinusBHCommision > b.PriceMinusBHCommision ? 1 : -1,
      render: (PriceMinusBHCommision) => {
        return <span>{Number(PriceMinusBHCommision).toFixed(2)}</span>;
      },
    },
  ];

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

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment("2021-12-31").endOf("day");
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 flex flex-col justify-between">
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
            disabledDate={user?.Role === "admin" || user?.Role === "super-admin" ? () => {} : disabledDate}
            value={[dateFrom, dateTo]}
            onChange={onDateChange}
          />

          <Button
            className="btn-default h-8 ml-2"
            onClick={() => fetchApartmentTransactions()}
          >
            {t("Submit")}
          </Button>
        </div>

        <div className="flex font-bold text-base text-c-blue">
          <Link
            to={`/transactions/apartments`}
            className="border-b-4 border-c-blue cursor-pointer py-2 lg:py-0"
          >
            <div className="bg-c-light rounded-md px-3 py-1 -mt-1">
              {t("transactions.Apartment Transactions.Apartment Transactions")}
            </div>
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
            className="border-b-4 px-3 border-transparent cursor-pointer py-2 lg:py-0"
          >
            {t("transactions.MissingAptTransactions")}
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-auto">
        <Table
          rowKey="RowID"
          columns={columns}
          dataSource={apartmentTransactions}
          rowClassName="hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 100,
          }}
          summary={() => {
            let summaryData = {
              Nights: 0,
              PriceAccomodation: 0,
              PriceMinusSourceCommision: 0,
              PriceMinusTax: 0,
              PriceMinusBreakfast: 0,
              PriceMinusBHCommision: 0,
            };
            apartmentTransactions.forEach((row: ApartmentTransaction) => {
              summaryData.Nights += Number(row.Nights);
              summaryData.PriceAccomodation += Number(row.PriceAccomodation);
              summaryData.PriceMinusSourceCommision += Number(
                row.PriceMinusSourceCommision
              );
              summaryData.PriceMinusTax += Number(row.PriceMinusTax);
              summaryData.PriceMinusBreakfast += Number(
                row.PriceMinusBreakfast
              );
              summaryData.PriceMinusBHCommision += Number(
                row.PriceMinusBHCommision
              );
            });

            return (
              <Table.Summary fixed={"bottom"}>
                <Table.Summary.Row>
                  <Table.Summary.Cell
                    index={0}
                    colSpan={3}
                    className="font-bold"
                  >
                    {t("transactions.Final Total")}
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
      </div>

      <div className="flex justify-between items-center my-6">
        <div className="font-bold text-lg">
          {t("transactions.Total amount the period")}:{" "}
          {apartmentTransactions
            .reduce(
              (pVal, cVal: ApartmentTransaction) =>
                Number(pVal) + Number(cVal.PriceMinusBHCommision),
              0
            )
            .toFixed(2)}
        </div>

        <ApartmentTransactionsExportExcel
          rows={apartmentTransactions}
          dateFrom={dateFrom}
          dateTo={dateTo}
        />
      </div>
    </div>
  );
};

export default ApartmentTransactions;
