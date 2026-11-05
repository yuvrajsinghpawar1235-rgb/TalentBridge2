import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx';
import JobSearchControls from './components/JobSearchControls.jsx';
import CompaniesView from './components/CompaniesView.jsx';
import CandidateDashboard from './components/CandidateDashboard.jsx';
import RecruiterDashboard from './components/RecruiterDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import NotFound from './components/NotFound.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

// Protected Route Guard Component
function ProtectedRoute({ children, role }) {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<JobSearchControls />} />
            <Route path="jobs" element={<JobSearchControls />} />
            <Route path="companies" element={<CompaniesView />} />

            <Route
              path="candidate/*"
              element={
                <ProtectedRoute role="CANDIDATE">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/*"
              element={
                <ProtectedRoute role="RECRUITER">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  </React.StrictMode>
);