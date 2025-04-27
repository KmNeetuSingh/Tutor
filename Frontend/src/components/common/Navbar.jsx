import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';
import { FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { theme } = useTheme();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    const userName = user?.name || 'teacher';
    
    // First remove the user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Then show the goodbye popup
    await Swal.fire({
      title: 'Goodbye!',
      html: `
        <div class="text-center">
          <p class="mb-4">We'll miss you, ${userName}! 👋</p>
          <p class="text-sm text-gray-600">Thank you for being part of our teaching community.</p>
          <p class="text-sm text-gray-600 mt-2">Hope to see you again soon!</p>
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
        title: `text-${theme.accent}`,
        htmlContainer: 'text-center'
      }
    });

    // Finally navigate to the landing page
    window.location.href = '/';
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="shadow-lg" style={{ backgroundColor: theme.background, borderBottom: `1px solid ${theme.border}`, fontFamily: '"Comic Relief", sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" style={{ fontFamily: '"Comic Relief", sans-serif' }}>
              <span className="text-xl font-bold" style={{ color: theme.accent, fontFamily: '"Comic Relief", sans-serif' }}>TutorApp</span>
            </Link>
            {/* About link */}
            <Link to="/about" className="ml-8 font-medium" style={{ color: theme.text, fontFamily: '"Comic Relief", sans-serif' }}>
              About
            </Link>
          </div>

          {/* Center/Right: Auth links, Theme Toggle, Profile */}
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link to="/login">
                  <Button variant="secondary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>Register</Button>
                </Link>
              </>
            )}

            {/* Theme Toggle always at the end */}
            <ThemeToggle />

            {user && (
              <>
                {user.role === 'student' && (
                  <>
                    <Link to="/find-tutors">
                      <Button variant="secondary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>Find Tutors</Button>
                    </Link>
                    <Link to="/create-request">
                      <Button variant="secondary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>Create Request</Button>
                    </Link>
                    <Link to="/my-requests">
                      <Button variant="secondary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>My Requests</Button>
                    </Link>
                  </>
                )}
                {user.role === 'tutor' && (
                  <>
                    <Link to="/open-requests">
                      <Button variant="secondary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>Open Requests</Button>
                    </Link>
                    <Link to="/schedule">
                      <Button variant="secondary" style={{ fontFamily: '"Comic Relief", sans-serif' }}>Schedule</Button>
                    </Link>
                  </>
                )}
                {/* Profile dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.accent2 }}>
                      {user.profilePicture ? (
                        <img 
                          src={user.profilePicture} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-6 h-6" style={{ color: theme.text }} />
                      )}
                    </div>
                    <span className="font-medium" style={{ color: theme.text }}>{user.name || user.email}</span>
                    <FaChevronDown className={`transition-transform ${dropdownOpen ? 'transform rotate-180' : ''}`} style={{ color: theme.text }} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-10" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}>
                      <div className="px-4 py-2 border-b" style={{ borderColor: theme.border }}>
                        <p className="text-sm font-medium" style={{ color: theme.text }}>{user.name || 'User'}</p>
                        <p className="text-xs truncate" style={{ color: theme.textSecondary }}>{user.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm hover:bg-opacity-10" 
                        style={{ color: theme.text }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-opacity-10" 
                        style={{ color: theme.accent }}
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 