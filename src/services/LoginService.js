import ConfigManager from "../config/ConfigManager";
import SecureStorage from "../config/SecureStorage";

class AuthService {
  constructor() {
    this.baseURL = "";
    this.timeout = 30000;
    this.retryAttempts = 3;
    this.authToken = null;
  }

  async initialize() {
    await ConfigManager.initialize();

    this.baseURL = ConfigManager.get("api.baseUrl");
    this.timeout = ConfigManager.get("api.timeout", 30000);
    this.retryAttempts = ConfigManager.get("api.retryAttempts", 3);

    // Load auth token
    this.authToken = await SecureStorage.getAuthToken();
    this.userData = await SecureStorage.getUserData();
  }

  // Create request with configuration
  async request(endpoint, options = {}) {
    const url = ConfigManager.getApiUrl(endpoint);

    const config = {
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        "App-Version": ConfigManager.get("app.version"),
        Platform: Platform.OS,
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (this.authToken) {
      config.headers.Authorization = `Bearer ${this.authToken}`;
    }

    return this.makeRequestWithRetry(url, config);
  }

  // Request with retry logic
  async makeRequestWithRetry(url, config, attempt = 1) {
    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt < this.retryAttempts) {
        console.warn(
          `Request failed, retrying (${attempt}/${this.retryAttempts})...`
        );
        await this.delay(1000 * attempt); // Exponential backoff
        return this.makeRequestWithRetry(url, config, attempt + 1);
      }

      throw error;
    }
  }

  // Utility delay function
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // API Methods
  async getQuestions() {
    return this.request("questions");
  }

  async submitQuizResult(data) {
    return this.request("quiz/submit", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async login(credentials) {
    await SecureStorage.setAuthToken(credentials.token);
    await SecureStorage.setUserData(credentials.userData);

    // const response = await this.request("auth/login", {
    //   method: "POST",
    //   body: JSON.stringify(credentials),
    // });

    // if (response.token) {
    //   this.authToken = response.token;
    //   await SecureStorage.setAuthToken(response.token);
    // }

    return { success: true, userData: credentials.userData };
  }

  async getUserData() {
    return this.userData;
  }

  async setUserData(userData) {
    this.userData = userData;
    return await SecureStorage.setUserData(userData);
  }

  async logout() {
    this.authToken = null;
    await SecureStorage.removeSecureItem("auth_token");
    await SecureStorage.removeSecureItem("user_data");
  }
}

export default new AuthService();
