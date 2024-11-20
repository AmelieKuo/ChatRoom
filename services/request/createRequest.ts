import instance from "./instance";

interface RequestInfo {
  url: string;
  params?: any;
  data?: any;
  base?: string;
  headers?: object;
  isUnLoad?: boolean;
  error?: (error: any) => { error: any; data: any | null; msg: string };
}

function createRequest() {
  const get = (requestInfo: RequestInfo) => {
    const {
      url,
      params,
      base,
      headers,
      isUnLoad = false,
      error = () => null,
    } = requestInfo;

    return instance(url, {
      method: "GET",
      params,
      baseURL: base,
      headers,
      error,
    }, isUnLoad);
  };

  const post = (requestInfo: RequestInfo) => {
    const {
      url,
      data,
      base,
      headers,
      isUnLoad = false,
      error = () => null,
    } = requestInfo;

    return instance(url, {
      method: "post",
      body: data,
      baseURL: base,
      headers,
      error,
    }, isUnLoad);
  };

  const put = (requestInfo: RequestInfo) => {
    const {
      url,
      data,
      base,
      headers,
      isUnLoad = false,
      error = () => null,
    } = requestInfo;

    return instance(url, {
      method: "put",
      body:data,
      baseURL: base,
      headers,
      error
    }, isUnLoad);
  };

  const del = (requestInfo: RequestInfo) => {
    const {
      url,
      data,
      base,
      headers,
      isUnLoad = false,
      error = () => null,
    } = requestInfo;

    return instance(url, {
      method: "delete",
      body:data,
      baseURL: base,
      headers,
      error
    }, isUnLoad);
  };

  return {
    get,
    post,
    put,
    delete: del,
  };
}

export const request = createRequest();
