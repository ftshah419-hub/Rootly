/**
 * USER ROUTES — OWNED BY PERSON 1 (User Website Lead)
 * 
 * Production REST endpoints for Person 1's user marketplace:
 * Mounted under /api/user
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import * as userController from '../controllers/userController.js';

const router = Router();

// ==========================================
// 1. PRODUCTS & DISCOVERY (PUBLIC + AUTH)
// ==========================================
router.get('/products', userController.getProducts);
router.get('/products/my-listings', authenticate, userController.getMyProducts);
router.get('/my-products', authenticate, userController.getMyProducts);
router.get('/products/:id', userController.getProductById);
router.post('/products', authenticate, userController.createProduct);
router.put('/products/:id', authenticate, userController.updateProduct);
router.patch('/products/:id/status', authenticate, userController.updateProductStatus);
router.delete('/products/:id', authenticate, userController.deleteProduct);
router.get('/categories', userController.getCategories);

// ==========================================
// 2. EXCHANGE & BARTER WORKFLOWS (AUTH)
// ==========================================
router.get('/exchanges', authenticate, userController.getExchangeRequests);
router.post('/exchanges', authenticate, userController.createExchangeRequest);
router.patch('/exchanges/:id/status', authenticate, userController.updateExchangeStatus);

// ==========================================
// 3. HARVEST RADAR & PREBOOKING
// ==========================================
router.get('/harvests/upcoming', userController.getUpcomingHarvests);
router.get('/harvests/my-harvests', authenticate, userController.getMyHarvests);
router.post('/harvests', authenticate, userController.createHarvest);
router.get('/prebookings', authenticate, userController.getPrebookings);
router.post('/prebookings', authenticate, userController.createPrebooking);
router.delete('/prebookings/:id', authenticate, userController.cancelPrebooking);

// ==========================================
// 4. USER PROFILE, DASHBOARD & IMPACT
// ==========================================
router.get('/dashboard', authenticate, userController.getUserDashboard);
router.get('/profile', authenticate, userController.getUserProfile);
router.put('/profile', authenticate, userController.updateUserProfile);
router.get('/sustainability', authenticate, userController.getSustainabilityImpact);
router.get('/reviews/:userId', userController.getUserReviews);
router.post('/reviews', authenticate, userController.createReview);

// ==========================================
// 5. NOTIFICATIONS (AUTH)
// ==========================================
router.get('/notifications', authenticate, userController.getNotifications);
router.patch('/notifications/:id/read', authenticate, userController.markNotificationRead);
router.patch('/notifications/read-all', authenticate, userController.markAllNotificationsRead);

// ==========================================
// 6. BARTER MATCHES & PREFERENCES (AUTH)
// ==========================================
router.get('/barter/matches', authenticate, userController.getBarterMatches);
router.get('/barter/preferences', authenticate, userController.getBarterPreferences);
router.post('/barter/preferences', authenticate, userController.saveBarterPreferences);

export default router;
