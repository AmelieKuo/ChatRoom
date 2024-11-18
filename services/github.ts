import { request } from "~/services/request/createRequest";

export const FETCH_GITHUB = {
  GetProfile: (params: any, headers?: any, githubUrl:any, isUnLoad: boolean = true) =>
    request.get("/user",
      params,
      githubUrl,
      headers,
      isUnLoad),
};
