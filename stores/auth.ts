import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const { $api, $dayjs } = useNuxtApp() as any;
  const { FETCH_AUTH } = $api;

  const router = useRouter();
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
  const globalLogin = async(userProfile:any) => {

    const requestBody: loginRequest = {
      loginType: 2,
      account: String(userProfile.account),
      password: "",
      name: String(userProfile.name),
      pic: String(userProfile.pic),
    };

    const { data:response } = await FETCH_AUTH.Login( { data: requestBody } );
    // const response = {
    //   account: requestBody.account,
    //   name: requestBody.name,
    //   pic: requestBody.pic,
    // };

    // console.log(response);

    const profile = {
      account: requestBody.account,
      name: requestBody.name,
      pic: requestBody.pic,
    };

    console.log(profile);

    await setUserProfile(profile);

    const tempTime = $dayjs().add(23, "hour");
    const maxDate = new Date($dayjs(tempTime).utc().format());

    const loginToken = useCookie("roomToken", {
      expires: maxDate,
    });

    // const token = 'ekmkmofoomiojiojoijjj'
  
    loginToken.value = JSON.stringify(response.token);
    router.push("/");
  };

  /** 登出 */
  const globalLoginOut = () => {
    const token = useCookie("roomToken") as any;
    token.value = null;

    router.push("/login");
  };

  /** 會員資料 */ 
  const userProfile = ref<Record<string, unknown>>({});

  /** @func 建立會員資料 */
  const setUserProfile = (profile: Record<string, unknown>) => {
    console.log(profile);
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
