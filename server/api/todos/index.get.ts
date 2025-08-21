export default defineEventHandler(async () => {
  const { crudcrudBase } = useRuntimeConfig()
  return await $fetch(`${crudcrudBase}/todos`)
})
