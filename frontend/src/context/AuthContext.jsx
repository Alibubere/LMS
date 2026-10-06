import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { STORAGE_KEYS, ROLES } from '../utils/constants';
import { authApi } from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session from localStorage on startup
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse cached auth state:', err);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const authData = await authApi.login(credentials);
    const receivedToken = authData.token;
    const receivedUser = authData.user;

    localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const register = async (credentials) => {
    const authData = await authApi.register(credentials);
    const receivedToken = authData.token;
    const receivedUser = authData.user;

    localStorage.setItem(STORAGE_KEYS.TOKEN, receivedToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(receivedUser));

    setToken(receivedToken);
    setUser(receivedUser);
    return receivedUser;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      // Ignore API logout error if session was expired
    } finally {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(merged));
    setUser(merged);
  };

  const role = user?.role || null;
  const isAuthenticated = Boolean(token && user);
  const isLearner = role === ROLES.LEARNER;
  const isInstructor = role === ROLES.INSTRUCTOR;
  const isAdmin = role === ROLES.ADMIN;

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated,
      isLoading,
      isLearner,
      isInstructor,
      isAdmin,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, token, role, isAuthenticated, isLoading, isLearner, isInstructor, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
