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
        <Route path="not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />\
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route path="/owners" element={<Users />} />
        <Route path="/owners/form" element={<UserForm />} />
        <Route path="/owners/form/:id" element={<UserForm />} />
        {/* <Route path="apartments" element={<Apartments />} /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default App;
