import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRequest } from '../../api/authService';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiStar, FiBook, FiFilter } from 'react-icons/fi';

const API_URL = 'http://localhost:5000/api';

// Get the auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  show: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

// Sample subjects (you can replace this with data from your backend)
const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 
  'English', 'History', 'Computer Science', 'Economics'
];

const TutorList = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: ''
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/users/tutors`,
          { headers: getAuthHeader() }
        );
        // Add sample ratings and subjects (replace with real data from backend)
        const tutorsWithDetails = response.data.map(tutor => ({
          ...tutor,
          rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
          subjects: SUBJECTS.sort(() => 0.5 - Math.random()).slice(0, 3), // Random 3 subjects
          reviews: Math.floor(Math.random() * 50) + 10 // Random number of reviews
        }));
        setTutors(tutorsWithDetails);
      } catch (error) {
        toast.error('Failed to fetch tutors');
        console.error('Error fetching tutors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTutor) {
      toast.error('Please select a tutor');
      return;
    }

    try {
      await createRequest({
        ...formData,
        tutor: selectedTutor._id
      });
      toast.success('Request sent successfully!');
      setFormData({ subject: '', description: '' });
      setSelectedTutor(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleTutorSelect = (tutor) => {
    // Store the selected tutor in localStorage
    localStorage.setItem('selectedTutor', JSON.stringify(tutor));
    // Redirect to create request page
    navigate('/create-request');
  };

  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tutor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || tutor.subjects.includes(selectedSubject);
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Tutors</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-100 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Available Tutors</h2>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tutors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Subjects</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
      
      <AnimatePresence>
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {filteredTutors.map((tutor) => (
            <motion.div 
              key={tutor._id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              exit="exit"
              className="card p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleTutorSelect(tutor)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-inner">
                  <span className="text-2xl font-bold text-white">
                    {tutor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{tutor.name}</h3>
                  <p className="text-sm text-gray-500">{tutor.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <FiStar className="text-yellow-400" />
                <span className="font-semibold">{tutor.rating}</span>
                <span className="text-sm text-gray-500">({tutor.reviews} reviews)</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <FiBook className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map(subject => (
                    <span 
                      key={subject}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Click to request this tutor
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredTutors.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No tutors found matching your criteria</p>
        </motion.div>
      )}

      {selectedTutor && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-8 bg-white shadow-lg rounded-xl p-8"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Request {selectedTutor.name} as your tutor
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Select a subject</option>
                {selectedTutor.subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what you need help with..."
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              Send Request
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default TutorList; 