import { apiClient } from '../../api/apiClient.js';

export const adminService = {
  // Overview / Analytics
  getOverview: async () => {
    const res = await apiClient.get('/admin/overview');
    return res.data || res;
  },

  // Users Management
  getUsers: async (params = {}) => {
    const res = await apiClient.get('/admin/users', { params });
    return res.data || res;
  },

  getUserById: async (id) => {
    const res = await apiClient.get(`/admin/users/${id}`);
    return res.data || res;
  },

  updateUserStatus: async (id, { status, reason }) => {
    const res = await apiClient.patch(`/admin/users/${id}/status`, { status, reason });
    return res.data || res;
  },

  // Products Management
  getProducts: async (params = {}) => {
    const res = await apiClient.get('/admin/products', { params });
    return res.data || res;
  },

  getProductById: async (id) => {
    const res = await apiClient.get(`/admin/products/${id}`);
    return res.data || res;
  },

  updateProductStatus: async (id, { availabilityStatus, reason }) => {
    const res = await apiClient.patch(`/admin/products/${id}/status`, { availabilityStatus, reason });
    return res.data || res;
  },

  deleteProduct: async (id, { reason } = {}) => {
    const res = await apiClient.delete(`/admin/products/${id}`, { data: { reason } });
    return res.data || res;
  },

  // Exchange Monitoring
  getExchanges: async (params = {}) => {
    const res = await apiClient.get('/admin/exchanges', { params });
    return res.data || res;
  },

  getExchangeById: async (id) => {
    const res = await apiClient.get(`/admin/exchanges/${id}`);
    return res.data || res;
  },

  // Reports Desk
  getReports: async (params = {}) => {
    const res = await apiClient.get('/admin/reports', { params });
    return res.data || res;
  },

  resolveReport: async (id, { status, resolutionNotes }) => {
    const res = await apiClient.patch(`/admin/reports/${id}`, { status, resolutionNotes });
    return res.data || res;
  },

  // Garden Verification Queue
  getVerifications: async (params = {}) => {
    const res = await apiClient.get('/admin/verifications', { params });
    return res.data || res;
  },

  reviewVerification: async (id, { status, reviewNotes }) => {
    const res = await apiClient.patch(`/admin/verifications/${id}`, { status, reviewNotes });
    return res.data || res;
  },

  // Reviews Management
  getReviews: async (params = {}) => {
    const res = await apiClient.get('/admin/reviews', { params });
    return res.data || res;
  },

  deleteReview: async (id, { reason } = {}) => {
    const res = await apiClient.delete(`/admin/reviews/${id}`, { data: { reason } });
    return res.data || res;
  },

  // Sustainability Overview
  getSustainabilityMetrics: async () => {
    const res = await apiClient.get('/admin/sustainability');
    return res.data || res;
  },

  // AI Usage Monitoring
  getAIUsageLogs: async (params = {}) => {
    const res = await apiClient.get('/admin/ai-usage', { params });
    return res.data || res;
  },

  // Notifications Desk
  getNotifications: async (params = {}) => {
    const res = await apiClient.get('/admin/notifications', { params });
    return res.data || res;
  },

  markNotificationRead: async (id) => {
    const res = await apiClient.patch(`/admin/notifications/${id}/read`);
    return res.data || res;
  },

  markAllNotificationsRead: async () => {
    const res = await apiClient.patch('/admin/notifications/mark-all-read');
    return res.data || res;
  },

  // Audit Logs
  getAuditLogs: async (params = {}) => {
    const res = await apiClient.get('/admin/audit-logs', { params });
    return res.data || res;
  },

  // System Settings
  getSystemSettings: async () => {
    const res = await apiClient.get('/admin/settings');
    return res.data || res;
  },

  updateSystemSetting: async (key, payload) => {
    const res = await apiClient.put(`/admin/settings/${key}`, payload);
    return res.data || res;
  },

  // Harvests & Yield Planner
  getHarvests: async (params = {}) => {
    const res = await apiClient.get('/admin/harvests', { params });
    return res.data || res;
  }
};

export default adminService;
