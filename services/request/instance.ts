import handleServiceResult from "~/utils/result";

interface Options {
  method:
    | "delete" | "get" | "GET" | "HEAD" | "PATCH" | "POST"
    | "PUT" | "DELETE" | "CONNECT" | "OPTIONS" | "TRACE"
    | "head" | "patch" | "post" | "put" | "connect" | "options" | "trace";
  body?: any;
  params?: any;
  headers?: Record<string, string>;
  baseURL?: string;
  error?: (error: any) => { error: any; data: any | null; msg: string };
}

export default async function instance(
  reqUrl: string,
  options: Options,
  isUnLoad: boolean = false
): Promise<{ error: any; data: any; msg: string }> {
  const useAuth = useAuthStore();
  const { globalLoginOut } = useAuth;

  const tokenAuth = await useCookie<string | undefined | null>("roomToken");
  const { public: { mode, baseUrl, apiPattern } } = useRuntimeConfig();

  const hasOtherAuth = options.headers?.Authorization != null;
  const isFormURLEncoded = typeof options.body === "string";

  try {
    const response = await $fetch<any>(reqUrl, {
      method: options.method,
      baseURL: options.baseURL ?? (mode === "development"
        ? "http://172.26.36.181:8087/api/"
        : `${baseUrl}${apiPattern}`),
      headers: {
        ...(options.headers ?? {}),
        ...(isFormURLEncoded
          ? {}
          : { accept: "*/*", "Content-Type": "application/json" }),
      },
      body: Object.keys(options.body || {}).length ? options.body : null,
      params: options.params || {},
      onRequest({ options }) {
        if (!hasOtherAuth && tokenAuth.value) {
          options.headers.set("Authorization", `Bearer ${tokenAuth.value}`);
        }
      }
    });

    // 本地 API：處理 resultCode 格式
    if (!options.baseURL && response) {
      const { resultCode, message, errorMessage, data } = response;
      return resultCode === "01"
        ? handleServiceResult(true, errorMessage, data)
        : handleServiceResult(null, message, data);
    }

    // 第三方 API：保留原樣
    return handleServiceResult(null, "success", response);

  } catch (err: any) {
    const { response } = err;

    // 401 自動登出
    if (response?.status === 401) {
      globalLoginOut();
      return handleServiceResult(true, "登入已失效，請重新登入", null);
    }

    // 自定義錯誤處理（如 Github、LINE 等）
    if (typeof options.error === "function") {
      return options.error(err);
    }

    // 其他錯誤情況
    return handleServiceResult(true, err?.message || "系統發生錯誤", null);
  }
}
