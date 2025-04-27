import { useState, useEffect } from 'react';
import { getMyRequests, acceptRequest, rejectRequest } from '../../api/authService';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiClock, FiCalendar } from 'react-icons/fi';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getMyRequests();
        // Filter only requests assigned to this tutor
        const tutorRequests = data.filter(request => request.tutor && request.tutor._id);
        setRequests(tutorRequests);
      } catch (error) {
        toast.error('Failed to fetch your requests');
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    setProcessingId(requestId);
    try {
      await acceptRequest(requestId);
      toast.success('Request accepted successfully!');
      
      // Update the local state to reflect the change
      setRequests(requests.map(request => 
        request._id === requestId 
          ? { ...request, status: 'accepted' } 
          : request
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    try {
      await rejectRequest(requestId);
      toast.success('Request rejected successfully!');
      
      // Update the local state to reflect the change
      setRequests(requests.map(request => 
        request._id === requestId 
          ? { ...request, status: 'rejected' } 
          : request
      ));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      applied: 'bg-blue-100 text-blue-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Requests Yet</h3>
        <p className="text-gray-500 mb-4">You don't have any tutoring requests to manage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Manage Requests</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.map((request) => (
          <motion.div 
            key={request._id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{request.subject}</h3>
                {getStatusBadge(request.status)}
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Student:</span> {request.student.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Description:</span> {request.description}
                </p>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <FiCalendar className="mr-2" />
                  <span>{new Date(request.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <FiClock className="mr-2" />
                  <span>{request.time} ({request.duration} minutes)</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Budget:</span> ${request.budget}
                </p>
              </div>
              
              {request.status === 'pending' && (
                <div className="flex space-x-2 mt-4">
                  <button
                    onClick={() => handleAccept(request._id)}
                    disabled={processingId === request._id}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {processingId === request._id ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <FiCheck className="mr-2" />
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={processingId === request._id}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {processingId === request._id ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>
                        <FiX className="mr-2" />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ManageRequests; 