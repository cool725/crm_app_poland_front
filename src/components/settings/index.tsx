import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { signout } from "../../store/authSlice";
import { setLang } from "../../store/commonSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Input, Radio } from "antd";
import { SearchOutlined, SettingFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SuperAdminSetting from './SuperAdminSetting';
import AdminSetting from './AdminSetting';

const Settings: React.FC = () => {
  const { pathname } = useLocation();
  const { ownerId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const lang = useSelector((state: RootState) => state.common.lang);
  const [t, i18n] = useTranslation("common");

  const handleChange = (e: any) => {
    localStorage.setItem("lang", e.target.value);
    dispatch(setLang(e.target.value));
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen">
      <div
        className={`lg:h-36 flex-none ${ownerId ? "bg-c-blue" : "bg-c-black"}`}
      >
        <div className="container h-full px-3 flex flex-col justify-between mx-auto">
          {/* Start Logo and logout */}
          <div className="flex justify-between mt-4">
            <div className="flex items-center">
              <Link to={"/"}>
                <img src="images/logo-dashboard.png" alt="dashboard logo" />
              </Link>
            </div>

            <div className="flex items-center custom-select">
              <Radio.Group
                defaultValue="en"
                onChange={handleChange}
                value={lang}
              >
                <Radio value="en" className="text-white">
                  EN
                </Radio>
                <Radio value="pl" className="text-white">
                  PL
                </Radio>
              </Radio.Group>

              <Link
                to={"/settings"}
                className="text-base text-white flex items-center cursor-pointer"
              >
                <SettingFilled />
              </Link>

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
                disabled={true}
              />
            </div>
            {/* End Search Input */}

            {/* Start tabs list */}
            <ul className="md:flex list-none text-white text-xl font-bold">
              {(user?.Role === "admin" || user?.Role === "super-admin") && (
                <li>
                  <Link
                    to="/settings"
                    className={`h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue ml-1 ${
                      pathname.indexOf("/settings") === 0
                        ? "bg-white text-c-blue"
                        : ""
                    }`}
                  >
                    Settings
                  </Link>
                </li>
              )}
            </ul>
            {/* End tabs list */}
          </div>
        </div>
      </div>
      
      <div className="flex-grow">
          {user?.Role === 'super-admin' ? <SuperAdminSetting /> : <AdminSetting />}
      </div>
    </div>
  );
};

export default Settings;
