import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
}

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([
    { id: 1, name: 'MacBook Pro', price: 25000, category: 'elektronik', inStock: true },
    { id: 2, name: 'iPhone 15', price: 15000, category: 'elektronik', inStock: true },
    { id: 3, name: 'Wireless Mouse', price: 200, category: 'elektronik', inStock: false },
    { id: 4, name: 'Vue.js Kitabı', price: 120, category: 'kitap', inStock: true },
    { id: 5, name: 'JavaScript Guide', price: 150, category: 'kitap', inStock: true },
    { id: 6, name: 'Kahve Fincanı', price: 50, category: 'ev-esyasi', inStock: true },
    { id: 7, name: 'Masa Lambası', price: 300, category: 'ev-esyasi', inStock: false },
    { id: 8, name: 'Bluetooth Kulaklık', price: 800, category: 'elektronik', inStock: true }
  ])
  
  const tax = ref(0.18)

  // Basic getters
  const productCount = computed(() => products.value.length)
  
  const totalValue = computed(() => 
    products.value.reduce((sum, product) => sum + product.price, 0)
  )
  
  const totalWithTax = computed(() => 
    Math.round(totalValue.value * (1 + tax.value))
  )
  
  const inStockProducts = computed(() =>
    products.value.filter(product => product.inStock)
  )
  
  const inStockCount = computed(() => inStockProducts.value.length)
  
  const categories = computed(() => {
    const cats = products.value.map(p => p.category)
    return [...new Set(cats)]
  })

  const productsByCategory = computed(() => {
    return products.value.reduce((groups: Record<string, Product[]>, product) => {
      const category = product.category
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(product)
      return groups
    }, {})
  })

  // Price statistics
  const cheapestPrice = computed(() => {
    const prices = products.value.map(p => p.price)
    return Math.min(...prices)
  })

  const mostExpensivePrice = computed(() => {
    const prices = products.value.map(p => p.price)
    return Math.max(...prices)
  })

  const averagePrice = computed(() => {
    const total = products.value.reduce((sum, p) => sum + p.price, 0)
    return Math.round(total / products.value.length)
  })

  // Parametreli getters (actions olarak implement edilir)
  const getProductsByCategory = (category: string) => {
    return products.value.filter(product => product.category === category)
  }

  const searchProducts = (searchTerm: string) => {
    if (!searchTerm) return products.value
    
    const term = searchTerm.toLowerCase()
    return products.value.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  const getProductsByPriceRange = (minPrice: number, maxPrice: number) => {
    return products.value.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )
  }

  // Actions
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.max(...products.value.map(p => p.id), 0) + 1
    }
    products.value.push(newProduct)
  }

  const updateProduct = (id: number, updates: Partial<Product>) => {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates }
    }
  }

  const removeProduct = (id: number) => {
    products.value = products.value.filter(p => p.id !== id)
  }

  const toggleStock = (id: number) => {
    const product = products.value.find(p => p.id === id)
    if (product) {
      product.inStock = !product.inStock
    }
  }

  return {
    products,
    tax,
    productCount,
    totalValue,
    totalWithTax,
    inStockProducts,
    inStockCount,
    categories,
    productsByCategory,
    cheapestPrice,
    mostExpensivePrice,
    averagePrice,
    getProductsByCategory,
    searchProducts,
    getProductsByPriceRange,
    addProduct,
    updateProduct,
    removeProduct,
    toggleStock
  }
})