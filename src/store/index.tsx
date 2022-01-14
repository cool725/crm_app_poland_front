import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
// import commonReducer from "./commonSlice";
import authReducer from "./authSlice";
import { useDispatch } from 'react-redux'

const store = configureStore({
  reducer: {
    // common: commonReducer,
    auth: authReducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default store;
