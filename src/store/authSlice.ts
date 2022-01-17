import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import storage from "../services/storage";
import { User } from "../@types/user";

export const signInWithEmail = createAsyncThunk(
  "/auth/login",
  async (data: object) => {
    return await axios.post("/auth/login", data).then((res) => res.data);
  }
);

export const signInWithToken = createAsyncThunk(
  "/auth/access-token",
  async () => {
    const token = storage.getToken();

    if (token) {
      return await axios
        .post("/auth/access-token", { access_token: token })
        .then((res) => res.data);
    }
    return null;
  }
);

interface CommonState {
  // currently selected user
  user: null | User;
}

const initialState = {
  user: null,
} as CommonState;

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signout: (state) => {
      state.user = null;
      storage.removeToken();
    },
  },
  extraReducers: (builder) => {
    // Sign in with email
    builder.addCase(signInWithEmail.fulfilled, (state, action) => {
      state.user = action.payload.user;
      if (action.payload.user) {
        storage.setToken(action.payload.access_token);
      }
    });

    // Sign in with token
    builder.addCase(signInWithToken.fulfilled, (state, action) => {
      if (!action.payload) return;
      state.user = action.payload.user;
    });
  },
});

// Action creators are generated for each case reducer function
export const { signout } = authSlice.actions;

export default authSlice.reducer;
