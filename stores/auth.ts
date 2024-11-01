import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const runtimeConfig = useRuntimeConfig();
  const { LineChannel } = runtimeConfig.public;
  const { FETCH_LINE } = useApi();
  const router = useRouter();
  const { $dayjs } = useNuxtApp();

  /** 取得Token */
  const getToken = useCookie("roomToken") as any;

  /** 登入 */
  const globalLogin = (token) => {
    const tempTime = $dayjs().add(23, "hour");
    const maxDate = new Date($dayjs(tempTime).utc().format());

    const loginToken = useCookie("roomToken", {
      expires: maxDate,
    });
  
    loginToken.value = JSON.stringify(token);
  };

  /** 登出 */
  const globalLoginOut = () => {
    console.log("登出");
    const token = useCookie("roomToken") as any;
    token.value = null;

    router.push({ name: "login" });
  };

  /** 會員資料 */ 
  const userProfile = ref<Record<string, unknown>>({});

  /** @func 建立會員資料 */
  const setUserProfile = (profile: Record<string, unknown>) => {
    userProfile.value = profile;
  };

  return {
    getToken,
    globalLogin,
    globalLoginOut,
    userProfile,
    setUserProfile,
  };
});
