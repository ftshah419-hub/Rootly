import mongoose from 'mongoose';

const { Schema } = mongoose;

const BarterMatchSchema = new Schema(
  {
    userA: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    userB: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    preferenceA: {
      type: Schema.Types.ObjectId,
      ref: 'BarterPreference'
    },
    preferenceB: {
      type: Schema.Types.ObjectId,
      ref: 'BarterPreference'
    },
    productA: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    productB: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    matchReasons: [
      {
        type: String
      }
    ],
    distanceKm: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: [
        'SUGGESTED',
        'USER_A_ACCEPTED',
        'USER_B_ACCEPTED',
        'MUTUAL_ACCEPTED',
        'DECLINED',
        'CONVERTED_TO_EXCHANGE'
      ],
      default: 'SUGGESTED',
      index: true
    },
    convertedExchangeRequestId: {
      type: Schema.Types.ObjectId,
      ref: 'ExchangeRequest'
    }
  },
  {
    timestamps: true,
    collection: 'barter_matches'
  }
);

BarterMatchSchema.index({ userA: 1, userB: 1, status: 1 });

export const BarterMatch = mongoose.model('BarterMatch', BarterMatchSchema);
export default BarterMatch;
