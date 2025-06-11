export default defineNuxtRouteMiddleware((to, from) => {
  const loginToken = useCookie("roomToken");

  const whiteRouter = ["login", "redirect-id"];
  if (!loginToken.value && !whiteRouter.includes(to.name)) {
    return navigateTo("/login");
  }
});
