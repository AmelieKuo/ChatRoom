export default async function instance(reqUrl: string, options: any, isUnLoad: boolean) {
  // 獲取 token
  const tokenAuth = await useCookie<string | undefined | null>("chatRoom_token");
  const { public: { apiBase } } = useRuntimeConfig(); // 從 runtimeConfig 獲取 API 基礎 URL

  const { data, pending, error, refresh } = await $fetch(reqUrl, {
    baseURL: apiBase,
    method: options.method,
    body: Object.keys(options.data || {}).length ? options.data : null, // 處理空 body
    params: options.params || {}, // URL 查詢參數
    onRequest({ options }) {
      // 設置請求頭
      options.headers = options.headers || {};
      options.headers['Content-Type'] = 'application/json'; // 默認為 JSON 請求

      if (tokenAuth.value) {
        options.headers.authorization = `Bearer ${tokenAuth.value.accessToken}`; // 如果存在 token，則設置 Authorization header
      }
    },
    onRequestError({ error }) {
      // 處理請求錯誤
      console.error('Request Error:', error);
      return error; // 返回錯誤
    },
    onResponse({ response }) {
      // 返回解析後的數據
      return response._data;
    },
    onResponseError({ response }) {
      // 處理響應錯誤
      console.error('Response Error:', response);
      return response; // 返回錯誤響應
    }
  });

  return { data, pending, error, refresh }; // 返回結果
}
