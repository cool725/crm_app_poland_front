import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../store";
import { Button, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { loadCompanies } from "../../store/companiesSlice";

import { Company } from "../../@types/company";

export default function Companies() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const companies: Array<Company> = useSelector(
    (state: RootState) => state.companies.companies
  );

  const columns: ColumnsType<Company> = [
    {
      title: <div className="whitespace-nowrap">ID</div>,
      dataIndex: "CompanyID",
      sorter: (a, b) => (a.CompanyID > b.CompanyID ? 1 : -1),
      render: (CompanyID: number) => {
        return <span className="whitespace-nowrap">{CompanyID}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Company Name</div>,
      dataIndex: "Name",
      sorter: (a, b) => ((a.Name as string) > (b.Name as string) ? 1 : -1),
      render: (Name: string) => {
        return <span className="whitespace-nowrap">{Name}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Address</div>,
      dataIndex: "Address",
      sorter: (a, b) =>
        (a.Address as string) > (b.Address as string) ? 1 : -1,
      render: (Address: string) => {
        return <span className="whitespace-nowrap">{Address}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">Website</div>,
      dataIndex: "Website",
      sorter: (a, b) =>
        (a.Website as string) > (b.Website as string) ? 1 : -1,
      render: (Website: string) => {
        return <span className="whitespace-nowrap">{Website}</span>;
      },
    },
    {
      title: <div className="whitespace-nowrap">DB</div>,
      dataIndex: "DB",
      sorter: (a, b) =>
        (a.DB as string) > (b.DB as string) ? 1 : -1,
      render: (DB: string) => {
        return <span className="whitespace-nowrap">{DB}</span>;
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
    dispatch(loadCompanies());
  }, []);

  return (
    <div className="container-xl mx-auto px-3 h-full pt-7 flex flex-col justify-between">
      <div className="max-w-full overflow-auto">
        <Table
          rowKey="CompanyID"
          onRow={(company) => {
            return {
              onDoubleClick: () => {
                navigate(`/companies/form/${company.CompanyID}`);
              },
            };
          }}
          columns={columns}
          rowClassName="cursor-pointer hover:bg-white hover:bg-opacity-10"
          className="border flex-grow"
          dataSource={companies}
          pagination={{
            hideOnSinglePage: true,
            defaultPageSize: 100,
          }}
        />
      </div>

      <div className="flex justify-end my-6">
        <Link to="/companies/form">
          <Button className="btn-yellow hvr-float-shadow h-10 w-40 ml-3">
            ADD CLIENT
          </Button>
        </Link>
      </div>
    </div>
  );
}
