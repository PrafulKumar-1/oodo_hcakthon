import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/'); // Redirect to homepage on successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please check your credentials.');
    }
  };

  // Animation effect for elements
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div 
        className={`max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl apple-card ${isVisible ? 'scale-in' : ''}`}
        style={{boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(0, 0, 0, 0.05)'}}
      >
        {/* Header Section with Logo */}
        <div className="form-header">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-yellow-400 flex items-center justify-center shadow-lg">
              <FiLogIn className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-green-700 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your CivicTrack account</p>
        </div>
        
        {/* Form Container with Border */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className={`${isVisible ? 'slide-up' : ''}`} style={{animationDelay: '0.1s'}}>
              <div className="mb-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-300"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div className={`${isVisible ? 'slide-up' : ''}`} style={{animationDelay: '0.2s'}}>
              <div className="mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition-all duration-300"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className={`${isVisible ? 'slide-up' : ''}`} style={{animationDelay: '0.3s'}}>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 apple-button"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FiLogIn className="h-5 w-5 text-green-500 group-hover:text-green-400" />
                </span>
                Sign in
              </button>
            </div>
           </form>
         </div>
        
        {/* Registration Link */}
        <div className="form-footer">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition-colors duration-300">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
