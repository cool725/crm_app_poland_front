import { useEffect } from "react";
import Header from "./Header";
import { Outlet, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { selectOwner, setSearchVal } from "../../store/commonSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

const AppContainer: React.FC = () => {
  const { ownerId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchOwnerProfile = async () => {
      const res = await axios
        .get(`/users/profile/${ownerId}`)
        .then((res) => res.data);

      dispatch(selectOwner(res));
    };

    if (ownerId) {
      fetchOwnerProfile();
    } else {
      dispatch(selectOwner(null));
    }

    dispatch(setSearchVal(""));
  }, [location]);

  return (
    <div className="flex flex-col h-screen">
      <Header />

      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default AppContainer;
