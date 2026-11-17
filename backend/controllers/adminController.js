/**
 * ADMIN CONTROLLER — OWNED BY PERSON 2 (Admin Dashboard Lead)
 * 
 * Complete administrative endpoints connected to real MongoDB collections:
 * 1. Overview metrics & aggregations (real counts & 6-month trends)
 * 2. User & Grower management (search, filter, suspend, activate, block)
 * 3. Products & listings oversight (search, filter, disable, remove)
 * 4. Exchange & barter monitoring (requests, trades, disputes)
 * 5. Moderation & reports desk (investigate, resolve, dismiss)
 * 6. Garden verification queue (terrace inspections, vouch reviews, approve/reject)
 * 7. Reviews management (ratings, feedback audits, delete inappropriate reviews)
 * 8. Sustainability footprint (real savings aggregations & methodology)
 * 9. AI usage & Gemini telemetry (feature breakdown, latency, tokens)
 * 10. Admin notifications desk (fetch, mark read, clear)
 * 11. System audit logs (immutable admin trails)
 * 12. System & agronomy settings (CRUD settings & audit records)
 * 13. Harvests & yield oversight
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { ExchangeRequest } from '../models/ExchangeRequest.js';
import { Report } from '../models/Report.js';
import { VerificationRecord } from '../models/VerificationRecord.js';
import { AdminAction } from '../models/AdminAction.js';
import { AuditLog } from '../models/AuditLog.js';
import { Review } from '../models/Review.js';
import { SustainabilityRecord } from '../models/SustainabilityRecord.js';
import { SystemSetting } from '../models/SystemSetting.js';
import { Notification } from '../models/Notification.js';
import { Harvest } from '../models/Harvest.js';
import { AIGeneration } from '../models/AIGeneration.js';
import { AIUsageLog } from '../models/AIUsageLog.js';

// ==========================================
// 1. DASHBOARD OVERVIEW & AGGREGATIONS
// ==========================================
export const getAdminOverview = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    totalProducts,
    availableProducts,
    totalExchanges,
    completedExchanges,
    pendingReports,
    pendingVerifications,
    activeHarvests,
    totalAiGenerations,
    sustainabilityAgg,
    recentReports,
    recentUsers,
    recentActions
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ accountStatus: 'ACTIVE' }),
    User.countDocuments({ accountStatus: { $in: ['SUSPENDED', 'BLOCKED'] } }),
    Product.countDocuments(),
    Product.countDocuments({ availabilityStatus: 'AVAILABLE' }),
    ExchangeRequest.countDocuments(),
    ExchangeRequest.countDocuments({ status: 'COMPLETED' }),
    Report.countDocuments({ status: 'PENDING' }),
    VerificationRecord.countDocuments({ status: 'SUBMITTED' }),
    Harvest.countDocuments({ status: { $in: ['GROWING', 'NEAR_HARVEST'] } }),
    AIGeneration.countDocuments(),
    SustainabilityRecord.aggregate([
      {
        $group: {
          _id: null,
          totalWastePrevented: { $sum: '$foodWastePreventedKg' },
          totalCo2Saved: { $sum: '$co2SavedKg' },
          totalMilesSaved: { $sum: '$foodMilesSavedKm' }
        }
      }
    ]),
    Report.find({ status: 'PENDING' })
      .populate('reporterId', 'name email')
      .populate('reportedUserId', 'name email accountStatus')
      .populate('reportedProductId', 'name availabilityStatus')
      .sort({ createdAt: -1 })
      .limit(5),
    User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .limit(5),
    AdminAction.find()
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  const sustainability = sustainabilityAgg.length > 0
    ? sustainabilityAgg[0]
    : { totalWastePrevented: 0, totalCo2Saved: 0, totalMilesSaved: 0 };

  // Calculate 6-month historical activity aggregations
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const monthlyExchanges = await ExchangeRequest.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        count: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return sendResponse(res, 200, 'Admin overview metrics retrieved', {
    metrics: {
      users: { total: totalUsers, active: activeUsers, blockedOrSuspended: blockedUsers },
      products: { total: totalProducts, available: availableProducts },
      exchanges: { total: totalExchanges, completed: completedExchanges },
      moderation: { pendingReports, pendingVerifications },
      harvests: { active: activeHarvests },
      sustainability: {
        foodWastePreventedKg: Math.round((sustainability.totalWastePrevented || 0) * 10) / 10,
        co2SavedKg: Math.round((sustainability.totalCo2Saved || 0) * 10) / 10,
        foodMilesSavedKm: Math.round((sustainability.totalMilesSaved || 0) * 10) / 10
      },
      aiUsage: { totalQueries: totalAiGenerations }
    },
    recentReports,
    recentUsers,
    recentActions,
    monthlyTrends: monthlyExchanges
  });
});

// ==========================================
// 2. USER MANAGEMENT & GROWERS
// ==========================================
export const getUsers = asyncHandler(async (req, res) => {
  const { search, status, role, page = 1, limit = 15, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.accountStatus = status;
  }
  if (role && role !== 'all') {
    query.role = role;
  }
  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { name: { $regex: s, $options: 'i' } },
      { email: { $regex: s, $options: 'i' } },
      { 'profile.gardenName': { $regex: s, $options: 'i' } },
      { 'location.neighborhood': { $regex: s, $options: 'i' } }
    ];
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;
  const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash')
      .sort(sort)
      .skip(skip)
      .limit(l),
    User.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Users retrieved successfully', {
    users,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select('-passwordHash');
  if (!user) throw new ApiError(404, 'User not found');

  const [products, exchangeCount, verifications, reportsAgainst, adminActions] = await Promise.all([
    Product.find({ sellerId: id }).limit(10),
    ExchangeRequest.countDocuments({ $or: [{ requesterId: id }, { sellerId: id }] }),
    VerificationRecord.find({ userId: id }).sort({ createdAt: -1 }),
    Report.find({ reportedUserId: id }).populate('reporterId', 'name email').sort({ createdAt: -1 }),
    AdminAction.find({ targetType: 'USER', targetId: id }).populate('adminId', 'name email').sort({ createdAt: -1 })
  ]);

  return sendResponse(res, 200, 'User details retrieved', {
    user,
    stats: {
      listingCount: products.length,
      exchangeCount,
      reportCount: reportsAgainst.length
    },
    products,
    verifications,
    reportsAgainst,
    adminActions
  });
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reason } = req.body;

  const validStatuses = ['ACTIVE', 'SUSPENDED', 'BLOCKED', 'DEACTIVATED'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.role === 'ADMIN' && req.user._id.toString() !== id.toString()) {
    throw new ApiError(403, 'Cannot alter status of fellow administrator accounts');
  }

  const oldStatus = user.accountStatus;
  user.accountStatus = status;
  await user.save();

  const actionType = status === 'BLOCKED' ? 'BLOCK_USER' : status === 'SUSPENDED' ? 'SUSPEND_USER' : 'ACTIVATE_USER';

  await AdminAction.create({
    adminId: req.user._id,
    actionType,
    targetType: 'USER',
    targetId: user._id,
    reason: reason || `Status changed from ${oldStatus} to ${status}`
  });

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: `USER_STATUS_CHANGE_${status}`,
    resource: `User/${user._id}`,
    status: 'SUCCESS',
    details: { oldStatus, newStatus: status, reason }
  });

  return sendResponse(res, 200, `User account marked as ${status}`, {
    user: user.toSafeObject()
  });
});

// ==========================================
// 3. PRODUCT MANAGEMENT & MODERATION
// ==========================================
export const getProducts = asyncHandler(async (req, res) => {
  const { search, category, exchangeType, availabilityStatus, page = 1, limit = 15 } = req.query;
  const query = {};

  if (category && category !== 'all') {
    query.categoryId = category;
  }
  if (exchangeType && exchangeType !== 'all') {
    query.exchangeType = exchangeType;
  }
  if (availabilityStatus && availabilityStatus !== 'all') {
    query.availabilityStatus = availabilityStatus;
  }
  if (search && search.trim()) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
      { 'location.neighborhood': { $regex: search.trim(), $options: 'i' } }
    ];
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('sellerId', 'name email profile location accountStatus')
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    Product.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Products retrieved successfully', {
    products,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id)
    .populate('sellerId', 'name email profile location accountStatus')
    .populate('categoryId', 'name slug');
  if (!product) throw new ApiError(404, 'Product listing not found');

  const reports = await Report.find({ reportedProductId: id })
    .populate('reporterId', 'name email')
    .sort({ createdAt: -1 });

  return sendResponse(res, 200, 'Product details retrieved', { product, reports });
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { availabilityStatus, reason } = req.body;

  const validStatuses = ['AVAILABLE', 'RESERVED', 'EXCHANGED', 'OUT_OF_STOCK'];
  if (!validStatuses.includes(availabilityStatus)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  const oldStatus = product.availabilityStatus;
  product.availabilityStatus = availabilityStatus;
  await product.save();

  await AdminAction.create({
    adminId: req.user._id,
    actionType: availabilityStatus === 'OUT_OF_STOCK' ? 'REMOVE_PRODUCT' : 'UPDATE_SETTINGS',
    targetType: 'PRODUCT',
    targetId: product._id,
    reason: reason || `Product status changed from ${oldStatus} to ${availabilityStatus}`
  });

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: `PRODUCT_STATUS_CHANGE_${availabilityStatus}`,
    resource: `Product/${product._id}`,
    status: 'SUCCESS',
    details: { oldStatus, newStatus: availabilityStatus, reason }
  });

  return sendResponse(res, 200, `Product status updated to ${availabilityStatus}`, { product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  // Instead of permanent hard-deletion, safe administrative unlisting
  product.availabilityStatus = 'OUT_OF_STOCK';
  await product.save();

  await AdminAction.create({
    adminId: req.user._id,
    actionType: 'REMOVE_PRODUCT',
    targetType: 'PRODUCT',
    targetId: product._id,
    reason: reason || 'Administratively removed listing for compliance'
  });

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: 'PRODUCT_REMOVAL',
    resource: `Product/${product._id}`,
    status: 'SUCCESS',
    details: { productName: product.name, sellerId: product.sellerId, reason }
  });

  return sendResponse(res, 200, 'Product disabled and removed from active marketplace', { id });
});

// ==========================================
// 4. EXCHANGE & BARTER MONITORING
// ==========================================
export const getExchanges = asyncHandler(async (req, res) => {
  const { search, requestType, status, page = 1, limit = 15 } = req.query;
  const query = {};

  if (requestType && requestType !== 'all') {
    query.requestType = requestType;
  }
  if (status && status !== 'all') {
    query.status = status;
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;

  const [exchanges, total] = await Promise.all([
    ExchangeRequest.find(query)
      .populate('requesterId', 'name email profile location')
      .populate('sellerId', 'name email profile location')
      .populate('productId', 'name pricing quantity availabilityStatus images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    ExchangeRequest.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Exchange records retrieved', {
    exchanges,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export const getExchangeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const exchange = await ExchangeRequest.findById(id)
    .populate('requesterId', 'name email profile location accountStatus')
    .populate('sellerId', 'name email profile location accountStatus')
    .populate('productId');
  if (!exchange) throw new ApiError(404, 'Exchange request not found');

  return sendResponse(res, 200, 'Exchange details retrieved', { exchange });
});

// ==========================================
// 5. REPORTS & MODERATION DESK
// ==========================================
export const getReports = asyncHandler(async (req, res) => {
  const { status, reason, page = 1, limit = 15 } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }
  if (reason && reason !== 'all') {
    query.reason = reason;
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;

  const [reports, total] = await Promise.all([
    Report.find(query)
      .populate('reporterId', 'name email profile')
      .populate('reportedUserId', 'name email profile accountStatus')
      .populate('reportedProductId', 'name pricing availabilityStatus images')
      .populate('resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    Report.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Moderation reports retrieved', {
    reports,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export const resolveReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, resolutionNotes } = req.body;

  const validStatuses = ['INVESTIGATING', 'RESOLVED', 'DISMISSED'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const report = await Report.findById(id);
  if (!report) throw new ApiError(404, 'Report not found');

  report.status = status;
  report.resolutionNotes = resolutionNotes || '';
  report.resolvedBy = req.user._id;
  report.resolvedAt = new Date();
  await report.save();

  await AdminAction.create({
    adminId: req.user._id,
    actionType: 'RESOLVE_REPORT',
    targetType: 'REPORT',
    targetId: report._id,
    reason: resolutionNotes || `Report marked as ${status}`
  });

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: `REPORT_${status}`,
    resource: `Report/${report._id}`,
    status: 'SUCCESS',
    details: { reason: report.reason, resolutionNotes, status }
  });

  return sendResponse(res, 200, `Report marked as ${status}`, { report });
});

// ==========================================
// 6. GARDEN VERIFICATION QUEUE
// ==========================================
export const getVerifications = asyncHandler(async (req, res) => {
  const { status, verificationType, page = 1, limit = 15 } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }
  if (verificationType && verificationType !== 'all') {
    query.verificationType = verificationType;
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;

  const [verifications, total] = await Promise.all([
    VerificationRecord.find(query)
      .populate('userId', 'name email profile location isEmailVerified accountStatus')
      .populate('evidence.vouchedBy', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    VerificationRecord.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Garden verification records retrieved', {
    verifications,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export const reviewVerification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reviewNotes } = req.body;

  const validStatuses = ['UNDER_REVIEW', 'APPROVED', 'REJECTED'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid verification status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const record = await VerificationRecord.findById(id);
  if (!record) throw new ApiError(404, 'Verification record not found');

  record.status = status;
  record.reviewNotes = reviewNotes || '';
  record.reviewedBy = req.user._id;
  if (status === 'APPROVED') {
    record.approvedAt = new Date();
  }
  await record.save();

  await AdminAction.create({
    adminId: req.user._id,
    actionType: 'MANUAL_VERIFY',
    targetType: 'USER',
    targetId: record.userId,
    reason: reviewNotes || `Garden verification ${status.toLowerCase()}`
  });

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: `VERIFICATION_${status}`,
    resource: `VerificationRecord/${record._id}`,
    status: 'SUCCESS',
    details: { userId: record.userId, status, reviewNotes }
  });

  return sendResponse(res, 200, `Verification request marked as ${status}`, { record });
});

// ==========================================
// 7. REVIEWS MANAGEMENT
// ==========================================
export const getReviews = asyncHandler(async (req, res) => {
  const { rating, page = 1, limit = 15 } = req.query;
  const query = {};

  if (rating && rating !== 'all') {
    query.rating = Number(rating);
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;

  const [reviews, total] = await Promise.all([
    Review.find(query)
      .populate('reviewerId', 'name email profile')
      .populate('targetUserId', 'name email profile')
      .populate('exchangeRequestId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    Review.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Reviews retrieved', {
    reviews,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body || {};

  const review = await Review.findById(id);
  if (!review) throw new ApiError(404, 'Review not found');

  await Review.findByIdAndDelete(id);

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: 'DELETE_REVIEW',
    resource: `Review/${id}`,
    status: 'SUCCESS',
    details: { reviewerId: review.reviewerId, targetUserId: review.targetUserId, rating: review.rating, reason }
  });

  return sendResponse(res, 200, 'Review deleted successfully', { id });
});

// ==========================================
// 8. SUSTAINABILITY OVERVIEW
// ==========================================
export const getSustainabilityOverview = asyncHandler(async (req, res) => {
  const [totalRecords, aggregations, topContributors, recentRecords] = await Promise.all([
    SustainabilityRecord.countDocuments(),
    SustainabilityRecord.aggregate([
      {
        $group: {
          _id: null,
          totalWastePrevented: { $sum: '$foodWastePreventedKg' },
          totalCo2Saved: { $sum: '$co2SavedKg' },
          totalMilesSaved: { $sum: '$foodMilesSavedKm' },
          avgWastePerExchange: { $avg: '$foodWastePreventedKg' }
        }
      }
    ]),
    SustainabilityRecord.aggregate([
      {
        $group: {
          _id: '$userId',
          totalWastePrevented: { $sum: '$foodWastePreventedKg' },
          totalCo2Saved: { $sum: '$co2SavedKg' },
          tradesCount: { $sum: 1 }
        }
      },
      { $sort: { totalWastePrevented: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'grower'
        }
      },
      { $unwind: { path: '$grower', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          totalWastePrevented: 1,
          totalCo2Saved: 1,
          tradesCount: 1,
          'grower.name': 1,
          'grower.email': 1,
          'grower.profile.gardenName': 1
        }
      }
    ]),
    SustainabilityRecord.find()
      .populate('userId', 'name email profile')
      .populate('exchangeRequestId')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  const agg = aggregations.length > 0
    ? aggregations[0]
    : { totalWastePrevented: 0, totalCo2Saved: 0, totalMilesSaved: 0, avgWastePerExchange: 0 };

  return sendResponse(res, 200, 'Sustainability metrics retrieved', {
    totals: {
      totalRecords,
      totalWastePreventedKg: Math.round((agg.totalWastePrevented || 0) * 10) / 10,
      totalCo2SavedKg: Math.round((agg.totalCo2Saved || 0) * 10) / 10,
      totalMilesSavedKm: Math.round((agg.totalMilesSaved || 0) * 10) / 10,
      avgWastePerExchangeKg: Math.round((agg.avgWastePerExchange || 0) * 10) / 10
    },
    topContributors,
    recentRecords,
    methodology:
      'Estimates based on average supermarket transport distance (approx. 150km supply chain) versus zero-mile homegrown pickup, with 1.9kg CO2e factor per kg organic waste prevented from landfill. Advisory estimate only, not certified commercial carbon offset.'
  });
});

// ==========================================
// 9. AI USAGE MONITORING
// ==========================================
export const getAIUsageMonitoring = asyncHandler(async (req, res) => {
  const [
    totalGenerations,
    featureBreakdown,
    statusBreakdown,
    recentGenerations,
    recentErrors
  ] = await Promise.all([
    AIGeneration.countDocuments(),
    AIGeneration.aggregate([
      {
        $group: {
          _id: '$feature',
          count: { $sum: 1 },
          totalTokens: { $sum: '$tokensUsed' },
          confirmedCount: {
            $sum: { $cond: ['$isAdvisoryConfirmedByUser', 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]),
    AIUsageLog.aggregate([
      {
        $group: {
          _id: '$requestStatus',
          count: { $sum: 1 },
          avgLatencyMs: { $avg: '$latencyMs' }
        }
      }
    ]),
    AIGeneration.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10),
    AIUsageLog.find({ requestStatus: { $in: ['ERROR', 'RATE_LIMITED'] } })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
  ]);

  return sendResponse(res, 200, 'AI usage logs retrieved', {
    summary: {
      totalGenerations,
      featureBreakdown,
      statusBreakdown
    },
    recentGenerations,
    recentErrors
  });
});

// ==========================================
// 10. NOTIFICATIONS DESK
// ==========================================
export const getNotifications = asyncHandler(async (req, res) => {
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipientId: req.user._id })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 })
      .limit(30),
    Notification.countDocuments({ recipientId: req.user._id, isRead: false })
  ]);

  return sendResponse(res, 200, 'Notifications retrieved', { notifications, unreadCount });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Notification.updateOne({ _id: id, recipientId: req.user._id }, { isRead: true });
  return sendResponse(res, 200, 'Notification marked as read', { id });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipientId: req.user._id, isRead: false }, { isRead: true });
  return sendResponse(res, 200, 'All notifications marked as read');
});

// ==========================================
// 11. AUDIT LOGS
// ==========================================
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { action, actorRole, search, page = 1, limit = 20 } = req.query;
  const query = {};

  if (action && action !== 'all') {
    query.action = action;
  }
  if (actorRole && actorRole !== 'all') {
    query.actorRole = actorRole;
  }
  if (search && search.trim()) {
    query.$or = [
      { action: { $regex: search.trim(), $options: 'i' } },
      { resource: { $regex: search.trim(), $options: 'i' } }
    ];
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (p - 1) * l;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('actorId', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(l),
    AuditLog.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Audit logs retrieved', {
    logs,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

// ==========================================
// 12. SYSTEM SETTINGS
// ==========================================
export const getSystemSettings = asyncHandler(async (req, res) => {
  const settings = await SystemSetting.find().populate('updatedBy', 'name email').sort({ category: 1, key: 1 });
  return sendResponse(res, 200, 'System settings retrieved', { settings });
});

export const updateSystemSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value, description, category } = req.body;

  let setting = await SystemSetting.findOne({ key });
  const oldValue = setting ? setting.value : null;

  if (setting) {
    setting.value = value;
    if (description !== undefined) setting.description = description;
    if (category !== undefined) setting.category = category;
    setting.updatedBy = req.user._id;
    await setting.save();
  } else {
    setting = await SystemSetting.create({
      key,
      value,
      description: description || '',
      category: category || 'GENERAL',
      updatedBy: req.user._id
    });
  }

  await AdminAction.create({
    adminId: req.user._id,
    actionType: 'UPDATE_SETTINGS',
    targetType: 'SYSTEM',
    targetId: setting._id,
    reason: `Setting ${key} modified`
  });

  await AuditLog.create({
    actorId: req.user._id,
    actorRole: 'ADMIN',
    action: `UPDATE_SETTING_${key.toUpperCase()}`,
    resource: `SystemSetting/${key}`,
    status: 'SUCCESS',
    details: { oldValue, newValue: value }
  });

  return sendResponse(res, 200, `Setting ${key} saved successfully`, { setting });
});

// ==========================================
// 13. HARVESTS & YIELD PLANNER OVERSIGHT
// ==========================================
export const getHarvests = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 15 } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(50, Math.max(1, parseInt(limit, 10) || 15));
  const skip = (p - 1) * l;

  const [harvests, total] = await Promise.all([
    Harvest.find(query)
      .populate('growerId', 'name email profile location')
      .populate('categoryId', 'name slug')
      .sort({ expectedHarvestDate: 1 })
      .skip(skip)
      .limit(l),
    Harvest.countDocuments(query)
  ]);

  return sendResponse(res, 200, 'Harvest records retrieved', {
    harvests,
    pagination: {
      total,
      page: p,
      limit: l,
      totalPages: Math.ceil(total / l)
    }
  });
});

export default {
  getAdminOverview,
  getUsers,
  getUserDetails,
  updateUserStatus,
  getProducts,
  getProductDetails,
  updateProductStatus,
  deleteProduct,
  getExchanges,
  getExchangeDetails,
  getReports,
  resolveReport,
  getVerifications,
  reviewVerification,
  getReviews,
  deleteReview,
  getSustainabilityOverview,
  getAIUsageMonitoring,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getAuditLogs,
  getSystemSettings,
  updateSystemSetting,
  getHarvests
};
