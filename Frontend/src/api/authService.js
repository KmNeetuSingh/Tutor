import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Helper function to get token from localStorage
export const getToken = () => localStorage.getItem('token');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (userData) => api.post('/auth/register', userData);
export const getCurrentUser = () => api.get('/users/me');

// Request endpoints
export const getRequests = () => api.get('/requests');
export const getMyRequests = () => api.get('/requests/my-requests');
export const createRequest = (requestData) => api.post('/requests', requestData);
export const updateRequest = (id, requestData) => api.put(`/requests/${id}`, requestData);
export const deleteRequest = (id) => api.delete(`/requests/${id}`);
export const applyToRequest = (requestId) => api.post(`/requests/${requestId}/apply`);
export const scheduleSession = (requestId, scheduledDate) => 
  api.post(`/requests/${requestId}/schedule`, { scheduledDate });

// Accept a tutoring request
export const acceptRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/requests/${requestId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reject a tutoring request
export const rejectRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/requests/${requestId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
); 