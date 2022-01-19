import { createSlice } from '@reduxjs/toolkit';
import { User } from '../@types/user';

interface CommonState {
  // currently selected user
  curUser: null | User;

  // global search input value
  searchVal: string;
}

const initialState = {
  curUser: null,
  searchVal: '',
} as CommonState;

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    selectOwner: (state, action) => {
      state.curUser = action.payload;
    },
    setSearchVal: (state, action) => {
      state.searchVal = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const {
  selectOwner,
  setSearchVal,
} = commonSlice.actions;

export default commonSlice.reducer;