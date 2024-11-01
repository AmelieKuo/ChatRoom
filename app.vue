<script setup lang="ts">
// const useAuth = useAuthStore();
// const { userProfile } = storeToRefs(useAuth)
// const { getProfile } = useAuth
// const loginToken = useCookie('roomToken') as any

onMounted(async () => {
  // if (loginToken.value && userProfile.value.name === undefined) {
  //   await getProfile(loginToken.value.accessToken, loginToken.value.idToken)
  // }
});
</script>

<template>
  <div class="w-full h-100% min-h-[100dvh]">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
