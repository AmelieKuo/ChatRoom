export default defineNuxtRouteMiddleware((to, from) => {
  const loginToken = useCookie('roomToken')

  if (!loginToken.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
