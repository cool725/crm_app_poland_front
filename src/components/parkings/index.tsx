import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Table, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { loadParkings } from "../../store/parkingsSlice";

import moment from "moment";
import CustomScrollbar from "../common/CustomScrollbar";

import { Parking } from "../../@types/parking";

import ExportExcel from './ExportExcel';

const columns: ColumnsType<Parking> = [
  {
    title: <div className="whitespace-nowrap">Parking name</div>,
    dataIndex: "ParkingName",
    sorter: (a, b) =>
      (a.ParkingName as string) > (b.ParkingName as string) ? 1 : -1,
    render: (ParkingName: string) => {
      return <span className="whitespace-nowrap">{ParkingName}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">BH Commission</div>,
    dataIndex: "BHCommision",
    sorter: (a, b) => (a.BHCommision > b.BHCommision ? 1 : -1),
    render: (BHCommision: string) => {
      return <span className="whitespace-nowrap">{Number(BHCommision)}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Source Commission</div>,
    dataIndex: "SourceCommision",
    sorter: (a, b) =>
      (a.SourceCommision as number) > (b.SourceCommision as number) ? 1 : -1,
    render: (SourceCommision: string) => {
      return (
        <span className="whitespace-nowrap">{Number(SourceCommision)}</span>
      );
    },
  },
  {
    title: <div className="whitespace-nowrap">Address</div>,
    dataIndex: "Address",
    sorter: (a, b) => ((a.Address as string) > (b.Address as string) ? 1 : -1),
    render: (Address: string) => {
      return <span className="whitespace-nowrap">{Address}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">City</div>,
    dataIndex: "City",
    sorter: (a, b) => ((a.City as string) > (b.City as string) ? 1 : -1),
    render: (City: string) => {
      return <span className="whitespace-nowrap">{City}</span>;
    },
  },
  {
    title: <div className="whitespace-nowrap">Agr-t start</div>,
    dataIndex: "AgreementStart",
    sorter: (a, b) =>
      (a.AgreementStart as string) > (b.AgreementStart as string) ? 1 : -1,
    render: (AgreementStart: string) => {
      return (
        <div className="whitespace-nowrap">
          {moment(AgreementStart).format("YYYY-MM-DD")}
        </div>
      );
    },
  },
  {
    title: <div className="whitespace-nowrap">Agr-t finish</div>,
    dataIndex: "AgreementFinish",
    sorter: (a, b) =>
      (a.AgreementFinish as string) > (b.AgreementFinish as string) ? 1 : -1,
    render: (AgreementFinish: string) => {
      return (
        <div className="whitespace-nowrap">
          {moment(AgreementFinish).format("YYYY-MM-DD")}
        </div>
      );
    },
  },
];

export default function Parkings() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const searchVal = useSelector((state: RootState) => state.common.searchVal);
  const parkings = useSelector((state: RootState) => state.parkings.parkings);

  useEffect(() => {
    dispatch(
      loadParkings({ search: searchVal, ownerId: Number(curUser?.OwnerID) })
    );
  }, []);

  return (
    <div className="container mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <CustomScrollbar>
        <Table
          rowKey="ParkingName"
          onRow={(parking) => {
            return {
              onDoubleClick: () => {
                navigate(
                  `/parkings/form/${parking.OwnerId}/${parking.ParkingName}`
                );
              },
            };
          }}
          columns={columns}
          dataSource={parkings}
          rowClassName="cursor-pointer hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={{
            hideOnSinglePage: true,
            total: parkings.length,
            pageSize: 10,
          }}
        />
      </CustomScrollbar>

      <div className="flex justify-end my-6">
        {curUser && (
          <Link to={`/parkings/form/${curUser.OwnerID}`}>
            <Button className="btn-yellow hvr-float-shadow h-10 w-40 ml-3">
              ADD PARKING
            </Button>
          </Link>
        )}
        
        <ExportExcel />
      </div>
    </div>
  );
}
