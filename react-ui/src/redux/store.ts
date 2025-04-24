import { configureStore } from "@reduxjs/toolkit";
import nbaReducer from "./slices/nbaSlice";
import weatherReducer from "./slices/weatherSlice";

export const store = configureStore({
  reducer: {
    nba: nbaReducer,
    weather: weatherReducer
  },
  devTools: process.env.NODE_ENV !== "production"
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
