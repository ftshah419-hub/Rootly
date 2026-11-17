import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuditLogSchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
    actorRole: {
      type: String,
      default: 'ANONYMOUS'
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    resource: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILURE'],
      default: 'SUCCESS'
    },
    details: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: 'audit_logs'
  }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
export default AuditLog;
