import mongoose from 'mongoose';

const { Schema } = mongoose;

const AIUsageLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    endpoint: {
      type: String,
      default: ''
    },
    model: {
      type: String,
      default: 'gemini-1.5-flash'
    },
    requestStatus: {
      type: String,
      enum: ['SUCCESS', 'RATE_LIMITED', 'ERROR', 'FALLBACK'],
      default: 'SUCCESS'
    },
    latencyMs: {
      type: Number,
      default: 0
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'ai_usage_logs'
  }
);

AIUsageLogSchema.index({ createdAt: -1 });

export const AIUsageLog = mongoose.model('AIUsageLog', AIUsageLogSchema);
export default AIUsageLog;
