import React from 'react';
import { Card } from '../components/common';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user.role === 'student' && (
          <>
            <Card
              title="Create New Request"
              headerAction={
                <button
                  onClick={() => navigate('/create-request')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Create
                </button>
              }
            >
              <p className="text-gray-600">
                Need help with a subject? Create a new tutoring request.
              </p>
            </Card>

            <Card
              title="My Requests"
              headerAction={
                <button
                  onClick={() => navigate('/my-requests')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View All
                </button>
              }
            >
              <p className="text-gray-600">
                Track the status of your tutoring requests.
              </p>
            </Card>
          </>
        )}

        {user.role === 'tutor' && (
          <>
            <Card
              title="Open Requests"
              headerAction={
                <button
                  onClick={() => navigate('/open-requests')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View All
                </button>
              }
            >
              <p className="text-gray-600">
                Browse and apply to open tutoring requests.
              </p>
            </Card>

            <Card
              title="Schedule Sessions"
              headerAction={
                <button
                  onClick={() => navigate('/schedule')}
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Schedule
                </button>
              }
            >
              <p className="text-gray-600">
                Manage your tutoring sessions and schedule.
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 