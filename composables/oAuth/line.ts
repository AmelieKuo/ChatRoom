import generateUUID from "~/utils/uuid";

/** Line OAuth 功能 */
export const useLine = () => {
  const { $api } = useNuxtApp() as any;
  const { FETCH_LINE } = $api;
  const runtimeConfig = useRuntimeConfig();
  const { LineChannel, LineSecret } = runtimeConfig.public;
  const { globalLogin, globalLoginOut } = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  /** @func Line登入 */
  const lineLogin = () => {
    const tempUUID = generateUUID();
    const redirectURI = "http://localhost:3000/redirect/line";
    const scope = "profile openid";
    const link = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${LineChannel}&redirect_uri=${redirectURI}&state=${tempUUID}&scope=${scope}&prompt=consent&ui_locales=zh-TW&client_secret=${LineSecret}`;
    window.location.href = link;
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

      const response = await FETCH_LINE.GetProfile(requestBody, headers, handleError);
      if (response) {
        const accountInfo = {
          account: response.sub,
          name: response.name,
          pic: response.picture,
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
        redirect_uri: "http://localhost:3000/redirect/line",
        client_secret: LineSecret,
      }).toString();

      const headers = { "Content-Type": "application/x-www-form-urlencoded" };
      const tokenResponse = await FETCH_LINE.GetToken(requestBody, headers);

      if (tokenResponse?.access_token && tokenResponse?.id_token) {
        const { access_token, id_token } = tokenResponse;
        await getLineProfile(access_token, id_token);
      }
    } catch (error) {
      console.error("Error fetching LINE token:", error);
    }
  };

  const handleError = (error: any) => {
    const { url, _data = null, message } = error;
    const { error_description } = _data ? _data : null;
    
    /** Line OAuth2.0 錯誤 */
    if (url.includes("api.line.me") && error_description === "invalid_request") {
      globalLoginOut();
    }

    return {
      error,
      data: null,
      msg: message
    };
  }

  return { lineLogin, getLineToken, getLineProfile, handleError };
};
