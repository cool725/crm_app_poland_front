import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Table, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { loadParkings } from "../../store/parkingsSlice";
import { useTranslation } from "react-i18next";

import moment from "moment";

import { Parking } from "../../@types/parking";

import ExportExcel from "./ExportExcel";

export default function Parkings() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const parkings = useSelector((state: RootState) => state.parkings.parkings);
  const user = useSelector((state: RootState) => state.auth.user);
  const [t] = useTranslation("common");

  const columns: ColumnsType<Parking> = [
    {
      title: (
        <div className="whitespace-nowrap">
          {t("parkings.table.Parking name")}
        </div>
      ),
      dataIndex: "ParkingName",
      sorter: (a, b) =>
        (a.ParkingName as string) > (b.ParkingName as string) ? 1 : -1,
      render: (ParkingName: string) => {
        return <span className="whitespace-nowrap">{ParkingName}</span>;
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">{t("parkings.table.Type")}</div>
      ),
      dataIndex: "Type",
      sorter: (a, b) => ((a.Type as string) > (b.Type as string) ? 1 : -1),
      render: (Type: string) => {
        return <span className="whitespace-nowrap">{Type}</span>;
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("parkings.table.BH Commission")}
        </div>
      ),
      dataIndex: "BHCommision",
      sorter: (a, b) => (a.BHCommision > b.BHCommision ? 1 : -1),
      render: (BHCommision: string) => {
        return <span className="whitespace-nowrap">{Number(BHCommision)}</span>;
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("parkings.table.Source Commission")}
        </div>
      ),
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
      title: (
        <div className="whitespace-nowrap">{t("parkings.table.Address")}</div>
      ),
      dataIndex: "Address",
      sorter: (a, b) =>
        (a.Address as string) > (b.Address as string) ? 1 : -1,
      render: (Address: string) => {
        return <span className="whitespace-nowrap">{Address}</span>;
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">{t("parkings.table.City")}</div>
      ),
      dataIndex: "City",
      sorter: (a, b) => ((a.City as string) > (b.City as string) ? 1 : -1),
      render: (City: string) => {
        return <span className="whitespace-nowrap">{City}</span>;
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("parkings.table.Agr-t start")}
        </div>
      ),
      dataIndex: "AgreementStart",
      sorter: (a, b) =>
        (a.AgreementStart as string) > (b.AgreementStart as string) ? 1 : -1,
      render: (AgreementStart: string) => {
        return (
          <div className="whitespace-nowrap">
            {AgreementStart ? moment(AgreementStart).format("YYYY-MM-DD") : ""}
          </div>
        );
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("parkings.table.Agr-t finish")}
        </div>
      ),
      dataIndex: "AgreementFinish",
      sorter: (a, b) =>
        (a.AgreementFinish as string) > (b.AgreementFinish as string) ? 1 : -1,
      render: (AgreementFinish: string) => {
        return (
          <div className="whitespace-nowrap">
            {AgreementFinish
              ? moment(AgreementFinish).format("YYYY-MM-DD")
              : ""}
          </div>
        );
      },
    },
    {
      title: (
        <div className="whitespace-nowrap">
          {t("parkings.table.Business Segment")}
        </div>
      ),
      dataIndex: "BusinessSegment",
      sorter: (a, b) =>
        (a.BusinessSegment as string) > (b.BusinessSegment as string) ? 1 : -1,
      render: (BusinessSegment: string) => {
        return <span className="whitespace-nowrap">{BusinessSegment}</span>;
      },
    },
  ];

  useEffect(() => {
    dispatch(loadParkings({ search: "", ownerId: Number(curUser?.OwnerID) }));
  }, []);

  return (
    <div className="mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <div className="max-w-full overflow-auto">
        <Table
          rowKey="ParkingName"
          onRow={(parking) => {
            return {
              onDoubleClick: () => {
                navigate(
                  `/parkings/form/${parking.OwnerID}/${encodeURIComponent(
                    parking.ParkingName || ""
                  )}`
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
            defaultPageSize: 100,
          }}
        />
      </div>

      <div className="flex justify-end my-6">
        {curUser && (user?.Role === "admin" || user?.Role === "super-admin") && (
          <Link to={`/parkings/form/${curUser.OwnerID}`}>
            <Button className="btn-yellow hvr-float-shadow h-10 w-40 ml-3">
              {t("parkings.item.ADD PARKING")}
            </Button>
          </Link>
        )}

        <ExportExcel />
      </div>
    </div>
  );
}
