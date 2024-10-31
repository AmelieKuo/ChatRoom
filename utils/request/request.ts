import instance from './instance'

function createRequest() {
  const get = (url: string, params: any, isUnLoad:boolean , base?: string, header:object) => {
    return instance(url, {
      baseURL: base,
      header
      method: 'GET',
      params,
    }, isUnLoad)
  }

  const post = (url: string, data: any, isUnLoad:boolean , base?: string) => {
    return instance(url, {
      baseURL: base,
      method: 'post',
      body: data,
    }, isUnLoad)
  }

  const put = (url: string, data:any, isUnLoad:boolean , base?: string) => {
    return instance(url, {
      baseURL: base,
      method: 'put',
      body:data,
    }, isUnLoad)
  }

  const del = (url: string, data:any, isUnLoad:boolean , base?: string) => {
    return instance(url, {
      baseURL: base,
      method: 'delete',
      body:data,
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
