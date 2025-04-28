import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaChevronDown, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const userName = user?.name || 'teacher';
    await logout();
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
    navigate('/');
  };

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav 
      className="shadow-lg fixed w-full z-50 transition-all duration-300 ease-in-out"
      style={{ backgroundColor: theme.background, borderBottom: `1px solid ${theme.border}`, fontFamily: '"Comic Relief", sans-serif' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold" style={{ color: theme.accent }}>
              TutorApp
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/about" className="font-medium hover:underline" style={{ color: theme.text }}>About</Link>

            {!user ? (
              <>
                <Link to="/login"><Button variant="secondary">Login</Button></Link>
                <Link to="/register"><Button variant="primary">Register</Button></Link>
              </>
            ) : (
              <>
                {user.role === 'student' && (
                  <>
                    <Link to="/find-tutors"><Button variant="secondary">Find Tutors</Button></Link>
                    <Link to="/create-request"><Button variant="secondary">Create Request</Button></Link>
                    <Link to="/my-requests"><Button variant="secondary">My Requests</Button></Link>
                  </>
                )}
                {user.role === 'tutor' && (
                  <>
                    <Link to="/open-requests"><Button variant="secondary">Open Requests</Button></Link>
                    <Link to="/schedule"><Button variant="secondary">Schedule</Button></Link>
                  </>
                )}

                {/* Profile */}
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="flex items-center space-x-2 group">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-opacity-50" style={{ backgroundColor: theme.accent2 }}>
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <FaUserCircle className="w-6 h-6" style={{ color: theme.text }} />
                      )}
                    </div>
                    <span className="font-medium group-hover:underline" style={{ color: theme.text }}>
                      {user.name || user.email}
                    </span>
                    <FaChevronDown className={`transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} style={{ color: theme.text }} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 animate-fade-in"
                      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.border}` }}
                    >
                      <Link 
                        to={`/tutors/${user._id}`}
                        className="block px-4 py-2 text-sm hover:bg-opacity-20"
                        style={{ color: theme.text }}
                        onClick={() => setDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm flex items-center hover:bg-opacity-20"
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
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu}>
              {menuOpen ? (
                <FaTimes className="h-6 w-6 transition-transform duration-300" style={{ color: theme.text }} />
              ) : (
                <FaBars className="h-6 w-6 transition-transform duration-300" style={{ color: theme.text }} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}
        style={{ backgroundColor: theme.background }}
      >
        <div className="flex flex-col px-4 py-4 space-y-4">
          <Link to="/about" style={{ color: theme.text }} onClick={closeMenu}>About</Link>

          {!user ? (
            <>
              <Link to="/login" onClick={closeMenu}><Button variant="secondary">Login</Button></Link>
              <Link to="/register" onClick={closeMenu}><Button variant="primary">Register</Button></Link>
            </>
          ) : (
            <>
              {user.role === 'student' && (
                <>
                  <Link to="/find-tutors" onClick={closeMenu}><Button variant="secondary">Find Tutors</Button></Link>
                  <Link to="/create-request" onClick={closeMenu}><Button variant="secondary">Create Request</Button></Link>
                  <Link to="/my-requests" onClick={closeMenu}><Button variant="secondary">My Requests</Button></Link>
                </>
              )}
              {user.role === 'tutor' && (
                <>
                  <Link to="/open-requests" onClick={closeMenu}><Button variant="secondary">Open Requests</Button></Link>
                  <Link to="/schedule" onClick={closeMenu}><Button variant="secondary">Schedule</Button></Link>
                </>
              )}
              <Link to={`/tutors/${user._id}`} onClick={closeMenu}><Button variant="secondary">Profile</Button></Link>
              <button onClick={() => { handleLogout(); closeMenu(); }}>
                <Button variant="primary">Logout</Button>
              </button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
