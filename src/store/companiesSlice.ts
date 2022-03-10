import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadCompanies = createAsyncThunk(
  "/companies/list",
  async function (search: string) {
    return await axios
      .get("/companies/list", { params: { search } })
      .then((res) => res.data);
  }
);

export const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCompanies.fulfilled, (state, action) => {
      state.companies = action.payload;
    });
  },
});

export default companiesSlice.reducer;
