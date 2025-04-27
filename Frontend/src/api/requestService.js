import { api } from './config';

export const createRequest = async (requestData) => {
  const response = await api.post('/requests', requestData);
  return response.data;
};

export const getRequests = async () => {
  const response = await api.get('/requests');
  return response.data;
};

export const getMyRequests = async () => {
  const response = await api.get('/requests/my-requests');
  return response.data;
};

export const getOpenRequests = async () => {
  const response = await api.get('/requests/open');
  return response.data;
};

export const acceptRequest = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/accept`);
  return response.data;
};

export const rejectRequest = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/reject`);
  return response.data;
};

export const applyToRequest = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/apply`);
  return response.data;
};

export const scheduleSession = async (requestId, sessionData) => {
  const response = await api.post(`/requests/${requestId}/schedule`, sessionData);
  return response.data;
};

export const cancelRequest = async (requestId) => {
  const response = await api.post(`/requests/${requestId}/cancel`);
  return response.data;
};

export const deleteRequest = async (requestId) => {
  try {
    const response = await api.delete(`/requests/${requestId}`);
    if (!response.data) {
      throw new Error('No response data received');
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 403) {
      throw new Error('You are not authorized to delete this request');
    } else if (error.response?.status === 404) {
      throw new Error('Request not found');
    }
    throw new Error(error.response?.data?.message || 'Failed to delete request');
  }
}; 