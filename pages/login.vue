<script setup lang="ts">
import generateUUID from '~/utils/uuid'

const { $dayjs } = useNuxtApp() as any
const runtimeConfig = useRuntimeConfig()
const { LineChannel, LineSecret } = runtimeConfig.public
const useAuth = useAuthStore()
const { getProfile } = useAuth

const router = useRouter()
const route = useRoute()

const handleClick = async () => {
  const tempUUID = generateUUID()
  const link = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LineChannel}&redirect_uri=http://localhost:3000/login&state=${tempUUID}&scope=profile%20openid&prompt=consent&ui_locales=zh-TW&client_secret=${LineSecret}`
  window.location.href = link
};

const getToken = async () => {
  try {
    const tokenResponse: any = await $fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: route.query.code,
        client_id: LineChannel,
        redirect_uri: 'http://localhost:3000/login',
        client_secret: LineSecret,
      }),
    })

    const obj = {
      accessToken: tokenResponse.access_token,
      idToken: tokenResponse.id_token,
    }

    const tempTime = $dayjs().add(23, 'hour')

    const maxDate = new Date($dayjs(tempTime).utc().format())

    const loginToken = useCookie('roomToken', {
      expires: maxDate,
    })

    loginToken.value = JSON.stringify(obj)

    await getProfile(obj.accessToken, obj.idToken)
    await router.push('/')
  }
  catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (route.query.code) {
    getToken()
  }
})

definePageMeta({
  middleware: ['non-login'],
})
</script>

<template>
  <section class="w-full h-full min-h-[100dvh] flex justify-center items-center flex-col">
    <div class="w-[200px]">
      <img
        src="~/assets/image/logo.svg"
        alt=""
      >
    </div>
    <h1>歡迎使用 ChatRoom </h1>
    <!-- <n-avatar round size="medium" :bordered="true" src="~/assets/image/logo.svg" /> -->
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold"
      @click="handleClick"
    >
      <template #icon>
        <div class="">
          <img
            src="~/assets/icons/line.png"
            alt=""
          >
        </div>
      </template>
      使用 Line 帳號登入
    </n-button>
  </section>
</template>
