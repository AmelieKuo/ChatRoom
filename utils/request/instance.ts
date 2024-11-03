import { createDiscreteApi } from "naive-ui";
const useModal = createDiscreteApi(["modal"]);
const { modal: alert } = useModal;

interface Options {
  method: string,
  body?: Record<string, any>,
  params?: Record<string, any>,
  headers?: Record<string, any>,
  baseURL?: string,
}

interface ResponseData<T> {
  data: T
  pending: boolean
  error: any
  refresh: () => void
}

export default async function instance<T>(
  reqUrl: string,
  options: Options,
  isUnLoad: boolean,
): Promise<ResponseData<T>> {
  const useAuth = useAuthStore();
  const { globalLoginOut } = useAuth;

  // 獲取 token
  const tokenAuth = await useCookie<string | undefined | null>("chatRoom_token");
  const { public: { apiBase } } = useRuntimeConfig(); // 從 runtimeConfig 獲取 API 基礎 URL

  const hasOtherAuth = options.headers?.Authorization !== null;

  const response = await $fetch<ResponseData<T>>(
    reqUrl, {
      method: options.method,
      baseURL: options.baseURL ?? apiBase,
      headers: options.headers ?? { "accept": "*/*", "Content-Type": "application/json" },
      body: Object.keys(options.body || {}).length ? options.body : null, // 處理空 body
      params: options.params || {}, // URL 查詢參數
      onRequest({ options }) {

      // 設置 Authorization header
      if (!hasOtherAuth && tokenAuth.value) {
        options.headers.set("Authorization", `Bearer ${tokenAuth.value}`);
      }

      },
      onRequestError({ error }) {
        console.log(111);
        const { url, status, _data } = error;
        
        /** Line OAuth2.0 錯誤 */
        if (url.includes("api.line.me")) {
          if (_data.error_description === "invalid_request") {
              globalLoginOut();
            }
        }
      // 處理請求錯誤
        console.error("Request Error:", error);
        return error; // 返回錯誤
      },
      onResponse({ response }) {
        return response;
      },
      onResponseError({ response }) {
        const { url, status, _data } = response;

        /** Line OAuth2.0 錯誤 */
        if (url.includes("api.line.me")) {
          if (_data.error === "invalid_request") {
            globalLoginOut();
          }
        }

        const currentModal = alert.create({
          title: "請重新登入",
          preset: "dialog",
        });

        currentModal.destroy();

        console.error("Response Error:", response);
        return response; // 返回錯誤響應
      },
    },
  );

  return response; // 返回結果
}
