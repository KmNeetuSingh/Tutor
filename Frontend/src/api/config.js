import axios from 'axios';
import { API_BASE_URL, ENV } from '../env';

// Get environment variables
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
// const ENV = import.meta.env.VITE_ENV || 'development';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
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

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Log API configuration in development
if (ENV === 'development') {
  console.log('API Configuration:', {
    baseURL: API_BASE_URL,
    environment: ENV
  });
}

export { api }; 