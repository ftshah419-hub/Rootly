import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rootly_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('rootly_access_token') || null;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Synchronize localStorage with state
  const handleAuthSuccess = useCallback((authData) => {
    const { user, accessToken, refreshToken } = authData;
    setUser(user);
    setAccessToken(accessToken);
    setAuthError(null);

    localStorage.setItem('rootly_user', JSON.stringify(user));
    localStorage.setItem('rootly_access_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('rootly_refresh_token', refreshToken);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('rootly_refresh_token');
      await authApi.logout(refreshToken);
    } catch (err) {
      console.warn('Logout network notice:', err.message);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem('rootly_user');
      localStorage.removeItem('rootly_access_token');
      localStorage.removeItem('rootly_refresh_token');
    }
  }, []);

  // Listen for forced logout events from axios interceptor
  useEffect(() => {
    const handleForcedLogout = () => {
      setUser(null);
      setAccessToken(null);
    };
    window.addEventListener('rootly_auth_logout', handleForcedLogout);
    return () => window.removeEventListener('rootly_auth_logout', handleForcedLogout);
  }, []);

  // Verify session on initial app mount
  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      const token = localStorage.getItem('rootly_access_token');
      if (!token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.getMe();
        if (isMounted && response.data?.user) {
          setUser(response.data.user);
          localStorage.setItem('rootly_user', JSON.stringify(response.data.user));
        }
      } catch (err) {
        console.warn('Session verification fallback, attempting refresh...');
        const refreshToken = localStorage.getItem('rootly_refresh_token');
        if (refreshToken) {
          try {
            const refreshRes = await authApi.refresh(refreshToken);
            if (isMounted && refreshRes.data?.user) {
              handleAuthSuccess(refreshRes.data);
            }
          } catch {
            if (isMounted) logout();
          }
        } else {
          if (isMounted) logout();
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    verifySession();
    return () => {
      isMounted = false;
    };
  }, [logout, handleAuthSuccess]);

  // Login
  const login = async ({ email, password, rememberDevice }) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.login({ email, password, rememberDevice });
      handleAuthSuccess(res.data);
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register
  const register = async (userData) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await authApi.register(userData);
      handleAuthSuccess(res.data);
      return res.data;
    } catch (err) {
      setAuthError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setAuthError(null);
    return await authApi.forgotPassword(email);
  };

  // Reset password
  const resetPassword = async (token, password, confirmPassword) => {
    setAuthError(null);
    return await authApi.resetPassword({ token, password, confirmPassword });
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user && !!accessToken,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    authError,
    setAuthError,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword
  };

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
