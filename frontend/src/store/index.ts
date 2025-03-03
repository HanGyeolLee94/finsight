import { configureStore } from "@reduxjs/toolkit";
import loadingReducer from "./loadingSlice";
import navigationReducer from "./navigationSlice"; // Import the navigation slice

export const store = configureStore({
  reducer: {
    loading: loadingReducer, // Existing loading reducer
    navigation: navigationReducer, // Add the navigation reducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
