import { decodeCredential, googleTokenLogin } from "vue3-google-login";


/** Google OAuth 功能 */
export const useGoogle = () => {
  const { FETCH_GOOGLE } = useApi();
  const runtimeConfig = useRuntimeConfig();
  const { GoogleClientId } = runtimeConfig.public;
  const { globalLogin } = useAuthStore();
  // const router = useRouter();
  // const route = useRoute();

  /** @func 獲取會員資料 */
  const getGoogleProfile = async (googleAuth) => {
    const headers = {
      "Authorization": `Bearer ${googleAuth.access_token}`,
    };

    const response = await FETCH_GOOGLE.GetProfile(undefined,headers);

    if (response) {
      const accountInfo = {
        account: response.sub,
        name: response.name,
        pic: response.picture,
      };
      globalLogin(accountInfo);
    }
  };

  /** @func Line登入 */
  const googleLogin = () => {
    googleTokenLogin({
      clientId: GoogleClientId
    }).then((googleAuth) => {
      console.log(googleAuth);

      if (!googleAuth){
        return;
      }
      
      getGoogleProfile(googleAuth);
    });
  };

  /** @func 取得Token */
  // const getLineToken = async () => {
  //   try {
  //     const code = typeof route.query.code === "string" ? route.query.code : "";
  //     const requestBody = new URLSearchParams({
  //       grant_type: "authorization_code",
  //       code,
  //       client_id: LineChannel,
  //       redirect_uri: "http://localhost:3000/login",
  //       client_secret: LineSecret,
  //     }).toString();

  //     const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  //     const tokenResponse = await FETCH_LINE.GetToken(requestBody, headers);

  //     console.log(tokenResponse);

  //     if (tokenResponse?.access_token && tokenResponse?.id_token) {
  //       const { access_token, id_token } = tokenResponse;
  //       await getLineProfile(access_token, id_token);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching LINE token:", error);
  //   }
  // };

  return { googleLogin, getGoogleProfile, };
};
