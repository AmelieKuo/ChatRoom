import generateUUID from "~/utils/uuid";
import handleServiceResult from "~/utils/result";
import { useMessage } from 'naive-ui'

// const useMsg = useMessage()

interface Options {
  method: string,
  body?: Record<string, any>,
  params?: Record<string, any>,
  headers?: Record<string, any>,
  baseURL?: string,
  error?: ((error: any) => void) | null,
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
  const tokenAuth = await useCookie<string | undefined | null>("roomToken");
  const { public: { mode, baseUrl, apiPattern } } = useRuntimeConfig(); // 從 runtimeConfig 獲取 API 基礎 URL

  const hasOtherAuth = options.headers?.Authorization != null;
  const handle3PApiError = options.error !== null && options.error !== undefined;

  const response = await $fetch<ResponseData<T>>(
    reqUrl,
    {
      method: options.method,
      baseURL: options.baseURL ?? (mode === "development" ? "http://172.26.36.181:8087/api/" : `${baseUrl}${apiPattern}`),
      headers: options.headers ?? { "accept": "*/*", "Content-Type": "application/json" },
      body: Object.keys(options.body || {}).length ? options.body : null, // 處理空 body
      params: options.params || {}, // URL 查詢參數
      onRequest({ options }) {
        // 設置 Authorization header
        if (!hasOtherAuth && tokenAuth.value) {
          options.headers.set("Authorization", `Bearer ${tokenAuth.value}`);
        }
      },
      onRequestError(options) {
        // 這裡可以處理請求錯誤
        console.log('onRequestError:', options);
      },
      onResponse({ response: oriResponse }) {

        // 第三方 API
        if (options.baseURL) {
          return oriResponse;
        } else {
          const { resultCode, errorMessage, data } = oriResponse._data as any;
          /** 01: 失敗、10: 成功 */
          if (resultCode === '01') {
            const result = handleServiceResult(true, errorMessage, data);
            console.log('result:',result);
            return result
          } else {
            const result = handleServiceResult(null, errorMessage, data);
            console.log('result:',result);
            return result
          }
        }
      },
      onResponseError({ response:oriResponse }) {
        const { error: apiError, resultCode, status, statusText, _data } = oriResponse as any;

        if (handle3PApiError) {
          // 如果自定義錯誤處理函數存在，則調用它
          const error = handle3PApiError(apiError);
          return error;
        } else if (resultCode && resultCode === '01') {
          // 如果返回的結果碼是 01（失敗），則返回錯誤信息
          return handleServiceResult(true, statusText || 'API Error', _data);
        } else if (status === 401) {
          // 登錄失效的情況，調用登出處理
          // 可以顯示登錄失效提示（目前已注釋）
          // useMsg.error({
          //   icon: 'error',
          //   content:'登入已失效，請重新登入',
          //   onLeave: () => {
          //     globalLoginOut();
          //   }
          // })

          const $useMsg = useMessage()
          $useMsg.error('登入已失效，請重新登入',{
            onLeave: () => {
              globalLoginOut();
            }
          })

          // globalLoginOut();
        } else {
          // 其他錯誤情況，返回錯誤信息
          return handleServiceResult(true, statusText, _data);
        }
      },
    }
  );
  
  console.log('instance response:', response);
  return response;
}
