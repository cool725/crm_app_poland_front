import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadApartments = createAsyncThunk(
  "/apartments/list",
  async ({ search, ownerId }: { search: string; ownerId: any }) => {
    return await axios
      .get(`/apartments/list`, {
        params: { search: search || "", ownerId: ownerId || '' },
      })
      .then((res) => res.data);
  }
);

export const apartmentsSlice = createSlice({
  name: "apartments",
  initialState: {
    apartments: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadApartments.fulfilled, (state, action) => {
      state.apartments = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {
// } = apartmentsSlice.actions;

export default apartmentsSlice.reducer;
