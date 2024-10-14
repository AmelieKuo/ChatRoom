
import { defineNuxtPlugin } from '#app'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)
dayjs.extend(isBetween);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('dayjs', dayjs)
})