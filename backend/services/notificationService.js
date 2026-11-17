import { Notification } from '../models/Notification.js';

export const createNotification = async ({
  recipientId,
  senderId,
  title,
  message,
  type,
  link = '',
  data = {}
}) => {
  try {
    const notification = await Notification.create({
      recipientId,
      senderId,
      title,
      message,
      type,
      link,
      data
    });
    return notification;
  } catch (error) {
    console.error('[Notification Service Error]', error.message);
    return null;
  }
};

export const getUserNotifications = async (userId, limit = 30) => {
  return await Notification.find({ recipientId: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'name profile.avatar');
};

export const markNotificationRead = async (notificationId, userId) => {
  return await Notification.findOneAndUpdate(
    { _id: notificationId, recipientId: userId },
    { $set: { isRead: true } },
    { new: true }
  );
};
