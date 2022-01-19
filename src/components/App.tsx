import { useEffect } from "react";

import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { signInWithToken } from "../store/authSlice";
import { RootState, AppDispatch } from "../store";

import Login from "./auth/Login";
import ResetPassword from "./auth/ResetPassword";
import NotFound from "./common/NotFound";
import AppContainer from "./layout/AppContainer";

import Users from "./users";
import UserForm from "./users/Form";

import Apartments from "./apartments";
import ApartmentForm from "./apartments/Form";

import Parkings from "./parkings";
import ParkingForm from "./parkings/Form";

import Redirect from "./common/Redirect";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (user) return;

    dispatch(signInWithToken()).then((res) => {
      if (res.payload && res.payload.user) {
        navigate(location.pathname);
      } else {
        navigate("/");
      }
    });
  }, []);

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={<Redirect to={`/`} />} />\
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route path="/owners" element={<Users />} />
        <Route path="/owners/form" element={<UserForm />} />
        <Route path="/owners/form/:id" element={<UserForm />} />

        <Route path="apartments" element={<Apartments />} />
        <Route path="apartments/:ownerId" element={<Apartments />} />
        <Route path="/apartments/form" element={<ApartmentForm />} />
        <Route path="/apartments/form/:roomName" element={<ApartmentForm />} />

        <Route path="parkings" element={<Parkings />} />
        <Route path="parkings/:ownerId" element={<Parkings />} />
        <Route path="/parkings/form" element={<ParkingForm />} />
        <Route path="/parkings/form/:parkingName" element={<ParkingForm />} />

        <Route index element={<Redirect to={user.Role === 'admin' ? '/owners' : `/owners/form/${user.OwnerID}`} />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default App;
