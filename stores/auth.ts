import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  // const { FETCH_LINE } = useApi();
  const runtimeConfig = useRuntimeConfig();
  const { LineChannel } = runtimeConfig.public;

  const userProfile = ref<Record<string, unknown>>({});

  const setUserProfile = (profile: Record<string, unknown>) => {
    userProfile.value = profile
  }

  const getProfile = async (accessToken: string, idToken: string) => {
    try {
      const header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + accessToken,
      };

      const requestBody = new URLSearchParams({
        id_token: idToken,
        client_id: LineChannel,
      });

      const { data } = await FETCH_LINE.GetProfile(requestBody, header);

      setUserProfile(data)
    }
    catch (error) {
      console.log(error)
    }
  }

  return {
    userProfile,
    setUserProfile,
    getProfile,
  }
});
