import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", () => {
  const { $api, $dayjs } = useNuxtApp() as any;
  const { FETCH_AUTH } = $api;

  const { public: { mode } } = useRuntimeConfig();

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

  /** 假 JWT Token */
  const createFakeJwt = (payload: object): string => {
    const base64Encode = (obj: object): string => {
      const json = JSON.stringify(obj);
      const utf8Bytes = new TextEncoder().encode(json);
      const binary = String.fromCharCode(...utf8Bytes);
      return btoa(binary)
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };
  
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = base64Encode(header);
    const encodedPayload = base64Encode(payload);
  
    return `${encodedHeader}.${encodedPayload}.fake-signature`;
  };

  /** 登入 */
  const globalLogin = async(userProfile:any) => {

    const requestBody: loginRequest = {
      loginType: 2,
      account: String(userProfile.account),
      password: "",
      name: String(userProfile.name),
      pic: String(userProfile.pic),
    };

    let profile: Record<string, unknown> = requestBody as unknown as Record<string, unknown>;
    
    const tempTime = $dayjs().add(23, "hour");
    const maxDate = new Date($dayjs(tempTime).utc().format());

    const loginToken = useCookie("roomToken", {
      expires: maxDate,
    });

    if(mode !== "development"){
      const { data: response } = await FETCH_AUTH.Login( { data: requestBody } );
      profile = {
        account: response.account,
        name: response.name,
        pic: response.pic,
      };
      
      loginToken.value = JSON.stringify(response.token);
    }
    
    await setUserProfile(profile);
  
    if(mode === "development"){
      loginToken.value = createFakeJwt(profile);
    }
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
