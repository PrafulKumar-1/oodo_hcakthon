import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Civic<span className="text-yellow-400">Track</span>
              </span>
            </Link>
            <p className="text-gray-200">
              Empowering citizens to report and track civic issues in their community.
              Together we can make our neighborhoods better places to live.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-yellow-400">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-200 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-200 hover:text-white transition-colors duration-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-200 hover:text-white transition-colors duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-200 hover:text-white transition-colors duration-300">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-yellow-400">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-yellow-400" />
                <span>123 Civic Street, City, Country</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone className="text-yellow-400" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-yellow-400" />
                <span>support@civictrack.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiGithub className="text-yellow-400" />
                <a 
                  href="https://github.com/civictrack" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  github.com/civictrack
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {currentYear} CivicTrack. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="text-gray-200 hover:text-yellow-400 transition-colors duration-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;