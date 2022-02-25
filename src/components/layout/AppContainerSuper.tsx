import { useDispatch } from "react-redux";
import { signout } from "../../store/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../store";
import { Outlet } from "react-router-dom";

const AppContainerSuper: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      <div className="h-24 flex-none bg-c-black">
        <div className="container-xl mx-auto pt-2 font-bold">
          <div className="flex justify-between">
            <div onClick={() => navigate("/")} className="cursor-pointer">
              <div className="text-white">ACCOMODATION CRM PORTAL</div>
              <div className="text-red-500 text-center">SUPER ADMIN MODE</div>
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
          <div className="text-2xl text-white text-center">
            CRM PORTAL COMPANIES
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
