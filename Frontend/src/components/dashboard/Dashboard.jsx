import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getRequests } from '../../api/authService';

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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 md:px-8 lg:px-16 mt-24">
      <div className="bg-white shadow-lg rounded-2xl p-8 mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
        <p className="text-gray-600">
          {isStudent
            ? "Here's an overview of your tutoring requests and sessions."
            : "Here's an overview of your tutoring sessions and applications."}
        </p>
      </div>

      {/* Student Section */}
      {isStudent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pending Requests */}
          <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Pending Requests</h3>
              <Link
                to="/create-request"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Create New
              </Link>
            </div>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map(request => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.subject}</h4>
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

          {/* Scheduled Sessions */}
          <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Scheduled Sessions</h3>
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
                    className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.subject}</h4>
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

      {/* Tutor Section */}
      {isTutor && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Open Requests */}
          <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Open Requests</h3>
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
                      className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.subject}</h4>
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

          {/* Scheduled Sessions */}
          <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Scheduled Sessions</h3>
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
                    className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-1 transition duration-300 ease-in-out"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.subject}</h4>
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
