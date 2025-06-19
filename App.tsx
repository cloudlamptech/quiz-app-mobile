import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

// Configuration imports
import { store } from "./src/store/Store";
import { initializeConfig } from "./src/store/ConfigSlice";
import ConfigManager from "./src/config/ConfigManager";
import authService from "./src/services/LoginService";
import SecureStorage from "./src/config/SecureStorage";

// Your existing imports
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigator/AppNavigator";
import AppHeader from "./src/components/AppHeader";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo);
    // Log to crash analytics service
    // crashlytics().recordError(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>
            {ConfigManager.isProduction()
              ? "Please restart the app"
              : this.state.error?.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// App Initialization Component
const AppInitializer = () => {
  const dispatch = useDispatch();
  const { initialized, loading, error } = useSelector((state) => state.config);
  const [initializationStep, setInitializationStep] = useState("Starting...");

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setInitializationStep("Loading configuration...");

      // Initialize configuration
      await dispatch(initializeConfig()).unwrap();

      setInitializationStep("Setting up API client...");

      // Initialize API client
      await authService.initialize();

      setInitializationStep("Loading secure data...");

      // Load any cached secure data
      const authToken = await SecureStorage.getAuthToken();
      if (authToken) {
        console.log("Found existing auth token");
      }

      setInitializationStep("Finalizing setup...");

      // Log successful initialization
      console.log("App initialized successfully");
      console.log("Environment:", ConfigManager.getEnvironment());
      console.log("API URL:", ConfigManager.get("api.baseUrl"));
      console.log("App Version:", ConfigManager.get("app.version"));
    } catch (error) {
      console.error("App initialization failed:", error);

      // Show user-friendly error based on environment
      if (ConfigManager.isProduction()) {
        Alert.alert(
          "Initialization Error",
          "Unable to start the app. Please check your internet connection and try again.",
          [
            {
              text: "Retry",
              onPress: () => initializeApp(),
            },
          ]
        );
      } else {
        Alert.alert("Development Error", error.message);
      }
    }
  };

  // Show loading screen during initialization
  if (loading || !initialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={ConfigManager.get("theme.primaryColor", "#DC2626")}
        />
        <Text style={styles.loadingTitle}>VDQuizzes</Text>
        <Text style={styles.loadingText}>{initializationStep}</Text>

        {/* Show environment indicator in non-production */}
        {!ConfigManager.isProduction() && (
          <View style={styles.environmentBadge}>
            <Text style={styles.environmentText}>
              {ConfigManager.getEnvironment().toUpperCase()}
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Failed to Initialize App</Text>
        <Text style={styles.errorText}>
          {ConfigManager.isProduction()
            ? "Please check your internet connection and try again."
            : error}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => initializeApp()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Render main app once initialized
  return <MainApp />;
};

// Main App Component (your existing app structure)
const MainApp = () => {
  const features = useSelector((state) => state.config.features);

  return (
    <AuthProvider>
      <NavigationContainer>
        {/* Conditionally render header based on feature flag */}
        {ConfigManager.isFeatureEnabled("showAppHeader") && <AppHeader />}
        <AppHeader />
        <AppNavigator />

        {/* Development tools in non-production */}
        {!ConfigManager.isProduction() && <DevelopmentTools />}
      </NavigationContainer>
    </AuthProvider>
  );
};

// Development Tools Component
const DevelopmentTools = () => {
  const [showTools, setShowTools] = useState(false);

  if (!showTools) {
    return (
      <TouchableOpacity
        style={styles.devToolsToggle}
        onPress={() => setShowTools(true)}
      >
        <Text style={styles.devToolsText}>🛠️</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.devToolsContainer}>
      <TouchableOpacity
        style={styles.devToolsClose}
        onPress={() => setShowTools(false)}
      >
        <Text>✕</Text>
      </TouchableOpacity>

      <Text style={styles.devToolsTitle}>Dev Tools</Text>
      <Text style={styles.devToolsInfo}>
        Environment: {ConfigManager.getEnvironment()}
      </Text>
      <Text style={styles.devToolsInfo}>
        API: {ConfigManager.get("api.baseUrl")}
      </Text>
      <Text style={styles.devToolsInfo}>
        Version: {ConfigManager.get("app.version")}
      </Text>

      <TouchableOpacity
        style={styles.devToolsButton}
        onPress={() => ConfigManager.refreshConfig()}
      >
        <Text style={styles.devToolsButtonText}>Refresh Config</Text>
      </TouchableOpacity>
    </View>
  );
};

// Root App Component with Redux Provider
const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <AppInitializer />
        </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
};

// Styles
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  environmentBadge: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  environmentText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 15,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  devToolsToggle: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  devToolsText: {
    fontSize: 20,
  },
  devToolsContainer: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    minWidth: 200,
  },
  devToolsClose: {
    position: "absolute",
    top: 5,
    right: 10,
    padding: 5,
  },
  devToolsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  devToolsInfo: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  devToolsButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 5,
    marginTop: 10,
  },
  devToolsButtonText: {
    color: "#FFF",
    fontSize: 12,
    textAlign: "center",
  },
});

export default App;
