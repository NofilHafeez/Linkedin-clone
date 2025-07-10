import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket'],
});


io.on('connection', (socket) => {
  console.log('✅ WS Client connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('join-room', (userId) => {
    console.log(`🛏️ Joined room: ${userId}`);
    socket.join(userId);
  });

  socket.on('send-like-noti', ({ message, receiverId, sender }) => {
    console.log(`📨 Sending to ${receiverId}: ${message}`);
    io.to(receiverId).emit('like-noti-receive', { message, sender, receiverId });
  });

   socket.on('send-comment-noti', ({ message, receiverId, sender }) => {
    console.log(`📨 Sending to ${receiverId}: ${message}`);
    io.to(receiverId).emit('comment-noti-receive', { message, sender, receiverId  });
  });

  socket.on('send-connect-noti', ({ message, receiverId, sender }) => {
    console.log(`📨 Sending to ${receiverId}: ${message}`);
    io.to(receiverId).emit('connect-noti-receive', { message, sender, receiverId });
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

