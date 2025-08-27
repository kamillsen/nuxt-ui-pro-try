import { defineStore } from 'pinia'
import type { Customer } from '~~/types/ecommerce'

export const useCustomerStore = defineStore('customer', () => {
  // State
  const customers = ref<Customer[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const customerCount = computed(() => customers.value.length)

  // Actions - sadece GET işlemi
  const fetchCustomers = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await $fetch<Customer[]>('http://localhost:3001/customers')
      customers.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch customers'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    customers,
    loading,
    error,
    
    // Getters
    customerCount,
    
    // Actions
    fetchCustomers
  }
})