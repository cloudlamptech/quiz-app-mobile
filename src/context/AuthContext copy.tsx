import React, { createContext, useContext, useState, useEffect } from "react";
import LoginService from "../services/LoginService"; // Handles API/storage

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const userData = await LoginService.getStoredUser();
      if (userData) {
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (mobile, otp) => {
    const result = await LoginService.login(mobile, otp);
    if (result.success) {
      setIsAuthenticated(true);
      setUser(result.user);
      await LoginService.storeUser(result.user); // Secure storage
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    await LoginService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
