import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { api } from '../../api/config';
import { Card, CardHeader, CardBody } from '../common/Card';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../common/Button';

const TutorProfile = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tutors/profile');
      setProfile(response.data);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: theme.accent }}></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        <Card>
          <CardBody>
            <p className="text-center" style={{ color: theme.text }}>No profile found</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h1 className="text-2xl font-bold" style={{ color: theme.text }}>My Profile</h1>
          <Link to="/profile/update">
            <Button variant="secondary">Update Profile</Button>
          </Link>
        </CardHeader>
        <CardBody>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Personal Information</h2>
                <div className="space-y-2">
                  <p><span className="font-medium" style={{ color: theme.text }}>Name:</span> {profile.name}</p>
                  <p><span className="font-medium" style={{ color: theme.text }}>Email:</span> {profile.email}</p>
                  <p><span className="font-medium" style={{ color: theme.text }}>Hourly Rate:</span> ${profile.hourlyRate}</p>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-sm"
                      style={{ backgroundColor: theme.accent, color: theme.background }}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Bio</h2>
              <p className="whitespace-pre-wrap" style={{ color: theme.text }}>{profile.bio}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Education</h2>
              <p className="whitespace-pre-wrap" style={{ color: theme.text }}>{profile.education}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Experience</h2>
              <p className="whitespace-pre-wrap" style={{ color: theme.text }}>{profile.experience}</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text }}>Availability</h2>
              <p className="whitespace-pre-wrap" style={{ color: theme.text }}>{profile.availability}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TutorProfile; 