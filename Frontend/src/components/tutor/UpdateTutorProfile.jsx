import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../api/config';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Input, TextArea } from '../common/Input';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';

const UpdateTutorProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    hourlyRate: '',
    subjects: [],
    bio: '',
    education: '',
    experience: '',
    availability: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutors/profile');
      const { hourlyRate, subjects, bio, education, experience, availability } = response.data;
      setFormData({
        hourlyRate: hourlyRate || '',
        subjects: subjects || [],
        bio: bio || '',
        education: education || '',
        experience: experience || '',
        availability: availability || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error(error.response?.data?.message || 'Failed to load profile');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectsChange = (e) => {
    const subjects = e.target.value.split(',').map(subject => subject.trim());
    setFormData(prev => ({
      ...prev,
      subjects
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put('/tutors/profile', formData);
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.accent }}></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>Update Profile</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Hourly Rate ($)
                </label>
                <Input
                  type="number"
                  name="hourlyRate"
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                  Subjects (comma-separated)
                </label>
                <Input
                  type="text"
                  name="subjects"
                  value={formData.subjects.join(', ')}
                  onChange={handleSubjectsChange}
                  required
                  placeholder="e.g. Mathematics, Physics, Chemistry"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                Bio
              </label>
              <TextArea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Tell us about yourself and your teaching experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                Education
              </label>
              <TextArea
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Your educational background..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                Experience
              </label>
              <TextArea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Your teaching experience..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: theme.text }}>
                Availability
              </label>
              <TextArea
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Your availability for tutoring sessions..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/profile')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default UpdateTutorProfile; 