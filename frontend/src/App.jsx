import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAuth } from './context/AuthContext';
import './App.css';

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

// Layout component to wrap authenticated pages with Header and Footer
const Layout = ({ children, hideFooter = false }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {isAuthenticated && <Header />}
      <main className={`flex-grow ${isAuthenticated ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={
        <Layout hideFooter={false}>
          <LoginPage />
        </Layout>
      } />
      <Route path="/register" element={
        <Layout hideFooter={false}>
          <RegisterPage />
        </Layout>
      } />

      {/* Redirect root path to the correct dashboard */}
      <Route path="/" element={
        <Layout>
          <PrivateRoute>
            <AppRedirect />
          </PrivateRoute>
        </Layout>
      } />
      
      {/* Citizen Dashboard */}
      <Route
        path="/dashboard"
        element={
          <Layout hideFooter={true}>
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          </Layout>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <Layout>
            <PrivateRoute adminOnly={true}>
              <AdminDashboard />
            </PrivateRoute>
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
