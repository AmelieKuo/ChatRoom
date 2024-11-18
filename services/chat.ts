import { request } from "~/services/request/createRequest";

export const FETCH_CHAT = {
  Join: (data: any, isUnLoad: boolean = true) => request.post("/JoinChatRoom", data, isUnLoad),
  Create: (data: any, isUnLoad: boolean = true) => request.post("/CreateChatRoom", data, isUnLoad),
  RemoveChatRoom: (data: any, isUnLoad: boolean = true) => request.delete("/RemoveChatRoom", data, isUnLoad),
};
