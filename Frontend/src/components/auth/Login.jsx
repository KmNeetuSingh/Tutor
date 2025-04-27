import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import Swal from 'sweetalert2';
import { useTheme } from '../../contexts/ThemeContext';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData);
      
      // Show welcome popup
      await Swal.fire({
        title: 'Welcome Back!',
        html: `
          <div class="text-center">
            <p class="mb-4">Welcome back, ${user.name || 'teacher'}! 👋</p>
            <p class="text-sm" style="color:${theme.textSecondary}">We're glad to have you back in our teaching community.</p>
            <p class="text-sm mt-2" style="color:${theme.textSecondary}">Let's continue making a difference!</p>
          </div>
        `,
        icon: 'success',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        background: theme.cardBg,
        color: theme.text,
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: `text-[${theme.accent}]`,
          htmlContainer: 'text-center'
        }
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background, fontFamily: '"Comic Relief", sans-serif' }}>
      <div className="max-w-md w-full space-y-8" style={{ background: theme.cardBg, borderRadius: '1rem', boxShadow: '0 2px 16px rgba(0,0,0,0.12)', padding: '2rem' }}>
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold" style={{ color: theme.accent }}>
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: theme.error, color: theme.text, borderRadius: '0.5rem', padding: '0.75rem 1rem', marginBottom: '1rem' }} role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border rounded-t-md sm:text-sm"
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                  marginBottom: 0,
                  outline: 'none',
                  boxShadow: 'none',
                }}
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border rounded-b-md sm:text-sm"
                style={{
                  background: theme.inputBg,
                  borderColor: theme.border,
                  color: theme.text,
                  fontFamily: '"Comic Relief", sans-serif',
                  marginBottom: 0,
                  outline: 'none',
                  boxShadow: 'none',
                }}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onFocus={e => e.target.style.borderColor = theme.accent}
                onBlur={e => e.target.style.borderColor = theme.border}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm" style={{ color: theme.textSecondary }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: theme.accent, fontWeight: 600 }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}; 