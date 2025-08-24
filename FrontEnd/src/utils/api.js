import axios from 'axios';

// Base URL for the API
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance with default configuration
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear local storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// API endpoints
export const endpoints = {
    // Auth endpoints
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        refresh: '/auth/refresh',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password',
        verifyOtp: '/auth/verify-otp',
    },

    // Employee endpoints
    employees: {
        getAll: '/employees',
        getById: (id) => `/employees/${id}`,
        create: '/employees',
        update: (id) => `/employees/${id}`,
        delete: (id) => `/employees/${id}`,
        search: '/employees/search',
        getByDepartment: (dept) => `/employees/department/${dept}`,
        getByStatus: (status) => `/employees/status/${status}`,
        getSalary: (id) => `/employees/${id}/salary`,
        updateSalary: (id) => `/employees/${id}/salary`,
        getProfile: '/employees/profile',
    },

    // Department endpoints
    departments: {
        getAll: '/departments',
        getById: (id) => `/departments/${id}`,
        create: '/departments',
        update: (id) => `/departments/${id}`,
        delete: (id) => `/departments/${id}`,
    },

    // Finance endpoints
    finance: {
        getSalaryOverview: '/finance/salary-overview',
        getBudget: '/finance/budget',
        allocateBudget: '/finance/budget/allocate',
        bulkUpdateSalaries: '/finance/salary/bulk-update',
    },

    // Admin endpoints
    admin: {
        getAllUsers: '/super-admin/users/all',
        getAllEmployees: '/super-admin/employees/all',
        getSystemStats: '/super-admin/system/stats',
        verify: '/super-admin/verify',
        getOwnerInfo: '/super-admin/owner-info',
    },
};

// Helper functions for making API calls
export const apiCall = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
};

// Super admin login function
export const superAdminLogin = async (email, password) => {
  try {
    const response = await api.post(endpoints.auth.login, { email, password });
    return response.data;
  } catch (error) {
    console.error('Super admin login error:', error);
    throw error;
  }
};

export default api;