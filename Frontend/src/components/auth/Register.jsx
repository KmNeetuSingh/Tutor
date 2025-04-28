import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useTheme } from '../../contexts/ThemeContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tutor', // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Only send required fields to backend
      const { confirmPassword, ...userData } = formData;
      const user = await register(userData);

      // Show success popup after successful registration
      await Swal.fire({
        title: 'Registration Successful!',
        html: `
          <div class="text-center">
            <p class="mb-4">Congratulations, ${user.name}! 🎉</p>
            <p class="text-sm text-gray-600">You have successfully registered. Welcome to the community!</p>
          </div>
        `,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: '#fff',
        customClass: {
          popup: 'rounded-lg shadow-xl border border-blue-100',
          title: 'text-blue-600',
          htmlContainer: 'text-center'
        }
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      toast.error(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-6 sm:px-8 lg:px-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4">
              <span>{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                }}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                }}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                }}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                }}
              />
            </div>
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select
                id="role"
                name="role"
                required
                className="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 focus:border-transparent sm:text-sm"
                value={formData.role}
                onChange={handleChange}
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                }}
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-transparent hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
