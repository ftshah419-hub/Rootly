import mongoose from 'mongoose';

const { Schema } = mongoose;

const AdminActionSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    actionType: {
      type: String,
      enum: [
        'SUSPEND_USER',
        'ACTIVATE_USER',
        'BLOCK_USER',
        'REMOVE_PRODUCT',
        'RESOLVE_REPORT',
        'UPDATE_SETTINGS',
        'MANUAL_VERIFY'
      ],
      required: true
    },
    targetType: {
      type: String,
      enum: ['USER', 'PRODUCT', 'REPORT', 'SYSTEM'],
      required: true
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    collection: 'admin_actions'
  }
);

AdminActionSchema.index({ adminId: 1, createdAt: -1 });
AdminActionSchema.index({ targetType: 1, targetId: 1 });

export const AdminAction = mongoose.model('AdminAction', AdminActionSchema);
export default AdminAction;
