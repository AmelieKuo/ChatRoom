import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  
  const runtimeConfig = useRuntimeConfig();
  const { LineChannel } = runtimeConfig.public;

  const userProfile = ref<any>({});

  const setUserProfile = (profile: object) => {
    userProfile.value = profile;
  }

  const getProfile = async (accessToken: string, idToken: string) => {
    try {
      const data: object = await $fetch('https://api.line.me/oauth2/v2.1/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer ' + accessToken
        },
        body: new URLSearchParams({
          'id_token': idToken,
          'client_id': LineChannel,
        })
      })
      
      setUserProfile(data)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    userProfile,
    setUserProfile,
    getProfile,
  }
})