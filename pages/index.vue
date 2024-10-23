<script lang="ts" setup>
import { Chat16Filled } from '@vicons/fluent'
// import { FETCH_AUTH } from '@/api';

const router = useRouter();

const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth)

// const loginToken = useCookie('roomToken');

// async function getAuth() {
//   const query = {
//     page: 1
//   }
//   const { data = [] } = await FETCH_AUTH.Test(query, true);
//   console.log(data)
// }

const roomID = ref<string>('')

const handleClick = () => {
  router.push(`/chat/${roomID.value}`)
}

onMounted(() => {

})

</script>


<template>
  <div class="w-full h-[100vh] flex justify-center items-center">
    <div class="max-w-[1440px] h-auto px-5 flex flex-col gap-[20px] justify-center items-center">
      <div class="rounded-full border border-4 border-[#63e2b7] overflow-hidden w-[200px]">
        <img :src="userProfile.picture" />
      </div>
      <p class="font-bold text-[28px]">Hi! {{ userProfile.name }}</p>

      <n-input v-model:value="roomID" placeholder="請輸入房號" size="large" type="text">
        <template #suffix>
          <n-icon :component="Chat16Filled" />
        </template>
      </n-input>

      <n-button type="primary" size="large" class="mt-[10px] font-bold" @click="handleClick">
        進入聊天室
      </n-button>
    </div>
  </div>
</template>


<style>
</style>