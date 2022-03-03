import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const loadUsers = createAsyncThunk(
  "/users/list",
  async ({
    search,
    companyID,
    companyWebsite,
  }: {
    search: string | undefined;
    companyID: string | undefined;
    companyWebsite: string | undefined;
  }) => {
    return await axios
      .get("/users/list", { params: { search, companyID, companyWebsite } })
      .then((res) => res.data);
  }
);

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    owners: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUsers.fulfilled, (state, action) => {
      state.owners = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
// export const {
// } = usersSlice.actions;

export default usersSlice.reducer;
