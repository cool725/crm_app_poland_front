import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Table, Button, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { loadApartments } from "../../store/apartmentsSlice";

import moment from "moment";
import CustomScrollbar from "../common/CustomScrollbar";
import { Apartment } from "../../@types/apartment";
import SourceCommissionModal from "./SourceCommissionModal";
import ExportExcel from "./ExportExcel";

const Apartments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const searchVal = useSelector((state: RootState) => state.common.searchVal);
  const [sourceCommissionEditingRoomName, setSourceCommissionEditingRoomName] =
    useState<string | null>(null);

  const apartments = useSelector(
    (state: RootState) => state.apartments.apartments
  );

  const columns: ColumnsType<Apartment> = [
    {
      title: <div className="whitespace-nowrap">Room name</div>,
      dataIndex: "RoomName",
      sorter: (a, b) =>
        (a.RoomName as string) > (b.RoomName as string) ? 1 : -1,
      render: (RoomName: string) => {
        return <span className="whitespace-nowrap">{RoomName}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Type</div>,
      dataIndex: "Type",
      sorter: (a, b) => ((a.Type as string) > (b.Type as string) ? 1 : -1),
      render: (Type: string) => {
        return <span className="whitespace-nowrap">{Type}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Period</div>,
      dataIndex: "Period",
      sorter: (a, b) => (a.Period > b.Period ? 1 : -1),
      render: (Period: string) => {
        return <span className="whitespace-nowrap">{Period}</span>;
      },
    },
    {
      title: <div>Cleaning Fee</div>,
      dataIndex: "CleaningFee",
      sorter: (a, b) => (a.CleaningFee > b.CleaningFee ? 1 : -1),
      render: (CleaningFee: string) => {
        return <span className="whitespace-nowrap">{Number(CleaningFee)}</span>;
      },
    },
    {
      title: <div>Owner cleaning Fee</div>,
      dataIndex: "OwnerCleaningFee",
      sorter: (a, b) => (a.OwnerCleaningFee > b.OwnerCleaningFee ? 1 : -1),
      render: (OwnerCleaningFee: string) => {
        return (
          <span className="whitespace-nowrap">{Number(OwnerCleaningFee)}</span>
        );
      },
    },
    {
      title: <div>BH Commission</div>,
      dataIndex: "BHCommission",
      sorter: (a, b) => (a.BHCommission > b.BHCommission ? 1 : -1),
      render: (BHCommission: string) => {
        return (
          <span className="whitespace-nowrap">{Number(BHCommission)}</span>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">ServiceFee</div>,
      dataIndex: "ServiceFee",
      sorter: (a, b) => (a.ServiceFee > b.ServiceFee ? 1 : -1),
      render: (ServiceFee: string) => {
        return <span className="whitespace-nowrap">{Number(ServiceFee)}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Source Commission</div>,
      dataIndex: "SourceCommission",
      sorter: (a, b) =>
        (a.SourceCommission as string) > (b.SourceCommission as string)
          ? 1
          : -1,
      render: (SourceCommission: string, row: Apartment) => {
        return (
          <Tooltip placement="top" title={SourceCommission}>
            <span
              className="whitespace-nowrap truncate block"
              style={{ color: "#4161B4", maxWidth: 150 }}
              onClick={(e) => {
                e.stopPropagation();
                setSourceCommissionEditingRoomName(row.RoomName);
              }}
            >
              {SourceCommission}
            </span>
          </Tooltip>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Address</div>,
      dataIndex: "Address",
      sorter: (a, b) =>
        (a.Address as string) > (b.Address as string) ? 1 : -1,
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
      title: <div>Agr-t number</div>,
      dataIndex: "AgreementNumber",
      sorter: (a, b) =>
        (a.AgreementNumber as string) > (b.AgreementNumber as string) ? 1 : -1,
      render: (AgreementNumber: string) => {
        return <span className="whitespace-nowrap">{AgreementNumber}</span>;
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
    {
      title: <div className="whitespace-nowrap">Business segment</div>,
      dataIndex: "BusinessSegment",
      sorter: (a, b) =>
        (a.BusinessSegment as string) > (b.BusinessSegment as string) ? 1 : -1,
      render: (BusinessSegment: string) => {
        return <span className="whitespace-nowrap">{BusinessSegment}</span>;
      },
    },
  ];

  useEffect(() => {
    dispatch(
      loadApartments({ search: searchVal, ownerId: Number(curUser?.OwnerID) })
    );
  }, []);

  return (
    <div className="container-3xl mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <CustomScrollbar>
        <Table
          rowKey="RoomName"
          onRow={(apartment) => {
            return {
              onDoubleClick: () => {
                navigate(
                  `/apartments/form/${apartment.OwnerID}/${apartment.RoomName}`
                );
              },
            };
          }}
          columns={columns}
          dataSource={apartments}
          rowClassName="cursor-pointer hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={{
            hideOnSinglePage: true,
            total: apartments.length,
            pageSize: 10,
          }}
        />
      </CustomScrollbar>

      <div className="flex justify-end my-6">
        {curUser && (
          <Link to={`/apartments/form/${curUser.OwnerID}`}>
            <Button className="btn-yellow hvr-float-shadow h-10 w-40 ml-3">
              ADD APARTMENT
            </Button>
          </Link>
        )}

        <ExportExcel />
      </div>

      <SourceCommissionModal
        RoomName={sourceCommissionEditingRoomName}
        visible={Boolean(sourceCommissionEditingRoomName)}
        onCancel={() => setSourceCommissionEditingRoomName(null)}
      />
    </div>
  );
};

export default Apartments;
