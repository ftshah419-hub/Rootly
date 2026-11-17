import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app.js';
import { connectDB, disconnectDB } from './config/db.js';
import { ENV, validateEnv } from './config/env.js';
import { setupChatSocket } from './sockets/chatSocket.js';

const startServer = async () => {
  try {
    // 1. Validate environment
    validateEnv();

    // 2. Create HTTP & WebSocket Server
    const server = http.createServer(app);
    const io = new SocketIOServer(server, {
      cors: {
        origin: (origin, callback) => {
          if (
            !origin ||
            /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
            /\.vercel\.app$/.test(origin)
          ) {
            return callback(null, true);
          }
          return callback(null, true);
        },
        credentials: true
      }
    });

    // 3. Initialize real-time chat socket handlers
    setupChatSocket(io);

    // 4. Start listening on all interfaces
    const PORT = ENV.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`\n=============================================================`);
      console.log(`  🌱 ROOTLY HOMEGROWN PRODUCE EXCHANGE — BACKEND CORE`);
      console.log(`  Running on: http://0.0.0.0:${PORT}`);
      console.log(`  Environment: ${ENV.NODE_ENV}`);
      console.log(`  Client Origin: ${ENV.CLIENT_URL}`);
      console.log(`  API Base: http://0.0.0.0:${PORT}/api`);
      console.log(`=============================================================\n`);
    });

    // 5. Connect to MongoDB Atlas / Database with background retry
    const attemptDBConnection = async () => {
      try {
        await connectDB();
      } catch (error) {
        console.error(`[MongoDB Atlas] Connection pending: ${error.message}`);
        console.info(`[MongoDB Atlas TIP] Ensure 0.0.0.0/0 (Allow from Anywhere) is whitelisted in MongoDB Atlas Network Access.`);
        setTimeout(attemptDBConnection, 5000);
      }
    };
    attemptDBConnection();

    // Graceful shutdown
    const handleShutdown = async (signal) => {
      console.log(`\nReceived ${signal}. Gracefully shutting down Rootly backend...`);
      server.close(async () => {
        await disconnectDB();
        console.log('HTTP & WebSocket server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('Fatal server boot failure:', error.message);
    process.exit(1);
  }
};

startServer();
