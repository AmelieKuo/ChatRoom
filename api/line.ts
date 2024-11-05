import { request } from "~/utils/request/createRequest";

const lineUrl = "https://api.line.me/oauth2/v2.1";

export const FETCH_LINE = {
  GetToken: (data: any, headers: any, isUnLoad: boolean = true) =>
    request.post("/token", 
      data, 
      lineUrl, 
      headers,
      isUnLoad),

  GetProfile: (data: any, headers: any, isUnLoad: boolean = true) =>
    request.post("/verify", 
      data, 
      lineUrl,
      headers,  
      isUnLoad),
};
