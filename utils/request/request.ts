import instance from './instance'

function createRequest() {
  const get = (url: string, params = {}, isUnLoad = false) => {
    return instance(url, {
      method: 'get',
      params,
    }, isUnLoad)
  };

  const post = (url: string, body = {}, isUnLoad = false) => {
    return instance(url, {
      method: 'post',
      body,
    }, isUnLoad)
  };

  const put = (url: string, body = {}, isUnLoad = false) => {
    return instance(url, {
      method: 'put',
      body,
    }, isUnLoad)
  };

  const del = (url: string, body = {}, isUnLoad = false) => {
    return instance(url, {
      method: 'delete',
      body,
    }, isUnLoad)
  };

  return {
    get,
    post,
    put,
    delete: del,
  }
}

export const request = createRequest()
