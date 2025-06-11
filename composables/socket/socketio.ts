// composables/socket/useSocketIO.ts
import { io, Socket } from 'socket.io-client';

export const useSocketIO = () => {

  const runtimeConfig = useRuntimeConfig();
  const { baseUrl } = runtimeConfig.public;

  // 建立新的 Socket.IO
  const newIOConnect = (user:any): Socket => {
    const socket = io(import.meta.env.DEV ? "http://localhost:3001" : `${baseUrl}:`, {
      path: '/socket.io',
      auth: user,
    });

    // 建立連線
    socket.on('connect', () => {
      console.log('Socket.IO 已連線:', socket.id);
    });

    // 斷線
    socket.on('disconnect', () => {
      console.log('Socket.IO 已斷線');
    });

    // 連線錯誤
    socket.on('connect_error', (err) => {
      console.error('連線錯誤:', err);
    });

    return socket;
  };

  // 發送訊息
  const sendIOMessage = (socket: Socket, msg: any): void => {
    socket.emit('chatMessage', msg);
  };

  // 監聽訊息
  const onIOMessage = (socket: Socket, handler: (msg: any) => void): void => {
    socket.on('chatMessage', handler);
  };

  // 監聽線上用戶
  const onOnlineUsers = (socket: Socket, handler: (users: any[]) => void): void => {
    socket.on('onlineUsers', handler);
  };

  return {
    newIOConnect,
    sendIOMessage,
    onIOMessage,
    onOnlineUsers,
  };
};
