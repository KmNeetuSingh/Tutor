import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiStar, FiBook, FiFilter } from 'react-icons/fi';
import { useTheme } from '../../contexts/ThemeContext';
import { API_BASE_URL } from '../../env';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'English', 'History', 'Computer Science', 'Economics'
];

const TutorList = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/users/tutors`,
          { headers: getAuthHeader() }
        );
        const tutorsWithDetails = response.data.map(tutor => ({
          ...tutor,
          rating: (Math.random() * 2 + 3).toFixed(1),
          subjects: SUBJECTS.sort(() => 0.5 - Math.random()).slice(0, 3),
          reviews: Math.floor(Math.random() * 50) + 10
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

  const handleTutorSelect = (tutor) => {
    localStorage.setItem('selectedTutor', JSON.stringify(tutor));
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
      <div className="space-y-6 p-6 mt-8">
        <h2 className="text-3xl font-bold mb-8">Available Tutors</h2>
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
    <div className="space-y-6 p-6 mt-4">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-4 text-center sm:text-left">Available Tutors</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div className="relative w-full sm:max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tutors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="relative w-full sm:max-w-xs">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Tutor Cards */}
      <AnimatePresence>
        <motion.div
          className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
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
              className={`p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}
              onClick={() => handleTutorSelect(tutor)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-blue-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'} text-white`}>
                  <span className="text-2xl font-bold">{tutor.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{tutor.name}</h3>
                  <p className="text-sm">{tutor.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <FiStar className="text-yellow-400" />
                <span className="font-semibold">{tutor.rating}</span>
                <span className="text-sm">({tutor.reviews} reviews)</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <FiBook className="text-gray-400" />
                  <span className="text-sm font-medium">Subjects:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map(subject => (
                    <span
                      key={subject}
                      className={`px-2 py-1 text-xs rounded-full ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-center sm:text-left">Click to request this tutor</p>
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
    </div>
  );
};

export default TutorList;
