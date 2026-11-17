import mongoose from 'mongoose';

const { Schema } = mongoose;

const SystemSettingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      enum: ['GENERAL', 'SECURITY', 'AI', 'NOTIFICATIONS', 'FEES_AND_LIMITS'],
      default: 'GENERAL'
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    collection: 'system_settings'
  }
);

export const SystemSetting = mongoose.model('SystemSetting', SystemSettingSchema);
export default SystemSetting;
