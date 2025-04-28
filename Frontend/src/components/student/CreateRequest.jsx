import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../../api/authService';

const CreateRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    date: '',
    time: '',
    duration: '',
    budget: ''
  });

  useEffect(() => {
    const selectedTutor = JSON.parse(localStorage.getItem('selectedTutor'));

    if (!selectedTutor) {
      toast.error('No tutor selected');
      navigate('/tutor-list'); // Redirect to tutor list if no tutor is selected
    }
  }, [navigate]);

  const selectedTutor = JSON.parse(localStorage.getItem('selectedTutor'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (!formData.subject || !formData.description || !formData.date || !formData.time || !formData.duration || !formData.budget) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      await createRequest({
        ...formData,
        tutor: selectedTutor._id, // Pass selected tutor's ID
      });
      toast.success('Request sent successfully!');
      setFormData({
        subject: '',
        description: '',
        date: '',
        time: '',
        duration: '',
        budget: ''
      });
      navigate('/dashboard'); // Navigate to another page after success
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  return (
    <div>
      <h2>Request Tutor: {selectedTutor ? selectedTutor.name : 'Loading...'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject">Subject</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Select a subject</option>
            {selectedTutor?.subjects.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your needs..."
          />
        </div>

        <div>
          <label htmlFor="date">Preferred Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="time">Preferred Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="duration">Session Duration</label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="Enter duration (e.g., 1 hour)"
          />
        </div>

        <div>
          <label htmlFor="budget">Budget</label>
          <input
            type="text"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            required
            placeholder="Enter budget"
          />
        </div>

        <button type="submit">Send Request</button>
      </form>
    </div>
  );
};

export default CreateRequest;
