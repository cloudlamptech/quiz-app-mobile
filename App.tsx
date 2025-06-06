import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native"; // Import NavigationContainer
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigator/AppNavigator";
import AppHeader from "./src/components/AppHeader";

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          {" "}
          {/* Wrap navigation components */}
          <AppHeader />
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
