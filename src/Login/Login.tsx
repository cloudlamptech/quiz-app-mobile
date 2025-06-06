import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

const OTPComponent = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{mobile?: string; otp?: string}>({});

  // Validation functions
  const validateMobileNumber = (number: string) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(number);
  };

  const validateOTP = (otpValue: string) => {
    return otpValue.length === 6 && /^\d+$/.test(otpValue);
  };

  // Clear errors when user starts typing
  const handleMobileChange = (text: string) => {
    setMobileNumber(text);
    if (errors.mobile) {
      setErrors(prev => ({...prev, mobile: undefined}));
    }
  };

  const handleOtpChange = (text: string) => {
    setOtp(text);
    if (errors.otp) {
      setErrors(prev => ({...prev, otp: undefined}));
    }
  };

  // Send OTP API call
  const sendOTP = async () => {
    // Validate mobile number
    if (!validateMobileNumber(mobileNumber)) {
      setErrors({mobile: 'Please enter a valid 10-digit mobile number'});
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('YOUR_API_BASE_URL/send-otp', {
        mobile: mobileNumber,
      });

      if (response.data.success) {
        setShowOtpField(true);
        Alert.alert('Success', 'OTP sent successfully to your mobile number');
      } else {
        Alert.alert('Error', response.data.message || 'Failed to send OTP');
      }
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Network error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP API call
  const verifyOTP = async () => {
    // Validate OTP
    if (!validateOTP(otp)) {
      setErrors({otp: 'Please enter a valid 6-digit OTP'});
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('YOUR_API_BASE_URL/verify-otp', {
        mobile: mobileNumber,
        otp: otp,
      });

      if (response.data.success) {
        Alert.alert('Success', 'OTP verified successfully!', [
          {
            text: 'OK',
            onPress: () => {
              // Reset form or navigate to next screen
              setMobileNumber('');
              setOtp('');
              setShowOtpField(false);
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.data.message || 'Invalid OTP');
      }
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Network error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    setOtp('');
    setErrors({});
    sendOTP();
  };

  const dummyNavigate = () => {};

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Login</Text> */}

      {/* Mobile Number Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={[styles.input, errors.mobile && styles.inputError]}
          placeholder="Enter 10-digit mobile number"
          value={mobileNumber}
          onChangeText={handleMobileChange}
          keyboardType="numeric"
          maxLength={10}
          editable={!showOtpField}
        />
        {errors.mobile && <Text style={styles.errorText}>{errors.mobile}</Text>}
      </View>

      {/* Send OTP Button */}
      {!showOtpField && (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={sendOTP}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      )}

      {/* OTP Input - Shows after sending OTP */}
      {showOtpField && (
        <>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={[styles.input, errors.otp && styles.inputError]}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={handleOtpChange}
              keyboardType="numeric"
              maxLength={6}
            />
            {errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}
          </View>

          {/* Verify OTP Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={dummyNavigate}
            // onPress={verifyOTP}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP Button */}
          <TouchableOpacity
            style={[styles.secondaryButton, loading && styles.buttonDisabled]}
            onPress={resendOTP}
            disabled={loading}>
            <Text style={styles.secondaryButtonText}>Resend OTP</Text>
          </TouchableOpacity>

          {/* Change Mobile Number */}
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => {
              setShowOtpField(false);
              setOtp('');
              setErrors({});
            }}>
            <Text style={styles.linkText}>Change Mobile Number</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default OTPComponent;
