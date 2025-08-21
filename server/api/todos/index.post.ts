export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { title, done?, createdAt? }
  const { crudcrudBase } = useRuntimeConfig()
  return await $fetch(`${crudcrudBase}/todos`, { method: 'POST', body })
})
