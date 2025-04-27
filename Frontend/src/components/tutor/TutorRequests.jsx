import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiDollarSign, FiCheck, FiX } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const TutorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/requests/tutor`, {
        headers: getAuthHeader()
      });
      setRequests(response.data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.patch(
        `${API_URL}/requests/${requestId}/${action}`,
        {},
        { headers: getAuthHeader() }
      );
      toast.success(`Request ${action}ed successfully`);
      fetchRequests();
    } catch (error) {
      toast.error(`Failed to ${action} request`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.subject}
                  </h3>
                  <p className="text-gray-600">{request.student.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <FiCalendar className="text-gray-400" />
                  <span className="text-gray-600">{formatDate(request.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="text-gray-400" />
                  <span className="text-gray-600">{formatTime(request.time)} ({request.duration} mins)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiDollarSign className="text-gray-400" />
                  <span className="text-gray-600">${request.budget}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{request.description}</p>

              {request.status === 'pending' && (
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleRequestAction(request._id, 'reject')}
                    className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <FiX />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleRequestAction(request._id, 'accept')}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <FiCheck />
                    <span>Accept</span>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TutorRequests; 