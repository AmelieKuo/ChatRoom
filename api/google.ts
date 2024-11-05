import { request } from "~/utils/request/createRequest";

const googleUrl = "https://www.googleapis.com/oauth2/v3";

export const FETCH_GOOGLE = {
  GetProfile: (params: any, headers: any, isUnLoad: boolean = true) =>
    request.get("/userinfo",
      params,
      googleUrl,
      headers,
      isUnLoad),
};
