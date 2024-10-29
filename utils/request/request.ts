import instance from './instance'

function createRequest() {
  const get = (base?: string, url: string, params = {}, isUnLoad = false) => {
    return instance(url, {
      baseURL: base,
      method: 'GET',
      params,
    }, isUnLoad)
  }

  const post = (base?: string, url: string, body = {}, isUnLoad = false) => {
    return instance(url, {
      baseURL: base,
      method: 'post',
      body,
    }, isUnLoad)
  }

  const put = (base?: string, url: string, body = {}, isUnLoad = false) => {
    return instance(url, {
      baseURL: base,
      method: 'put',
      body,
    }, isUnLoad)
  }

  const del = (base?: string, url: string, body = {}, isUnLoad = false) => {
    return instance(url, {
      baseURL: base,
      method: 'delete',
      body,
    }, isUnLoad)
  }

  return {
    get,
    post,
    put,
    delete: del,
  }
}

export const request = createRequest()
