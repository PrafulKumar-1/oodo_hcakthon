import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/api';
import Map from '../components/Map';
import IssueForm from '../components/IssueForm';
import IssueCard from '../components/IssueCard';
import { FiMapPin, FiAlertCircle, FiRefreshCw, FiList, FiMap } from 'react-icons/fi';

const HomePage = () => {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchIssues = (location) => {
    setLoading(true);
    issueService.getIssues({ lat: location.lat, lon: location.lng, radius: 5 })
      .then(response => {
        setIssues(response.data);
      })
      .catch(() => setError('Failed to fetch issues.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(location);
          fetchIssues(location);
        },
        () => {
          setError('Location access denied. Please enable it in your browser settings.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const handleIssueCreated = () => {
    if (userLocation) fetchIssues(userLocation);
  };

  // Animation and UI state
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'map', 'list'
  const mapRef = useRef(null);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRefresh = () => {
    if (userLocation) {
      setLoading(true);
      fetchIssues(userLocation);
    }
  };

  return (
    <div className="container mx-auto px-4 flex flex-col h-screen bg-gradient-to-br from-green-50 to-white">
      <main className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile View Controls */}
        <div className="md:hidden fixed bottom-4 right-4 z-10 flex space-x-2">
          <button 
            onClick={() => setViewMode('list')} 
            className={`p-3 rounded-full shadow-lg ${viewMode === 'list' ? 'bg-green-600 text-white' : 'bg-white text-green-600'} transition-all duration-300`}
          >
            <FiList className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setViewMode('map')} 
            className={`p-3 rounded-full shadow-lg ${viewMode === 'map' ? 'bg-green-600 text-white' : 'bg-white text-green-600'} transition-all duration-300`}
          >
            <FiMap className="h-5 w-5" />
          </button>
          <button 
            onClick={() => setViewMode('split')} 
            className={`p-3 rounded-full shadow-lg ${viewMode === 'split' ? 'bg-green-600 text-white' : 'bg-white text-green-600'} transition-all duration-300`}
          >
            <div className="flex items-center justify-center h-5 w-5">
              <div className="w-2 h-5 bg-current rounded-l-sm"></div>
              <div className="w-3 h-5 bg-current rounded-r-sm"></div>
            </div>
          </button>
        </div>

        {/* Sidebar */}
        <div 
          className={`${viewMode === 'map' ? 'hidden' : viewMode === 'list' ? 'w-full' : 'w-1/3 max-w-md'} md:block p-6 bg-white overflow-y-auto border-r shadow-lg transition-all duration-500 ${isVisible ? 'slide-up' : ''}`}
          style={{animationDelay: '0.1s'}}
        >
          <div className="sticky top-0 bg-white pb-4 z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Report an Issue</h2>
              <button 
                onClick={handleRefresh} 
                className="p-2 rounded-full hover:bg-green-50 text-green-600 transition-all duration-300 transform hover:rotate-180"
                disabled={loading}
              >
                <FiRefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="glass p-6 rounded-xl mb-8 transform transition-all duration-500 hover:translate-y-[-5px]">
            <IssueForm userLocation={userLocation} onIssueCreated={handleIssueCreated} />
          </div>

          <div className="mt-8">
            <div className="flex items-center mb-6">
              <FiAlertCircle className="text-yellow-500 mr-2 h-6 w-6" />
              <h2 className="text-2xl font-bold text-gray-800">Nearby Issues</h2>
            </div>
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {issues.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-500">
                  <FiMapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No issues reported in your area yet.</p>
                </div>
              ) : (
                issues.map(issue => (
                  <div 
                    key={issue.id} 
                    className="transform transition-all duration-300 hover:translate-y-[-5px]"
                  >
                    <IssueCard issue={issue} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Map Area */}
        <div 
          className={`${viewMode === 'list' ? 'hidden' : 'flex-1'} md:block transition-all duration-500 ${isVisible ? 'fade-in' : ''}`}
          style={{animationDelay: '0.3s'}}
          ref={mapRef}
        >
          <div className="h-full w-full relative">
            <Map 
              issues={issues} 
              center={userLocation ? [userLocation.lat, userLocation.lng] : null} 
            />
            
            {/* Location indicator */}
            {userLocation && (
              <div className="absolute bottom-6 left-6 bg-white py-2 px-4 rounded-lg shadow-lg z-10 flex items-center">
                <FiMapPin className="text-green-600 mr-2" />
                <span className="text-sm font-medium">Your Location</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
