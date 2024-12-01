import { request } from "~/services/request/createRequest";
import type { RequestParams } from "./types";

export const FETCH_GITHUB = {
  GetProfile: ({ headers, isUnLoad = true, handleError }: RequestParams) =>
    request.get({
      url: "/user",
      base: "https://api.github.com",
      headers,
      error: handleError,
      isUnLoad
    }),
};
