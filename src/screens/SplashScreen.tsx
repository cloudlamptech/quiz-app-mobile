import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const SplashScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Vijay Quizzes</Text>
    <ActivityIndicator size="large" color="#DC2626" style={styles.loader} />
    <Text style={styles.loadingText}>Loading...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DC2626",
    marginBottom: 40,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});

export default SplashScreen;
