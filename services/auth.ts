import { request } from "~/services/request/createRequest";
import type { RequestParams } from "./types";

export const FETCH_AUTH = {
  Login: ({ data, isUnLoad = true }: RequestParams) => request.post({
      url: "/Login",
      data,
      isUnLoad
    }),
  RefreshToken: ({ data, isUnLoad = true }: RequestParams) => request.post({
      url: "/RefreshToken",
      data,
      isUnLoad
    }),
  Logout: ({ data, isUnLoad = false }: RequestParams) => request.post({
      url: "/Logout",
      data,
      isUnLoad
    }),
};