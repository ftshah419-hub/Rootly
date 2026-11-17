import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ToastProvider } from './components/common/Toast.jsx';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleBasedRoute from './routes/RoleBasedRoute.jsx';

// Person 1: User Website Pages
import {
  HomePage,
  ExplorePage,
  MapDiscoveryPage,
  ProductDetailPage,
  CreateListingPage,
  EditListingPage,
  BuySellWorkspacePage,
  BarterExchangePage,
  HarvestPlannerPage,
  PrebookingPage,
  UserDashboardPage,
  MessagesPage,
  NotificationsPage,
  ProfilePage,
  HarvestAIStudioPage
} from './pages/user';

// Auth Pages (Person 3)
import LoginPage from './pages/auth/LoginPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

// Common Pages (Person 3)
import AboutPage from './pages/common/AboutPage.jsx';
import HowItWorksPage from './pages/common/HowItWorksPage.jsx';
import HelpPage from './pages/common/HelpPage.jsx';
import ContactPage from './pages/common/ContactPage.jsx';
import PrivacyPage from './pages/common/PrivacyPage.jsx';
import TermsPage from './pages/common/TermsPage.jsx';
import UnauthorizedPage from './pages/common/UnauthorizedPage.jsx';
import NotFoundPage from './pages/common/NotFoundPage.jsx';

// Person 2: Admin Boundary
import Person2Placeholder from './pages/integration/Person2Placeholder.jsx';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              {/* ======================================================== */}
              {/* 1. PERSON 1: PUBLIC USER MARKETPLACE & DISCOVERY         */}
              {/* ======================================================== */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/map" element={<MapDiscoveryPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/ai-studio" element={<HarvestAIStudioPage />} />
              <Route path="/harvest-ai" element={<HarvestAIStudioPage />} />
              <Route path="/harvest" element={<HarvestPlannerPage />} />
              <Route path="/harvest-planner" element={<HarvestPlannerPage />} />

              {/* ======================================================== */}
              {/* 2. PERSON 1: PROTECTED USER WORKFLOWS & WORKSPACES       */}
              {/* ======================================================== */}
              <Route
                path="/create-listing"
                element={
                  <ProtectedRoute>
                    <CreateListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-listing/:id"
                element={
                  <ProtectedRoute>
                    <EditListingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buy-sell"
                element={
                  <ProtectedRoute>
                    <BuySellWorkspacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/workspace"
                element={
                  <ProtectedRoute>
                    <BuySellWorkspacePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/barter"
                element={
                  <ProtectedRoute>
                    <BarterExchangePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/prebooking"
                element={
                  <ProtectedRoute>
                    <PrebookingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
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

              {/* ======================================================== */}
              {/* 3. AUTHENTICATION ROUTES (PERSON 3)                      */}
              {/* ======================================================== */}
              <Route path="/login" element={<LoginPage initialMode="signin" />} />
              <Route path="/register" element={<LoginPage initialMode="register" />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* ======================================================== */}
              {/* 4. COMMON INFORMATIONAL ROUTES (PERSON 3)                */}
              {/* ======================================================== */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />

              {/* ======================================================== */}
              {/* 5. ADMIN DASHBOARD (PERSON 2 BOUNDARY)                   */}
              {/* ======================================================== */}
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
