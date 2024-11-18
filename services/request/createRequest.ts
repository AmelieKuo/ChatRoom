import instance from "./instance";

function createRequest(requestInfo) {
  console.log(requestInfo)
  const {
    url,
    data,
    params,
    base,
    headers,
    isUnLoad = false,
  } = requestInfo;

  const get = (url: string, params: any, base?: string, headers?: object, isUnLoad: boolean) => {
    return instance(url, {
      method: "GET",
      params,
      baseURL: base,
      headers,
    }, isUnLoad);
  };

  const post = (url: string, data: any, base?: string, headers?: object, isUnLoad: boolean) => { 
    return instance(url, {
      method: "post",
      body: data,
      baseURL: base,
      headers,
    }, isUnLoad);
  };

  const put = (url: string, data: any, base?: string, headers?: object, isUnLoad: boolean) => {
    return instance(url, {
      method: "put",
      body:data,
      baseURL: base,
      headers,
    }, isUnLoad);
  };

  const del = (url: string, data: any, base?: string, headers?: object, isUnLoad: boolean) => {
    return instance(url, {
      method: "delete",
      body:data,
      baseURL: base,
      headers,
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
