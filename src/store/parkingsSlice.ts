import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadParkings = createAsyncThunk(
  "/parkings/list",
  async ({ search, ownerId }: { search: string; ownerId: number }) => {
    return await axios
      .get(`/parkings/list${ownerId ? `?ownerId=${ownerId}` : ''}`, { params: {} })
      .then((res) => res.data);
  }
);

export const parkingsSlice = createSlice({
  name: "parkings",
  initialState: {
    parkings: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadParkings.fulfilled, (state, action) => {
      state.parkings = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {
// } = parkingsSlice.actions;

export default parkingsSlice.reducer;
