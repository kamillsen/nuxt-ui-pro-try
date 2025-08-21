export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { crudcrudBase } = useRuntimeConfig()
  await $fetch(`${crudcrudBase}/todos/${id}`, { method: 'DELETE' })
  return { ok: true }
})
