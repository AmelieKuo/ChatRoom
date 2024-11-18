import { request } from "~/services/request/createRequest";
const { handleError } = useLine();

const lineUrl = "https://api.line.me/oauth2/v2.1";

export const FETCH_LINE = {
  GetToken: ({data, headers, isUnLoad}) =>
    request.post("/token", 
      data, 
      lineUrl, 
      headers,
      isUnLoad,
      handleError,

    ),

  GetProfile: ({data, headers,isUnLoad}) =>
    request.post("/verify", 
      data, 
      lineUrl,
      headers,  
      isUnLoad,
      handleError,
    ),
};
