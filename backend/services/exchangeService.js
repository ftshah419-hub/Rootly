import { ExchangeRequest } from '../models/ExchangeRequest.js';
import { Product } from '../models/Product.js';
import { ApiError } from '../utils/ApiError.js';
import { recordExchangeSustainability } from './sustainabilityService.js';
import { createNotification } from './notificationService.js';

export const createExchangeRequest = async ({
  requesterId,
  productId,
  requestType,
  quantityRequested,
  offeredItems = [],
  offeredPrice = 0,
  message = ''
}) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, 'Product listing not found.');
  }

  if (product.availabilityStatus !== 'AVAILABLE') {
    throw new ApiError(400, 'This produce is no longer available for exchange.');
  }

  if (product.sellerId.toString() === requesterId.toString()) {
    throw new ApiError(400, 'You cannot request your own produce listing.');
  }

  if (quantityRequested > product.quantity.available) {
    throw new ApiError(400, `Requested quantity exceeds available inventory (${product.quantity.available} ${product.quantity.unit} available).`);
  }

  const exchangeRequest = await ExchangeRequest.create({
    requesterId,
    sellerId: product.sellerId,
    productId,
    requestType,
    quantityRequested,
    offeredItems,
    offeredPrice,
    message,
    status: 'PENDING'
  });

  // Notify seller
  await createNotification({
    recipientId: product.sellerId,
    senderId: requesterId,
    title: 'New Exchange Request',
    message: `You received a new ${requestType} request for ${product.name}.`,
    type: 'EXCHANGE_REQUEST',
    link: `/exchanges/${exchangeRequest._id}`,
    data: { exchangeRequestId: exchangeRequest._id }
  });

  return exchangeRequest;
};

export const updateExchangeStatus = async (exchangeRequestId, userId, newStatus, rejectionReason = '') => {
  const request = await ExchangeRequest.findById(exchangeRequestId).populate('productId');
  if (!request) {
    throw new ApiError(404, 'Exchange request not found.');
  }

  // Only seller or requester can update status
  const isSeller = request.sellerId.toString() === userId.toString();
  const isRequester = request.requesterId.toString() === userId.toString();

  if (!isSeller && !isRequester) {
    throw new ApiError(403, 'You are not authorized to update this exchange request.');
  }

  if (newStatus === 'ACCEPTED') {
    if (!isSeller) throw new ApiError(403, 'Only the seller can accept the request.');
    
    // Check inventory
    const product = await Product.findById(request.productId._id);
    if (!product || product.quantity.available < request.quantityRequested) {
      throw new ApiError(400, 'Insufficient inventory remaining to accept this request.');
    }

    // Deduct inventory safely
    product.quantity.available -= request.quantityRequested;
    if (product.quantity.available <= 0) {
      product.availabilityStatus = 'EXCHANGED';
    } else {
      product.availabilityStatus = 'AVAILABLE';
    }
    await product.save();

    request.status = 'ACCEPTED';
    await request.save();

    await createNotification({
      recipientId: request.requesterId,
      senderId: userId,
      title: 'Exchange Request Accepted!',
      message: `Your request for ${product.name} was accepted. You can now coordinate pickup!`,
      type: 'EXCHANGE_ACCEPTED',
      link: `/exchanges/${request._id}`
    });
  } else if (newStatus === 'REJECTED') {
    if (!isSeller) throw new ApiError(403, 'Only the seller can reject the request.');
    request.status = 'REJECTED';
    request.rejectionReason = rejectionReason;
    await request.save();

    await createNotification({
      recipientId: request.requesterId,
      senderId: userId,
      title: 'Exchange Request Declined',
      message: `Your request for ${request.productId.name} was declined.`,
      type: 'EXCHANGE_REJECTED',
      link: `/exchanges/${request._id}`
    });
  } else if (newStatus === 'COMPLETED') {
    request.status = 'COMPLETED';
    request.completedAt = new Date();
    await request.save();

    // Trigger sustainability impact record
    await recordExchangeSustainability(request);

    await createNotification({
      recipientId: isSeller ? request.requesterId : request.sellerId,
      senderId: userId,
      title: 'Exchange Completed!',
      message: `Exchange for ${request.productId.name} marked completed. Please leave a review!`,
      type: 'EXCHANGE_COMPLETED',
      link: `/reviews/new?exchangeId=${request._id}`
    });
  } else if (newStatus === 'CANCELLED') {
    request.status = 'CANCELLED';
    await request.save();
  }

  return request;
};

export const getExchangeRequests = async ({ userId, role, status, requestType, type, page = 1, limit = 20 } = {}) => {
  const query = {};
  if (userId) {
    if (role === 'seller') {
      query.sellerId = userId;
    } else if (role === 'requester') {
      query.requesterId = userId;
    } else {
      query.$or = [{ sellerId: userId }, { requesterId: userId }];
    }
  }
  if (status) query.status = status;
  const t = requestType || type;
  if (t) query.requestType = t;

  const skip = (page - 1) * limit;
  const requests = await ExchangeRequest.find(query)
    .populate('productId')
    .populate('requesterId', 'name profile.gardenName profile.avatar')
    .populate('sellerId', 'name profile.gardenName profile.avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await ExchangeRequest.countDocuments(query);
  return { requests, total, page, pages: Math.ceil(total / limit) };
};
