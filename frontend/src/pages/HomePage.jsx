import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { issueService } from '../services/api';
import Map from '../components/Map';
import IssueForm from '../components/IssueForm';
import IssueCard from '../components/IssueCard'; // We'll create this next
import { FiLogOut } from 'react-icons/fi'; // Using an icon for logout

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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow-md w-full">
        <h1 className="text-2xl font-bold text-gray-800">Civic Track</h1>
        <div className="flex items-center">
          <span className="text-gray-700 mr-4">Welcome, {user.user.name}</span>
          <button onClick={logout} className="p-2 rounded-full hover:bg-gray-200 transition">
            <FiLogOut className="text-red-500 h-6 w-6" />
          </button>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/3 max-w-md p-4 bg-white overflow-y-auto border-r">
          <IssueForm userLocation={userLocation} onIssueCreated={handleIssueCreated} />
          <h2 className="text-xl font-semibold mt-6 mb-4">Nearby Issues</h2>
          {loading && <p>Loading issues...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-4">
            {issues.map(issue => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        </div>
        {/* Map Area */}
        <div className="flex-1">
          <Map issues={issues} center={userLocation ? [userLocation.lat, userLocation.lng] : null} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
