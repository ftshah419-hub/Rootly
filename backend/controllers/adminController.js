/**
 * ADMIN CONTROLLER — OWNED BY PERSON 2 (Admin Dashboard Lead)
 * 
 * This file is an integration placeholder providing route handler stubs
 * for Person 2's admin features:
 * - Admin analytics & overview stats
 * - User moderation (suspend/activate/block)
 * - Product moderation & content compliance
 * - Report management & dispute resolution
 * - Garden verification requests
 * - System settings & audit logs
 * 
 * DO NOT OVERWRITE PERSON 2'S WORK IN THIS FILE.
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';
import * as adminService from '../services/adminService.js';

export const getAdminOverview = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardMetrics();
  return sendResponse(res, 200, 'Admin overview metrics retrieved', stats);
});

export const getModerationReports = asyncHandler(async (req, res) => {
  const reports = await adminService.getReportsList();
  return sendResponse(res, 200, 'Reports retrieved for moderation', { reports });
});

export default {
  getAdminOverview,
  getModerationReports
};
