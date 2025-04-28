import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import Navbar from './components/common/Navbar';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TutorDashboard from './components/tutor/TutorDashboard';
import CreateRequest from './components/student/CreateRequest';
import MyRequests from './components/student/MyRequests';
import TutorList from './components/student/TutorList';
import OpenRequests from './components/tutor/OpenRequests';
import ScheduleSession from './components/tutor/ScheduleSession';
import TutorProfile from './components/tutor/TutorProfile';
import LandingPage from './components/LandingPage';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

function AppContent() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.background, color: theme.text, fontFamily: '"Comic Relief", sans-serif' }}>
      <Navbar />
      <main className="container mx-auto px-4 py-8" style={{ fontFamily: '"Comic Relief", sans-serif' }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                {user?.role === 'tutor' ? <TutorDashboard /> : <Dashboard />}
              </ProtectedRoute>
            } />
            
            {/* Student routes */}
            <Route 
              path="/find-tutors" 
              element={
                <ProtectedRoute roles={['student']}>
                  <TutorList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-request" 
              element={
                <ProtectedRoute roles={['student']}>
                  <CreateRequest />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-requests" 
              element={
                <ProtectedRoute roles={['student']}>
                  <MyRequests />
                </ProtectedRoute>
              } 
            />

            {/* Tutor routes */}
            <Route 
              path="/open-requests" 
              element={
                <ProtectedRoute roles={['tutor']}>
                  <OpenRequests />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute roles={['tutor']}>
                  <ScheduleSession />
                </ProtectedRoute>
              } 
            />
            
            {/* ✅ Updated profile route to be dynamic */}
            <Route 
              path="/tutors/:id" 
              element={
                <ProtectedRoute>
                  <TutorProfile />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
