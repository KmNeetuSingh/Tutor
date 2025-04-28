import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../../api/authService';
import { useTheme } from '../../contexts/ThemeContext'; // Assuming the theme context is set up

const CreateRequest = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get the current theme
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    budget: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const selectedTutor = JSON.parse(localStorage.getItem('selectedTutor'));
    if (!selectedTutor) {
      toast.error('No tutor selected');
      navigate('/tutor-list');
    }
  }, [navigate]);

  const selectedTutor = JSON.parse(localStorage.getItem('selectedTutor'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject || !formData.description || !formData.date || !formData.time || !formData.duration || !formData.budget) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      await createRequest({
        ...formData,
        tutor: selectedTutor._id,
      });

      toast.success('Request sent successfully! 🎉');

      setFormData({
        subject: '',
        description: '',
        date: '',
        time: '',
        duration: '',
        budget: ''
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: theme.primary }}>
          Request Tutor: {selectedTutor ? selectedTutor.name : 'Loading...'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form Inputs */}
          {[
            { label: 'Subject', type: 'select', name: 'subject', options: selectedTutor?.subjects || [] },
            { label: 'Description', type: 'textarea', name: 'description' },
            { label: 'Preferred Date', type: 'date', name: 'date' },
            { label: 'Preferred Time', type: 'time', name: 'time' },
            { label: 'Session Duration', type: 'text', name: 'duration', placeholder: 'Enter duration (e.g., 1 hour)' },
            { label: 'Budget', type: 'text', name: 'budget', placeholder: 'Enter budget' }
          ].map((field, index) => (
            <div key={index}>
              <label htmlFor={field.name} className="block mb-1 font-medium text-gray-700">{field.label}</label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  className="w-full border border-purple-300 rounded px-3 py-2 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                >
                  <option value="">Select a subject</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  placeholder="Describe your needs..."
                  className="w-full border border-purple-300 rounded px-3 py-2 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                  placeholder={field.placeholder || ''}
                  className="w-full border border-purple-300 rounded px-3 py-2 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                />
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-white text-purple-600 border border-purple-600' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'} hover:opacity-90 font-semibold py-2 px-4 rounded transition flex items-center justify-center`}
            style={{
              background: loading ? 'white' : `linear-gradient(to right, ${theme.primary} 0%, ${theme.accent} 100%)`,
              borderColor: theme.primary
            }}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 border-2 animate-spin"
                  style={{
                    borderColor: `${theme.primary} transparent ${theme.primary} ${theme.primary}`,
                    borderRadius: '9999px'
                  }}
                ></div>
                <span className="text-purple-600 font-semibold" style={{ color: theme.primary }}>Sending...</span>
              </div>
            ) : (
              'Send Request'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;
