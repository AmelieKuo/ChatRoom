import * as api from "~/services";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('api', api)
});