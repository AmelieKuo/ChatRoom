
const getGithubToken = async (client_id, code, client_secret, redirect_uri) => {
  try {
    const requestUrl = `https://github.com/login/oauth/access_token?client_id=${client_id}&code=${code}&client_secret=${client_secret}&${redirect_uri}`;
    const response = await $fetch(requestUrl, {
      method: "POST",
      headers: {
        accept: "application/json"
      },
    });
    
    return response;
  }
  catch (error) {
    console.log(error);
  }
};

export default defineEventHandler(async(event) => {
  try {
    const body = await readBody(event, { strict: true });

    const { client_id, code, client_secret, redirect_uri } = body;

    const resp = await getGithubToken(client_id, code, client_secret, redirect_uri);

    return resp;
  } catch (error) {
    return { error: error.message };
  }
});