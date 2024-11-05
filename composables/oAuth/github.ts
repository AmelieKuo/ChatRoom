import generateUUID from "~/utils/uuid";
import { c, createDiscreteApi } from "naive-ui";

/** Github OAuth 功能 */
export const useGithub = () => {
  const useModal = createDiscreteApi(["modal"]);
  const { modal: alert } = useModal;
  const route = useRoute();
  const router = useRouter();
  const { FETCH_GITHUB } = useApi();
  const runtimeConfig = useRuntimeConfig();
  const { GithubClientId, GithubSecret } = runtimeConfig.public;
  const { globalLogin } = useAuthStore();

  const getGithubProfile = async (accessToken: string) => {

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const resp = await FETCH_GITHUB.GetProfile(undefined, headers, "https://api.github.com");

    if (resp) {
      const accountInfo = {
        account: resp.id,
        name: resp.login,
        pic: resp.avatar_url,
      };

      console.log(accountInfo);
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
      redirect_uri: "http://localhost:3000/redirect/github"
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

    const token = data.value.access_token;
    await getGithubProfile(token);
  };

  /** @func 登入 */
  const githubLogin = async () => {
    const tempUUID = generateUUID();

    const redirectURI = "http://localhost:3000/redirect/github";
    const scope = "user:email";
    const link = `https://github.com/login/oauth/authorize?client_id=${GithubClientId}&redirect_uri=${redirectURI}&state=${tempUUID}&scope=${scope}`;
    window.location.href = link;
  };

  return { githubLogin, getGithubToken, getGithubProfile };
};
