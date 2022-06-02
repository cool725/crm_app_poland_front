import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { signout } from "../../store/authSlice";
import { setSearchVal, setLang } from "../../store/commonSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { loadUsers } from "../../store/usersSlice";
import { loadApartments } from "../../store/apartmentsSlice";
import { loadParkings } from "../../store/parkingsSlice";
import { Input, Radio } from "antd";
import { SearchOutlined, SettingFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Header: React.FC = () => {
  const { pathname } = useLocation();
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const curUser = useSelector((state: RootState) => state.common.curUser);
  const user = useSelector((state: RootState) => state.auth.user);
  const searchVal = useSelector((state: RootState) => state.common.searchVal);
  const lang = useSelector((state: RootState) => state.common.lang);
  const [t, i18n] = useTranslation("common");

  const checkSearchAvailable = (): false | string => {
    if (
      pathname.indexOf("form") > -1 ||
      pathname.indexOf("transactions") > -1 ||
      pathname.indexOf("reports") > -1
    ) {
      return false;
    }

    if (pathname.indexOf("/owners") === 0) return "owners";
    if (pathname.indexOf("/apartments") === 0) return "apartments";
    if (pathname.indexOf("/parkings") === 0) return "parkings";

    return false;
  };

  const isSearchAvailable = checkSearchAvailable();

  const onSearch = (searchVal: string) => {
    switch (isSearchAvailable) {
      case "owners":
        dispatch(loadUsers(searchVal));
        break;
      case "apartments":
        dispatch(
          loadApartments({ search: searchVal, ownerId: curUser?.OwnerID || "" })
        );
        break;
      case "parkings":
        dispatch(
          loadParkings({ search: searchVal, ownerId: curUser?.OwnerID || "" })
        );
        break;
      default:
        break;
    }
  };
  const handleChange = (e: any) => {
    localStorage.setItem("lang", e.target.value);
    dispatch(setLang(e.target.value));
    i18n.changeLanguage(e.target.value);
  };

  useEffect(() => {
    const oldLang = localStorage.getItem("lang") || "en";
    dispatch(setLang(oldLang));
    i18n.changeLanguage(lang);
  }, []);

  return (
    <div
      className={`lg:h-36 flex-none ${ownerId ? "bg-c-blue" : "bg-c-black"}`}
    >
      <div className="container h-full px-3 flex flex-col justify-between mx-auto">
        {/* Start Logo and logout */}
        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            {!curUser && (
              <img src="images/logo-dashboard.png" alt="dashboard logo" />
            )}

            {curUser && (
              <div className="text-white text-base font-bold flex items-center">
                {user?.Role !== "owner" && (
                  <Link to="/owners">
                    <FontAwesomeIcon
                      icon={faLongArrowAltLeft}
                      className="mr-4 text-3xl cursor-pointer"
                    />
                  </Link>
                )}
                {t("Owner")}: {curUser.FirstName} {curUser.LastName}
              </div>
            )}
          </div>

          <div className="flex items-center custom-select">
            <Radio.Group defaultValue="en" onChange={handleChange} value={lang}>
              <Radio value="en" className="text-white">
                EN
              </Radio>
              <Radio value="pl" className="text-white">
                PL
              </Radio>
            </Radio.Group>

            {!(user?.Role === "owner") && (
              <Link
                to={"/settings"}
                className="text-base text-white flex items-center cursor-pointer"
              >
                <SettingFilled />
              </Link>
            )}

            <div
              className="text-base text-white flex items-center cursor-pointer ml-3"
              onClick={() => {
                dispatch(signout());
                navigate("/login");
              }}
            >
              {t("Logout")}
              <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
            </div>
          </div>
        </div>
        {/* End Logo and logout */}

        {/* Start tabs list */}
        <div className="lg:flex justify-between">
          {/* Start Search Input */}
          <div className="flex items-center my-4 mx-1 lg:m-0">
            <Input.Search
              placeholder={t("Search")}
              enterButton={t("Submit")}
              prefix={<SearchOutlined />}
              value={searchVal}
              onChange={(e) => dispatch(setSearchVal(e.target.value))}
              onSearch={onSearch}
              disabled={!isSearchAvailable}
            />
          </div>
          {/* End Search Input */}

          {/* Start tabs list */}
          <ul className="md:flex list-none text-white text-xl font-bold">
            {!curUser && (
              <li>
                <Link
                  to="/owners"
                  className={`h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue ml-1 ${
                    pathname.indexOf("/owners") === 0
                      ? "bg-white text-c-blue"
                      : ""
                  }`}
                >
                  {t("tabs.Owners")}
                </Link>
              </li>
            )}

            {curUser && (
              <li>
                <Link
                  to={`/owners/form/${curUser.OwnerID}`}
                  className={`h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue ml-1 ${
                    pathname.indexOf("/owners/form") === 0
                      ? "bg-white text-c-blue"
                      : ""
                  }`}
                >
                  {t("tabs.Profile")}
                </Link>
              </li>
            )}
            <li>
              <Link
                to={`/apartments/${curUser ? curUser.OwnerID : ""}`}
                className={`h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue ml-1 ${
                  pathname.indexOf("/apartments") === 0
                    ? "bg-white text-c-blue"
                    : ""
                }`}
              >
                {t("tabs.Apartments")}
              </Link>
            </li>
            <li>
              <Link
                to={`/parkings/${curUser ? curUser.OwnerID : ""}`}
                className={`h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue ml-1 ${
                  pathname.indexOf("/parkings") === 0
                    ? "bg-white text-c-blue"
                    : ""
                }`}
              >
                {t("tabs.Parkings")}
              </Link>
            </li>

            <li>
              <Link
                to={
                  curUser
                    ? `/reports/${curUser.OwnerID}/simple`
                    : "/transactions/apartments"
                }
                className={`h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue ml-1 ${
                  pathname.indexOf("/transactions") === 0 ||
                  pathname.indexOf("/reports") === 0
                    ? "bg-white text-c-blue"
                    : ""
                }`}
              >
                {t("tabs.Transactions")}
              </Link>
            </li>
          </ul>
          {/* End tabs list */}
        </div>
      </div>
    </div>
  );
};

export default Header;
