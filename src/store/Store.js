import { configureStore } from "@reduxjs/toolkit";
import configReducer from "./ConfigSlice";
// import authReducer from "./authSlice"; // Your existing auth slice

export const store = configureStore({
  reducer: {
    config: configReducer,
    // auth: authReducer, // Your existing auth reducer
    // Add other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});
