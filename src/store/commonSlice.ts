import { createSlice } from "@reduxjs/toolkit";
import { User } from "../@types/user";

interface CommonState {
  // currently selected user
  curUser: null | User;

  // global search input value
  searchVal: string;
  lang: string;
}

const initialState = {
  curUser: null,
  searchVal: "",
  lang: "en",
} as CommonState;

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    selectOwner: (state, action) => {
      state.curUser = action.payload;
    },
    setSearchVal: (state, action) => {
      state.searchVal = action.payload;
    },
    setLang: (state, action) => {
      state.lang = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { selectOwner, setSearchVal, setLang } = commonSlice.actions;

export default commonSlice.reducer;
