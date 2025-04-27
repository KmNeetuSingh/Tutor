import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { api } from '../../api/config';
import { Card, CardHeader, CardBody } from '../common/Card';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { Input, TextArea } from '../common/Input';

const CreateRequest = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    budget: '',
    tutorId: '' // This will be set manually or already predefined
  });

  useEffect(() => {
    // Since tutor is pre-selected, you don't need to fetch tutors anymore
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/requests', formData);
      toast.success('Request created successfully');
      navigate('/my-requests');
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error(error.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>Create New Request</h1>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Removed Tutor Select Field */}
              
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Duration (hours)
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Budget (USD)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: theme.inputBg,
                    color: theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 rounded-lg"
                style={{
                  backgroundColor: theme.inputBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`
                }}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : (
                  <>
                    <FaPlus className="mr-2" />
                    Create Request
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateRequest;
