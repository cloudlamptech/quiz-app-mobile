import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Card } from "@rneui/themed";
import { useAuth } from "../context/AuthContext";

const LoginScreen = () => {
  const { login } = useAuth();
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Validation functions
  const validateMobileNumber = (number) => {
    const mobileRegex = /^[6-9]\d{9}$/; // Indian mobile number format
    return mobileRegex.test(number);
  };

  const validateOTP = (otpValue) => {
    return otpValue.length === 6 && /^\d+$/.test(otpValue);
  };

  const handleMobileChange = (text) => {
    // Remove any non-numeric characters
    const cleanedText = text.replace(/[^0-9]/g, "");
    setMobileNumber(cleanedText);
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: null }));
    }
  };

  const handleOtpChange = (text) => {
    // Remove any non-numeric characters
    const cleanedText = text.replace(/[^0-9]/g, "");
    setOtp(cleanedText);
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: null }));
    }
  };

  // Send OTP function (Mock implementation)
  const sendOTP = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({
        mobile: "Please enter a valid 10-digit mobile number starting with 6-9",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Mock API call for sending OTP
      console.log("Sending OTP to:", mobileNumber);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful OTP send
      setShowOtpField(true);
      setOtpSent(true);
      startResendTimer();

      Alert.alert(
        "OTP Sent!",
        `A 6-digit OTP has been sent to +91 ${mobileNumber}\n\nFor testing, use OTP: 123456`,
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Send OTP Error:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and login (Mock implementation)
  const verifyOTP = async () => {
    if (!validateOTP(otp)) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Mock API call for OTP verification
      console.log("Verifying OTP:", otp, "for mobile:", mobileNumber);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock OTP verification (accept 123456 or any 6-digit number for testing)
      const isValidOtp = otp === "123456" || otp.length === 6;

      if (isValidOtp) {
        // Mock successful login
        const token = `mock-jwt-token-${Date.now()}`;
        const userData = {
          id: "1",
          name: "User", // You can modify this
          email: `user${mobileNumber.slice(-4)}@example.com`,
          phone: `+91${mobileNumber}`,
          mobile: mobileNumber,
        };

        await login(token, userData);

        Alert.alert("Success!", "Login successful! Welcome to Vijay Quizzes.", [
          {
            text: "Continue",
            onPress: () => {
              // Navigation will automatically switch to Dashboard due to auth state change
            },
          },
        ]);
      } else {
        Alert.alert("Invalid OTP", "Please enter the correct OTP.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      Alert.alert("Error", "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP function
  const resendOTP = async () => {
    if (resendTimer > 0) return;

    setOtp("");
    setErrors({});
    await sendOTP();
  };

  // Timer for resend OTP
  const startResendTimer = () => {
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Change mobile number
  const changeMobileNumber = () => {
    setShowOtpField(false);
    setOtp("");
    setErrors({});
    setOtpSent(false);
    setResendTimer(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          {showOtpField
            ? "Enter the OTP sent to your mobile"
            : "Enter your mobile number to continue"}
        </Text>

        <Card containerStyle={styles.loginCard}>
          {/* Mobile Number Input */}
          <Input
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChangeText={handleMobileChange}
            keyboardType="numeric"
            maxLength={10}
            editable={!showOtpField}
            leftIcon={{
              type: "material",
              name: "phone",
              color: showOtpField ? "#ccc" : "#666",
            }}
            inputStyle={showOtpField ? styles.disabledInput : null}
            errorMessage={errors.mobile}
            label="Mobile Number"
            labelStyle={styles.inputLabel}
          />

          {/* Send OTP Button */}
          {!showOtpField && (
            <Button
              title={loading ? <ActivityIndicator color="#fff" /> : "Send OTP"}
              onPress={sendOTP}
              disabled={loading}
              buttonStyle={styles.loginButton}
              titleStyle={styles.loginButtonText}
            />
          )}

          {/* OTP Input - Shows after sending OTP */}
          {showOtpField && (
            <>
              <Input
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={handleOtpChange}
                keyboardType="numeric"
                maxLength={6}
                leftIcon={{ type: "material", name: "lock", color: "#666" }}
                errorMessage={errors.otp}
                label="OTP"
                labelStyle={styles.inputLabel}
              />

              {/* Verify OTP Button */}
              <Button
                title={
                  loading ? <ActivityIndicator color="#fff" /> : "Verify OTP"
                }
                onPress={verifyOTP}
                disabled={loading}
                buttonStyle={styles.loginButton}
                titleStyle={styles.loginButtonText}
              />

              {/* Resend OTP Button */}
              <Button
                title={
                  resendTimer > 0
                    ? `Resend OTP in ${resendTimer}s`
                    : "Resend OTP"
                }
                onPress={resendOTP}
                disabled={loading || resendTimer > 0}
                type="outline"
                buttonStyle={styles.resendButton}
                titleStyle={[
                  styles.resendButtonText,
                  resendTimer > 0 && styles.disabledText,
                ]}
              />

              {/* Change Mobile Number */}
              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={changeMobileNumber}
                disabled={loading}
              >
                <Text style={styles.changeNumberText}>
                  Change Mobile Number
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* Help Text */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>
              {showOtpField
                ? "For testing, use OTP: 123456 or any 6-digit number"
                : "We will send a 6-digit OTP to verify your mobile number"}
            </Text>
          </View>
        </Card>

        {/* Quick Login for Testing */}
        <Card containerStyle={styles.testCard}>
          <Text style={styles.testTitle}>🚀 Quick Test Login</Text>
          <Text style={styles.testDescription}>
            For testing purposes, you can use any valid 10-digit mobile number
            starting with 6-9
          </Text>
          <Button
            title="Quick Login (Test)"
            onPress={async () => {
              setMobileNumber("9876543210");
              await new Promise((resolve) => setTimeout(resolve, 500));
              setShowOtpField(true);
              setOtp("123456");
              await new Promise((resolve) => setTimeout(resolve, 500));
              await verifyOTP();
            }}
            type="outline"
            buttonStyle={styles.testButton}
            titleStyle={styles.testButtonText}
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
    lineHeight: 24,
  },
  loginCard: {
    borderRadius: 12,
    paddingVertical: 20,
    marginBottom: 20,
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
  resendButton: {
    borderColor: "#0EA5E9",
    borderRadius: 8,
    marginTop: 15,
  },
  resendButtonText: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledText: {
    color: "#ccc",
  },
  changeNumberButton: {
    alignItems: "center",
    marginTop: 15,
    paddingVertical: 10,
  },
  changeNumberText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  helpContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  helpText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },

  // Test Card Styles
  testCard: {
    borderRadius: 12,
    paddingVertical: 15,
    backgroundColor: "#F0F9FF",
    borderColor: "#0EA5E9",
    borderWidth: 1,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  testDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 16,
  },
  testButton: {
    borderColor: "#0EA5E9",
    borderRadius: 6,
    paddingVertical: 8,
  },
  testButtonText: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "500",
  },
});

export default LoginScreen;
