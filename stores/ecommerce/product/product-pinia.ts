import { defineStore } from 'pinia';
import type { Product } from '~~/types/ecommerce/product/product-types';

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const productCount = computed(() => products.value.length);

  // Actions
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch<{success: boolean, data: Product[]}>('/api/ecommerce-api/product/product-api');
      const data = response.data;
      products.value = data;
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch products';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    products,
    loading,
    error,
    
    // Getters
    productCount,
    
    // Actions
    fetchProducts
  };
});