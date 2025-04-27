import { api } from './config';

export const updateProfile = async (userData) => {
  const response = await api.put('/users/profile', userData);
  return response.data;
};

export const getTutors = async () => {
  const response = await api.get('/users/tutors');
  return response.data;
};

export const getStudents = async () => {
  const response = await api.get('/users/students');
  return response.data;
};

export const getTutorProfile = async (tutorId) => {
  const response = await api.get(`/users/tutors/${tutorId}`);
  return response.data;
};

export const getStudentProfile = async (studentId) => {
  const response = await api.get(`/users/students/${studentId}`);
  return response.data;
}; 