/**
 * USER CONTROLLER — OWNED BY PERSON 1 (User Website Lead)
 * 
 * Provides production route handlers for Person 1's user-facing marketplace features:
 * - Product discovery & listings
 * - Exchange requests & barter workflows
 * - Harvest announcements & prebooking
 * - User profile & garden management
 * - Sustainability metrics
 */

import { asyncHandler } from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import * as productService from '../services/productService.js';
import * as exchangeService from '../services/exchangeService.js';
import * as harvestService from '../services/harvestService.js';
import * as prebookingService from '../services/prebookingService.js';
import * as reviewService from '../services/reviewService.js';
import * as sustainabilityService from '../services/sustainabilityService.js';
import * as notificationService from '../services/notificationService.js';
import * as barterService from '../services/barterService.js';
import { Notification } from '../models/Notification.js';

// ==========================================
// 1. PRODUCTS & DISCOVERY
// ==========================================

export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    exchangeType,
    type,
    longitude,
    latitude,
    lng,
    lat,
    radiusKm,
    radius,
    status = 'AVAILABLE',
    search,
    q,
    page = 1,
    limit = 20
  } = req.query;

  const validLon = longitude !== undefined ? longitude : lng;
  const validLat = latitude !== undefined ? latitude : lat;
  const validRadius = radiusKm !== undefined ? radiusKm : (radius ? radius / 1000 : 5);
  const validType = exchangeType || type;
  const validSearch = search || q;

  const result = await productService.getProducts({
    category,
    exchangeType: validType,
    longitude: validLon,
    latitude: validLat,
    radiusKm: validRadius,
    status: status || undefined,
    search: validSearch,
    page: Number(page),
    limit: Number(limit)
  });

  return sendResponse(res, 200, 'Products retrieved successfully', result);
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return sendResponse(res, 200, 'Product details retrieved', { product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const productData = req.body;

  // Handle uploaded images if provided by multer
  if (req.files && req.files.length > 0) {
    productData.images = req.files.map(f => f.path || f.url || f.filename);
  }

  // Parse location if stringified
  if (typeof productData.location === 'string') {
    try {
      productData.location = JSON.parse(productData.location);
    } catch (e) {
      // ignore
    }
  }

  const product = await productService.createProduct(sellerId, productData);
  return sendResponse(res, 201, 'Product listing created successfully', { product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const product = await productService.updateProduct(req.params.id, sellerId, req.body);
  return sendResponse(res, 200, 'Product updated successfully', { product });
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const status = req.body.status || req.body.availabilityStatus || 'AVAILABLE';
  const product = await productService.updateProductStatus(req.params.id, sellerId, status);
  return sendResponse(res, 200, 'Product status updated', { product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  await productService.deleteProduct(req.params.id, sellerId);
  return sendResponse(res, 200, 'Product listing removed successfully');
});

export const getMyProducts = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const products = await productService.getProductsBySeller(sellerId, req.query);
  return sendResponse(res, 200, 'User listings retrieved', { products });
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  return sendResponse(res, 200, 'Categories retrieved', { categories });
});

// ==========================================
// 2. EXCHANGE & BARTER WORKFLOWS
// ==========================================

export const getExchangeRequests = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { role, status, page = 1, limit = 20 } = req.query;

  const result = await exchangeService.getExchangeRequests({
    userId,
    role,
    status,
    page: Number(page),
    limit: Number(limit)
  });

  return sendResponse(res, 200, 'Exchange requests retrieved', result);
});

export const createExchangeRequest = asyncHandler(async (req, res) => {
  const requesterId = req.user._id;
  const { productId, type, requestType, quantity, quantityRequested, notes, message, offeredProductId, offeredItems } = req.body;

  const exchange = await exchangeService.createExchangeRequest({
    requesterId,
    productId,
    requestType: type || requestType || 'BUY',
    quantityRequested: Number(quantity || quantityRequested || 1),
    offeredItems: offeredItems || (offeredProductId ? [{ productId: offeredProductId }] : []),
    message: notes || message || ''
  });

  return sendResponse(res, 201, 'Exchange request placed successfully', { exchange });
});

export const updateExchangeStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { status, reason } = req.body;

  const exchange = await exchangeService.updateExchangeRequestStatus(
    req.params.id,
    userId,
    status,
    reason
  );

  return sendResponse(res, 200, `Exchange status updated to ${status}`, { exchange });
});

// ==========================================
// 3. HARVEST RADAR & PREBOOKING
// ==========================================

export const getUpcomingHarvests = asyncHandler(async (req, res) => {
  const { days = 30, limit = 20, categoryId } = req.query;
  const harvests = await harvestService.getUpcomingHarvests({
    maxDays: Number(days),
    limit: Number(limit),
    categoryId
  });
  return sendResponse(res, 200, 'Upcoming harvests retrieved', { harvests });
});

export const createHarvest = asyncHandler(async (req, res) => {
  const growerId = req.user._id;
  const harvest = await harvestService.createHarvestAnnouncement(growerId, req.body);
  return sendResponse(res, 201, 'Upcoming crop harvest logged', { harvest });
});

export const getMyHarvests = asyncHandler(async (req, res) => {
  const growerId = req.user._id;
  const harvests = await harvestService.getUpcomingHarvests({ growerId, maxDays: 365, limit: 50 });
  return sendResponse(res, 200, 'My harvests retrieved', { harvests });
});

export const getPrebookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const prebookings = await prebookingService.getUserPrebookings(userId);
  return sendResponse(res, 200, 'User prebookings retrieved', { prebookings });
});

export const createPrebooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const prebooking = await prebookingService.createPrebooking(userId, req.body);
  return sendResponse(res, 201, 'Harvest pre-booking confirmed', { prebooking });
});

export const cancelPrebooking = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await prebookingService.cancelPrebooking(req.params.id, userId);
  return sendResponse(res, 200, 'Pre-booking reservation cancelled');
});

// ==========================================
// 4. USER PROFILE & DASHBOARD
// ==========================================

export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [productsCount, inboundPending, activeBarters, completedCount, impact] = await Promise.all([
    productService.getProductsBySeller(userId, {}).then(r => r.length).catch(() => 0),
    exchangeService.getExchangeRequests({ userId, role: 'seller', status: 'PENDING' }).then(r => r.total || 0).catch(() => 0),
    exchangeService.getExchangeRequests({ userId, status: 'ACCEPTED' }).then(r => r.total || 0).catch(() => 0),
    exchangeService.getExchangeRequests({ userId, status: 'COMPLETED' }).then(r => r.total || 0).catch(() => 0),
    sustainabilityService.getUserSustainability(userId).catch(() => ({}))
  ]);

  return sendResponse(res, 200, 'User dashboard metrics retrieved', {
    metrics: {
      activeListingsCount: productsCount,
      pendingRequestsCount: inboundPending,
      activeBartersCount: activeBarters,
      completedExchangesCount: completedCount
    },
    impact
  });
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return sendResponse(res, 200, 'User profile retrieved', { user });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, phone, gardenName, bio, location, porchBoxEnabled } = req.body;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');

  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (bio) user.profile = { ...user.profile, bio };
  if (gardenName) user.profile = { ...user.profile, gardenName };
  if (location) user.location = location;
  if (porchBoxEnabled !== undefined) user.profile = { ...user.profile, porchBoxEnabled };

  await user.save();
  return sendResponse(res, 200, 'Profile updated successfully', { user: user.toSafeObject() });
});

export const getSustainabilityImpact = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const impact = await sustainabilityService.getUserSustainability(userId);
  return sendResponse(res, 200, 'Sustainability impact retrieved', { impact });
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const userId = req.params.userId || req.user._id;
  const reviews = await reviewService.getUserReviews(userId);
  return sendResponse(res, 200, 'Reviews retrieved', { reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const reviewerId = req.user._id;
  const review = await reviewService.createReview(reviewerId, req.body);
  return sendResponse(res, 201, 'Review published', { review });
});

// ==========================================
// 5. NOTIFICATIONS & BARTER PREFERENCES
// ==========================================

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifications = await notificationService.getUserNotifications(userId);
  return sendResponse(res, 200, 'Notifications retrieved', { notifications });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notification = await notificationService.markNotificationRead(req.params.id, userId);
  return sendResponse(res, 200, 'Notification marked as read', { notification });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Notification.updateMany({ recipientId: userId }, { $set: { isRead: true } });
  return sendResponse(res, 200, 'All notifications marked as read');
});

export const getBarterMatches = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const matches = await barterService.findDirectBarterMatches(userId);
  return sendResponse(res, 200, 'Direct barter matches retrieved', { matches });
});

export const getBarterPreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const preferences = await barterService.getBarterPreference(userId);
  return sendResponse(res, 200, 'Barter preferences retrieved', { preferences });
});

export const saveBarterPreferences = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const preference = await barterService.upsertBarterPreference(userId, req.body);
  return sendResponse(res, 200, 'Barter preferences saved', { preference });
});

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
  getMyProducts,
  getCategories,
  getExchangeRequests,
  createExchangeRequest,
  updateExchangeStatus,
  getUpcomingHarvests,
  createHarvest,
  getMyHarvests,
  getPrebookings,
  createPrebooking,
  cancelPrebooking,
  getUserDashboard,
  getUserProfile,
  updateUserProfile,
  getSustainabilityImpact,
  getUserReviews,
  createReview,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getBarterMatches,
  getBarterPreferences,
  saveBarterPreferences
};
