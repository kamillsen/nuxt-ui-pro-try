export default defineEventHandler(async () => {
  const API_BASE = 'http://localhost:3001'
  
  try {
    const customers = await $fetch(`${API_BASE}/customers`)
    
    return {
      success: true,
      data: customers
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch customers',
      data: { error }
    })
  }
})