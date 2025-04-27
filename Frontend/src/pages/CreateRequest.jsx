import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from '../components/common/Form';
import { createRequest } from '../api/requestService';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      await createRequest(data);
      navigate('/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      required: true,
      placeholder: 'Enter the subject you need help with'
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Describe what you need help with'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Form
        title="Create New Request"
        fields={fields}
        onSubmit={handleSubmit}
        error={error}
        loading={loading}
        submitText="Create Request"
      />
    </div>
  );
};

export default CreateRequest; 