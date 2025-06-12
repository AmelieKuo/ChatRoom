<!-- 使用原生 WebSocket -->
<script setup lang="ts">
import type { Socket } from 'socket.io-client';
import { Send16Filled } from '@vicons/fluent';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
const loginToken = useCookie('roomToken') as any

const { originChatContent, newSocketInstance, onMessage, sendMessage } = useWebsocket();
const { newIOConnect, onIOMessage, sendIOMessage, onOnlineUsers, onSocketList } = useSocketIO();

const { $dayjs } = useNuxtApp() as any;
const route = useRoute();
const router = useRouter();

const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth);

const roomInfo = ref({
  id: route.params.id,
  chatRoomName: "聊天室",
  description: 'This is a chat room',
});

const chatWindow = ref<HTMLElement | null>(null);
const chatContent = ref<any[]>([]);
const messageInput = ref('');
const socket = ref<WebSocket | null>(null);
const socketIo = ref<Socket | null>(null);

async function scrollToBottom() {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTo({
      top: chatWindow.value.scrollHeight,
      behavior: 'smooth',
    });
  }
}
//#region WebSocket
const getWebSocketContent = async () => {
  const roomKey = route.params.id as string;

  if (loginToken.value !== null || loginToken.value !== undefined && roomKey !== undefined ) {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      return;
    }

    if (socket.value && socket.value.readyState !== WebSocket.CLOSED) {
      socket.value.close();
    }

    // 1. 初始化 socket 實例
    socket.value = newSocketInstance(); // socket.value = newSocketInstance(userProfile.value.account);

    // 2. 獲取 WebSocket 訊息
    socket.value.onmessage = async (event) => {
      await onMessage(event);
      chatContent.value = [...originChatContent.value];
      await scrollToBottom();
    };

    socket.value.onopen = () => {
      console.log('WebSocket 已連接');
    };

    socket.value.onerror = (error) => {
      console.error('WebSocket 發生錯誤:', error);
    };

    socket.value.onclose = (event) => {
      console.log('WebSocket 連接關閉:', event);
    };
  } else {
    router.push('/');
  }

  await scrollToBottom();
};

const sendWebSocket = () => {
  if (!messageInput.value.trim()) return;

  const msg = {
    chatRoomCode: roomInfo.value.id,
    senderId: userProfile.value.account,
    message: messageInput.value,
    createDate: new Date(),
  };

  sendMessage(socket.value, msg);
  messageInput.value = '';
};
//#endregion

//#region SocketIO
const onlineUserList = ref<any[]>([]);
const socketsList = ref<any[]>([]);
const userNickname = ref<string | null>(null);
const getIOContent = async () => {
  const roomKey = route.params.id as string;

  if ((loginToken.value || loginToken.value !== undefined) && roomKey) {
    if (socketIo.value?.connected) return;

    // 中斷舊連線
    if (socketIo.value) {
      socketIo.value.disconnect();
    }

    // 取得匿名名稱
    userNickname.value = sessionStorage.getItem(`nickname-${roomInfo.value.id}`);

    // 建立新連線
    socketIo.value = newIOConnect({
      roomKey: roomInfo.value.id,
      account: userProfile.value.account,
      name: userNickname.value || userProfile.value.name,
      pic: userProfile.value.pic,
    });

    // 接收聊天訊息
    onIOMessage(socketIo.value, (msg) => {
      originChatContent.value.push(msg);
      chatContent.value = [...originChatContent.value];
      scrollToBottom();
    });

    // 接收在線名單
    onOnlineUsers(socketIo.value, (users) => {
      onlineUserList.value = users;
    });

    // 接收在線裝置
    onSocketList(socketIo.value, ({ account, socketIds }) => {
      if (account === userProfile.value.account) {
        socketsList.value = socketIds;
      };
    });
  } else {
    router.push('/');
  }
};

/** 發送 Socket 訊息 */
const sendSocketIO = () => {
  if (!messageInput.value.trim()) return;

  const msg = {
    senderId: userProfile.value.account,
    senderName: userNickname.value || userProfile.value.name,
    senderPic: userProfile.value.pic,
    message: messageInput.value,
    createDate: new Date(),
  };

  if (socketIo.value) {
    sendIOMessage(socketIo.value, msg);
    originChatContent.value.push(msg);
    chatContent.value = [...originChatContent.value];
    messageInput.value = '';
    scrollToBottom();
  }
};
//#endregion

const isMobileBrowser = () => {
  return navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
};

const isComposing = ref(false);

const send = () => {
  sendSocketIO();
  // sendWebSocket();
};

const handleKeydown = (e: KeyboardEvent) => {
 
  if (e.key === "Enter") {
      if (isComposing.value) return;
      if (isMobileBrowser()) return;
      if (!e.shiftKey) {
        e.preventDefault(); // 禁止換行
        send();
      }
      // Shift + Enter 允許換行
    }
};

const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
};

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if(socketsList.value.length === 1){
    sessionStorage.removeItem(`nickname-${roomInfo.value.id}`);
    loginToken.value = '';
  };
};


onMounted(async () => {
  if (userProfile.value.account) {
    await getIOContent();
  }
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});

watch(() => userProfile.value.account, async (newAccount) => {
  if (newAccount) {
    await getIOContent();
  }
}, { immediate: true });
</script>

<template>
  <section class="w-full h-[100dvh]">
    <div class="p-5 h-100% md:min-h-fit box-border scroll-smooth">
      <div class="bg-black font-bold text-white p-[5px] text-center text-[20px] rounded-[33px]">
        {{ roomInfo.chatRoomName }}
        <span class="text-[1rem] text-gray-200">房號：{{ roomInfo.id }}</span>
      </div>
      <div class="w-full h-[calc(100dvh-33px-5px-10px-3rem)] mt-[10px] bg-white rounded-[33px] flex flex-col px-5 py-5 divide-y-2">
        <div class="w-full flex-1 overflow-hidden">
          <p v-show="onlineUserList.length === 2" class="text-[20px] text-left p-2 shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            {{ onlineUserList.find(user => user.id !== userProfile.account)?.name }}
          </p>
          <ul
            ref="chatWindow"
            class="scrollbar h-[calc(100%-23px-39px)] md:h-[calc(100%-15px)] overflow-y-auto py-2 flex flex-col gap-4 pr-[1px]"
          >
            <li
              v-for="(msg, index) in chatContent"
              :key="index"
              class="w-full"
              :class="msg.senderId === userProfile.account ? 'self-end' : msg.senderId === 'system' ? 'self-center' : 'self-start'"
            >
              <div
                v-if="msg.senderId !== 'system'"
                class="w-full flex gap-[5px]"
                :class="msg.senderId === userProfile.account ? 'justify-end' : ''"
              >

                  <!-- 大頭貼 -->
                  <div
                    v-if="msg.senderId !== userProfile.account"
                    class="h-[36px] w-[36px] overflow-hidden rounded-full self-start"
                  >
                    <img
                      :src="msg.senderPic ? msg.senderPic : '/image/defalut_headshot.jpg'"
                      alt="user profile"
                      class="w-full h-full object-cover"
                    >
                  </div>

                  <div
                   :class="msg.senderId === userProfile.account ? 'w-[calc(100%-36px)] ' : 'w-[calc(100%-56px)] '"
                    class="flex flex-col gap-[8px]">
                    <!-- 名字 -->
                    <div v-show="onlineUserList.length > 2 && msg.senderId !== userProfile.account"class="flex items-center gap-[5px]">
                      <div>{{ msg.senderName }}</div>
                    </div>
    
                    <div :class="msg.senderId === userProfile.account ? 'justify-end' : 'justify-start'" class="max-w-full flex items-end gap-[5px]">
                      <!-- 訊息 -->
                      <div
                        :class="msg.senderId === userProfile.account ? 'bg-green-200 max-w-[calc(90%-56px)]' : 'bg-gray-200 max-w-[calc(90%-56px)]'"
                        class="w-fit p-[10px_20px] rounded-[15px] overflow-hidden whitespace-pre-wrap break-words text-[1rem]"
                      >
                        {{ msg.message }}
                      </div>
    
                      <!-- 時間/已讀 -->
                      <div
                        :class="msg.senderId === userProfile.account ? 'items-end order-first' : 'items-start order-last'"
                        class="self-end flex flex-col text-[0.65rem] gap-[2px]"
                      >
                        <p>{{ msg.isRead ? '已讀' : '' }}</p>
                        <p v-if="index === chatContent.length - 1 || $dayjs(chatContent[index + 1]?.msg?.createDate).format('MM/DD hh:mm') !== $dayjs(msg.createDate).format('MM/DD hh:mm')">
                          {{ $dayjs(msg.createDate).format('MM/DD hh:mm') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>


              <!-- 官方訊息 -->
              <p v-else class="text-center text-gray-200">{{ msg.message }}</p>
            </li>
          </ul>
        </div>
        <div>
          <n-input-group class="msg__input h-full flex-col md:min-h-[130px] md:flex-row">
            <n-input
              v-model:value="messageInput"
              round
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="請輸入訊息..."
              class="rounded-none h-full text-[1rem]"
              @keydown="handleKeydown"
              @compositionstart="handleCompositionStart"
              @compositionend="handleCompositionEnd"
            />
            <div
              class="static self-end"
              @click="send"
            >
              <n-icon
                :component="Send16Filled"
                size="30"
                class="text-gray-400 hover:text-gray-600 cursor-pointer"
              />
            </div>
          </n-input-group>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(.msg__input .n-input__border) {
  border: none;
}

:deep(.msg__input .n-input .n-input-wrapper) {
  padding-left: 0px;
  padding-right: 0px;
}

:deep(.msg__input .n-input__state-border) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.scrollbar::-webkit-scrollbar) {
  width: 10px;
}

:deep(.scrollbar::-webkit-scrollbar-track) {
  background-color: transparent;
  border-radius: 10px;
  margin: 10px 50px;
}

:deep(.scrollbar:hover::-webkit-scrollbar-track) {
  background-color: #dadada;
}

:deep(::-webkit-scrollbar-thumb) {
  background-color: transparent;
  border-radius: 10px;
}

:deep(.scrollbar:hover::-webkit-scrollbar-thumb) {
  background-color: #b3b3b3;
}
</style>
