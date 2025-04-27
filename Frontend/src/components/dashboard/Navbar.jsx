import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex"> 
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Tutor App</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 