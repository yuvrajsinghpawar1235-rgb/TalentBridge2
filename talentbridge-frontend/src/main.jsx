import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import CandidateDashboard from './components/CandidateDashboard.jsx';
import RecruiterDashboard from './components/RecruiterDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import CompaniesView from './components/CompaniesView.jsx';
import JobSearchControls from './components/JobSearchControls.jsx';
import NotFound from './components/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import './index.css';

ReactDOM.createRoot(getElementById('root')).render(
  <React.StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="jobs" element={<JobSearchControls />} />
            <Route path="companies" element={<CompaniesView />} />
            <Route
              path="candidate/*"
              element={
                <ProtectedRoute allowedRole="CANDIDATE">
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="recruiter/*"
              element={
                <ProtectedRoute allowedRole="RECRUITER">
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/*"
              element={
                <ProtectedRoute allowedRole="ADMIN">
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