import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Button, DatePicker, Select, Table } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ColumnsType } from "antd/es/table";
import { loadApartments } from "../../store/apartmentsSlice";
import { loadParkings } from "../../store/parkingsSlice";
import {
  ApartmentTransaction,
  ApartmentOtherItems,
} from "../../@types/apartmenttransaction";
import { ParkingTransaction } from "../../@types/parkingtransaction";
import moment, { Moment } from "moment";
import axios from "axios";
import ReportsExportPDFFull from "./ReportsExportPDFFull";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const ReportTransactionsFull: React.FC = () => {
  const { ownerId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const [periodFrom, setPeriodFrom] = useState<Moment | null>(
    moment().subtract(1, "month").startOf("month")
  );
  const [periodTo, setPeriodTo] = useState<Moment | null>(
    moment().subtract(1, "month").endOf("month")
  );
  const [filterApartments, setFilterApartments] = useState([]);
  const [filterParkings, setFilterParkings] = useState([]);
  const [apartmentCalculations, setApartmentCalculations] = useState([]);
  const [apartmentOtherItems, setApartmentOtherItems] = useState<
    Array<ApartmentOtherItems>
  >([]);
  const [parkingCalculations, setParkingCalculations] = useState([]);
  const [isSubmitting, setIsSumitting] = useState(false);
  const [t] = useTranslation("common");

  const apartments = useSelector(
    (state: RootState) => state.apartments.apartments
  );
  const parkings = useSelector((state: RootState) => state.parkings.parkings);

  const curUser = useSelector((state: RootState) => state.common.curUser);
  const user = useSelector((state: RootState) => state.auth.user);

  const apartmentColumns: ColumnsType<ApartmentTransaction> = [
    {
      title: t("transactions.Apartment Transactions.table.Apartment name"),
      dataIndex: "RoomName",
      width: 130,
      defaultSortOrder: "ascend",
      sorter: (a, b) =>
        (a.RoomName as string) > (b.RoomName as string) ? 1 : -1,
    },
    {
      title: t("transactions.Apartment Transactions.table.Date From"),
      dataIndex: "DateFrom",
      defaultSortOrder: "descend",
      width: 140,
      sorter: (a, b) =>
        (a.DateFrom as string) > (b.DateFrom as string) ? 1 : -1,
      render: (DateFrom: string) => {
        return (
          <span>{DateFrom ? moment(DateFrom).format("YYYY-MM-DD") : ""}</span>
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Date To"),
      dataIndex: "DateTo",
      width: 140,
      sorter: (a, b) => ((a.DateTo as string) > (b.DateTo as string) ? 1 : -1),
      render: (DateTo: string) => {
        return <span>{DateTo ? moment(DateTo).format("YYYY-MM-DD") : ""}</span>;
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Nights"),
      dataIndex: "Nights",
      width: 100,
      sorter: (a, b) => (a.Nights > b.Nights ? 1 : -1),
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Accomodation Per Night"
      ),
      dataIndex: "PriceAccomodationPerNight",
      width: 100,
      sorter: (a, b) =>
        a.PriceAccomodationPerNight > b.PriceAccomodationPerNight ? 1 : -1,
      render: (PriceAccomodationPerNight) => {
        return <span>{Number(PriceAccomodationPerNight).toFixed(2)}</span>;
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus Src Commission Per Night"
      ),
      dataIndex: "PriceMinusSourceCommisionPerNight",
      width: 100,
      sorter: (a, b) =>
        a.PriceMinusSourceCommisionPerNight >
        b.PriceMinusSourceCommisionPerNight
          ? 1
          : -1,
      render: (PriceMinusSourceCommisionPerNight) => {
        return (
          <span>{Number(PriceMinusSourceCommisionPerNight).toFixed(2)}</span>
        );
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus Tax Per Night"
      ),
      dataIndex: "PriceMinusTaxPerNight",
      width: 100,
      sorter: (a, b) =>
        a.PriceMinusTaxPerNight > b.PriceMinusTaxPerNight ? 1 : -1,
      render: (PriceMinusTaxPerNight) => {
        return <span>{Number(PriceMinusTaxPerNight).toFixed(2)}</span>;
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.BreakfastQty"),
      dataIndex: "BreakfastQty",
      width: 100,
      sorter: (a, b) => (a.BreakfastQty > b.BreakfastQty ? 1 : -1),
      render: (BreakfastQty) => {
        return <span>{Number(BreakfastQty).toFixed(2)}</span>;
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.BreakFastUnitPrice"),
      dataIndex: "BreakFastUnitPrice",
      width: 100,
      sorter: (a, b) => (a.BreakFastUnitPrice > b.BreakFastUnitPrice ? 1 : -1),
      render: (BreakFastUnitPrice) => {
        return <span>{Number(BreakFastUnitPrice).toFixed(2)}</span>;
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.PriceMinusBreakfastPerNight"
      ),
      dataIndex: "PriceMinusBreakfastPerNight",
      width: 100,
      sorter: (a, b) =>
        a.PriceMinusBreakfastPerNight > b.PriceMinusBreakfastPerNight ? 1 : -1,
      render: (PriceMinusBreakfastPerNight) => {
        return <span>{Number(PriceMinusBreakfastPerNight).toFixed(2)}</span>;
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus Breakfast"
      ),
      dataIndex: "PriceMinusBreakfast",
      width: 100,
      sorter: (a, b) =>
        a.PriceMinusBreakfast > b.PriceMinusBreakfast ? 1 : -1,
      render: (PriceMinusBreakfast) => {
        return <span>{Number(PriceMinusBreakfast).toFixed(2)}</span>;
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus BH Commission"
      ),
      dataIndex: "PriceMinusBHCommision",
      width: 100,
      sorter: (a, b) =>
        a.PriceMinusBHCommision > b.PriceMinusBHCommision ? 1 : -1,
      render: (PriceMinusBHCommision) => {
        return <span>{Number(PriceMinusBHCommision).toFixed(2)}</span>;
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Booking Src"),
      dataIndex: "BookingSource",
      width: 140,
      sorter: (a, b) =>
        (a.BookingSource as string) > (b.BookingSource as string) ? 1 : -1,
    },
  ];

  const apartmentOtherItemsColumns: ColumnsType<ApartmentOtherItems> = [
    {
      title: t("transactions.Other items.Other items"),
      dataIndex: "ItemName",
      width: 150,
    },
    {
      title: t("transactions.Other items.Fee"),
      dataIndex: "Fee",
      width: 150,
      render: (Fee) => {
        return <span>{Number(Fee).toFixed(2)}</span>;
      },
    },
    {
      title: t("transactions.Other items.Count"),
      dataIndex: "Count",
      width: 150,
      render: (Count) => {
        return Number(Count) || 0;
      },
    },
    {
      title: t("transactions.Other items.Fee Minus BH Commission"),
      dataIndex: "FeeMinusBHCommission",
      width: 150,
      render: (FeeMinusBHCommission) => {
        return <span>{Number(FeeMinusBHCommission).toFixed(2)}</span>;
      },
    },
    {
      title: t("transactions.Other items.Total"),
      dataIndex: "Total",
      width: 150,
      render: (Total) => {
        return <span>{Number(Total).toFixed(2)}</span>;
      },
    },
  ];

  const parkingColumns: ColumnsType<ParkingTransaction> = [
    {
      title: t("transactions.Parking Transactions.table.Parking name"),
      dataIndex: "ParkingName",
      defaultSortOrder: "ascend",
      width: 160,
      sorter: (a, b) =>
        (a.ParkingName as string) > (b.ParkingName as string) ? 1 : -1,
    },
    {
      title: (
        <div>{t("transactions.Parking Transactions.table.Date From")}</div>
      ),
      defaultSortOrder: "descend",
      dataIndex: "DateFrom",
      width: 160,
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
      title: <div>{t("transactions.Parking Transactions.table.Date To")}</div>,
      dataIndex: "DateTo",
      width: 160,
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
      title: t("transactions.Parking Transactions.table.Nights"),
      dataIndex: "ParkingNights",
      width: 160,
      sorter: (a, b) => (a.ParkingNights > b.ParkingNights ? 1 : -1),
    },
    {
      title: (
        <div>
          {t("transactions.Parking Transactions.table.Price Minus Tax")}
        </div>
      ),
      dataIndex: "ParkingPriceMinusTax",
      width: 160,
      sorter: (a, b) =>
        a.ParkingPriceMinusTax > b.ParkingPriceMinusTax ? 1 : -1,
      render: (ParkingPriceMinusTax) => {
        return <span>{Number(ParkingPriceMinusTax).toFixed(2)}</span>;
      },
    },
    {
      title: (
        <div>
          {t(
            "transactions.Parking Transactions.table.Price Minus BH Commission"
          )}
        </div>
      ),
      dataIndex: "ParkingPriceMinusBHCommision",
      width: 160,
      sorter: (a, b) =>
        a.ParkingPriceMinusBHCommision > b.ParkingPriceMinusBHCommision
          ? 1
          : -1,
      render: (ParkingPriceMinusBHCommision) => {
        return <span>{Number(ParkingPriceMinusBHCommision).toFixed(2)}</span>;
      },
    },
  ];

  const fetchApartmentCalculations = async () => {
    try {
      const res = await axios
        .get("/apartment-transactions/reports/", {
          params: {
            from: periodFrom ? periodFrom.format("YYYY-MM-DD") : "",
            to: periodTo ? periodTo.format("YYYY-MM-DD") : "",
            apartments: filterApartments,
            ownerId,
          },
        })
        .then((res) => res.data);

      setApartmentCalculations(res.transactions);
      setApartmentOtherItems([
        {
          ItemName: t("Service"),
          Fee: res.otherItems.ServiceFee || 0,
          Count: res.otherItems.ServiceCount || 0,
          FeeMinusBHCommission: res.otherItems.ServiceFeeMinusBHCommision || 0,
          Total: res.otherItems.ServiceTotal || 0,
        },
        {
          ItemName: t("Cleaning"),
          Fee: res.otherItems.CleaningFee || 0,
          Count: res.otherItems.CleaningFeeCount || 0,
          FeeMinusBHCommission: res.otherItems.CleaningFeeMinusBHCommision || 0,
          Total: res.otherItems.CleaningTotal || 0,
        },
        {
          ItemName: t("Owner Cleaning"),
          Fee: res.otherItems.OwnerCleaningFee || 0,
          Count: res.otherItems.OwnerCleaningFeeCount || 0,
          FeeMinusBHCommission: 0,
          Total: res.otherItems.OwnerCleaningTotal || 0,
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchParkingCalculations = async () => {
    try {
      const res = await axios
        .get("/parking-transactions/reports", {
          params: {
            from: periodFrom ? periodFrom.format("YYYY-MM-DD") : "",
            to: periodTo ? periodTo.format("YYYY-MM-DD") : "",
            parkings: filterParkings,
            ownerId,
          },
        })
        .then((res) => res.data);

      setParkingCalculations(res);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(loadApartments({ search: "", ownerId }));
    dispatch(loadParkings({ search: "", ownerId }));

    fetchApartmentCalculations();
    fetchParkingCalculations();
  }, []);

  useEffect(() => {
    fetchApartmentCalculations();
  }, [filterApartments, t]);

  useEffect(() => {
    fetchParkingCalculations();
  }, [filterParkings]);

  const onPeriodChange = (dates: any) => {
    setPeriodFrom(dates ? dates[0] : null);
    setPeriodTo(dates ? dates[1] : null);
  };

  const ReportsExportPDFRender: React.FC = () => {
    return (
      <ReportsExportPDFFull
        dateFrom={periodFrom}
        dateTo={periodTo}
        apartmentCalculations={apartmentCalculations}
        apartmentOtherItems={apartmentOtherItems}
        parkingCalculations={parkingCalculations}
        curUser={curUser}
        t={t}
      />
    );
  };

  const sendEmail = async () => {
    const myPdf = pdf(<ReportsExportPDFRender />);
    const blob = await myPdf.toBlob(); /*create blob*/

    var file = new File([blob], "pdfname.pdf", {
      lastModified: new Date().getTime(),
    }); /*create file*/

    try {
      const formData = new FormData();
      formData.append("Attachment", file);
      formData.append("DateFrom", periodFrom as any);
      formData.append("DateTo", periodTo as any);
      formData.append(
        "FileName",
        `Transactions report (${curUser?.FirstName} ${curUser?.LastName}).pdf`
      );

      setIsSumitting(true);

      const res = await axios
        .post(`/apartment-transactions/reports/${curUser?.OwnerID}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => res.data);

      setIsSumitting(false);
      if (res?.success) {
        message.success(
          t("Email has been sent successfully. Please check your inbox.")
        );
      } else {
        message.error(
          t(
            "Wrong email or something went wrong on server. Please try again later."
          )
        );
      }
    } catch (err: any) {
      console.log(err.message);
      setIsSumitting(false);
      message.error(
        t(
          "Wrong email or something went wrong on server. Please try again later."
        )
      );
    }
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment("2021-12-31").endOf("day");
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 ">
      <div className="flex flex-col justify-between mb-10">
        <div className="mt-8 border-b-2 mb-2 border-gray-700 justify-between md:flex block">
          <div className="flex font-bold text-xl text-c-blue px-3">
            {t("transactions.Apartment Transactions.Apartment Transactions")}
          </div>

          <div className="flex font-bold text-xl text-c-blue md:mb-0 mb-2">
            <Link
              to={`/reports/${ownerId}/simple`}
              className="border-b-4 px-3 border-transparent cursor-pointer mr-6 py-2 lg:py-0"
            >
              {t("transactions.Apartment Transactions.Simple")}
            </Link>
            <Link
              to={`/reports/${ownerId}/full`}
              className="border-b-4 px-3 border-c-blue cursor-pointer py-2 lg:py-0"
            >
              {t("transactions.Apartment Transactions.Full")}
            </Link>
          </div>

          <div className="flex items-center mb-2">
            <span className="font-bold mr-4">{t("transactions.Period")}:</span>

            <DatePicker.RangePicker
              ranges={{
                "Last Month": [
                  moment().subtract(1, "month").startOf("month"),
                  moment().subtract(1, "month").endOf("month"),
                ],
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              disabledDate={
                user?.Role === "admin" || user?.Role === "super-admin"
                  ? () => {}
                  : disabledDate
              }
              value={[periodFrom, periodTo]}
              onChange={onPeriodChange}
            />

            <Select
              className="w-40 ml-3"
              mode="multiple"
              allowClear
              placeholder="All"
              onChange={(value) => setFilterApartments(value)}
              value={filterApartments}
            >
              {apartments.map((apartment: any) => (
                <Select.Option key={apartment.RowID} value={apartment.RoomName}>
                  {apartment.RoomName}
                </Select.Option>
              ))}
            </Select>

            <Button
              className="btn-default h-8 ml-2"
              onClick={() => {
                fetchApartmentCalculations();
                fetchParkingCalculations();
              }}
            >
              {t("Submit")}
            </Button>
          </div>
        </div>

        <div className="max-w-full overflow-auto">
          <Table
            rowKey="RowID"
            columns={apartmentColumns}
            dataSource={apartmentCalculations}
            rowClassName="hover:bg-white hover:bg-opacity-10"
            className="border flex-grow mb-5"
            pagination={false}
            scroll={{ y: 500 }}
            summary={() => {
              let summaryData = {
                Nights: 0,
                PriceAccomodationPerNight: 0,
                PriceMinusSourceCommisionPerNight: 0,
                PriceMinusTaxPerNight: 0,
                BreakfastQty: 0,
                BreakFastUnitPrice: 0,
                PriceMinusBreakfastPerNight: 0,
                PriceMinusBreakfast: 0,
                PriceMinusBHCommision: 0,
              };
              apartmentCalculations.forEach((row: ApartmentTransaction) => {
                summaryData.Nights += Number(row.Nights);
                summaryData.PriceAccomodationPerNight += Number(
                  row.PriceAccomodationPerNight
                );
                summaryData.PriceMinusSourceCommisionPerNight += Number(
                  row.PriceMinusSourceCommisionPerNight
                );
                summaryData.PriceMinusTaxPerNight += Number(
                  row.PriceMinusTaxPerNight
                );
                summaryData.BreakfastQty += Number(row.BreakfastQty);
                summaryData.BreakFastUnitPrice += Number(
                  row.BreakFastUnitPrice
                );
                summaryData.PriceMinusBreakfastPerNight += Number(
                  row.PriceMinusBreakfastPerNight
                );
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
                      {Number(summaryData.Nights)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.PriceAccomodationPerNight).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(
                        summaryData.PriceMinusSourceCommisionPerNight
                      ).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.PriceMinusTaxPerNight).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.BreakfastQty).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.BreakFastUnitPrice).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.PriceMinusBreakfastPerNight).toFixed(
                        2
                      )}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={2} className="font-bold">
                      {Number(summaryData.PriceMinusBreakfast).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell
                      index={3}
                      colSpan={2}
                      className="font-bold"
                    >
                      {Number(summaryData.PriceMinusBHCommision).toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </div>
        <div className="max-w-full overflow-auto">
          <Table
            rowKey="ItemName"
            columns={apartmentOtherItemsColumns}
            dataSource={apartmentOtherItems}
            rowClassName="hover:bg-white hover:bg-opacity-10"
            className="border flex-grow"
            pagination={false}
            summary={() => {
              let summaryData = {
                Fee: 0,
                Count: 0,
                FeeMinusBHCommission: 0,
                Total: 0,
              };
              apartmentOtherItems.forEach((row) => {
                summaryData.Fee += Number(row.Fee);
                summaryData.Count += Number(row.Count);
                summaryData.FeeMinusBHCommission += Number(
                  row.FeeMinusBHCommission || 0
                );
                summaryData.Total += Number(row.Total);
              });

              return (
                <Table.Summary fixed={"bottom"}>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} className="font-bold">
                      {t("transactions.Final Total")}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.Fee).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={1} className="font-bold">
                      {Number(summaryData.Count)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={2} className="font-bold">
                      {Number(summaryData.FeeMinusBHCommission).toFixed(2)}
                    </Table.Summary.Cell>

                    <Table.Summary.Cell index={3} className="font-bold">
                      {Number(summaryData.Total).toFixed(2)}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              );
            }}
          />
        </div>
      </div>

      <div className="flex flex-col justify-between">
        <div className="mt-8 border-b-2 mb-2 border-gray-700 flex justify-between">
          <div className="flex font-bold text-xl text-c-blue px-3">
            {t("transactions.Parking Transactions.Parking Transactions")}
          </div>

          <div className="flex items-center mb-2">
            <Select
              className="w-40 ml-3"
              mode="multiple"
              allowClear
              placeholder="All"
              onChange={(value) => setFilterParkings(value)}
              value={filterParkings}
            >
              {parkings.map((parking: any) => (
                <Select.Option key={parking.RowId} value={parking.ParkingName}>
                  {parking.ParkingName}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <Table
          rowKey="RowId"
          columns={parkingColumns}
          dataSource={parkingCalculations}
          rowClassName="hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={false}
          scroll={{ y: 500 }}
          summary={() => {
            let summaryData = {
              Nights: 0,
              ParkingPriceMinusTax: 0,
              ParkingPriceMinusBHCommision: 0,
            };
            parkingCalculations.forEach((row: ParkingTransaction) => {
              summaryData.Nights += Number(row.ParkingNights);
              summaryData.ParkingPriceMinusTax += Number(
                row.ParkingPriceMinusTax
              );
              summaryData.ParkingPriceMinusBHCommision += Number(
                row.ParkingPriceMinusBHCommision
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
                    {Number(summaryData.Nights)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={2} className="font-bold">
                    {Number(summaryData.ParkingPriceMinusTax).toFixed(2)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={3} className="font-bold">
                    {Number(summaryData.ParkingPriceMinusBHCommision).toFixed(
                      2
                    )}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />

        <div className="mt-2 mb-6 pt-4 border-t-2 border-gray-700">
          <div className="font-bold text-lg mb-8 flex">
            <div className="flex-grow">{t("Final Total Transactions")}: </div>
            <div style={{ width: "22%" }} className="flex-none">
              {(
                apartmentCalculations.reduce(
                  (pVal, cVal: ApartmentTransaction) =>
                    Number(pVal) + Number(cVal.PriceMinusBHCommision),
                  0
                ) -
                apartmentOtherItems.reduce(
                  (pVal, cVal: any) => Number(pVal) + Number(cVal.Total),
                  0
                ) +
                parkingCalculations.reduce(
                  (pVal, cVal: ParkingTransaction) =>
                    Number(pVal) + Number(cVal.ParkingPriceMinusBHCommision),
                  0
                )
              ).toFixed(2)}
            </div>
          </div>

          <div className="flex justify-end">
            {(user?.Role === "admin" || user?.Role === "super-admin") && (
              <Link
                to={`/reports/${curUser?.OwnerID}/full/cloned`}
                className="btn-default hvr-float-shadow h-10 w-40 ml-3 flex items-center justify-center"
              >
                {t("CHANGE REPORT")}
              </Link>
            )}

            <Button
              className="btn-default hvr-float-shadow h-10 w-40 ml-3"
              disabled={isSubmitting}
              onClick={sendEmail}
            >
              {isSubmitting && <FontAwesomeIcon icon={faSpinner} spin />}
              {!isSubmitting && t("SEND BY MAIL")}
            </Button>

            <PDFDownloadLink
              document={<ReportsExportPDFRender />}
              fileName={`Transactions report (${curUser?.FirstName} ${curUser?.LastName}).pdf`}
            >
              <Button className="btn-default hvr-float-shadow h-10 w-40 ml-3">
                {t("EXPORT PDF")}
              </Button>
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTransactionsFull;
