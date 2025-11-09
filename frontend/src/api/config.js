import axios from 'axios';

// API Configuration
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance
const api = axios.create(API_CONFIG);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Calculate request duration
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    // Log response in development
    if (import.meta.env.DEV) {
      console.log(
        `API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status} (${duration}ms)`
      );
    }

    return response;
  },
  async (error) => {
    // Handle common error responses
    const originalRequest = error.config || {};

    if (error.response) {
      const { status, data } = error.response;

      // Attempt token refresh on 401 once
      if (status === 401) {
        // Do not try to refresh for login/reset/refresh endpoints
        const url = (originalRequest.url || '').toLowerCase();
        const isAuthPath = url.includes('/auth/login') || url.includes('/auth/reset-password') || url.includes('/auth/refresh');

        const hasRefreshToken = !!localStorage.getItem('refreshToken');

        if (!isAuthPath && hasRefreshToken && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = localStorage.getItem('refreshToken');
            const refreshResponse = await api.post('/auth/refresh', { refreshToken });
            const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data || {};

            if (newToken) {
              localStorage.setItem('authToken', newToken);
              if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
              }
              // Update auth header and retry original request
              originalRequest.headers = originalRequest.headers || {};
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            // Fall through to clearing auth and redirect
          }
        }

        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Handle forbidden access
      if (status === 403) {
        return Promise.reject(new Error('Access denied. Insufficient permissions.'));
      }

      // Handle server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }

      // Handle validation errors
      if (status === 400 && data?.details) {
        const errorMessage = Array.isArray(data.details)
          ? data.details.map(detail => detail.msg).join(', ')
          : data.message || 'Validation error';
        return Promise.reject(new Error(errorMessage));
      }

      // Return server error message or generic message
      return Promise.reject(new Error(data?.message || data?.error || 'Something went wrong'));
    }

    // Handle network errors
    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REQUEST_ACCESS: '/auth/request-access',
    REFRESH: '/auth/refresh',
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
  },

  // Students
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id) => `/students/${id}`,
    BY_CLASS: '/students/by-class',
  },

  // Schools
  SCHOOLS: {
    BASE: '/schools',
    BY_ID: (id) => `/schools/${id}`,
    STATS: (id) => `/schools/${id}/stats`,
  },

  // Subjects
  SUBJECTS: {
    BASE: '/subjects',
    BY_ID: (id) => `/subjects/${id}`,
    STATS: (id) => `/subjects/${id}/stats`,
  },

  // Marks
  MARKS: {
    BASE: '/marks',
    BY_ID: (id) => `/marks/${id}`,
    BULK: '/marks/bulk',
    CLASS_SECTION: '/marks/class-section',
    STUDENT_REPORT: (studentId) => `/marks/student/${studentId}`,
  },

  // Reports
  REPORTS: {
    SUMMARY: '/reports/summary',
    ANALYTICS: '/reports/analytics',
    CLASS: '/reports/class',
    SUBJECT: (subjectId) => `/reports/subject/${subjectId}`,
    CERTIFICATE: (studentId) => `/reports/certificate/${studentId}`,
  },
};

// Helper functions for common API patterns
export const apiHelpers = {
  // GET request
  get: async (endpoint, params = {}) => {
    const response = await api.get(endpoint, { params });
    return response.data;
  },

  // POST request
  post: async (endpoint, data = {}) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  // DELETE request
  delete: async (endpoint) => {
    const response = await api.delete(endpoint);
    return response.data;
  },

  // PATCH request
  patch: async (endpoint, data = {}) => {
    const response = await api.patch(endpoint, data);
    return response.data;
  },

  // Upload file
  upload: async (endpoint, file, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    if (onProgress) {
      config.onUploadProgress = (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      };
    }

    const response = await api.post(endpoint, formData, config);
    return response.data;
  },

  // Download file
  download: async (endpoint, filename = null) => {
    const response = await api.get(endpoint, {
      responseType: 'blob',
    });

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return response.data;
  },
};

// Request cancellation utility
export const createCancelToken = () => {
  const source = axios.CancelToken.source();
  return {
    token: source.token,
    cancel: source.cancel,
  };
};

// Check if error is cancellation
export const isCancelledRequest = (error) => {
  return axios.isCancel(error);
};

export default api;
