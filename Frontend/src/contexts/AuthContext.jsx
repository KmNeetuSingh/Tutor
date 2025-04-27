import { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi } from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Get user data from localStorage
          const userData = JSON.parse(localStorage.getItem('user'));
          if (userData) {
            setUser(userData);
          } else {
            // If no user data in localStorage, log out
            logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  // Register a new user
  const register = async (userData) => {
    try {
      setLoading(true);
      // Register the user
      const response = await registerApi(userData);
      
      // Automatically log in the user after registration
      return await login({
        email: userData.email,
        password: userData.password
      });
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await loginApi(credentials);
      const { token, user } = response;
      
      // Save token and user data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setToken(token);
      setUser(user);
      
      toast.success('Login successful!');
      return user;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    loading,
    token,
    register,
    login,
    logout,
    isAuthenticated: !!token,
    isStudent: user?.role === 'student',
    isTutor: user?.role === 'tutor'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 