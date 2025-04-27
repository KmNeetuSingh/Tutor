import React, { useState, useEffect } from 'react';
import { RequestItem } from '../components/common';
import { getMyRequests, cancelRequest } from '../api/requestService';
import { Alert } from '../components/common';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRequests();
      setRequests(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelRequest(requestId);
      fetchRequests();
    } catch (err) {
      setError('Failed to cancel request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600">You haven't created any requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestItem
              key={request._id}
              request={request}
              onCancel={handleCancel}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRequests; 