import { Review } from '../models/Review.js';
import { ExchangeRequest } from '../models/ExchangeRequest.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from './notificationService.js';

export const createReview = async ({
  reviewerId,
  exchangeRequestId,
  rating,
  comment,
  produceQualityRating,
  punctualityRating
}) => {
  const exchange = await ExchangeRequest.findById(exchangeRequestId);
  if (!exchange) {
    throw new ApiError(404, 'Exchange request record not found.');
  }

  // Critical rule: Reviews only allowed after COMPLETED exchanges
  if (exchange.status !== 'COMPLETED') {
    throw new ApiError(400, 'Reviews can only be submitted after an exchange has been completed.');
  }

  // Ensure reviewer was part of this exchange
  const isRequester = exchange.requesterId.toString() === reviewerId.toString();
  const isSeller = exchange.sellerId.toString() === reviewerId.toString();

  if (!isRequester && !isSeller) {
    throw new ApiError(403, 'You are not a verified participant in this exchange.');
  }

  const targetUserId = isRequester ? exchange.sellerId : exchange.requesterId;

  // Prevent duplicate review
  const existingReview = await Review.findOne({
    reviewerId,
    exchangeRequestId
  });

  if (existingReview) {
    throw new ApiError(409, 'You have already submitted a review for this exchange.');
  }

  const review = await Review.create({
    reviewerId,
    targetUserId,
    exchangeRequestId,
    rating,
    comment,
    produceQualityRating,
    punctualityRating
  });

  await createNotification({
    recipientId: targetUserId,
    senderId: reviewerId,
    title: 'New Community Review Received',
    message: `A neighbor left you a ${rating}-star review for your completed exchange!`,
    type: 'REVIEW_RECEIVED',
    link: `/reviews`
  });

  return review;
};

export const getUserReviews = async (targetUserId) => {
  const reviews = await Review.find({ targetUserId })
    .populate('reviewerId', 'name profile.avatar profile.gardenName')
    .sort({ createdAt: -1 });

  const count = reviews.length;
  const averageRating =
    count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 5.0;

  return {
    reviews,
    metrics: {
      totalReviews: count,
      averageRating: Math.round(averageRating * 10) / 10
    }
  };
};
