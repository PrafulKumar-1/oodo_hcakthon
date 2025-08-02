import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll effect for transparent to solid header
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={`text-2xl font-bold ${scrolled ? 'text-green-700' : 'text-green-600'} transition-colors duration-300`}>
            Civic<span className="text-yellow-500">Track</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {user && (
            <div className="flex items-center space-x-6">
              <span className={`${scrolled ? 'text-gray-700' : 'text-gray-800'} font-medium transition-colors duration-300`}>
                Welcome, {user.user.name}
              </span>
              <button 
                onClick={logout} 
                className="flex items-center space-x-1 px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-green-700" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 p-4 transition-all duration-300 ease-in-out">
          {user && (
            <div className="flex flex-col space-y-4">
              <span className="text-gray-700 font-medium">
                Welcome, {user.user.name}
              </span>
              <button 
                onClick={logout} 
                className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;