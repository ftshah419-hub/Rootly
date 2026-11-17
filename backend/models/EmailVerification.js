import mongoose from 'mongoose';

const { Schema } = mongoose;

const EmailVerificationSchema = new Schema(
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
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '0s' }
    },
    usedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'email_verifications'
  }
);

export const EmailVerification = mongoose.model('EmailVerification', EmailVerificationSchema);
export default EmailVerification;
