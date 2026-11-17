import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import {
  authRateLimiter,
  passwordResetRateLimiter
} from '../middleware/rateLimitMiddleware.js';
import {
  validateRegistration,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} from '../validators/authValidators.js';

const router = Router();

// Registration
router.post(
  '/register',
  authRateLimiter,
  validate(validateRegistration),
  authController.register
);

// Login
router.post(
  '/login',
  authRateLimiter,
  validate(validateLogin),
  authController.login
);

// Token Refresh
router.post('/refresh', authController.refresh);

// Logout
router.post('/logout', authController.logout);

// Forgot Password
router.post(
  '/forgot-password',
  passwordResetRateLimiter,
  validate(validateForgotPassword),
  authController.forgotPassword
);

// Reset Password
router.post(
  '/reset-password',
  passwordResetRateLimiter,
  validate(validateResetPassword),
  authController.resetPassword
);

// Current User Profile
router.get('/me', authenticate, authController.getMe);

export default router;
