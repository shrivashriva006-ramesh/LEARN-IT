import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Redirect protected views when the server rejects the current session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      const requestUrl = error.config?.url || '';
      const isAuthCheck = /\/auth\/(me|login|register|verify-email|logout)(?:\?|$)/.test(requestUrl);
      if (!isAuthCheck && !['/login', '/register', '/verify-email'].includes(currentPath)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Helper for extracting clean error message
export const getErrorMessage = (error: any): string => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default api;
