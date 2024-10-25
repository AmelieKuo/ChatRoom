import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import utc from 'dayjs/plugin/utc'
import { defineNuxtPlugin } from '#app'

dayjs.extend(utc)
dayjs.extend(isBetween)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('dayjs', dayjs)
});
