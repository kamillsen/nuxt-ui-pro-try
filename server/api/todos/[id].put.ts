export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const body = await readBody(event)
  const { crudcrudBase } = useRuntimeConfig()

  // CrudCrud PUT'ta body içinde _id kabul etmez
  // @ts-ignore
  delete body._id

  await $fetch(`${crudcrudBase}/todos/${id}`, { method: 'PUT', body })
  return { ok: true }
})
