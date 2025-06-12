import generateUUID from "~/utils/uuid";

/** Line OAuth 功能 */
export const useLine = () => {
  const { $api } = useNuxtApp() as any;
  const { FETCH_LINE } = $api;
  const runtimeConfig = useRuntimeConfig();
  const { LineChannel, LineSecret, baseUrl, mode } = runtimeConfig.public;
  const { globalLogin, globalLoginOut } = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  /** @func Line登入 */
  const lineLogin = () => {
    const tempUUID = generateUUID();
    const redirectURI = mode === "development" ? "http://localhost:3000/redirect/line" : `${baseUrl}/redirect/line`;    
    const scope = "profile openid";
    const link = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LineChannel}&redirect_uri=${redirectURI}&state=${tempUUID}&scope=${scope}&prompt=consent&ui_locales=zh-TW&client_secret=${LineSecret}`;
    if (process.client) {
      window.location.href = link;
    }
  };

  /** @func 獲取會員資料 */
  const getLineProfile = async (accessToken: string, idToken: string) => {
    try {
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Bearer ${accessToken}`,
      };

      const requestBody = new URLSearchParams({
        id_token: idToken,
        client_id: LineChannel,
      }).toString();

      const { data } = await FETCH_LINE.GetProfile({data:requestBody, headers, handleError});
      if (data) {
        const accountInfo = {
          account: data.sub,
          name: data.name,
          pic: data.picture,
        };
        globalLogin(accountInfo);
      }

      await router.push("/");
    } catch (error) {
      console.error("Error fetching LINE profile:", error);
    }
  };

  /** @func 取得Token */
  const  getLineToken = async () => {
    try {
      const code = typeof route.query.code === "string" ? route.query.code : "";
      const requestBody = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: LineChannel,
        redirect_uri: mode === "development" ? "http://localhost:3000/redirect/line" : `${baseUrl}/redirect/line`,
        client_secret: LineSecret,
      }).toString();

      const headers = { "Content-Type": "application/x-www-form-urlencoded" };
      const { data } = await FETCH_LINE.GetToken({ data: requestBody, headers, handleError });

      if (data?.access_token && data?.id_token) {
        const { access_token, id_token } = data;
        await getLineProfile(access_token, id_token);
      }
    } catch (error) {
      console.error("Error fetching LINE token:", error);
    }
  };

  const handleError = (error: any): { error: any; data: null; msg: string } => {
    const { url = "", _data = {}, statusText = "LINE API Error" } = error || {};
    const { error_description = "未知錯誤" } = _data;
  
    /** Line OAuth2.0 錯誤處理 */
    if (url.includes("api.line.me") && error_description === "invalid_request") {
      globalLoginOut();
    }
  
    return {
      error,
      data: null,
      msg: `${statusText}: ${error_description}`
    };
  };  

  return { lineLogin, getLineToken, getLineProfile, handleError };
};
