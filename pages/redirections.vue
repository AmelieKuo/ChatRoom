<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const runtimeConfig = useRuntimeConfig()
const { LineChannel, LineSecret } = runtimeConfig.public

const getProfile = async () => {
  try {
    const data = await $fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: route.query.code,
        client_id: LineChannel,
        redirect_uri: 'http://localhost:3000/',
        client_secret: LineSecret,
      }),
    })

    console.log(data)

    router.push('/')
  }
  catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  if (route.query.code) {
    getProfile()
  }
  else {
    router.push('/')
  }
})
</script>

<template>
  <section>
    loading...
  </section>
</template>
