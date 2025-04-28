import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests } from '../../api/authService';
import { toast } from 'react-hot-toast';

const TutorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    const handleRequestDeleted = (event) => {
      const { requestId } = event.detail;
      setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
    };

    window.addEventListener('requestDeleted', handleRequestDeleted);
    return () => window.removeEventListener('requestDeleted', handleRequestDeleted);
  }, []);

  const openRequests = requests.filter(request => request.status === 'pending');
  const appliedRequests = requests.filter(request => request.tutor === user?.id && request.status === 'applied');
  const scheduledSessions = requests.filter(request => request.tutor === user?.id && request.status === 'scheduled');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-10">
        <div className="relative w-24 h-24 mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 animate-pulse"></div>
            <div className="w-16 h-16 rounded-full border-4 border-blue-400 animate-spin"></div>
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Dashboard</h3>
          <p className="text-gray-500">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-12 px-4 md:px-8">
      {/* Welcome Section */}
      <div className="bg-white shadow rounded-lg p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">Here's an overview of your tutoring activities.</p>
      </div>

      {/* Requests Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Open Requests */}
        <div className="bg-white shadow rounded-lg p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Open Requests</h3>
            <button onClick={() => navigate('/open-requests')} className="text-sm text-blue-600 hover:text-blue-800">
              View All
            </button>
          </div>
          {openRequests.length === 0 ? (
            <p className="text-gray-500">No open requests</p>
          ) : (
            <div className="space-y-4">
              {openRequests.slice(0, 3).map(request => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{request.subject}</h4>
                      <p className="text-sm text-gray-500">{request.description}</p>
                    </div>
                    <button
                      onClick={() => navigate('/open-requests')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applied Requests */}
        <div className="bg-white shadow rounded-lg p-6 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Applied Requests</h3>
            <button onClick={() => navigate('/schedule')} className="text-sm text-blue-600 hover:text-blue-800">
              Schedule
            </button>
          </div>
          {appliedRequests.length === 0 ? (
            <p className="text-gray-500">No applied requests</p>
          ) : (
            <div className="space-y-4">
              {appliedRequests.slice(0, 3).map(request => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{request.subject}</h4>
                      <p className="text-sm text-gray-500">Student: {request.student.name}</p>
                    </div>
                    <button
                      onClick={() => navigate('/schedule')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Sessions */}
        <div className="bg-white shadow rounded-lg p-6 md:col-span-2 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Scheduled Sessions</h3>
          </div>
          {scheduledSessions.length === 0 ? (
            <p className="text-gray-500">No scheduled sessions</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {scheduledSessions.map(request => (
                <div
                  key={request._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="flex flex-col space-y-2">
                    <h4 className="font-medium text-gray-900">{request.subject}</h4>
                    <p className="text-sm text-gray-500">Student: {request.student.name}</p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(request.scheduledDate).toLocaleDateString()}
                    </p>
                    <span className="self-start px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Scheduled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TutorDashboard;
