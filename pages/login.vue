<script setup lang="ts">
const route = useRoute();
const { lineLogin, getLineToken } = useLine();


const handleClick = () => {
  console.log("click");
};

const goTTGO = async() => {
  const resp = useFetch('/Banner/GetAll',{
    baseURL: "https://ttgouat.cbsdinfo.com.tw/service/api/",
    method: 'GET',
  });

  console.log(resp);
}

onMounted(() => {
  /** 使用 Line 登入*/ 
  if (route.query.code) {
    getLineToken();
  }
});

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
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold w-[230px]"
      @click="goTTGO"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/line.png"
            alt=""
          >
        </div>
      </template>
      TTGO
    </n-button>
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
      使用 Line 帳號登入
    </n-button>
    <!-- Google -->
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold w-[230px]"
      @click="handleClick"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/line.png"
            alt=""
          >
        </div>
      </template>
      使用 Google 帳號登入
    </n-button>
    <!-- Facebook -->
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold w-[230px]"
      @click="handleClick"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/line.png"
            alt=""
          >
        </div>
      </template>
      使用 Facebook 帳號登入
    </n-button>
    <!-- Microsoft -->
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold w-[230px]"
      @click="handleClick"
    >
      <template #icon>
        <div class="">
          <img
            src="/icons/line.png"
            alt=""
          >
        </div>
      </template>
      使用 Microsoft 帳號登入
    </n-button>
  </section>
</template>
