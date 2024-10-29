<script setup lang="ts">
import { Send16Filled } from "@vicons/fluent";

const route = useRoute();

const roomInfo = {
  id: route.params.id,
  chatRoomName: "BotBotBot",
  description: 'This is a chat room',
}

const userProfile = {
  name: 'Amelie',
  account: "ddddd",
  pic: '',
}

const chatContent = [
  {
    id: 1,
    account: "小明",
    content: "你今天過得怎麼樣？",
    isRead: true,
    createDate: "2024-10-29T10:00:00",
    expDate: "2024-10-30T10:00:00"
  },
  {
    id: 2,
    account: "小華",
    content: "還不錯，你呢？",
    isRead: true,
    createDate: "2024-10-29T10:01:00",
    expDate: "2024-10-30T10:01:00"
  },
  {
    id: 3,
    account: "小明",
    content: "最近有什麼新鮮事嗎？",
    isRead: false,
    createDate: "2024-10-29T10:02:00",
    expDate: "2024-10-30T10:02:00"
  },
  {
    id: 4,
    account: "小華",
    content: "我最近開始學習吉他了！",
    isRead: false,
    createDate: "2024-10-29T10:03:00",
    expDate: "2024-10-30T10:03:00"
  },
  {
    id: 5,
    account: "小明",
    content: "哇，太棒了！你會彈什麼歌？",
    isRead: true,
    createDate: "2024-10-29T10:04:00",
    expDate: "2024-10-30T10:04:00"
  },
  {
    id: 6,
    account: "小華",
    content: "我想學《平凡之路》，你覺得呢？",
    isRead: false,
    createDate: "2024-10-29T10:05:00",
    expDate: "2024-10-30T10:05:00"
  },
  {
    id: 7,
    account: "小明",
    content: "那首歌很不錯，我也喜歡！",
    isRead: true,
    createDate: "2024-10-29T10:06:00",
    expDate: "2024-10-30T10:06:00"
  },
  {
    id: 8,
    account: "小華",
    content: "對了，你有興趣一起練習嗎？",
    isRead: false,
    createDate: "2024-10-29T10:07:00",
    expDate: "2024-10-30T10:07:00"
  },
  {
    id: 9,
    account: "小明",
    content: "好啊，我也想要一起進步！",
    isRead: true,
    createDate: "2024-10-29T10:08:00",
    expDate: "2024-10-30T10:08:00"
  },
  {
    id: 10,
    account: "小華",
    content: "太好了，我們約個時間吧！",
    isRead: false,
    createDate: "2024-10-29T10:09:00",
    expDate: "2024-10-30T10:09:00"
  },
];
</script>

<template>
  <div class="p-5 min-h-screen md:min-h-fit box-border">
    <div class="bg-black font-bold text-white p-[5px] text-center text-[20px] rounded-[33px]">
      {{ roomInfo.chatRoomName }}
      <span class="text-[12px] text-gray-200">{{ roomInfo.id }}</span>
    </div>
    <div class="w-full h-[calc(100dvh-33px-5px-10px-3rem)] mt-[10px] bg-white rounded-[33px] grid grid-rows-[30px_auto_100px] p-5">
      <p class="text-[20px] text-center">
        {{ userProfile.name }}
      </p>

      <ul class="h-full overflow-y-auto">
        <li
          v-for="msg in chatContent"
          :key="msg.id"
        >
          {{ msg.content }}
        </li>
      </ul>

      <div class="w-full border-t-2">
        <n-input-group class="msg__input h-full flex-col md:flex-row">
          <n-input
            round
            type="textarea"
            autosize
            class="rounded-none h-full"
          />
          <n-button
            type="primary"
            class="static md:hidden self-end"
          >
            <n-icon
              :component="Send16Filled"
              size="20"
            />
          </n-button>
        </n-input-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.msg__input .n-input__border){
    border: none;
}

:deep(.msg__input .n-input__state-border){
    border: none !important;
    box-shadow: none !important;
}
</style>
