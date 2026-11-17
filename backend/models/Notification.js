import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'EXCHANGE_REQUEST',
        'EXCHANGE_ACCEPTED',
        'EXCHANGE_REJECTED',
        'EXCHANGE_COMPLETED',
        'BARTER_MATCH',
        'HARVEST_ALERT',
        'PREBOOKING_CONFIRMED',
        'NEW_MESSAGE',
        'REVIEW_RECEIVED',
        'SYSTEM'
      ],
      required: true
    },
    link: {
      type: String,
      default: ''
    },
    data: {
      type: Schema.Types.Mixed,
      default: {}
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true,
    collection: 'notifications'
  }
);

NotificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
