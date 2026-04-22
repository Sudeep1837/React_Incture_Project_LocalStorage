import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import workReducer from "./workSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    work: workReducer,
  },
});
