import { request } from "~/services/request/createRequest";
import type { RequestParams } from "./types";

const lineUrl = "https://api.line.me/oauth2/v2.1";

export const FETCH_LINE = {
  GetToken: ({ data, headers, isUnLoad = true, handleError }: RequestParams) => {
    return request.post({
      url: "/token",
      data,
      base: lineUrl,
      headers,
      isUnLoad,
      error: handleError,
    });
  },

  GetProfile: ({ data, headers, isUnLoad = true, handleError }: RequestParams) => {
    return request.post({
      url: "/verify",
      data,
      base: lineUrl,
      headers,
      isUnLoad,
      error: handleError,
    })
  }
};
