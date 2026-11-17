/**
 * ADMIN ROUTES — OWNED BY PERSON 2 (Admin Dashboard Lead)
 * 
 * Person 2 connects their admin endpoints here:
 * - GET    /api/admin/overview
 * - GET    /api/admin/users
 * - PATCH  /api/admin/users/:id/status
 * - GET    /api/admin/products
 * - DELETE /api/admin/products/:id
 * - GET    /api/admin/reports
 * - PATCH  /api/admin/reports/:id/resolve
 * - GET    /api/admin/verifications
 * - PATCH  /api/admin/verifications/:id
 * - GET    /api/admin/audit-logs
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

router.get('/overview', adminController.getAdminOverview);
router.get('/reports', adminController.getModerationReports);

export default router;
