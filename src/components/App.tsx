import { useEffect } from "react";

import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { signInWithToken } from "../store/authSlice";
import { RootState, AppDispatch } from "../store";

import Login from "./auth/Login";
import ResetPassword from './auth/ResetPassword';
import NotFound from './common/NotFound';

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
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  return (
    <div className="w-full max-h-screen	flex flex-col bg-purple">
      {/* <AppHeader /> */}
      Hello world
      <div className="flex-grow">
        <Routes>
          {/* <Route path="/dashboard" element={Dashboard} /> */}
        </Routes>
      </div>
    </div>
  );
}
export default App;
