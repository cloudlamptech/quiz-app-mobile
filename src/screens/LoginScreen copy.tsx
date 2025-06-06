import React, { useState } from "react";
import { View, Text, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Card } from "@rneui/themed";
import { useAuth } from "../context/AuthContext";

const LoginScreen1 = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful login
      const token = "mock-jwt-token-12345";
      const userData = {
        id: "1",
        name: "John Doe",
        email: email,
        phone: "+1234567890",
      };

      await login(token, userData);

      // Navigation will automatically switch to Dashboard
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back!!</Text>
        <Text style={styles.subtitle}>Please sign in to continue</Text>

        <Card containerStyle={styles.loginCard}>
          <Input
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={{ type: "material", name: "email", color: "#666" }}
          />

          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={{ type: "material", name: "lock", color: "#666" }}
          />

          <Button
            title={loading ? <ActivityIndicator color="#fff" /> : "Sign In"}
            onPress={handleLogin}
            disabled={loading}
            buttonStyle={styles.loginButton}
            titleStyle={styles.loginButtonText}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  loginCard: {
    borderRadius: 12,
    paddingVertical: 20,
  },
  loginButton: {
    backgroundColor: "#DC2626",
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LoginScreen1;
