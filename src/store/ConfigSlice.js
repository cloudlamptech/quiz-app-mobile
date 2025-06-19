import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ConfigManager from "../config/ConfigManager";

// Async thunk for initializing configuration
export const initializeConfig = createAsyncThunk(
  "config/initialize",
  async (_, { rejectWithValue }) => {
    try {
      await ConfigManager.initialize();
      return {
        apiUrl: ConfigManager.get("api.baseUrl"),
        environment: ConfigManager.get("app.environment"),
        features: ConfigManager.get("features"),
        appVersion: ConfigManager.get("app.version"),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for refreshing remote config
export const refreshRemoteConfig = createAsyncThunk(
  "config/refresh",
  async (_, { rejectWithValue }) => {
    try {
      await ConfigManager.refreshConfig();
      return {
        features: ConfigManager.get("features"),
        apiUrl: ConfigManager.get("api.baseUrl"),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const configSlice = createSlice({
  name: "config",
  initialState: {
    initialized: false,
    loading: false,
    error: null,
    apiUrl: "",
    environment: "development",
    features: {},
    appVersion: "",
  },
  reducers: {
    updateFeatureFlag: (state, action) => {
      const { feature, enabled } = action.payload;
      state.features[feature] = enabled;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeConfig.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.apiUrl = action.payload.apiUrl;
        state.environment = action.payload.environment;
        state.features = action.payload.features;
        state.appVersion = action.payload.appVersion;
      })
      .addCase(initializeConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(refreshRemoteConfig.fulfilled, (state, action) => {
        state.features = action.payload.features;
        state.apiUrl = action.payload.apiUrl;
      });
  },
});

export const { updateFeatureFlag, clearError } = configSlice.actions;
export default configSlice.reducer;
