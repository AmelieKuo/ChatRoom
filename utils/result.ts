export default function handleServiceResult(
  error: any,
  message: string,
  data: any
) {
  return {
    error,
    data,
    msg: message,
  };
}