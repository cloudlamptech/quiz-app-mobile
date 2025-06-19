import ConfigManager from "./ConfigManager";
import SecureStorage from "./SecureStorage";

class FirebaseConfig {
  constructor() {
    this.config = null;
  }

  async initialize() {
    // Load Firebase config based on environment
    const environment = ConfigManager.getEnvironment();

    const configs = {
      development: {
        apiKey: "dev-api-key",
        authDomain: "vdquizzes-dev.firebaseapp.com",
        projectId: "vdquizzes-dev",
        storageBucket: "vdquizzes-dev.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abcdef",
      },
      staging: {
        apiKey: "staging-api-key",
        authDomain: "vdquizzes-staging.firebaseapp.com",
        projectId: "vdquizzes-staging",
        storageBucket: "vdquizzes-staging.appspot.com",
        messagingSenderId: "987654321",
        appId: "1:987654321:web:fedcba",
      },
      production: {
        apiKey: "prod-api-key",
        authDomain: "vdquizzes.firebaseapp.com",
        projectId: "vdquizzes",
        storageBucket: "vdquizzes.appspot.com",
        messagingSenderId: "111222333",
        appId: "1:111222333:web:xyz789",
      },
    };

    this.config = configs[environment] || configs.development;

    // Store securely
    await SecureStorage.setFirebaseConfig(this.config);

    return this.config;
  }

  getConfig() {
    return this.config;
  }
}

export default new FirebaseConfig();
