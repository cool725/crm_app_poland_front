import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Button, DatePicker, Select, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { loadApartments } from "../../store/apartmentsSlice";
import { loadParkings } from "../../store/parkingsSlice";
import { selectOwner } from "../../store/commonSlice";
import {
  ApartmentTransaction,
  ApartmentOtherItems,
} from "../../@types/apartmenttransaction";
import { ParkingTransaction } from "../../@types/parkingtransaction";
import moment, { Moment } from "moment";
import axios from "axios";

const apartmentColumns: ColumnsType<ApartmentTransaction> = [
  {
    title: "Apartment name",
    dataIndex: "RoomName",
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
    title: <div className="whitespace-nowrap">Price minus breakfast</div>,
    dataIndex: "PriceMinusBreakfast",
    sorter: (a, b) => (a.PriceMinusBreakfast > b.PriceMinusBreakfast ? 1 : -1),
    render: (PriceMinusBreakfast) => {
      return <span>{Number(PriceMinusBreakfast).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Price minus BH commission</div>,
    dataIndex: "PriceMinusBHCommision",
    sorter: (a, b) =>
      a.PriceMinusBHCommision > b.PriceMinusBHCommision ? 1 : -1,
    render: (PriceMinusBHCommision) => {
      return <span>{Number(PriceMinusBHCommision).toFixed(2)}</span>;
    },
  },
];

const apartmentOtherItemsColumns: ColumnsType<ApartmentOtherItems> = [
  {
    title: "Other items",
    dataIndex: "ItemName",
  },
  {
    title: "Fee",
    dataIndex: "Fee",
    render: (Fee) => {
      return <span>{Number(Fee).toFixed(2)}</span>;
    },
  },
  {
    title: "Count",
    dataIndex: "Count",
  },
  {
    title: "FeeMinusBHCommission",
    dataIndex: "FeeMinusBHCommission",
    render: (FeeMinusBHCommission) => {
      return <span>{Number(FeeMinusBHCommission).toFixed(2)}</span>;
    },
  },
  {
    title: "Total",
    dataIndex: "Total",
    render: (Total) => {
      return <span>{Number(Total).toFixed(2)}</span>;
    },
  },
];

const parkingColumns: ColumnsType<ParkingTransaction> = [
  {
    title: "Parking name",
    dataIndex: "ParkingName",
    sorter: (a, b) =>
      (a.ParkingName as string) > (b.ParkingName as string) ? 1 : -1,
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
    title: "Nights",
    dataIndex: "ParkingNights",
    sorter: (a, b) => (a.ParkingNights > b.ParkingNights ? 1 : -1),
  },
  {
    title: <div className="whitespace-nowrap">Price minus tax</div>,
    dataIndex: "ParkingPriceMinusTax",
    sorter: (a, b) =>
      a.ParkingPriceMinusTax > b.ParkingPriceMinusTax ? 1 : -1,
    render: (ParkingPriceMinusTax) => {
      return <span>{Number(ParkingPriceMinusTax).toFixed(2)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Price minus BH Commission</div>,
    dataIndex: "ParkingPriceMinusBHCommision",
    sorter: (a, b) =>
      a.ParkingPriceMinusBHCommision > b.ParkingPriceMinusBHCommision ? 1 : -1,
    render: (ParkingPriceMinusBHCommision) => {
      return <span>{Number(ParkingPriceMinusBHCommision).toFixed(2)}</span>;
    },
  },
];

const ReportTransactions: React.FC = () => {
  const { ownerId } = useParams();

  const dispatch = useDispatch<AppDispatch>();
  const [apartmentDateFrom, setApartmentDateFrom] = useState<Moment | null>(
    null
  );
  const [apartmentDateTo, setApartmentDateTo] = useState<Moment | null>(null);
  const [parkingDateFrom, setParkingDateFrom] = useState<Moment | null>(null);
  const [parkingDateTo, setParkingDateTo] = useState<Moment | null>(null);
  const [apartment, setApartment] = useState("");
  const [parking, setParking] = useState("");
  const [apartmentCalculations, setApartmentCalculations] = useState([]);
  const [apartmentOtherItems, setApartmentOtherItems] = useState<
    Array<ApartmentOtherItems>
  >([]);
  const [parkingCalculations, setParkingCalculations] = useState([]);

  const apartments = useSelector(
    (state: RootState) => state.apartments.apartments
  );
  const parkings = useSelector((state: RootState) => state.parkings.parkings);

  const fetchApartmentCalculations = async () => {
    try {
      const res = await axios
        .get("/apartment-transactions/reports/", {
          params: {
            from: apartmentDateFrom
              ? apartmentDateFrom.format("YYYY-MM-DD")
              : "",
            to: apartmentDateTo ? apartmentDateTo.format("YYYY-MM-DD") : "",
            apartment,
            ownerId,
          },
        })
        .then((res) => res.data);

      setApartmentCalculations(res.transactions);
      setApartmentOtherItems([
        {
          ItemName: "Service",
          Fee: res.otherItems.ServiceFee,
          Count: res.otherItems.ServiceCount,
          FeeMinusBHCommission: res.otherItems.ServiceFeeMinusBHCommision,
          Total: res.otherItems.ServiceTotal,
        },
        {
          ItemName: "Cleaning",
          Fee: res.otherItems.CleaningFee,
          Count: res.otherItems.CleaningFeeCount,
          FeeMinusBHCommission: res.otherItems.CleaningFeeMinusBHCommision,
          Total: res.otherItems.CleaningTotal,
        },
        {
          ItemName: "Owner Cleaning",
          Fee: res.otherItems.OwnerCleaningFee,
          Count: res.otherItems.OwnerCleaningFeeCount,
          FeeMinusBHCommission: res.otherItems.OwnerCleaningFeeMinusBHCommision,
          Total: res.otherItems.OwnerCleaningTotal,
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
            from: parkingDateFrom ? parkingDateFrom.format("YYYY-MM-DD") : "",
            to: parkingDateTo ? parkingDateTo.format("YYYY-MM-DD") : "",
            parking,
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

    const fetchOwnerProfile = async () => {
      const res = await axios
        .get(`/users/profile/${ownerId}`)
        .then((res) => res.data);

      dispatch(selectOwner(res));
    };

    if (ownerId) fetchOwnerProfile();

    fetchApartmentCalculations();
    fetchParkingCalculations();
  }, []);

  useEffect(() => {
    fetchApartmentCalculations();
  }, [apartment]);

  useEffect(() => {
    fetchParkingCalculations();
  }, [parking]);

  const onApartmentDateChange = (dates: any) => {
    setApartmentDateFrom(dates ? dates[0] : null);
    setApartmentDateTo(dates ? dates[1] : null);
  };

  const onParkingChange = (dates: any) => {
    setParkingDateFrom(dates ? dates[0] : null);
    setParkingDateTo(dates ? dates[1] : null);
  };

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 ">
      <div className="flex flex-col justify-between mb-10">
        <div className="mt-8 border-b-2 mb-2 border-gray-700 flex justify-between">
          <div className="flex font-bold text-xl text-c-blue px-3">
            Apartment Transactions
          </div>
          <div className="flex items-center mb-2">
            <span className="font-bold mr-4">Period</span>

            <DatePicker.RangePicker
              ranges={{
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              value={[apartmentDateFrom, apartmentDateTo]}
              onChange={onApartmentDateChange}
            />

            <Select
              className="w-40 ml-3"
              onChange={(value) => setApartment(value)}
              value={apartment}
            >
              <Select.Option value="" disabled>
                Select apartment
              </Select.Option>
              {apartments.map((apartment: any) => (
                <Select.Option key={apartment.RowID} value={apartment.RoomName}>
                  {apartment.RoomName}
                </Select.Option>
              ))}
            </Select>

            <Button
              className="btn-default h-8 ml-2"
              onClick={() => fetchApartmentCalculations()}
            >
              Submit
            </Button>
          </div>
        </div>

        <Table
          rowKey="RowID"
          columns={apartmentColumns}
          dataSource={apartmentCalculations}
          rowClassName="hover:bg-white hover:bg-opacity-10"
          className="border flex-grow mb-5"
          pagination={false}
          scroll={{ y: 500 }}
          summary={(pageData) => {
            let summaryData = {
              Nights: 0,
              PriceMinusBreakfast: 0,
              PriceMinusBHCommision: 0,
            };
            pageData.forEach((row) => {
              summaryData.Nights += Number(row.Nights);
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
                    Final Total
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={1} className="font-bold">
                    {Number(summaryData.Nights)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={2} className="font-bold">
                    {Number(summaryData.PriceMinusBreakfast).toFixed(2)}
                  </Table.Summary.Cell>

                  <Table.Summary.Cell index={3} className="font-bold">
                    {Number(summaryData.PriceMinusBHCommision).toFixed(2)}
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />

        <Table
          rowKey="ItemName"
          columns={apartmentOtherItemsColumns}
          dataSource={apartmentOtherItems}
          rowClassName="hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={false}
          summary={(pageData) => {
            let summaryData = {
              Fee: 0,
              Count: 0,
              FeeMinusBHCommission: 0,
              Total: 0,
            };
            pageData.forEach((row) => {
              summaryData.Fee += Number(row.Fee);
              summaryData.Count += Number(row.Count);
              summaryData.FeeMinusBHCommission += Number(
                row.FeeMinusBHCommission
              );
              summaryData.Total += Number(row.Total);
            });

            return (
              <Table.Summary fixed={"bottom"}>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} className="font-bold">
                    Final Total
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
            Parking Transactions
          </div>

          <div className="flex items-center mb-2">
            <span className="font-bold mr-4">Period</span>

            <DatePicker.RangePicker
              ranges={{
                "This Month": [
                  moment().startOf("month"),
                  moment().endOf("month"),
                ],
              }}
              value={[parkingDateFrom, parkingDateTo]}
              onChange={onParkingChange}
            />

            <Select
              className="w-40 ml-3"
              onChange={(value) => setParking(value)}
              value={parking}
            >
              <Select.Option value="" disabled>
                Select parking
              </Select.Option>
              {parkings.map((parking: any) => (
                <Select.Option key={parking.RowId} value={parking.ParkingName}>
                  {parking.ParkingName}
                </Select.Option>
              ))}
            </Select>

            <Button
              className="btn-default h-8 ml-2"
              onClick={() => fetchParkingCalculations()}
            >
              Submit
            </Button>
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
          summary={(pageData) => {
            let summaryData = {
              Nights: 0,
              ParkingPriceMinusTax: 0,
              ParkingPriceMinusBHCommision: 0,
            };
            pageData.forEach((row) => {
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
                    Final Total
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

        <div className="flex justify-end my-6">
          <Button className="btn-default hvr-float-shadow h-10 w-40 ml-3">
            EXPORT PDF
          </Button>

          <Button className="btn-default hvr-float-shadow h-10 w-40 ml-3">
            EXPORT XLS
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportTransactions;
