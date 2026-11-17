import mongoose from 'mongoose';

const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    reportedUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    reportedProductId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      index: true
    },
    reason: {
      type: String,
      enum: [
        'COMMERCIAL_RESELLER',
        'FALSE_ADVERTISING',
        'NOT_HOMEGROWN',
        'INAPPROPRIATE_BEHAVIOR',
        'SPAM',
        'SAFETY_CONCERN',
        'OTHER'
      ],
      required: true
    },
    details: {
      type: String,
      required: true,
      maxlength: 1500
    },
    evidenceImages: [
      {
        type: String
      }
    ],
    status: {
      type: String,
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
      index: true
    },
    resolutionNotes: {
      type: String,
      default: ''
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: 'reports'
  }
);

ReportSchema.index({ status: 1, createdAt: -1 });

export const Report = mongoose.model('Report', ReportSchema);
export default Report;
