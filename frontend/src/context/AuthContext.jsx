import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Create the context
const AuthContext = createContext(null);

/**
 * Custom hook to use the AuthContext
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Provider component that wraps the application and provides auth state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for a logged-in user in localStorage when the app loads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Logs in a user and updates the state.
   * @param {object} credentials - { email, password }
   */
  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  /**
   * Logs out the user and clears the state.
   */
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
  };

  // Don't render children until we've checked for a user
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
