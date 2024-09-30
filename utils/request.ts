export



async function _fetchData(url: string, params: Record<string, string | number | boolean | undefined> = {}, config: any = {}) {
  const { public: { apiBaseUrl } } = useRuntimeConfig();

  const cookieAuth = await useCookie<string | undefined | null>("auth");
  const useToken = cookieAuth.value

  // if (useToken) {
  //   config['X-token'] = useToken;
  //   config['Content-Type'] ??= 'application/json';
  // }

  const { _data } = await $fetch.raw(url, {
    baseURL: `${apiBaseUrl}`,
    headers: config,
    timeout: 30000,
    ...params,
    onRequest() { },
    onRequestError({ request, response, options }) {
      throw response
    },
    onResponse({ response }: FetchContext<any, ResponseType> & { response: FetchResponse<any> }) {
      const { resultCode = 10, message, errorMessage } = response;
      if (resultCode === 10) {
        return message;
      } else if (resultCode === 1) {
        console.log(errorMessage)
      } else {
        console.log(errorMessage)
      }
    },
    onResponseError() {
      console.log('onResponseError')
    },
  }) as any;
  return _data.code === 200 ? _data : []
}

export function fetchData(url: string, params: Record<string, any> = {}, config: any = {}): Promise<any> {
  return _fetchData(url, params, config).then((res) => res).catch((e) => { throw e });
}
