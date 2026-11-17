import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout.jsx';

import AdminOverviewPage from './AdminOverviewPage.jsx';
import UserManagementPage from './UserManagementPage.jsx';
import ProductManagementPage from './ProductManagementPage.jsx';
import ExchangeMonitoringPage from './ExchangeMonitoringPage.jsx';
import ReportsManagementPage from './ReportsManagementPage.jsx';
import VerificationManagementPage from './VerificationManagementPage.jsx';
import ReviewsManagementPage from './ReviewsManagementPage.jsx';
import SustainabilityPage from './SustainabilityPage.jsx';
import AIUsageMonitoringPage from './AIUsageMonitoringPage.jsx';
import NotificationsPage from './NotificationsPage.jsx';
import AuditLogsPage from './AuditLogsPage.jsx';
import SystemSettingsPage from './SystemSettingsPage.jsx';
import HarvestOversightPage from './HarvestOversightPage.jsx';

export const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminOverviewPage />} />
        <Route path="overview" element={<AdminOverviewPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="exchanges" element={<ExchangeMonitoringPage />} />
        <Route path="harvests" element={<HarvestOversightPage />} />
        <Route path="reports" element={<ReportsManagementPage />} />
        <Route path="verifications" element={<VerificationManagementPage />} />
        <Route path="reviews" element={<ReviewsManagementPage />} />
        <Route path="sustainability" element={<SustainabilityPage />} />
        <Route path="ai-usage" element={<AIUsageMonitoringPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SystemSettingsPage />} />
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes;
