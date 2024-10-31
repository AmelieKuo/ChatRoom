import { request } from '~/utils/request/request'

const lineUrl = 'https://api.line.me/v2'

export const FETCH_LINE = {
  GetToken: (data: any, headers: object = {}, isUnLoad: boolean = true) =>
    request.post('/token', data, lineUrl, headers, isUnLoad),

  GetProfile: (data: any, headers: object = {}, isUnLoad: boolean = true) =>
    request.get('/users', data, lineUrl, headers, isUnLoad),
}
