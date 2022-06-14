import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadApartments = createAsyncThunk(
  "/apartments/list",
  async ({ search, ownerId }: { search: string; ownerId: any }) => {
    return await axios
      .get(`/apartments/list`, {
        params: { search: search || "", ownerId: ownerId || "" },
      })
      .then((res) => res.data);
  }
);

export const apartmentsSlice = createSlice({
  name: "apartments",
  initialState: {
    apartments: [],
    cities: [],
    businessSegments: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadApartments.fulfilled, (state, action) => {
      state.apartments = action.payload?.list;
      state.cities = action.payload?.cities;
      state.businessSegments = action.payload?.businessSegments;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {
// } = apartmentsSlice.actions;

export default apartmentsSlice.reducer;
