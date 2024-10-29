import { request } from '~/utils/request/request'

export const FETCH_LINE = {
  GetToken: (data: any, headers: object = {}, isUnLoad: boolean = true) =>
    request.post('/token', headers, data, isUnLoad),

  GetProfile: (params: any, headers: object = {}, isUnLoad: boolean = true) =>
    request.get('/users', headers, params, isUnLoad),
}
