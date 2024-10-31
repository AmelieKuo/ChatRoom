import { request } from '~/utils/request/request'

export const FETCH_CHAT = {
  Join: (data: any, isUnLoad: boolean = true) => request.post('/JoinChatRoom', data, isUnLoad),
  Create: (data: any, isUnLoad: boolean = true) => request.get('/CreateChatRoom', data, isUnLoad),
}
