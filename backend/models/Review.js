import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer ID is required'],
      index: true
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Target User ID is required'],
      index: true
    },
    exchangeRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'ExchangeRequest',
      required: [true, 'Exchange Request ID is required'],
      index: true
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      default: ''
    },
    produceQualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    punctualityRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  {
    timestamps: true,
    collection: 'reviews'
  }
);

// Enforce unique review per exchange request by the same reviewer
ReviewSchema.index({ reviewerId: 1, exchangeRequestId: 1 }, { unique: true });
ReviewSchema.index({ targetUserId: 1, createdAt: -1 });

export const Review = mongoose.model('Review', ReviewSchema);
export default Review;
