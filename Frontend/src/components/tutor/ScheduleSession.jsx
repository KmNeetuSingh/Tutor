import { useState, useEffect } from 'react';
import { getRequests, scheduleSession } from '../../api/authService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ScheduleSession = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schedulingId, setSchedulingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequests();
        // Filter only requests where the current tutor has applied
        const appliedRequests = data.filter(
          request => request.tutor === user.id && request.status === 'applied'
        );
        setRequests(appliedRequests);
      } catch (error) {
        toast.error('Failed to fetch your applied requests');
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user.id]);

  const handleSchedule = async (requestId) => {
    if (!selectedDate) {
      toast.error('Please select a date and time');
      return;
    }

    setSchedulingId(requestId);
    try {
      await scheduleSession(requestId, selectedDate);
      toast.success('Session scheduled successfully!');
      
      // Update the local state to reflect the change
      setRequests(requests.map(request => 
        request._id === requestId 
          ? { ...request, status: 'scheduled', scheduledDate: selectedDate } 
          : request
      ));
      
      // Reset the selected date
      setSelectedDate('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule session');
    } finally {
      setSchedulingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-24 h-24 mb-4">
          {/* Animated logo container */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Outer circle */}
            <div className="w-20 h-20 rounded-full border-4 border-blue-200 animate-pulse"></div>
            {/* Inner circle */}
            <div className="w-16 h-16 rounded-full border-4 border-blue-400 animate-spin"></div>
            {/* Center dot */}
            <div className="w-4 h-4 rounded-full bg-blue-600 animate-bounce"></div>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Sessions</h3>
          <p className="text-gray-500">Please wait while we fetch your applied requests...</p>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 mb-2">No Applied Requests</h3>
        <p className="text-gray-500">You haven't applied to any tutoring requests yet.</p>
        <a href="/dashboard/open-requests" className="btn-primary inline-block mt-4">
          Browse Open Requests
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Schedule Sessions</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        {requests.map((request) => (
          <div key={request._id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{request.subject}</h3>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                Applied
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{request.description}</p>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                <span>Student: {request.student.name}</span>
              </div>
              
              <div className="mb-4">
                <label htmlFor={`date-${request._id}`} className="form-label">Select Date and Time</label>
                <input
                  type="datetime-local"
                  id={`date-${request._id}`}
                  className="input-field"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              
              <button
                onClick={() => handleSchedule(request._id)}
                disabled={schedulingId === request._id || !selectedDate}
                className="btn-primary w-full"
              >
                {schedulingId === request._id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scheduling...
                  </span>
                ) : (
                  'Schedule Session'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleSession; 