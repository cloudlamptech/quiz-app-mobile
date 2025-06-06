import { StyleSheet } from "react-native";

const globalStyles = StyleSheet.create({
  // Common container style
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light background color
    justifyContent: "center",
    alignItems: "center",
  },

  // Content wrapper
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  // Common text styles
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333", // Dark text color
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666", // Gray text color
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },

  // Input styles
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB", // Light border color
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    width: "90%",
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  disabledInput: {
    color: "#ccc",
  },

  // Button styles
  button: {
    backgroundColor: "#DC2626", // Primary button color
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF", // Button text color
  },
});

export default globalStyles;
