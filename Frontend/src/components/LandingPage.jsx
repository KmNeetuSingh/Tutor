import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaSearch, FaMoneyBillWave, FaClock, FaUserGraduate } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate loading animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: theme.background, color: theme.text, fontFamily: '"Comic Relief", sans-serif' }}>
      {/* Loading Animation */}
      {!isLoaded && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ background: theme.background, zIndex: 50 }}>
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-16 h-16 border-4" style={{ borderColor: theme.accent, borderTopColor: 'transparent', borderRadius: '9999px', animation: 'spin 1s linear infinite' }}></div>
            <p className="mt-4 font-medium" style={{ color: theme.accent }}>Loading...</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 px-4 text-center transition-opacity duration-1000" style={{ background: theme.accent, color: theme.background, opacity: isLoaded ? 1 : 0 }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 animate-fade-in">Welcome to TutorConnect</h1>
          <p className="text-xl mb-8 animate-fade-in-delay">Connect with students and share your knowledge</p>
          <div className="space-x-4 animate-fade-in-delay-2">
            <Link to="/register" style={{ background: theme.background, color: theme.accent, padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              Get Started
            </Link>
            <Link to="/login" style={{ border: `2px solid ${theme.background}`, color: theme.background, padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 600, marginLeft: '1rem' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 transition-opacity duration-1000" style={{ opacity: isLoaded ? 1 : 0 }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: theme.accent }}>Why Choose TutorConnect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<FaChalkboardTeacher className="w-8 h-8" style={{ color: theme.accent }} />}
              title="Share Your Expertise"
              description="Teach subjects you're passionate about and help students succeed"
              theme={theme}
            />
            <FeatureCard
              icon={<FaMoneyBillWave className="w-8 h-8" style={{ color: theme.accent }} />}
              title="Earn Money"
              description="Set your own rates and earn while making a difference"
              theme={theme}
            />
            <FeatureCard
              icon={<FaClock className="w-8 h-8" style={{ color: theme.accent }} />}
              title="Flexible Schedule"
              description="Choose your own hours and work from anywhere"
              theme={theme}
            />
            <FeatureCard
              icon={<FaUserGraduate className="w-8 h-8" style={{ color: theme.accent }} />}
              title="Build Your Profile"
              description="Showcase your qualifications and teaching experience"
              theme={theme}
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 transition-opacity duration-1000" style={{ background: theme.cardBg, opacity: isLoaded ? 1 : 0 }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ color: theme.accent }}>How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and complete your tutor profile with your qualifications and expertise"
              theme={theme}
            />
            <StepCard
              number="2"
              title="Browse Requests"
              description="View tutoring requests from students and find opportunities that match your skills"
              theme={theme}
            />
            <StepCard
              number="3"
              title="Start Teaching"
              description="Connect with students, schedule sessions, and begin your tutoring journey"
              theme={theme}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center transition-opacity duration-1000" style={{ background: theme.accent, color: theme.background, opacity: isLoaded ? 1 : 0 }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Teaching?</h2>
          <p className="text-xl mb-8">Join our community of tutors and make a difference in students' lives</p>
          <Link to="/register" style={{ background: theme.background, color: theme.accent, padding: '0.75rem 2rem', borderRadius: '0.5rem', fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Add custom styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          .animate-fade-in-delay {
            animation: fadeIn 0.8s ease-out 0.2s forwards;
            opacity: 0;
          }
          .animate-fade-in-delay-2 {
            animation: fadeIn 0.8s ease-out 0.4s forwards;
            opacity: 0;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, theme }) => (
  <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ background: theme.cardBg, color: theme.text }}>
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2" style={{ color: theme.accent }}>{title}</h3>
    <p style={{ color: theme.textSecondary }}>{description}</p>
  </div>
);

const StepCard = ({ number, title, description, theme }) => (
  <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ background: theme.cardBg, color: theme.text }}>
    <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4" style={{ background: theme.accent, color: theme.background }}>
      {number}
    </div>
    <h3 className="text-xl font-semibold mb-2" style={{ color: theme.accent }}>{title}</h3>
    <p style={{ color: theme.textSecondary }}>{description}</p>
  </div>
);

export default LandingPage; 