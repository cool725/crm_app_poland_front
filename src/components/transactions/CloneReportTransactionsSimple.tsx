import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import {
  Button,
  DatePicker,
  Select,
  Table,
  Modal,
  InputNumber,
  AutoComplete,
} from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
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
import ReportsExportPDFSimple from "./ReportsExportPDFSimple";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { message } from "antd";
import { useTranslation } from "react-i18next";

const CloneReportTransactionsSimple: React.FC = () => {
  const { ownerId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const [periodFrom, setPeriodFrom] = useState<Moment | null>(
    moment().startOf("year")
  );

  const [bookingSources, setBookingSources] = useState<Array<any>>([]);

  const [periodTo, setPeriodTo] = useState<Moment | null>(moment());
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

  const [selectedACsRowKeys, setSelectedACsRowKeys] = useState<Array<any>>([]);
  const [selectedPCsRowKeys, setSelectedPCsRowKeys] = useState<Array<any>>([]);
  const [selectedAOsRowKeys, setSelectedAOsRowKeys] = useState<Array<any>>([]);

  const fetchBookingSources = async () => {
    try {
      const res = await axios
        .get("/source-commisions/booking-sources")
        .then((res) => res.data);

      setBookingSources(
        res.map((row: any) => {
          return { value: row?.BookingSource };
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

  const apartmentColumns: ColumnsType<ApartmentTransaction> = [
    {
      title: t("transactions.Apartment Transactions.table.Apartment name"),
      dataIndex: "RoomName",
      width: 195,
      render: (
        RoomName: string,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <Select
            className="w-40 ml-3"
            value={RoomName}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["RoomName"] = value;
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          >
            {apartments.map((apartment: any) => (
              <Select.Option key={apartment.RowID} value={apartment.RoomName}>
                {apartment.RoomName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Date From"),
      dataIndex: "DateFrom",
      width: 150,
      render: (
        DateFrom: string,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <DatePicker
            value={moment(DateFrom)}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["DateFrom"] = moment(value).format("YYYY-MM-DD");
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Date To"),
      dataIndex: "DateTo",
      width: 150,
      render: (DateTo: string, record: ApartmentTransaction, index: number) => {
        return (
          <DatePicker
            value={moment(DateTo)}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["DateTo"] = moment(value).format("YYYY-MM-DD");
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Nights"),
      dataIndex: "Nights",
      width: 110,
      render: (Nights: number, record: ApartmentTransaction, index: number) => {
        return (
          <InputNumber
            value={Nights}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["Nights"] = value;
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Price Accomodation"),
      dataIndex: "PriceAccomodationPerNight",
      render: (
        PriceAccomodationPerNight: number,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={PriceAccomodationPerNight}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["PriceAccomodationPerNight"] = value;
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus Src Commission"
      ),
      dataIndex: "PriceMinusSourceCommisionPerNight",
      render: (
        PriceMinusSourceCommisionPerNight: number,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={PriceMinusSourceCommisionPerNight}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["PriceMinusSourceCommisionPerNight"] = value;
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Price Minus Tax"),
      dataIndex: "PriceMinusTaxPerNight",
      render: (
        PriceMinusTaxPerNight: number,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={PriceMinusTaxPerNight}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["PriceMinusTaxPerNight"] = value;
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus Breakfast"
      ),
      dataIndex: "PriceMinusBreakfast",
      render: (
        PriceMinusBreakfast: number,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={Number(PriceMinusBreakfast).toFixed(2)}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["PriceMinusBreakfast"] = Number(value);
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t(
        "transactions.Apartment Transactions.table.Price Minus BH Commission"
      ),
      dataIndex: "PriceMinusBHCommision",
      render: (
        PriceMinusBHCommision: number,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={Number(PriceMinusBHCommision).toFixed(2)}
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["PriceMinusBHCommision"] = Number(value);
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Apartment Transactions.table.Booking Src"),
      dataIndex: "BookingSource",
      render: (
        BookingSource: string,
        record: ApartmentTransaction,
        index: number
      ) => {
        return (
          <AutoComplete
            value={BookingSource}
            className="w-full"
            onChange={(value) => {
              let newACs = [...apartmentCalculations] as any;
              let newRecord = { ...record };
              newRecord["BookingSource"] = value;
              newACs[index] = newRecord;
              setApartmentCalculations(newACs);
            }}
            options={bookingSources}
            filterOption={(inputValue, option: any) =>
              option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !==
              -1
            }
          />
        );
      },
    },
  ];

  const apartmentOtherItemsColumns: ColumnsType<ApartmentOtherItems> = [
    {
      title: t("transactions.Other items.Other items"),
      dataIndex: "ItemName",
      width: "32%",
    },
    {
      title: t("transactions.Other items.Fee"),
      dataIndex: "Fee",
      width: "12%",
      render: (Fee: number, record: ApartmentOtherItems, index: number) => {
        return (
          <InputNumber
            value={Number(Fee).toFixed(2) || 0}
            onChange={(value) => {
              let newAOs = [...apartmentOtherItems] as any;
              let newRecord = { ...record };
              newRecord["Fee"] = Number(value);
              newAOs[index] = newRecord;
              setApartmentOtherItems(newAOs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Other items.Count"),
      dataIndex: "Count",
      width: "12%",
      render: (Count: number, record: ApartmentOtherItems, index: number) => {
        return (
          <InputNumber
            value={Number(Count).toFixed(2) || 0}
            onChange={(value) => {
              let newAOs = [...apartmentOtherItems] as any;
              let newRecord = { ...record };
              newRecord["Count"] = Number(value);
              newAOs[index] = newRecord;
              setApartmentOtherItems(newAOs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Other items.Fee Minus BH Commission"),
      dataIndex: "FeeMinusBHCommission",
      width: "22%",
      render: (
        FeeMinusBHCommission: number,
        record: ApartmentOtherItems,
        index: number
      ) => {
        return (
          <InputNumber
            value={Number(FeeMinusBHCommission).toFixed(2) || 0}
            onChange={(value) => {
              let newAOs = [...apartmentOtherItems] as any;
              let newRecord = { ...record };
              newRecord["FeeMinusBHCommission"] = Number(value);
              newAOs[index] = newRecord;
              setApartmentOtherItems(newAOs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Other items.Total"),
      dataIndex: "Total",
      width: "22%",
      render: (Total: number, record: ApartmentOtherItems, index: number) => {
        return (
          <InputNumber
            value={Number(Total).toFixed(2) || 0}
            onChange={(value) => {
              let newAOs = [...apartmentOtherItems] as any;
              let newRecord = { ...record };
              newRecord["Total"] = Number(value);
              newAOs[index] = newRecord;
              setApartmentOtherItems(newAOs);
            }}
          />
        );
      },
    },
  ];

  const parkingColumns: ColumnsType<ParkingTransaction> = [
    {
      title: t("transactions.Parking Transactions.table.Parking name"),
      dataIndex: "ParkingName",
      width: "20%",
      render: (
        ParkingName: string,
        record: ParkingTransaction,
        index: number
      ) => {
        return (
          <Select
            className="w-40 ml-3"
            value={ParkingName}
            onChange={(value) => {
              let newPCs = [...parkingCalculations] as any;
              let newRecord = { ...record };
              newRecord["ParkingName"] = value;
              newPCs[index] = newRecord;
              setParkingCalculations(newPCs);
            }}
          >
            {parkings.map((parking: any) => (
              <Select.Option key={parking.RowId} value={parking.ParkingName}>
                {parking.ParkingName}
              </Select.Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: (
        <div>{t("transactions.Parking Transactions.table.Date From")}</div>
      ),
      dataIndex: "DateFrom",
      width: "12%",
      render: (DateFrom: string, record: ParkingTransaction, index: number) => {
        return (
          <DatePicker
            value={moment(DateFrom)}
            onChange={(value) => {
              let newPCs = [...parkingCalculations] as any;
              let newRecord = { ...record };
              newRecord["DateFrom"] = moment(value).format("YYYY-MM-DD");
              newPCs[index] = newRecord;
              setParkingCalculations(newPCs);
            }}
          />
        );
      },
    },
    {
      title: <div>{t("transactions.Parking Transactions.table.Date To")}</div>,
      dataIndex: "DateTo",
      width: "12%",
      render: (DateTo: string, record: ParkingTransaction, index: number) => {
        return (
          <DatePicker
            value={moment(DateTo)}
            onChange={(value) => {
              let newPCs = [...parkingCalculations] as any;
              let newRecord = { ...record };
              newRecord["DateTo"] = moment(value).format("YYYY-MM-DD");
              newPCs[index] = newRecord;
              setParkingCalculations(newPCs);
            }}
          />
        );
      },
    },
    {
      title: t("transactions.Parking Transactions.table.Nights"),
      dataIndex: "ParkingNights",
      width: "12%",
      render: (
        ParkingNights: number,
        record: ParkingTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={ParkingNights}
            onChange={(value) => {
              let newPCs = [...parkingCalculations] as any;
              let newRecord = { ...record };
              newRecord["ParkingNights"] = value;
              newPCs[index] = newRecord;
              setParkingCalculations(newPCs);
            }}
          />
        );
      },
    },
    {
      title: (
        <div>
          {t("transactions.Parking Transactions.table.Price Minus Tax")}
        </div>
      ),
      dataIndex: "ParkingPriceMinusTax",
      width: "22%",
      render: (
        ParkingPriceMinusTax: number,
        record: ParkingTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={Number(ParkingPriceMinusTax).toFixed(2)}
            onChange={(value) => {
              let newPCs = [...parkingCalculations] as any;
              let newRecord = { ...record };
              newRecord["ParkingPriceMinusTax"] = Number(value);
              newPCs[index] = newRecord;
              setParkingCalculations(newPCs);
            }}
          />
        );
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
      width: "22%",
      render: (
        ParkingPriceMinusBHCommision: number,
        record: ParkingTransaction,
        index: number
      ) => {
        return (
          <InputNumber
            value={Number(ParkingPriceMinusBHCommision).toFixed(2)}
            onChange={(value) => {
              let newPCs = [...parkingCalculations] as any;
              let newRecord = { ...record };
              newRecord["ParkingPriceMinusBHCommision"] = Number(value);
              newPCs[index] = newRecord;
              setParkingCalculations(newPCs);
            }}
          />
        );
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
    setSelectedACsRowKeys([]);

    dispatch(loadApartments({ search: "", ownerId }));
    dispatch(loadParkings({ search: "", ownerId }));

    fetchApartmentCalculations();
    fetchParkingCalculations();
    fetchBookingSources();
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
      <ReportsExportPDFSimple
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

  const confirmDelete = () => {
    Modal.confirm({
      title: (
        <div className="text-white text-center">
          {t("Do you want to delete")} ?
        </div>
      ),
      okText: t("YES"),
      icon: null,
      cancelText: t("NO"),
      width: 340,
      okButtonProps: {
        className: "btn-yellow hvr-float-shadow w-32 h-10 text-xs ml-3.5",
      },
      cancelButtonProps: {
        className: "btn-danger hvr-float-shadow w-32 h-10 text-xs",
      },
      onOk: async () => {
        const apartmentIds = selectedACsRowKeys
          .map((key) => key.split("_")[0])
          .filter((id) => Boolean(id));

        const parkingIds = selectedPCsRowKeys
          .map((key) => key.split("_")[0])
          .filter((id) => Boolean(id));

        const otherItemsIds = selectedAOsRowKeys
          .map((key) => key.split("_")[0])
          .filter((ItemName) => Boolean(ItemName));

        if (apartmentIds.length > 0) {
          const newApartmentCalculations = apartmentCalculations.filter(
            (row: any, index) =>
              selectedACsRowKeys.indexOf(`${row.RowID}_${index}`) === -1
          );
          setApartmentCalculations(newApartmentCalculations);
        }

        if (parkingIds.length > 0) {
          const newParkingCalculations = parkingCalculations.filter(
            (row: any, index) =>
              selectedPCsRowKeys.indexOf(`${row.RowID}_${index}`) === -1
          );
          setParkingCalculations(newParkingCalculations);
        }

        if (otherItemsIds.length > 0) {
          const newApartmentOtherItems = apartmentOtherItems.filter(
            (row: any, index) =>
              selectedAOsRowKeys.indexOf(`${row.ItemName}_${index}`) === -1
          );
          setApartmentOtherItems(newApartmentOtherItems);
        }

        setSelectedACsRowKeys([]);
        setSelectedPCsRowKeys([]);
        setSelectedAOsRowKeys([]);
      },
      onCancel() {},
    });
  };

  const deleteApartmentTransactions = () => {
    if (
      selectedACsRowKeys.length === 0 &&
      selectedPCsRowKeys.length === 0 &&
      selectedAOsRowKeys.length === 0
    ) {
      message.warning(t("Select rows first."));
      return;
    }

    confirmDelete();
  };

  const addParkingTransaction = () => {
    if (parkings.length === 0) {
      message.warning("There are no parkings. Please add parking first.");
      return;
    }
    const emptyParkingTransaction = {
      RowID: (
        String(new Date().getTime()) + String(Math.round(Math.random() * 10000))
      ).slice(-10),
      ParkingName: (parkings[0] as any).ParkingName,
      DateFrom: moment(new Date()).format("YYYY-MM-DD"),
      DateTo: moment(new Date()).format("YYYY-MM-DD"),
      ParkingNights: 0,
      ParkingPriceMinusTax: 0,
      ParkingPriceMinusBHCommision: 0,
    };

    setParkingCalculations([
      ...parkingCalculations,
      emptyParkingTransaction,
    ] as any);
  };

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment("2021-12-31").endOf("day");
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 ">
      <div className="flex flex-col justify-between mb-10">
        <h2 className="text-xl font-bold leading-7 text-gray-900 sm:text-2xl sm:truncate">
          CHANGE REPORT PAGE is clone of transactions
        </h2>
        <div className="mt-5 border-b-2 mb-2 border-gray-700 flex justify-between">
          <div className="flex font-bold text-xl text-c-blue px-3">
            {t("transactions.Apartment Transactions.Apartment Transactions")}
          </div>
          <div className="flex items-center mb-2">
            <span className="font-bold mr-4">{t("transactions.Period")}:</span>

            <DatePicker.RangePicker
              ranges={{
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              disabledDate={user?.Role === "admin" ? () => {} : disabledDate}
              value={[periodFrom, periodTo]}
              onChange={onPeriodChange}
            />

            <Select
              mode="multiple"
              allowClear
              className="w-40 ml-3"
              onChange={(value) => setFilterApartments(value)}
              value={filterApartments}
            >
              <Select.Option value="">All</Select.Option>
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
            rowKey={(record, index) => {
              return `${record.RowID}_${index}`;
            }}
            rowSelection={{
              selectedRowKeys: selectedACsRowKeys,
              onChange: (values) => {
                setSelectedACsRowKeys(values);
              },
            }}
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
                      colSpan={4}
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

        <Table
          rowKey={(record, index) => {
            return `${record.ItemName}_${index}`;
          }}
          rowSelection={{
            selectedRowKeys: selectedAOsRowKeys,
            onChange: (values) => {
              setSelectedAOsRowKeys(values);
            },
          }}
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
                  <Table.Summary.Cell
                    index={0}
                    colSpan={2}
                    className="font-bold"
                  >
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

      <div className="flex flex-col justify-between">
        <div className="mt-8 border-b-2 mb-2 border-gray-700 flex justify-between">
          <div className="flex font-bold text-xl text-c-blue px-3">
            {t("transactions.Parking Transactions.Parking Transactions")}
          </div>

          <div className="flex items-center mb-2">
            <Select
              mode="multiple"
              allowClear
              className="w-40 ml-3"
              onChange={(value) => setFilterParkings(value)}
              value={filterParkings}
            >
              <Select.Option value="">All</Select.Option>
              {parkings.map((parking: any) => (
                <Select.Option key={parking.RowID} value={parking.ParkingName}>
                  {parking.ParkingName}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <Table
          rowKey={(record, index) => {
            return `${record.RowID}_${index}`;
          }}
          rowSelection={{
            selectedRowKeys: selectedPCsRowKeys,
            onChange: (values) => {
              setSelectedPCsRowKeys(values);
            },
          }}
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
                  <Table.Summary.Cell index={0}>
                    <FontAwesomeIcon
                      icon={faPlusCircle}
                      className="cursor-pointer"
                      onClick={addParkingTransaction}
                    />
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={1}
                    colSpan={3}
                    className="font-bold"
                  >
                    {t("transactions.Final Total")}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={2} className="font-bold">
                    {Number(summaryData.Nights)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={3} className="font-bold">
                    {Number(summaryData.ParkingPriceMinusTax).toFixed(2)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={4} className="font-bold">
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
            <Link
              to={`/reports/${curUser?.OwnerID}/simple`}
              className="btn-default hvr-float-shadow h-10 w-32 flex items-center justify-center"
            >
              {t("BACK")}
            </Link>

            <Button
              key="delete"
              className="btn-default hvr-float-shadow h-10 w-40 ml-auto"
              onClick={deleteApartmentTransactions}
            >
              {t("DELETE SELECTED")}
            </Button>

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

export default CloneReportTransactionsSimple;
