import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './components/common/Toast.jsx';

// Auth Pages
import LoginPage from './pages/auth/LoginPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

// Common Pages
import AboutPage from './pages/common/AboutPage.jsx';
import HowItWorksPage from './pages/common/HowItWorksPage.jsx';
import HelpPage from './pages/common/HelpPage.jsx';
import ContactPage from './pages/common/ContactPage.jsx';
import PrivacyPage from './pages/common/PrivacyPage.jsx';
import TermsPage from './pages/common/TermsPage.jsx';
import UnauthorizedPage from './pages/common/UnauthorizedPage.jsx';
import NotFoundPage from './pages/common/NotFoundPage.jsx';

// Route Guards & Placeholders
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleBasedRoute from './routes/RoleBasedRoute.jsx';
import Person1Placeholder from './pages/integration/Person1Placeholder.jsx';
import Person2Placeholder from './pages/integration/Person2Placeholder.jsx';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* Home Marketplace Entrypoint (Person 1 Boundary) */}
              <Route path="/" element={<Person1Placeholder />} />

              {/* Authentication Routes (My Responsibility) */}
              <Route path="/login" element={<LoginPage initialMode="signin" />} />
              <Route path="/register" element={<LoginPage initialMode="register" />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Common Informational Routes (My Responsibility) */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Security & Error Routes */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* Admin Dashboard Entrypoint (Person 2 Boundary, Protected by ADMIN role) */}
              <Route
                path="/admin/*"
                element={
                  <RoleBasedRoute allowedRole="ADMIN">
                    <Person2Placeholder />
                  </RoleBasedRoute>
                }
              />

              {/* 404 Catch-All */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
