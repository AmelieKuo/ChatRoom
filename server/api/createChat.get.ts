import generateUUID from '~/utils/uuid'

export default defineEventHandler(() => {
  const temp = generateUUID()
  console.log('temp', temp)
  return temp
});
