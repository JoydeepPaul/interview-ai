import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks';

// Pages
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import InterviewStartPage from './pages/InterviewStartPage';
import InterviewPracticePage from './pages/InterviewPracticePage';
import InterviewResultsPage from './pages/InterviewResultsPage';
import InterviewHistoryPage from './pages/InterviewHistoryPage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth/login" replace />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth/*"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-start"
        element={
          <ProtectedRoute>
            <InterviewStartPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:interviewId"
        element={
          <ProtectedRoute>
            <InterviewPracticePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-results/:interviewId"
        element={
          <ProtectedRoute>
            <InterviewResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview-history"
        element={
          <ProtectedRoute>
            <InterviewHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
