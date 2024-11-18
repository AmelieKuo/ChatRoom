export default async function handleServiceResult(error, message, data) {
  if (error) {
    const fail = {
      error,
      data,
      msg: message,
    };
    return fail;
  }
  const success = {
    error: null,
    data,
    msg: message,
  };
  return success;
}

