<script setup lang="ts">
const useAuth = useAuthStore();
const { userProfile } = storeToRefs(useAuth);
const { setUserProfile } = useAuth;
const loginToken = useCookie('roomToken') as any
import { jwtDecode } from 'jwt-decode';

onMounted(async () => {
  if (loginToken.value && userProfile.value.name === undefined) {
    const parseToken = jwtDecode(loginToken.value)

    const profile = {
      account: parseToken.account,
      name: parseToken.name || parseToken.aud,
      pic: parseToken.pic,
    };

    await setUserProfile(profile);
  }
});
</script>

<template>
  <div class="w-full h-100% min-h-[100lvh]">
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
