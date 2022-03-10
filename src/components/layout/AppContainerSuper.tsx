import { useDispatch, useSelector } from "react-redux";
import { signout } from "../../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { AppDispatch } from "../../store";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { selectOwner } from "../../store/commonSlice";
import { RootState } from "../../store";
import { setCompany } from "../../store/commonSlice";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { loadCompanies } from "../../store/companiesSlice";

const AppContainerSuper: React.FC = () => {
  const { pathname } = useLocation();
  const { ownerId } = useParams();
  const { companyID } = useParams();
  const company = useSelector((state: RootState) => state.common.company);
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState("");

  const fetchOwnerProfile = async () => {
    const res = await axios
      .get(
        `/users/profile${companyID ? "/" + companyID : ""}${
          ownerId ? "/" + ownerId : ""
        }`,
        {
          params: {
            companyWebsite: company?.Website,
          },
        }
      )
      .then((res) => res.data);

    dispatch(selectOwner(res));
  };

  const checkSearchAvailable = (): false | string => {
    if (pathname.indexOf("form") > -1 || pathname.indexOf("admins") > -1) {
      return false;
    }

    if (pathname.indexOf("/companies") === 0 || pathname.indexOf("/") === 0) return "companies";

    return false;
  };

  const isSearchAvailable = checkSearchAvailable();

  const fetchCompanyProfile = async () => {
    const res = await axios
      .get(`/companies/${companyID}`)
      .then((res) => res.data);

    dispatch(setCompany(res));

    if (ownerId) {
      fetchOwnerProfile();
    } else {
      dispatch(selectOwner(null));
    }
  };

  const onSearch = (searchVal: string) => {
    if (isSearchAvailable) {
      dispatch(loadCompanies(searchVal));
    }
  };

  useEffect(() => {
    if (companyID) {
      fetchCompanyProfile();
    }
  }, [location]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none" style={{ backgroundColor: "#057ADD" }}>
        <div className="container mx-auto pt-2 font-bold mb-2">
          <div className="flex justify-between items-center">
            <div onClick={() => navigate("/")} className="cursor-pointer ml-20">
              <img src="images/logo.png" className="h-20" alt="logo" />
            </div>
            <div className="text-center">
              <h2 className="text-white text-2xl">
                PROPERTY MANAGEMENT PORTAL
              </h2>
              <h1 className="text-white text-2xl font-light">ADMIN MODE</h1>
            </div>
            <div
              className="text-base text-white flex items-center cursor-pointer ml-3"
              onClick={() => {
                dispatch(signout());
                navigate("/login");
              }}
            >
              Logout
              <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
            </div>
          </div>

          <div className="flex items-center my-4 mx-1 lg:m-0">
            <Input.Search
              className="w-auto"
              placeholder="Search"
              enterButton="Submit"
              prefix={<SearchOutlined />}
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onSearch={onSearch}
              disabled={!isSearchAvailable}
            />
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default AppContainerSuper;
