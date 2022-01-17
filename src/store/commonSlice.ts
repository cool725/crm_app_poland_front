import { createSlice } from '@reduxjs/toolkit';
import { User } from '../@types/user';

interface CommonState {
  // currently selected user
  curUser: null | User;
}

const initialState = {
  curUser: null,
} as CommonState;

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    selectOwner: (state, action) => {
      state.curUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  selectOwner
} = commonSlice.actions;

export default commonSlice.reducer;