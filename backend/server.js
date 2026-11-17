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

    // 2. Connect to MongoDB Atlas / Database
    await connectDB();

    // 3. Create HTTP & WebSocket Server
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

    // 4. Initialize real-time chat socket handlers
    setupChatSocket(io);

    // 5. Start listening
    const PORT = ENV.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`\n=============================================================`);
      console.log(`  🌱 ROOTLY HOMEGROWN PRODUCE EXCHANGE — BACKEND CORE`);
      console.log(`  Running on: http://localhost:${PORT}`);
      console.log(`  Environment: ${ENV.NODE_ENV}`);
      console.log(`  Client Origin: ${ENV.CLIENT_URL}`);
      console.log(`  API Base: http://localhost:${PORT}/api`);
      console.log(`=============================================================\n`);
    });

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
