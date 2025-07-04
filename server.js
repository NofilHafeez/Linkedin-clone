import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer(); // No (req, res) handler

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Allow your frontend
  },
});

io.on('connection', (socket) => {
  console.log('✅ WS Client connected:', socket.id);

  socket.on('send-message', (data) => {
    console.log('Message:', data);
    io.emit('receive-message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log('✅ WebSocket server running on port 4000');
});
