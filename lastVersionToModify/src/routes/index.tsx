import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  HomePage,
  AboutPage,
  EventsPage,
  CommunityPage,
  ContactPage,
  DonatePage,
  LoginPage,
  RegisterPage,
  MyRolePage,
  IdCardPage,
  SettingsPage,
  ProfilePage,
} from '../pages';
import NotFoundPage from '../pages/NotFoundPage';
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserVerificationPage from '../pages/UserVerificationPage';
import RegistrationSuccessPage from '../pages/RegistrationSuccessPage';
import EventDetailsPage from '../pages/EventDetailsPage';
import NewsDetailsPage from '../pages/NewsDetailsPage';
import ComingSoonPage from '../pages/ComingSoonPage';
import TermsPage from '../pages/TermsPage';
import ReportsPage from '../pages/ReportsPage';
import ReportEvidencePage from '../pages/ReportEvidencePage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailsPage />} />
      <Route path="/news/:id" element={<NewsDetailsPage />} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/donate" element={<DonatePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/coming-soon" element={<ComingSoonPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/reports/:id/evidence" element={<ReportEvidencePage />} />
      
      {/* Guest Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/registration-success" element={<RegistrationSuccessPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/my-role"
        element={
          <ProtectedRoute>
            <MyRolePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/id-card"
        element={
          <ProtectedRoute>
            <IdCardPage />
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

      {/* Admin Routes */}
      <Route path="/boss/kho/logy/wld" element={<AdminLoginPage />} />
      <Route
        path="/admin/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['A']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/content/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['X']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/moderator/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['Y']}>
            <UserVerificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviewer/dashboard/*"
        element={
          <ProtectedRoute allowedRoles={['Z']}>
            <UserVerificationPage />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;