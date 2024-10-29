interface Options {
  method: string
  data?: Record<string, any>
  params?: Record<string, any>
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
  header?: Record<string, string>,
  baseUrl?: string,
): Promise<ResponseData<T>> {
  // 獲取 token
  const tokenAuth = await useCookie<string | undefined | null>("chatRoom_token");
  const { public: { apiBase } } = useRuntimeConfig(); // 從 runtimeConfig 獲取 API 基礎 URL

  const { data, pending, error, refresh } = await $fetch<ResponseData<T>>(
    reqUrl, {
      baseURL: baseUrl ?? apiBase, // 使用 nullish 合併運算符
      method: options.method,
      body: Object.keys(options.data || {}).length ? options.data : null, // 處理空 body
      params: options.params || {}, // URL 查詢參數
      onRequest({ options }) {
      // 設置請求頭
        if (header) {
          Object.entries(header).forEach(([key, value]) => {
            options.headers.set(key, value);
          })
        }
        else {
          options.headers.set("Content-Type", "application/json"); // 默認為 JSON 請求

          if (tokenAuth.value) {
            options.headers.set("Authorization", `Bearer ${tokenAuth.value}`); // 如果存在 token，則設置 Authorization header
          }
        }
      },
      onRequestError({ error }) {
      // 處理請求錯誤
        console.error("Request Error:", error);
        return error; // 返回錯誤
      },
      onResponse({ response }) {
      // 返回解析後的數據
        return response._data;
      },
      onResponseError({ response }) {
      // 處理響應錯誤
        console.error("Response Error:", response);
        return response; // 返回錯誤響應
      },
    },
  )

  return { data, pending, error, refresh }; // 返回結果
}
