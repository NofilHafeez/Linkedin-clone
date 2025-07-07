import { createServer } from 'http';
import { Server } from 'socket.io';
// Create a Map to store user IDs and their socket IDs
const userSocketMap = new Map();


const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  },
});

io.on('connection', (socket) => {
  console.log('✅ WS Client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('send-comment-noti', (name, message) => {
    console.log('Comment:', name, message);
  })

  // socket.on('send-like-noti', ({ name, message, receiverId }) => {
  //   console.log('Comment:', name, message, receiverId);
  //   //  emit to receiver
  //    const receiverSocketId = userSocketMap.get(receiverId);
  //   if (receiverSocketId) {
  //     io.to(receiverSocketId).emit('like-noti-receive', { name, message, receiverId });
  //   }

  // });

    // User joins room named after their userId
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  // Sending like notification
  socket.on('send-like-noti', ({ name, message, receiverId, sender }) => {
    io.to(receiverId).emit('like-noti-receive', { name, message, receiverId, sender });
  });

  socket.on('send-message', (data) => {
    const { roomId } = data;
    console.log('Message:', data);

    // Send to everyone in the room EXCEPT sender
    socket.to(roomId).emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log('✅ WebSocket server running on port 4000');
});

