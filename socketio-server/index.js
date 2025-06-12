import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Map<roomId, Map<account, { sockets: Set<socketId>, info: { name, pic } }>>
const roomUserSockets = new Map();

io.on('connection', (socket) => {
  const { roomKey, account, name, pic } = socket.handshake.auth;
  const roomId = roomKey;

  if (!roomId || !account) {
    socket.disconnect();
    return;
  }

  socket.join(roomId);

  // ✅ 初始化房間
  if (!roomUserSockets.has(roomId)) {
    roomUserSockets.set(roomId, new Map());
  }

  const roomMap = roomUserSockets.get(roomId);

  // ✅ 初始化使用者
  const isNewUser = !roomMap.has(account);
  if (isNewUser) {
    roomMap.set(account, {
      sockets: new Set(),
      info: { account, name, pic },
    });
  }

  const userData = roomMap.get(account);
  const isFirstJoin = userData.sockets.size === 0;

  userData.sockets.add(socket.id);

  // ✅ 僅第一次連線顯示「已加入」
  if (isFirstJoin) {
    io.to(roomId).emit('chatMessage', {
      senderId: 'system',
      message: `使用者 ${name} 已加入聊天室`,
      caller: { id: account, name, pic },
      createDate: new Date(),
    });

    // ✅ 傳送「新增」後的 onlineUsers 給全部人
    const updatedUsers = Array.from(roomMap.entries()).map(([id, { info }]) => ({
      id,
      name: info.name,
      pic: info.pic,
    }));
    
    io.to(roomId).emit('onlineUsers', updatedUsers);
  } 

  // ✅ 傳送 sockets 清單
  for (const socketId of userData.sockets) {
    io.to(socketId).emit('socketsList', {
      account,
      socketIds: Array.from(userData.sockets),
    });
  };

  // ✅ 接收聊天訊息
  socket.on('chatMessage', (msg) => {
    socket.to(roomId).emit('chatMessage', msg);
  });

  // ✅ 處理離線
  socket.on('disconnect', () => {
    const roomMap = roomUserSockets.get(roomId);
    if (!roomMap) return;

    const userData = roomMap.get(account);
    if (!userData) return;

    userData.sockets.delete(socket.id);

    // ✅ 傳送該帳號的 sockets 清單
    for (const socketId of userData.sockets) {
      io.to(socketId).emit('socketsList', {
        account,
        socketIds: Array.from(userData.sockets),
      });
    }

    const isCompletelyDisconnected = userData.sockets.size === 0;

    if (isCompletelyDisconnected) {
      roomMap.delete(account);

      // ✅ 所有視窗都關閉 → 廣播離開訊息
      io.to(roomId).emit('chatMessage', {
        senderId: 'system',
        message: `使用者 ${name} 離開聊天室`,
        createDate: new Date(),
      });

      // ✅ 傳送刪除後的 onlineUsers 給全部人
      const updatedUsers = Array.from(roomMap.entries()).map(([id, { info }]) => ({
        id,
        ...info,
      }));
      io.to(roomId).emit('onlineUsers', updatedUsers);

    }
    // ✅ 若房間空了，清除 room
    if (roomMap.size === 0) {
      roomUserSockets.delete(roomId);
    }
  });
});

server.listen(3001, () => {
  console.log('✅ Socket.IO server running at http://localhost:3001');
});