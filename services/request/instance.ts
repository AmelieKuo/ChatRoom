import { createDiscreteApi } from "naive-ui";
import generateUUID from "~/utils/uuid";
import handleServiceResult from "~/utils/result";

const useModal = createDiscreteApi(["modal"]);
const { modal: alert } = useModal;

interface Options {
  method: string,
  body?: Record<string, any>,
  params?: Record<string, any>,
  headers?: Record<string, any>,
  baseURL?: string,
  error?: (error: any) => void,
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
  const { public: { mode, baseUrl, apiPattern } } = useRuntimeConfig(); // 從 runtimeConfig 獲取 API 基礎 URL

  const hasOtherAuth = options.headers?.Authorization !== null;
  const handle3PApiError = options.error;

  const { data, status, error, response } = await $fetch<ResponseData<T>>(
    reqUrl,
    {
      method: options.method,
      baseURL: options.baseURL ?? (mode === "development" ? "/chatRoom/api/" : `${baseUrl}${apiPattern}`),
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
        const { url, status, _data } = error;

        /** Line OAuth2.0 錯誤 */
        if (url.includes("api.line.me") && _data?.error_description === "invalid_request") {
          globalLoginOut();
        }

        return handleServiceResult(error, null);
      },
      onResponse({ response }) {

        if (options.baseURL){
          return response;
        }else{
          const { resultCode, message, data } = response as any;
  
          /** 01: 失敗、10: 成功 */ 
          if (resultCode === '01') {
            const error = true
            return handleServiceResult(error, message, data);
          }else{
            return handleServiceResult(null, message, data);
          }
        }

      },
      onResponseError({ response }) {
        const { error:apiError } = response as any;

        if (options.error){
          const error = handle3PApiError(apiError);

          return error
        }else{
          return handleServiceResult(error, error.message);
        }
      },
    }
  );

  // 返回結果
  return {
    data,
    pending: status === "pending",
    error: error || response?.error,
    refresh: () => { }, // 根據需要定義 refresh 逻辑
  };
}
