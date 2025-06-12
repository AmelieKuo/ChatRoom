import generateUUID from "~/utils/uuid";
import { createDiscreteApi } from "naive-ui";
const { public: { baseUrl } } = useRuntimeConfig(); 

/** Github OAuth 功能 */
export const useGithub = () => {
  const useModal = createDiscreteApi(["modal"]);
  const { modal: alert } = useModal;
  const route = useRoute();
  const router = useRouter();
  const { $api } = useNuxtApp() as any;
  const { FETCH_GITHUB } = $api;
  const runtimeConfig = useRuntimeConfig();
  const { GithubClientId, GithubSecret, mode } = runtimeConfig.public;
  const { globalLogin, globalLoginOut } = useAuthStore();

  const getGithubProfile = async (accessToken: string) => {

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const { data } = await FETCH_GITHUB.GetProfile( { headers, handleError } );

    if (data) {
      const accountInfo = {
        account: data.id,
        name: data.login,
        pic: data.avatar_url,
      };

      globalLogin(accountInfo);
    }
  };

  /** @func 獲取Token */
  const getGithubToken = async () => {
    const code = typeof route.query.code === "string" ? route.query.code : "";
    const requestBody = {
      client_id: GithubClientId,
      code: code,
      client_secret: GithubSecret,
      redirect_uri: mode === "development" ? "http://localhost:3000/redirect/github" : `${baseUrl}/redirect/github`
    };

    const { data, error } = await useFetch("/api/githubToken", {
      method: "POST",
      body: requestBody
    });

    if (error.value){
      console.error("Error fetching Github token:", error);
      const currentModal = alert.create({
        title: "請重新操作一次",
        preset: "dialog",
      });
      currentModal.destroy();
      router.push("/login");
    }

    const token = (data.value as { access_token: string })?.access_token;
    await getGithubProfile(token);
  };

  /** @func 登入 */
  const githubLogin = async () => {
    const tempUUID = generateUUID();

    const redirectURI = mode === "development" ? "http://localhost:3000/redirect/github" : `${baseUrl}/redirect/github`
    const scope = "user:email";
    const link = `https://github.com/login/oauth/authorize?client_id=${GithubClientId}&redirect_uri=${redirectURI}&state=${tempUUID}&scope=${scope}`;
    if (process.client) {
      window.location.href = link;
    }
  };

  const handleError = (error: any) => {
    const { url, data, message } = error;

    // GitHub 錯誤處理
    if (url.includes("github") && data.status === "401") {
      globalLoginOut();
    }

    return {
      error,
      data: null,
      msg: message
    };
  }

  return { githubLogin, getGithubToken, getGithubProfile, handleError };
};
