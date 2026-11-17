import mongoose from 'mongoose';

const { Schema } = mongoose;

const PasswordResetTokenSchema = new Schema(
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
      index: { expires: '0s' } // TTL index automatically cleans up expired tokens
    },
    usedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: 'password_reset_tokens'
  }
);

export const PasswordResetToken = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
export default PasswordResetToken;
