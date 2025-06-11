import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

// 儲存每個房間的使用者清單
const roomUserMap = new Map();

io.on('connection', (socket) => {
  const { roomKey, account, name, pic } = socket.handshake.auth;
  const roomId = roomKey;

  if (!roomId || !account) {
    console.warn('缺少房號，終止連線');
    socket.disconnect();
    return;
  }

  socket.join(roomId);
  console.log(`使用者 ${name} 加入房間`);

  // 初始化房間使用者清單
  if (!roomUserMap.has(roomId)) {
    roomUserMap.set(roomId, new Set());
  }
  roomUserMap.get(roomId).add(JSON.stringify({ id: account, name: name, pic: pic }));

  // 廣播加入訊息
  io.to(roomId).emit('chatMessage', {
    senderId: 'system',
    message: `使用者 ${name} 已加入聊天室`,
    caller: { id: account, name: name, pic: pic },
    createDate: new Date(),
  });

  // 傳送目前在線使用者清單
  const users = Array.from(roomUserMap.get(roomId)).map(JSON.parse);
  io.to(roomId).emit('onlineUsers', users);

  // 處理文字訊息
  socket.on('chatMessage', (msg) => {
    console.log(`${name}:`, msg.message);
    socket.to(roomId).emit('chatMessage', msg);
  });

  // 處理離線
  socket.on('disconnect', () => {
    console.log(`${name} 離開房間`);

    const users = roomUserMap.get(roomId);
    if (users) {
      for (const u of users) {
        const user = JSON.parse(u);
        if (user.id === account) {
          users.delete(u);
          break;
        }
      }

      if (users.size === 0) {
        roomUserMap.delete(roomId);
      }
    }

    socket.to(roomId).emit('chatMessage', {
      senderId: 'system',
      message: `使用者 ${name} 離開聊天室`,
      createDate: new Date(),
    });

    io.to(roomId).emit('onlineUsers', Array.from(roomUserMap.get(roomId) || []).map(JSON.parse));
  });
});

server.listen(3001, () => {
  console.log('Socket.IO server 運行中：http://localhost:3001');
});
