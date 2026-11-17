/**
 * USER CONTROLLER — OWNED BY PERSON 1 (User Website Lead)
 * 
 * This file is an integration placeholder providing route handler stubs
 * for Person 1's user-facing marketplace features:
 * - Product discovery & listings
 * - Exchange requests & barter workflows
 * - Harvest announcements & prebooking
 * - User profile & garden management
 * - Chat conversations & messaging
 * - Reviews & notifications
 * 
 * DO NOT OVERWRITE PERSON 1'S WORK IN THIS FILE.
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';

export const getUserDashboard = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, 'User dashboard endpoint stub (Person 1)', {
    status: 'Ready for Person 1 integration'
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, 'User profile endpoint stub (Person 1)', {
    user: req.user.toSafeObject()
  });
});

export default {
  getUserDashboard,
  getUserProfile
};
