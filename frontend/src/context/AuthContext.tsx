import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getErrorMessage } from '../services/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; user?: User }>;
  register: (data: any) => Promise<{ success: boolean; message?: string; user?: User }>;
  switchDemoRole: (role: 'student' | 'instructor' | 'admin') => Promise<User | null>;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('edtech_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('edtech_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('edtech_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('edtech_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, clearing authentication token.');
          localStorage.removeItem('edtech_token');
          localStorage.removeItem('edtech_user');
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('edtech_token', receivedToken);
        localStorage.setItem('edtech_user', JSON.stringify(receivedUser));
        return { success: true, user: receivedUser };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const switchDemoRole = async (role: 'student' | 'instructor' | 'admin') => {
    const credentials = {
      student: { email: 'student@edtech.com', password: 'Student@123' },
      instructor: { email: 'instructor@edtech.com', password: 'Instructor@123' },
      admin: { email: 'admin@edtech.com', password: 'Admin@123' },
    };

    const cred = credentials[role];
    const res = await login(cred.email, cred.password);
    if (res.success && res.user) {
      return res.user;
    }
    return null;
  };

  const register = async (formData: any) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('edtech_token', receivedToken);
        localStorage.setItem('edtech_user', JSON.stringify(receivedUser));
        return { success: true };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edtech_token');
    localStorage.removeItem('edtech_user');
    window.location.href = '/login';
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updated };
      setUser(newUser);
      localStorage.setItem('edtech_user', JSON.stringify(newUser));
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('edtech_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        switchDemoRole,
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
