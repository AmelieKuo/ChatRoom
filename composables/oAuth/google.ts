import { googleTokenLogin } from "vue3-google-login";


/** Google OAuth 功能 */
export const useGoogle = () => {
  const { $api } = useNuxtApp() as any;
  const { FETCH_GOOGLE } = $api();
  const runtimeConfig = useRuntimeConfig();
  const { GoogleClientId } = runtimeConfig.public;
  const { globalLogin } = useAuthStore();

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

  /** @func Google登入 */
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

  return { googleLogin, getGoogleProfile, };
};
