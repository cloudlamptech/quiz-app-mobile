import Config from "react-native-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

class ConfigManager {
  constructor() {
    this.config = null;
    this.remoteConfig = null;
    this.initialized = false;
  }

  // Initialize configuration
  async initialize() {
    try {
      // Load build-time config
      this.config = {
        // API Configuration
        api: {
          baseUrl: Config.API_BASE_URL,
          version: Config.API_VERSION,
          timeout: 30000,
          retryAttempts: 3,
        },

        // App Configuration
        app: {
          name: Config.APP_NAME,
          environment: Config.ENVIRONMENT,
          version: DeviceInfo.getVersion(),
          buildNumber: DeviceInfo.getBuildNumber(),
          bundleId: DeviceInfo.getBundleId(),
        },

        // Feature Flags
        features: {
          enableAnalytics: Config.ENVIRONMENT !== "development",
          enablePushNotifications: true,
          enableBiometrics: true,
          enableOfflineMode: true,
          maxQuizAttempts: 3,
        },

        // Debug Configuration
        debug: {
          enableFlipper: Config.ENABLE_FLIPPER === "true",
          logLevel: Config.LOG_LEVEL,
          showNetworkLogs: Config.ENVIRONMENT !== "production",
        },

        // Cache Configuration
        cache: {
          apiCacheDuration: 5 * 60 * 1000, // 5 minutes
          imageCacheDuration: 24 * 60 * 60 * 1000, // 24 hours
          maxCacheSize: 50 * 1024 * 1024, // 50MB
        },
      };

      // Load remote configuration
      await this.loadRemoteConfig();

      // Merge configurations
      this.mergeConfigurations();

      this.initialized = true;
      console.log("ConfigManager initialized:", this.config);
    } catch (error) {
      console.error("Failed to initialize ConfigManager:", error);
      throw error;
    }
  }

  // Load remote configuration (without rebuilding app)
  async loadRemoteConfig() {
    try {
      const cachedConfig = await AsyncStorage.getItem("remote_config");
      if (cachedConfig) {
        this.remoteConfig = JSON.parse(cachedConfig);
      }

      // Fetch latest remote config
      const response = await fetch(
        `${this.config.api.baseUrl}/${this.config.api.version}/config`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "App-Version": this.config.app.version,
            Platform: Platform.OS,
          },
          timeout: 10000,
        }
      );

      if (response.ok) {
        const remoteConfig = await response.json();
        this.remoteConfig = remoteConfig;

        // Cache for offline use
        await AsyncStorage.setItem(
          "remote_config",
          JSON.stringify(remoteConfig)
        );
        console.log("Remote config loaded:", remoteConfig);
      }
    } catch (error) {
      console.warn("Failed to load remote config:", error);
      // Continue with cached config if available
    }
  }

  // Merge build-time and runtime configurations
  mergeConfigurations() {
    if (this.remoteConfig) {
      // Safely merge remote config
      this.config = {
        ...this.config,
        api: {
          ...this.config.api,
          ...(this.remoteConfig.api || {}),
        },
        features: {
          ...this.config.features,
          ...(this.remoteConfig.features || {}),
        },
        cache: {
          ...this.config.cache,
          ...(this.remoteConfig.cache || {}),
        },
      };
    }
  }

  // Get configuration value with fallback
  get(path, fallback = null) {
    if (!this.initialized) {
      console.warn("ConfigManager not initialized");
      return fallback;
    }

    return this.getNestedValue(this.config, path) ?? fallback;
  }

  // Helper to get nested object values
  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  // Get API URL with version
  getApiUrl(endpoint = "") {
    const baseUrl = this.get("api.baseUrl");
    const version = this.get("api.version");
    const cleanEndpoint = endpoint.startsWith("/")
      ? endpoint.slice(1)
      : endpoint;

    return `${baseUrl}/${version}/${cleanEndpoint}`;
  }

  // Check if feature is enabled
  isFeatureEnabled(featureName) {
    return this.get(`features.${featureName}`, false);
  }

  // Get environment
  getEnvironment() {
    return this.get("app.environment", "development");
  }

  // Is production environment
  isProduction() {
    return this.getEnvironment() === "production";
  }

  // Refresh remote configuration
  async refreshConfig() {
    await this.loadRemoteConfig();
    this.mergeConfigurations();
  }
}

export default new ConfigManager();
