import { sendMessage } from '../services/chatService.js';
import { verifyAccessToken } from '../utils/generateToken.js';

export const setupChatSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication token required'));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return next(new Error('Invalid or expired authentication token'));
    }

    socket.user = decoded;
    next();
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] User connected: ${socket.user.name} (${socket.user._id})`);

    // Join personal notification channel
    socket.join(`user:${socket.user._id}`);

    // Join specific conversation room
    socket.on('join_conversation', ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`[Socket.IO] ${socket.user.name} joined conversation: ${conversationId}`);
    });

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // Send chat message
    socket.on('send_message', async ({ conversationId, content, messageType = 'TEXT' }, callback) => {
      try {
        const msg = await sendMessage({
          conversationId,
          senderId: socket.user._id,
          content,
          messageType
        });

        // Broadcast to everyone in conversation room
        io.to(`conversation:${conversationId}`).emit('new_message', msg);

        if (typeof callback === 'function') {
          callback({ success: true, data: msg });
        }
      } catch (err) {
        if (typeof callback === 'function') {
          callback({ success: false, error: err.message });
        }
      }
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        userId: socket.user._id,
        name: socket.user.name
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        userId: socket.user._id
      });
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] User disconnected: ${socket.user.name}`);
    });
  });
};

export default setupChatSocket;
