<script lang="ts" setup>
import { FETCH_AUTH } from '@/api';

const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth)

const loginToken = useCookie('roomToken');

async function getAuth() {
  const query = {
    page: 1
  }
  const { data = [] } = await FETCH_AUTH.Test(query, true);
  console.log(data)
}

onMounted(() => {
  if(!loginToken.value) {
    getAuth()
  }
})

</script>


<template>
  <div class="p-5">
    首頁

    <div class="w-full h-full p-5">

      <div class="p-5">
        Code:
        <pre class="w-full bg-black text-white mb-2 p-5 overflow-x-auto">
            {{ userProfile }}
        </pre>

        <Nuxt-link to="https://developers.line.biz/en/reference/line-login/#verify-id-token" class="w-fit rounded-md bg-green-400 hover:bg-green-300 text-black py-4 px-10 flex justify-center items-center">Response Parameter</nuxt-link>
      </div>

    </div>
  </div>
</template>


<style>
</style>