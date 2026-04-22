import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../services/apiClient";

const initialState = {
  user: JSON.parse(localStorage.getItem("ewms:user") || "null"),
  token: localStorage.getItem("ewms:token"),
  status: "idle",
  error: null,
};

export const loginThunk = createAsyncThunk("auth/login", async (payload) => {
  const response = await apiClient.post("/auth/login", payload);
  return response.data;
});

export const signupThunk = createAsyncThunk("auth/signup", async (payload) => {
  const response = await apiClient.post("/auth/signup", payload);
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("ewms:user");
      localStorage.removeItem("ewms:token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("ewms:user", JSON.stringify(action.payload.user));
        localStorage.setItem("ewms:token", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(signupThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("ewms:user", JSON.stringify(action.payload.user));
        localStorage.setItem("ewms:token", action.payload.token);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
