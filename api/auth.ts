import { request } from '~/utils/request/request'

export const FETCH_AUTH = {
  Login: (data: any, isUnLoad: boolean) => request.post('/login', data, isUnLoad),
  Test: (params: any, isUnLoad: boolean) => request.get('/users', params, isUnLoad),
}
