<script setup lang="ts">
import { Send16Filled } from '@vicons/fluent';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const { $dayjs } = useNuxtApp() as any;
const route = useRoute();
const router = useRouter();
const loginToken = useCookie('roomToken') as any

const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth);

const roomInfo = ref({
  id: route.params.id,
  chatRoomName: "BotBotBot",
  description: 'This is a chat room',
});

const caller = {
  name: '小明',
  account: "小明",
  pic: "",
};

const chatWindow = ref<HTMLElement | null>(null);
const chatContent = ref<any[]>([]);
const messageInput = ref('');
const socket = reactive<any>({
  instance: null,  // 初始化為 null，並在後面進行 WebSocket 實例的賦值
});

async function scrollToBottom() {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTo({
      top: chatWindow.value.scrollHeight,
      behavior: 'smooth',
    });
  }
}

watch(() => userProfile.value.account, async (newAccount) => {
  if (newAccount) {
    await getChatContent();
  }
}, { immediate: true });

const getChatContent = async () => {
  const roomToken = sessionStorage.getItem('roomKey');

  if (roomToken) {
    if (socket.instance) {  // 檢查是否已經有 WebSocket 連接
      socket.instance.close();  // 關閉已存在的連接
    }
    // 初始化 WebSocket 實例
        // socket.instance = new WebSocket(`ws://echo.websocket.events`);

    socket.instance = new WebSocket(`ws://172.26.36.181:8087/WebSocket/${roomToken}?account=${userProfile.value.account}`, null, { headers: { Authorization: `Bearer ${loginToken.value}` } });

      socket.instance.onmessage = (event) => {
        try {
          const message = JSON.parse(JSON.stringify(event.data));
          console.log(message);
          chatContent.value.push(message);
          console.log(chatContent.value);
          scrollToBottom();
        } catch (error) {
          console.log(error);
          console.warn('收到非 JSON 格式資料:', event.data);
        }
      };


    socket.instance.onopen = () => {
      console.log('WebSocket 已連接');
    };

    socket.instance.onerror = (error) => {
      console.error('WebSocket 發生錯誤:', error);
    };

    socket.instance.onclose = (event) => {
      console.log('WebSocket 連接關閉:', event);
    };
  } else {
    sessionStorage.removeItem('roomKey');
    router.push('/');
  }

  await scrollToBottom();
};

const sendMessage = () => {
  if (socket.instance && socket.instance.readyState === WebSocket.OPEN) {
    console.log(messageInput.value);
    if (messageInput.value.trim() !== '') {
      const message = {
        chatRoomCode: roomInfo.value.id,
        account: userProfile.value.account,
        message: messageInput.value,
        createDate: new Date(),
      };

      socket.instance.send(JSON.stringify(message));
      messageInput.value = '';
    } else {
      console.error('訊息為空，無法發送');
    }
  } else {
    console.error('WebSocket 未連接');
  }
};


onMounted(async () => {
  if (userProfile.value.account) {
    await getChatContent();
  }
});
</script>

<template>
  <section class="w-full">
    <div class="p-5 min-h-screen md:min-h-fit box-border scroll-smooth">
      <div class="bg-black font-bold text-white p-[5px] text-center text-[20px] rounded-[33px]">
        {{ roomInfo.chatRoomName }}
        <span class="text-[12px] text-gray-200">{{ roomInfo.id }}</span>
      </div>
      <div class="w-full h-[calc(100dvh-33px-5px-10px-3rem)] mt-[10px] bg-white rounded-[33px] flex flex-col p-5 divide-y-2">
        <div class="w-full flex-1 overflow-hidden">
          <p class="text-[20px] text-left p-2 shadow-[0_0_6px_rgba(0,0,0,0.2)]">
            {{ userProfile.name }}
          </p>
          <ul
            ref="chatWindow"
            class="scrollbar h-[calc(100%-23px-39px)] overflow-y-auto py-2 flex flex-col gap-10 pr-[1px]"
          >
            <li
              v-for="(msg, index) in chatContent"
              :key="index"
              class="w-full"
              :class="msg.senderId === userProfile.account ? 'self-end' : 'self-start'"
            >
            {{msg}}
              <div
                class="w-full flex gap-[5px]"
                :class="msg.senderId === userProfile.account ? 'justify-end' : ''"
              >
                <div
                  v-if="msg.senderId !== userProfile.account"
                  class="h-[36px] w-[36px] overflow-hidden rounded-full self-center"
                >
                  <img
                    :src="caller.pic ? caller.pic : '/image/defalut_headshot.jpg'"
                    alt="user profile"
                    class="w-full h-full object-cover"
                  >
                </div>
                <div
                  :class="msg.senderId === userProfile.account ? 'items-end order-first' : 'items-start order-last'"
                  class="self-end flex flex-col text-[10px] gap-[2px]"
                >
                  <p>{{ msg.isRead ? '已讀' : '' }}</p>
                  <p>{{ $dayjs(msg.createDate).format('MM/DD hh:mm') }}</p>
                </div>
                <div
                  :class="msg.senderId === userProfile.account ? 'bg-green-200 max-w-[calc(90%-56px)]' : 'bg-gray-200 max-w-[calc(90%-56px-36px)]'"
                  class="p-[10px_20px] rounded-[30px] overflow-hidden"
                >
                  {{ msg.message }}
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div>
          <n-input-group class="msg__input h-full flex-col md:flex-row">
            <n-input
              v-model:value="messageInput"
              round
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              placeholder="請輸入訊息..."
              class="rounded-none h-full"
            />
            <div
              class="static md:hidden self-end"
              @click="sendMessage"
            >
              <n-icon
                :component="Send16Filled"
                size="20"
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
