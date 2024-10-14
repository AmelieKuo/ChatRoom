<script setup lang="ts">
const { $dayjs } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const { LineChannel, LineSecret } = runtimeConfig.public;

const router = useRouter();
const route = useRoute();

const handleClick = async() => {

  const link = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LineChannel}&redirect_uri=http://localhost:3000/login&state=12345abcde&scope=profile%20openid&prompt=consent&ui_locales=zh-TW&client_secret=${LineSecret}`

  window.location.href = link;
}

const getProfile = async (accessToken: string, idToken: string) => {
  try {
    const userProfile = await $fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken
      },
      body: new URLSearchParams({
        'id_token': idToken,
        'client_id': LineChannel,
      })
    })

    // const loginToken = useCookie('roomToken',{
    //   expires: new Date($dayjs(24, 'hour').utc()),
    // });

    const loginToken = useCookie('roomToken');

    // const expires = new Date($dayjs(24, 'hour').utc());
    loginToken.value = userProfile.sub;
    
    // console.log(expires)

    router.push('/')
  } catch (error) {
    console.log(error)
  }


}


const getToken = async () => {
  try {
    const tokenResponse = await $fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'authorization_code',
        'code': route.query.code,
        'client_id': LineChannel,
        'redirect_uri': 'http://localhost:3000/login',
        'client_secret': LineSecret
      })
    })

    const accessToken = tokenResponse.access_token;
    const idToken = tokenResponse.id_token;

    getProfile(accessToken,idToken)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (route.query.code) {
    getToken()
  }
})

definePageMeta({
  middleware: ['auth'],
});
</script>

<template>
  <section class="w-full h-full min-h-[100dvh] flex justify-center items-center flex-col">
    <div class="w-[200px]">
      <img src="~/assets/image/logo.svg" alt="">
    </div>
    <h1>歡迎使用 ChatRoom </h1>
    <!-- <n-avatar round size="medium" :bordered="true" src="~/assets/image/logo.svg" /> -->
    <n-button color="#06C755" size="large" class="mt-[10px] font-bold" @click="handleClick">
      <template #icon>
        <div class="">
          <img src="~/assets/icons/line.png" alt="">
        </div>
      </template>
      使用 Line 帳號登入
    </n-button>
  </section>
</template>
