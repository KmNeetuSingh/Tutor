import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Get the auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new request
export const createRequest = async (requestData) => {
  try {
    const response = await axios.post(
      `${API_URL}/requests`, 
      requestData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get all requests
export const getRequests = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/requests`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Apply to a request (as tutor)
export const applyToRequest = async (requestId) => {
  try {
    const response = await axios.post(
      `${API_URL}/requests/apply/${requestId}`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Schedule a session
export const scheduleSession = async (requestId, scheduledDate) => {
  try {
    const response = await axios.post(
      `${API_URL}/requests/schedule/${requestId}`,
      { scheduledDate },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get requests by user ID
export const getRequestsByUser = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/requests`,
      { headers: getAuthHeader() }
    );
    // Filter requests by user ID (this would be better handled by the backend)
    return response.data.filter(request => 
      request.student._id === userId || request.tutor === userId
    );
  } catch (error) {
    throw error;
  }
};

export const saveRequest = async (requestId) => {
  try {
    const response = await axios.post(`${API_URL}/requests/${requestId}/save`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unsaveRequest = async (requestId) => {
  try {
    const response = await axios.delete(`${API_URL}/requests/${requestId}/save`);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 