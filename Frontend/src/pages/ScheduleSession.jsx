import React, { useState, useEffect } from 'react';
import { Form } from '../components/common';
import { getRequests, scheduleSession } from '../api/requestService';
import { Alert } from '../components/common';

const ScheduleSession = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getRequests();
      // Filter only requests that are in 'applied' status
      const appliedRequests = data.filter(request => request.status === 'applied');
      setRequests(appliedRequests);
      setError('');
    } catch (err) {
      setError('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (data) => {
    try {
      await scheduleSession(data.requestId, {
        scheduledDate: data.scheduledDate,
        duration: data.duration
      });
      setSuccess('Session scheduled successfully');
      fetchRequests();
    } catch (err) {
      setError('Failed to schedule session');
    }
  };

  const fields = [
    {
      name: 'requestId',
      label: 'Select Request',
      type: 'select',
      required: true,
      options: requests.map(request => ({
        value: request._id,
        label: `${request.subject} - ${request.student.name}`
      }))
    },
    {
      name: 'scheduledDate',
      label: 'Session Date & Time',
      type: 'datetime-local',
      required: true
    },
    {
      name: 'duration',
      label: 'Duration (minutes)',
      type: 'number',
      required: true,
      min: 30,
      max: 180,
      step: 30
    }
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Schedule Session</h1>

      {error && (
        <Alert type="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {requests.length === 0 ? (
        <p className="text-gray-600">No requests available for scheduling.</p>
      ) : (
        <Form
          title="Schedule a Session"
          fields={fields}
          onSubmit={handleSchedule}
          submitText="Schedule Session"
        />
      )}
    </div>
  );
};

export default ScheduleSession; 