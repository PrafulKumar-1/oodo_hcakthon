import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard'; // <-- Import AdminDashboard
import { useAuth } from './context/AuthContext';

// This component now checks for role for admin routes
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.user.role !== 'ADMIN') {
    // If it's an admin-only route and user is not an admin, redirect
    return <Navigate to="/" />;
  }

  return children;
};

// This component redirects logged-in users to their respective dashboards
const AppRedirect = () => {
    const { user } = useAuth();
    if (user.user.role === 'ADMIN') {
        return <Navigate to="/admin" />;
    }
    return <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Redirect root path to the correct dashboard */}
      <Route path="/" element={<PrivateRoute><AppRedirect /></PrivateRoute>} />
      
      {/* Citizen Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
