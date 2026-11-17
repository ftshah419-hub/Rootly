/**
 * ADMIN ROUTES — OWNED BY PERSON 2 (Admin Dashboard Lead)
 * 
 * Person 2 connects their admin endpoints here:
 * - GET    /api/admin/overview
 * - GET    /api/admin/users
 * - GET    /api/admin/users/:id
 * - PATCH  /api/admin/users/:id/status
 * - GET    /api/admin/products
 * - GET    /api/admin/products/:id
 * - PATCH  /api/admin/products/:id/status
 * - DELETE /api/admin/products/:id
 * - GET    /api/admin/exchanges
 * - GET    /api/admin/exchanges/:id
 * - GET    /api/admin/reports
 * - PATCH  /api/admin/reports/:id
 * - GET    /api/admin/verifications
 * - PATCH  /api/admin/verifications/:id
 * - GET    /api/admin/reviews
 * - DELETE /api/admin/reviews/:id
 * - GET    /api/admin/sustainability
 * - GET    /api/admin/ai-usage
 * - GET    /api/admin/notifications
 * - PATCH  /api/admin/notifications/:id/read
 * - PATCH  /api/admin/notifications/mark-all-read
 * - GET    /api/admin/audit-logs
 * - GET    /api/admin/settings
 * - PUT    /api/admin/settings/:key
 * - GET    /api/admin/harvests
 * 
 * All routes are mounted under /api/admin and protected with authenticate + requireAdmin
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import * as adminController from '../controllers/adminController.js';

const router = Router();

// Apply authentication and admin verification middleware to all admin routes
router.use(authenticate, requireAdmin);

// 1. Overview & Telemetry
router.get('/overview', adminController.getAdminOverview);

// 2. User & Grower Management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id/status', adminController.updateUserStatus);

// 3. Products & Harvest Listings
router.get('/products', adminController.getProducts);
router.get('/products/:id', adminController.getProductDetails);
router.patch('/products/:id/status', adminController.updateProductStatus);
router.delete('/products/:id', adminController.deleteProduct);

// 4. Exchange & Barter Monitoring
router.get('/exchanges', adminController.getExchanges);
router.get('/exchanges/:id', adminController.getExchangeDetails);

// 5. Moderation & Reports Desk
router.get('/reports', adminController.getReports);
router.patch('/reports/:id', adminController.resolveReport);

// 6. Garden Verification Queue
router.get('/verifications', adminController.getVerifications);
router.patch('/verifications/:id', adminController.reviewVerification);

// 7. Reviews Management
router.get('/reviews', adminController.getReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// 8. Sustainability Overview
router.get('/sustainability', adminController.getSustainabilityOverview);

// 9. AI Usage Monitoring
router.get('/ai-usage', adminController.getAIUsageMonitoring);

// 10. Notifications Desk
router.get('/notifications', adminController.getNotifications);
router.patch('/notifications/:id/read', adminController.markNotificationRead);
router.patch('/notifications/mark-all-read', adminController.markAllNotificationsRead);

// 11. System Audit Logs
router.get('/audit-logs', adminController.getAuditLogs);

// 12. System Settings
router.get('/settings', adminController.getSystemSettings);
router.put('/settings/:key', adminController.updateSystemSetting);

// 13. Harvests & Yield Planner
router.get('/harvests', adminController.getHarvests);

export default router;
