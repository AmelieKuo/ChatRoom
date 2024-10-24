<script lang="ts" setup>
import { createDiscreteApi } from 'naive-ui'
import { Key16Filled } from '@vicons/fluent'

// import { FETCH_AUTH } from '@/api';

const router = useRouter();
const useModal = createDiscreteApi(['modal'])
const { modal } = useModal;

const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth);

const loginToken = useCookie('roomToken');

// async function getAuth() {
//   const query = {
//     page: 1
//   }
//   const { data = [] } = await FETCH_AUTH.Test(query, true);
//   console.log(data)
// }

const roomID = ref<string>('');

const inputStatus = ref<string>('');

const validatorRoomID = () => {
  if (!roomID.value) {
    inputStatus.value = 'error'
    return false
  }
  return true
}

const handleClick = async() => {
  if (!validatorRoomID) {
    return
  }else{

    const { message, success, data } = await $fetch('/api/chatSearch', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginToken.value.accessToken}`
        },
        params: { id: roomID.value }
      })

    if(success){
       const currentModal = modal.create({
        title: message,
        preset: 'dialog',
      })
      setTimeout(() => {
        currentModal.destroy();
        router.push(`/chat/${roomID.value}`)
      }, 3000)
    }else{
       const currentModal = modal.create({
        title: message,
        preset: 'dialog',
      })

      setTimeout(() => {
        currentModal.destroy();
        router.push(`/chat/${data}`)
      }, 3000)
    }
  }
}

onMounted(() => {

})

</script>


<template>
  <div class="w-full h-[100vh] flex justify-center items-center">
    <div class="max-w-[600px] h-auto px-5 flex flex-col gap-[20px] justify-center items-center">
      <div class="rounded-full border border-4 border-[#63e2b7] overflow-hidden w-[60%]">
        <img :src="userProfile.picture" />
      </div>
      <p class="font-bold text-[28px] w-full">Hi! {{ userProfile.name }}</p>

      <n-input v-model:value="roomID" @input="enterRoomID" :status="inputStatus" placeholder="請輸入房號" type="text" autosize style="width: 100%; min-height: 50px">
        <template #suffix>
          <n-icon :component="Key16Filled" size="20" />
        </template>
      </n-input>

      <n-button type="primary" class="mt-[10px] w-full font-bold h-[50px]" @click="handleClick">
        進入聊天室
      </n-button>
    </div>
  </div>

</template>


<style>
</style>