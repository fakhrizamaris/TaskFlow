import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());

// Health check endpoint for Cloud Run
app.get('/', (req, res) => {
  res.status(200).send('Socket.IO server is running');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Izinkan semua origin (untuk dev), nanti ganti URL produksi
    methods: ['GET', 'POST'],
  },
});

// Track users in each board room
const boardUsers: Record<string, Map<string, { id: string; name: string; image?: string }>> = {};

io.on('connection', (socket) => {
  console.log('User terhubung:', socket.id);

  // 1. Event saat User membuka halaman Board tertentu
  socket.on('join-board', (data: { boardId: string; user: { id: string; name: string; image?: string } }) => {
    const { boardId, user } = data;
    socket.join(boardId);

    // Track user di room
    if (!boardUsers[boardId]) {
      boardUsers[boardId] = new Map();
    }
    boardUsers[boardId].set(socket.id, user);

    // Broadcast daftar user online ke semua di room
    const onlineUsers = Array.from(boardUsers[boardId].values());
    io.to(boardId).emit('users-updated', onlineUsers);

    console.log(`User ${user.name} (${socket.id}) masuk room board: ${boardId}`);
  });

  // 2. Event saat User meninggalkan halaman
  socket.on('leave-board', (boardId: string) => {
    socket.leave(boardId);

    // Hapus user dari tracking
    if (boardUsers[boardId]) {
      boardUsers[boardId].delete(socket.id);

      // Broadcast updated list
      const onlineUsers = Array.from(boardUsers[boardId].values());
      io.to(boardId).emit('users-updated', onlineUsers);

      // Cleanup empty rooms
      if (boardUsers[boardId].size === 0) {
        delete boardUsers[boardId];
      }
    }
  });

  // 3. Event saat ada perubahan (List/Card berubah)
  socket.on('update-board', (data: { boardId: string; message: string; userName: string }) => {
    const { boardId, message, userName } = data;

    // Kirim ke SEMUA orang di room boardId, KECUALI pengirimnya
    socket.to(boardId).emit('refresh-board', { message, userName });
    console.log(`📤 ${userName} updated board ${boardId}: ${message}`);
  });

  // 4. Event Interaksi Realtime (Hover, Drag, Typing)
  socket.on(
    'user-interaction',
    (data: {
      boardId: string;
      type: 'hover-list' | 'drag-start' | 'drag-end' | 'typing-start' | 'typing-end';
      targetId: string; // ID List atau Card
      userId: string;
      userName: string;
      userImage?: string;
    }) => {
      const { boardId } = data;
      // Broadcast ke user lain di board ini
      socket.to(boardId).emit('user-interaction', data);
    }
  );

  // Handle disconnect - cleanup semua rooms
  socket.on('disconnect', () => {
    // Remove user dari semua boards yang dia join
    for (const boardId of Object.keys(boardUsers)) {
      const room = boardUsers[boardId];
      if (room?.has(socket.id)) {
        room.delete(socket.id);

        const onlineUsers = Array.from(room.values());
        io.to(boardId).emit('users-updated', onlineUsers);

        if (room.size === 0) {
          delete boardUsers[boardId];
        }
      }
    }
    console.log('User disconnect:', socket.id);
  });
});

const PORT = parseInt(process.env.PORT || '8080', 10);
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Socket Server jalan di port ${PORT}`);
});
