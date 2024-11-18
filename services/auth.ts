import { request } from "~/services/request/createRequest";

export const FETCH_AUTH = {
  Login: (data: any, isUnLoad: boolean) => request.post("/Login", data, isUnLoad),
  RefreshToken: (data: any, isUnLoad: boolean) => request.post("/RefreshToken", data, isUnLoad),
  Logout: (data: any, isUnLoad: boolean) => request.post("/Logout", data, isUnLoad),
};
