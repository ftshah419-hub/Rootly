import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import adminRoutes from './adminRoutes.js';
import { sendResponse } from '../utils/responseHandler.js';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  return sendResponse(res, 200, 'Rootly API is healthy and operational', {
    status: 'ONLINE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount modular sub-routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
