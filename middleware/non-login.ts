export default defineNuxtRouteMiddleware((to, from) => {
  const loginToken = useCookie('roomToken');

  if (loginToken.value && to.path === '/login') {
    console.log('登入成功')
    return navigateTo('/');
  }

});