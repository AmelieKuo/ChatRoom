<script setup lang="ts">
const useAuth = useAuthStore()
const { userProfile } = storeToRefs(useAuth)
const { getProfile } = useAuth
const loginToken = useCookie('roomToken') as any

onMounted(async () => {
  if (loginToken.value && userProfile.value.name === undefined) {
    await getProfile(loginToken.value.accessToken, loginToken.value.idToken)
  }
})
</script>

<template>
  <div class="w-full h-100% min-h-[100dvh]">
    <NuxtPage />
  </div>
</template>
