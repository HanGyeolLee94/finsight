import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavigationState {
  customParams: Record<string, any>; // Single field for all navigation-related data
}

const initialState: NavigationState = {
  customParams: {}, // Initialize as an empty object
};

const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setCustomParams(state, action: PayloadAction<Record<string, any>>) {
      state.customParams = {
        ...state.customParams, // Preserve existing keys
        ...action.payload, // Merge new key-value pairs
      };
    },
    resetNavigationState(state) {
      state.customParams = {}; // Reset customParams to an empty object
    },
  },
});

export const { setCustomParams, resetNavigationState } =
  navigationSlice.actions;
export default navigationSlice.reducer;
