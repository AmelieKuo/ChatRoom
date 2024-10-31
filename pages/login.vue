<script setup lang="ts">
import generateUUID from "~/utils/uuid";

const { FETCH_LINE } = useApi();

const { $dayjs } = useNuxtApp() as any;
const runtimeConfig = useRuntimeConfig();
const { LineChannel, LineSecret } = runtimeConfig.public;
const useAuth = useAuthStore();
const { getProfile } = useAuth;

const router = useRouter();
const route = useRoute();

const handleClick = async () => {
  const tempUUID = generateUUID();
  const link = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LineChannel}&redirect_uri=http://localhost:3000/login&state=${tempUUID}&scope=profile%20openid&prompt=consent&ui_locales=zh-TW&client_secret=${LineSecret}`;
  window.location.href = link;
};

const getToken = async () => {
  try {
    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      code: typeof route.query.code === "string" ? route.query.code : "",
      client_id: LineChannel,
      redirect_uri: "http://localhost:3000/login",
      client_secret: LineSecret,
    }).toString()

    const header = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const { data: tokenResponse }: { data: any } = await FETCH_LINE.GetToken(requestBody, header);

    const obj = {
      accessToken: tokenResponse.access_token,
      idToken: tokenResponse.id_token,
    };

    const tempTime = $dayjs().add(23, "hour");

    const maxDate = new Date($dayjs(tempTime).utc().format());

    const loginToken = useCookie("roomToken", {
      expires: maxDate,
    });

    loginToken.value = JSON.stringify(obj);

    await getProfile(obj.accessToken, obj.idToken);
    await router.push("/");
  }
  catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  if (route.query.code) {
    getToken();
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
    <h1>歡迎使用 ChatRoom</h1>
    <!-- <n-avatar round size="medium" :bordered="true" src="/image/logo.svg" /> -->
    <n-button
      color="#06C755"
      size="large"
      class="mt-[10px] font-bold"
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
      使用 Line 帳號登入
    </n-button>
  </section>
</template>
