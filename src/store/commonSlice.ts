import { createSlice } from "@reduxjs/toolkit";
import { User } from "../@types/user";
import { Company } from "../@types/company";

interface CommonState {
  // currently selected user
  curUser: null | User;

  // select company
  company: null | Company;

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
    setCompany: (state, action) => {
      state.company = action.payload;
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
export const { selectOwner, setSearchVal, setLang, setCompany } = commonSlice.actions;

export default commonSlice.reducer;
