import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import api, { getErrorMessage } from '../services/api';
import { Role, User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (data: { name: string; email: string; password: string; confirmPassword: string; role: Role }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (['/login', '/register', '/verify-email'].includes(window.location.pathname)) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        setUser(null);
        if (!axios.isAxiosError(err) || err.response?.status !== 401) {
          console.error('Unable to validate the current authentication session:', getErrorMessage(err));
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });
      if (res.data.success) {
        const { user: receivedUser } = res.data;
        setUser(receivedUser);
        return { success: true, user: receivedUser };
      }
      return { success: false, message: res.data.message || 'Login failed' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: Role;
  }) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        return { success: true, message: res.data.message };
      }
      return { success: false, message: res.data.message || 'Registration failed' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      console.error('The server could not clear the authentication cookie during logout.');
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updated };
      setUser(newUser);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
