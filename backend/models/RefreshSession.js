import mongoose from 'mongoose';

const { Schema } = mongoose;

const RefreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    tokenHash: {
      type: String,
      required: true,
      index: true
    },
    deviceInfo: {
      type: String,
      default: 'Unknown Device'
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '0s' }
    },
    revokedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'refresh_sessions'
  }
);

RefreshSessionSchema.methods.isActive = function () {
  return !this.revokedAt && this.expiresAt > new Date();
};

export const RefreshSession = mongoose.model('RefreshSession', RefreshSessionSchema);
export default RefreshSession;
