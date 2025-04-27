import React, { useState, useEffect } from 'react';
import { RequestItem } from '../components/common';
import { getOpenRequests, applyToRequest } from '../api/requestService';
import { Alert } from '../components/common';

const OpenRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getOpenRequests();
      setRequests(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (requestId) => {
    try {
      await applyToRequest(requestId);
      fetchRequests();
    } catch (err) {
      setError('Failed to apply to request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Open Requests</h1>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600">No open requests available.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <RequestItem
              key={request._id}
              request={request}
              onApply={handleApply}
              isTutor={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OpenRequests; 