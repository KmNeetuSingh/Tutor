import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests } from '../../api/authService';
import { FiBook, FiCalendar, FiClock, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const { user, isStudent, isTutor } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const studentRequests = requests.filter(request => request.studentId === user?.id);
  const tutorRequests = requests.filter(request => request.tutorId === user?.id);
  const pendingRequests = studentRequests.filter(request => request.status === 'pending');
  const scheduledSessions = [...studentRequests, ...tutorRequests].filter(
    request => request.status === 'scheduled'
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          {isStudent
            ? "Here's an overview of your tutoring requests and sessions."
            : "Here's an overview of your tutoring sessions and applications."}
        </p>
      </div>

      {isStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Pending Requests</h3>
              {isStudent && (
                <Link
                  to="/create-request"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Create New Request
                </Link>
              )}
            </div>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <p className="text-sm text-gray-500">{request.description}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Scheduled Sessions</h3>
              <Link
                to="/dashboard/my-requests"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            {scheduledSessions.length === 0 ? (
              <p className="text-gray-500">No scheduled sessions</p>
            ) : (
              <div className="space-y-4">
                {scheduledSessions.map(request => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(request.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Scheduled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {isTutor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Open Requests</h3>
              <Link
                to="/dashboard/open-requests"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            {requests.filter(r => r.status === 'pending').length === 0 ? (
              <p className="text-gray-500">No open requests</p>
            ) : (
              <div className="space-y-4">
                {requests
                  .filter(r => r.status === 'pending')
                  .slice(0, 3)
                  .map(request => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.subject}</h4>
                          <p className="text-sm text-gray-500">{request.description}</p>
                        </div>
                        <Link
                          to="/dashboard/open-requests"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Apply
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Scheduled Sessions</h3>
              <Link
                to="/dashboard/schedule"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
            {scheduledSessions.length === 0 ? (
              <p className="text-gray-500">No scheduled sessions</p>
            ) : (
              <div className="space-y-4">
                {scheduledSessions.map(request => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(request.scheduledDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Scheduled
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 