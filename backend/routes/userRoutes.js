/**
 * USER ROUTES — OWNED BY PERSON 1 (User Website Lead)
 * 
 * Person 1 connects their user-facing routes here:
 * - GET    /api/user/dashboard
 * - GET    /api/user/profile
 * - POST   /api/user/profile
 * - GET    /api/user/products
 * - POST   /api/user/products
 * - GET    /api/user/exchanges
 * - POST   /api/user/exchanges
 * - GET    /api/user/harvests
 * - GET    /api/user/conversations
 * 
 * All routes are mounted under /api/user
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = Router();

// Example protected user routes
router.get('/dashboard', authenticate, userController.getUserDashboard);
router.get('/profile', authenticate, userController.getUserProfile);

export default router;
