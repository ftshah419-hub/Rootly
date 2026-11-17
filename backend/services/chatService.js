import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { ApiError } from '../utils/ApiError.js';
import { createNotification } from './notificationService.js';

export const getOrCreateConversation = async (user1Id, user2Id, exchangeRequestId = null) => {
  if (user1Id.toString() === user2Id.toString()) {
    throw new ApiError(400, 'Cannot start conversation with yourself.');
  }

  let conversation = await Conversation.findOne({
    participants: { $all: [user1Id, user2Id] }
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [user1Id, user2Id],
      exchangeRequestId,
      unreadCounts: new Map()
    });
  }

  return conversation;
};

export const sendMessage = async ({ conversationId, senderId, content, messageType = 'TEXT' }) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw new ApiError(404, 'Conversation not found.');
  }

  if (!conversation.participants.some((p) => p.toString() === senderId.toString())) {
    throw new ApiError(403, 'You are not a participant in this conversation.');
  }

  const message = await Message.create({
    conversationId,
    senderId,
    content,
    messageType,
    readBy: [senderId]
  });

  // Update conversation last message
  conversation.lastMessage = {
    text: content,
    senderId,
    createdAt: new Date()
  };

  // Increment unread count for other participant(s)
  conversation.participants.forEach((participantId) => {
    if (participantId.toString() !== senderId.toString()) {
      const pKey = participantId.toString();
      const current = conversation.unreadCounts.get(pKey) || 0;
      conversation.unreadCounts.set(pKey, current + 1);

      // Create notification for new message
      createNotification({
        recipientId: participantId,
        senderId,
        title: 'New Message',
        message: content.length > 60 ? `${content.substring(0, 57)}...` : content,
        type: 'NEW_MESSAGE',
        link: `/messages/${conversation._id}`
      });
    }
  });

  await conversation.save();
  return message;
};

export const getConversationMessages = async (conversationId, userId, limit = 50) => {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new ApiError(404, 'Conversation not found.');

  if (!conversation.participants.some((p) => p.toString() === userId.toString())) {
    throw new ApiError(403, 'Unauthorized to view these messages.');
  }

  // Clear unread count for this user
  const userKey = userId.toString();
  if (conversation.unreadCounts.has(userKey)) {
    conversation.unreadCounts.set(userKey, 0);
    await conversation.save();
  }

  return await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(limit)
    .populate('senderId', 'name profile.avatar');
};
