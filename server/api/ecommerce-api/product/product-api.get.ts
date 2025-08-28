export default defineEventHandler(async () => {
  const API_BASE = 'http://localhost:3001'
  
  try {
    const products = await $fetch(`${API_BASE}/products`)
    
    return {
      success: true,
      data: products
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products',
      data: { error }
    })
  }
})