import mongoose from 'mongoose';

const { Schema } = mongoose;

const VerificationRecordSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    verificationType: {
      type: String,
      enum: ['HOME_GARDEN', 'COMMUNITY_VOUCH', 'ADMIN_INSPECTION'],
      required: true
    },
    evidence: {
      gardenPhotos: [{ type: String }],
      description: { type: String, default: '' },
      vouchedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    },
    status: {
      type: String,
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
      default: 'SUBMITTED',
      index: true
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewNotes: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'verification_records'
  }
);

VerificationRecordSchema.index({ userId: 1, status: 1 });

export const VerificationRecord = mongoose.model('VerificationRecord', VerificationRecordSchema);
export default VerificationRecord;
