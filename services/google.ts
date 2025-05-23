import { request } from "~/services/request/createRequest";
import type { RequestParams } from "./types";

const googleUrl = "https://www.googleapis.com/oauth2/v3";

export const FETCH_GOOGLE = {
  GetProfile: ({ headers, isUnLoad = true }: RequestParams) =>
    request.get({
      url: "/userinfo",
      base: googleUrl,
      headers,
      isUnLoad
    }),
};