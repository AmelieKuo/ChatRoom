export default defineNuxtRouteMiddleware((to, from) => {
  const loginToken = useCookie('roomToken');

  if (!loginToken.value) {
    return navigateTo('/login');
  } 

  if (loginToken.value){
    console.log('登入成功')
  }

  if (loginToken.value && to.path === '/login') {
    return navigateTo('/');
  }
});