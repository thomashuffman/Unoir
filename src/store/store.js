import { configureStore } from "@reduxjs/toolkit";
import runReducer from "./runSlice";

export const store = configureStore({
  reducer: {
    run: runReducer,
  },
});
