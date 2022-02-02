import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { loadUsers } from "../../store/usersSlice";
import moment from "moment";

import { User } from "../../@types/user";
import ExportExcel from "./ExportExcel";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const users: Array<User> = useSelector(
    (state: RootState) => state.users.owners
  );
  const searchVal = useSelector((state: RootState) => state.common.searchVal);

  const columns: ColumnsType<User> = [
    {
      title: <div className="whitespace-nowrap">ID</div>,
      dataIndex: "OwnerID",
      sorter: (a, b) => (a.OwnerID > b.OwnerID ? 1 : -1),
      render: (OwnerID: number) => {
        return <span className="whitespace-nowrap">{OwnerID}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Name</div>,
      dataIndex: "FirstName",
      sorter: (a, b) =>
        (a.FirstName as string) > (b.FirstName as string) ? 1 : -1,
      render: (FirstName: string) => {
        return <span className="whitespace-nowrap">{FirstName}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Surname</div>,
      dataIndex: "LastName",
      sorter: (a, b) =>
        (a.LastName as string) > (b.LastName as string) ? 1 : -1,
      render: (LastName: string) => {
        return <span className="whitespace-nowrap">{LastName}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Email</div>,
      dataIndex: "Email",
      sorter: (a, b) => (a.Email > b.Email ? 1 : -1),
      render: (Email: string) => {
        return (
          <a
            href={`mailto:${Email}`}
            className="whitespace-nowrap text-blue-500"
          >
            {Email}
          </a>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Phone</div>,
      dataIndex: "Mobile",
      render: (Mobile: string) => {
        return (
          <a href={`tel:${Mobile}`} className="whitespace-nowrap text-blue-500">
            {Mobile}
          </a>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Landline</div>,
      dataIndex: "Landline",
      render: (Landline: string) => {
        return (
          <a
            href={`tel:${Landline}`}
            className="whitespace-nowrap text-blue-500"
          >
            {Landline}
          </a>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Renewal date</div>,
      dataIndex: "RenewalDate",
      sorter: (a, b) =>
        (a.RenewalDate as string) > (b.RenewalDate as string) ? 1 : -1,
      render: (RenewalDate: string) => {
        return (
          <div className="whitespace-nowrap">
            {RenewalDate ? moment(RenewalDate).format("YYYY-MM-DD") : ""}
          </div>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Apartments</div>,
      dataIndex: "Apartments",
      render: (Apartments: string, row: User) => {
        return (
          <>
            {Apartments?.split(",").map((item: any) => (
              <Link
                to={`/apartments/form/${row.OwnerID}/${item}`}
                className="whitespace-nowrap truncate block hover:underline"
                style={{ color: "#349C9C", maxWidth: 150 }}
              >
                {item}
              </Link>
            ))}
          </>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Parkings</div>,
      dataIndex: "Parkings",
      render: (Parkings: string, row: User) => {
        return (
          <>
            {Parkings?.split(",").map((item: any) => (
              <Link
                to={`/parkings/form/${row.OwnerID}/${item}`}
                className="whitespace-nowrap truncate block hover:underline"
                style={{ color: "#4161B4", maxWidth: 150 }}
              >
                {item}
              </Link>
            ))}
          </>
        );
      },
    },
    {
      title: <div className="whitespace-nowrap">Company</div>,
      dataIndex: "Company",
      render: (Company: string) => {
        return <span className="whitespace-nowrap">{Company}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">NIP</div>,
      dataIndex: "NIP",
      render: (NIP: string) => {
        return <span className="whitespace-nowrap">{NIP}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Status</div>,
      dataIndex: "Status",
      sorter: (a, b) => (a.Status > b.Status ? 1 : -1),
      render: (Status: string) => {
        if (Status === "active") return <span>Active</span>;
        return <span style={{ color: "#A11D1D" }}>Blocked</span>;
      },
    },
  ];

  useEffect(() => {
    dispatch(loadUsers(""));
  }, []);

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <div className="max-w-full overflow-auto">
        <Table
          rowKey="OwnerID"
          onRow={(owner) => {
            return {
              onDoubleClick: () => {
                navigate(`/owners/form/${owner.OwnerID}`);
              },
            };
          }}
          columns={columns}
          dataSource={users}
          rowClassName="cursor-pointer hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          pagination={{
            hideOnSinglePage: true,
          }}
        />
      </div>

      <div className="flex justify-end my-6">
        {user?.Role === "admin" && (
          <Link to="/owners/form">
            <Button className="btn-yellow hvr-float-shadow h-10 w-40 ml-3">
              ADD PROFILE
            </Button>
          </Link>
        )}

        <ExportExcel />
      </div>
    </div>
  );
}
