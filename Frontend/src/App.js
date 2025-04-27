import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import CreateRequest from './components/student/CreateRequest';
import MyRequests from './components/student/MyRequests';
import TutorList from './components/student/TutorList';
import OpenRequests from './components/tutor/OpenRequests';
import ScheduleSession from './components/tutor/ScheduleSession';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/create-request" element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
              <Route path="/my-requests" element={<ProtectedRoute><MyRequests /></ProtectedRoute>} />
              <Route path="/tutors" element={<ProtectedRoute><TutorList /></ProtectedRoute>} />
              <Route path="/open-requests" element={<ProtectedRoute><OpenRequests /></ProtectedRoute>} />
              <Route path="/schedule" element={<ProtectedRoute><ScheduleSession /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 