import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feedback Screen</Text>
      <Text style={styles.content}>This is the Feedback Screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#666",
  },
});

export default FeedbackScreen;
