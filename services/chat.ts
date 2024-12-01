import { request } from "~/services/request/createRequest";
import type { RequestParams } from "./types";

export const FETCH_CHAT = {
  Join: ({ data, isUnLoad = true }: RequestParams) => request.post({
      url: "/JoinChatRoom",
      data,
      isUnLoad
    }),
  Create: ({ data, isUnLoad = true }: RequestParams) => request.post({
      url: "/CreateChatRoom",
      data,
      isUnLoad
    }),
  RemoveChatRoom: ({ data, isUnLoad = false }: RequestParams) => request.delete({
      url: "/RemoveChatRoom",
      data,
      isUnLoad
    }),
};