import Keychain from "react-native-keychain";

class SecureStorage {
  // Store sensitive data in Keychain
  async setSecureItem(key, value) {
    try {
      const options = {
        service: key,
        accessGroup: undefined, // iOS only
        accessControl: undefined,
        authenticationType: undefined,
        accessibleWhenUnlocked: true,
      };

      await Keychain.setInternetCredentials(
        key, // server
        key, // username
        JSON.stringify(value), // password
        options // options object
      );

      console.log(`✅ Secure item '${key}' stored successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error storing secure item '${key}':`, error);
      return false;
    }
  }

  // Get sensitive data from Keychain
  async getSecureItem(key) {
    try {
      const options = {
        service: key,
        accessGroup: undefined,
        authenticationPrompt: "Please authenticate to access your data",
        authenticationType: undefined,
      };

      const credentials = await Keychain.getInternetCredentials(key, options);

      if (credentials && credentials.password) {
        console.log(`✅ Secure item '${key}' retrieved successfully`);
        return JSON.parse(credentials.password);
      }

      console.log(`ℹ️ Secure item '${key}' not found`);
      return null;
    } catch (error) {
      console.error(`❌ Error retrieving secure item '${key}':`, error);
      return null;
    }
  }

  // Remove sensitive data
  async removeSecureItem(key) {
    try {
      const options = {
        service: key,
      };

      // NEW API: Use options object instead of string
      await Keychain.resetInternetCredentials(options);

      console.log(`✅ Secure item '${key}' removed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing secure item '${key}':`, error);

      // Fallback: Try alternative removal method
      try {
        await Keychain.resetInternetCredentials(key);
        console.log(`✅ Secure item '${key}' removed with fallback method`);
        return true;
      } catch (fallbackError) {
        console.error(
          `❌ Fallback removal also failed for '${key}':`,
          fallbackError
        );
        return false;
      }
    }
  }

  // Store JWT Token
  async setAuthToken(token) {
    return await this.setSecureItem("auth_token", token);
  }

  // Get JWT Token
  async getAuthToken() {
    return await this.getSecureItem("auth_token");
  }

  // Store User Data
  async setUserData(userData) {
    return await this.setSecureItem("user_data", userData);
  }

  // Get User Data
  async getUserData() {
    return await this.getSecureItem("user_data");
  }

  // Store API Keys
  async setApiKeys(keys) {
    return await this.setSecureItem("api_keys", keys);
  }

  // Get API Keys
  async getApiKeys() {
    return await this.getSecureItem("api_keys");
  }

  // Store Firebase Config
  async setFirebaseConfig(config) {
    return await this.setSecureItem("firebase_config", config);
  }

  // Get Firebase Config
  async getFirebaseConfig() {
    return await this.getSecureItem("firebase_config");
  }

  // Clear all secure data (logout)
  async clearAll() {
    try {
      await this.removeSecureItem("auth_token");
      await this.removeSecureItem("api_keys");
      await this.removeSecureItem("firebase_config");
      return true;
    } catch (error) {
      console.error("Error clearing secure storage:", error);
      return false;
    }
  }
}

export default new SecureStorage();
