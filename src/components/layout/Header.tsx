import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { signout } from "../../store/authSlice";
import { selectOwner } from "../../store/commonSlice";

import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const curUser = useSelector((state: RootState) => state.common.curUser);

  return (
    <div className="h-36 bg-c-black flex-none">
      <div className="container h-full px-3 flex flex-col justify-between mx-auto">
        {/* Start Logo and logout */}
        <div className="flex justify-between mt-4">
          <div className="flex items-center">
            {!curUser && (
              <img src="images/logo-dashboard.png" alt="dashboard logo" />
            )}

            {curUser && (
              <div className="text-white text-base font-bold flex items-center">
                <FontAwesomeIcon
                  icon={faLongArrowAltLeft}
                  className="mr-4 text-3xl cursor-pointer"
                  onClick={() => dispatch(selectOwner(null))}
                />
                Owner: {curUser.FirstName} {curUser.LastName}
              </div>
            )}
          </div>

          <div
            className="text-base text-white flex items-center cursor-pointer"
            onClick={() => dispatch(signout())}
          >
            Logout
            <FontAwesomeIcon icon={faSignOutAlt} className="ml-2" />
          </div>
        </div>
        {/* End Logo and logout */}

        {/* Start tabs list */}
        <div className="flex justify-between">
          {/* Start Search Input */}
          <div className="flex items-center">
            <Input.Search
              placeholder="Search"
              enterButton="Submit"
              prefix={<SearchOutlined />}
              onSearch={() => {
                console.log("");
              }}
            />
          </div>
          {/* End Search Input */}

          {/* Start tabs list */}
          <ul className="flex list-none text-white text-xl font-bold">
            {!curUser && (
              <li>
                <Link
                  to="/owners"
                  className="h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue"
                >
                  Owners
                </Link>
              </li>
            )}

            {curUser && (
              <li>
                <Link
                  to="/profile"
                  className="h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue"
                >
                  Profile
                </Link>
              </li>
            )}
            <li>
              <Link
                to="/apartments"
                className="h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue"
              >
                Apartments
              </Link>
            </li>
            <li>
              <Link
                to="/parkings"
                className="h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue"
              >
                Parkings
              </Link>
            </li>

            <li>
              <Link
                to={curUser ? "/reports" : "/transactions"}
                className="h-13 px-10 rounded-t flex justify-center items-center hover:bg-white hover:text-c-blue"
              >
                Transactions
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
