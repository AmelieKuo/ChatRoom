<script setup lang="ts">
const { lineLogin } = useLine();
const { googleLogin } = useGoogle();
const { githubLogin } = useGithub();

definePageMeta({
  middleware: ["non-login"],
});

</script>

<template>
  <section
    class="flex justify-center items-center flex-col bg-white p-5 min-h-screen md:min-h-fit"
  >
    <div class="w-[200px]">
      <img
        src="/image/logo.svg"
        alt=""
      >
    </div>
    <h1 class="text-[25px]">歡迎使用 ChatRoom</h1>
    <!-- Line -->
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold w-[230px]"
      @click="lineLogin"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/line.png"
            alt=""
          >
        </div>
      </template>
      使用 Line 登入
    </n-button>
    <!-- Google -->
    <n-button
      color="#e5e7eb"
      ghost
      size="large"
      text-color="black"
      class="mt-[10px] font-bold w-[230px]"
      @click="googleLogin"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/google.png"
            alt=""
          >
        </div>
      </template>
      使用 Google 登入
    </n-button>
    <!-- Github -->
    <n-button
      color="#24292f"
      size="large"
      class="mt-[10px] font-bold w-[230px] mb-5"
      @click="githubLogin"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/github.png"
            alt=""
          >
        </div>
      </template>
      使用 Github 帳號登入
    </n-button>
  </section>
</template>
