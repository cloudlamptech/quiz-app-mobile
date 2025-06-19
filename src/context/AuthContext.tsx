import React, { createContext, useContext, useState, useEffect } from "react";
import LoginService from "../services/LoginService";

// Create the context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const userData = await LoginService.getUserData();
        if (userData) {
          setIsAuthenticated(true);
          setUser(userData);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
      } finally {
        setIsLoading;
      }
    };
    checkAuth();
  }, []);

  const login = async (token, userData) => {
    try {
      const result = await LoginService.login({ token, userData });

      if (result.success) {
        setIsAuthenticated(true);
        setUser(result.userData);
        await LoginService.setUserData(result.userData); // Secure storage
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const logout = async () => {
    await LoginService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  const updateUser = async (updatedData: any) => {
    try {
      if (user) {
        // const newUserData = { ...user, ...updatedData };
        await LoginService.setUserData(updatedData);
        setUser(updatedData);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
