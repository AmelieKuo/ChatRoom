import generateUUID from "~/utils/uuid";
import { useAuthStore } from "~/stores/auth";

/** Line OAuth 功能 */
export const useLine = () => {
  const { FETCH_LINE } = useApi();
  const { $dayjs } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();
  const { LineChannel, LineSecret } = runtimeConfig.public;
  const { setUserProfile } = useAuthStore();
  const router = useRouter();
  const route = useRoute();

  /** @func Line登入 */
  const lineLogin = () => {
    const tempUUID = generateUUID();
    const redirectURI = encodeURIComponent("http://localhost:3000/login");
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

      const response = await FETCH_LINE.GetProfile(requestBody, headers);
      if (response) {
        setUserProfile(response);
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
        redirect_uri: "http://localhost:3000/login",
        client_secret: LineSecret,
      }).toString();

      const headers = { "Content-Type": "application/x-www-form-urlencoded" };
      const tokenResponse = await FETCH_LINE.GetToken(requestBody, headers);

      if (tokenResponse?.access_token && tokenResponse?.id_token) {
        const { access_token, id_token } = tokenResponse;
        const tempTime = $dayjs().add(23, "hour").utc().format();
        const maxDate = new Date(tempTime);

        const loginToken = useCookie("roomToken", { expires: maxDate });
        loginToken.value = JSON.stringify({ accessToken: access_token, idToken: id_token });

        await getLineProfile(access_token, id_token);
      }
    } catch (error) {
      console.error("Error fetching LINE token:", error);
    }
  };

  return { lineLogin, getLineToken, getLineProfile };
};
