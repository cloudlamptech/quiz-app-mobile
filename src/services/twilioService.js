import axios from "axios";

const TWILIO_ACCOUNT_SID = "your_account_sid";
const TWILIO_AUTH_TOKEN = "your_auth_token";
const TWILIO_PHONE_NUMBER = "your_twilio_phone_number";

class TwilioService {
  constructor() {
    this.baseURL = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}`;
    this.auth = {
      username: TWILIO_ACCOUNT_SID,
      password: TWILIO_AUTH_TOKEN,
    };
  }

  async sendOTP(phoneNumber) {
    try {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const message = `Your Vijay Quizzes OTP is: ${otp}. Valid for 5 minutes.`;

      const response = await axios.post(
        `${this.baseURL}/Messages.json`,
        new URLSearchParams({
          From: TWILIO_PHONE_NUMBER,
          To: phoneNumber,
          Body: message,
        }),
        {
          auth: this.auth,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Store OTP in your backend or secure storage
      return { success: true, otp, messageSid: response.data.sid };
    } catch (error) {
      console.error("Twilio SMS Error:", error);
      return { success: false, error: error.message };
    }
  }
}

export default new TwilioService();
