/** WebSocket */

interface UseWebsocketResult {
  newSocketInstance: () => WebSocket;
  onMessage: (event: MessageEvent) => Promise<void>;
  originChatContent: Ref<any[]>;
  sendMessage: (socket: WebSocket | null, msg: any) => void;
}

export const useWebsocket = (): UseWebsocketResult => {
  const roomToken = sessionStorage.getItem('roomKey');
  const originChatContent = ref<any[]>([]);

  // 建立新的 WebSocket 實例
  const newSocketInstance = (account?:string): WebSocket => {
    return new WebSocket(`wss://ws.ifelse.io`);
    // return new WebSocket(`ws://172.26.36.181:8087/WebSocket/${roomToken}?account=${account}`);
  };

  // 當收到訊息時的處理邏輯
  const onMessage = async (event: MessageEvent): Promise<void> => {
    try {
      const message = JSON.parse(event.data);
      originChatContent.value.push(message);

    } catch (error) {

      const msg = {
        senderId: 'guest',
        message: event.data,
        createDate: new Date(event.timeStamp),
        isRead: false,
      };

      originChatContent.value.push(msg);
    }
  };

  // 發送訊息
  const sendMessage = (socket: WebSocket | null, msg: any): void => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket 未連線或已關閉，無法發送訊息');
      return;
    }

    try {
      socket.send(JSON.stringify(msg));
    } catch (e) {
      console.error('訊息發送失敗', e);
    }
  };

  return {
    newSocketInstance,
    onMessage,
    originChatContent,
    sendMessage,
  };
};
