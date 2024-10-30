<script setup lang="ts">
import { Send16Filled } from '@vicons/fluent';

const { $dayjs } = useNuxtApp() as any;
const route = useRoute();

const roomInfo = {
  id: route.params.id,
  chatRoomName: "BotBotBot",
  description: 'This is a chat room',
}

const userProfile = {
  name: 'Amelie',
  account: "小華",
  pic: '',
}

const caller = {
  name: '小明',
  account: "小明",
  pic: "",
}

const chatWindow = ref(null);

async function scrollToBottom() {
  await nextTick();
  console.log(chatWindow.value.scrollHeight)
  chatWindow.value.scrollTo({
    top: chatWindow.value.scrollHeight, // 設定滾動高度為視窗的最大高度
    behavior: 'smooth', // 平滑滾動效果
  });
  // chatWindow.scrollTo(0, chatWindow.scrollHeight);
}

const chatContent = ref([]);

const getChatContent = async () => {
  const data = await $fetch("/api/getChat", {
    method: "GET",
  });
  chatContent.value = data;

  scrollToBottom()
}

onMounted(() => {
  getChatContent()
});
</script>

<template>
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
            v-for="msg in chatContent"
            :key="msg.id"
            class="w-full"
            :class="msg.account === userProfile.account ? 'self-end' : 'self-start'"
          >
            <div
              class="w-full flex gap-[5px]"
              :class="msg.account === userProfile.account ? 'justify-end' : ''"
            >
              <!-- 大頭貼 -->
              <div
                v-if="msg.account !== userProfile.account"
                class="h-[36px] w-[36px] overflow-hidden rounded-full self-center"
              >
                <img
                  :src="caller.pic ? caller.pic : '/image/defalut_headshot.jpg'"
                  alt="w-full h-full object-cover"
                >
              </div>
              <!-- 已讀&&時間 -->
              <div
                :class="msg.account === userProfile.account ? 'items-end order-first' : 'items-start order-last'"
                class="self-end flex flex-col text-[10px] gap-[2px]"
              >
                <p>{{ msg.isRead ? '已讀' : '' }}</p>
                <p>{{ $dayjs(msg.createDate).format('MM/DD hh:mm') }}</p>
              </div>
              <!-- 訊息 -->
              <div
                :class="msg.account === userProfile.account ? 'bg-green-200 max-w-[calc(90%-56px)]' : 'bg-gray-200 max-w-[calc(90%-56px-36px)]'"
                class="p-[10px_20px] rounded-[30px] overflow-hidden"
              >
                {{ msg.content }}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div class="">
        <n-input-group class="msg__input h-full flex-col md:flex-row">
          <n-input
            round
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            placeholder="請輸入訊息..."
            class="rounded-none h-full"
          />
          <div
            class="static md:hidden self-end"
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
</template>

<style scoped>
:deep(.msg__input .n-input__border){
    border: none;
}

:deep(.msg__input .n-input .n-input-wrapper){
    padding-left: 0px;
    padding-right: 0px;
}

:deep(.msg__input .n-input__state-border){
    border: none !important;
    box-shadow: none !important;
}

/* scrollbar style */

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
