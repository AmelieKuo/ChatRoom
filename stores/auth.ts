import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const { FETCH_AUTH } = useApi();
  const router = useRouter();
  const { $dayjs } = useNuxtApp();

  interface loginRequest {
    loginType: number; // 1: 一般登入, 2: 第三方登入
    account: string;
    password: string;
    name: string;
    pic: string;
  }

  /** 取得Token */
  const getToken = useCookie("roomToken") as any;

  /** 登入 */
  const globalLogin = async(userProfile) => {

    const requestBody: loginRequest = {
      loginType: 2,
      account: userProfile.account,
      password: "",
      name: userProfile.name,
      pic: userProfile.pic,
    };

    const response = await FETCH_AUTH.Login(requestBody);

    console.log(response);

    const profile = {
      account: response.account,
      name: response.name,
      pic: response.pic,
    };

    setUserProfile(profile);

    // const tempTime = $dayjs().add(23, "hour");
    // const maxDate = new Date($dayjs(tempTime).utc().format());

    // const loginToken = useCookie("roomToken", {
    //   expires: maxDate,
    // });
  
    // loginToken.value = JSON.stringify(token);
  };

  /** 登出 */
  const globalLoginOut = () => {
    console.log("登出");
    const token = useCookie("roomToken") as any;
    token.value = null;

    router.push("/login");
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
