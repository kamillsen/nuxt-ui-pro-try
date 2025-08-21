<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Store Oluşturma</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">defineStore kullanarak farklı store yapıları oluşturmayı öğrenin</p>
      </div>
      <UBadge color="green" variant="subtle">Başlangıç</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Store Tanımlama Yöntemleri</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Pinia'da store tanımlamak için iki ana yöntem vardır: Options API ve Composition API
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg">
            <h3 class="font-semibold text-green-600 dark:text-green-400 mb-2">Options API</h3>
            <ul class="text-sm space-y-1">
              <li>• Vuex'e benzer yapı</li>
              <li>• state, getters, actions ayrı</li>
              <li>• Daha yapılandırılmış</li>
            </ul>
          </div>
          <div class="p-4 border rounded-lg">
            <h3 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">Composition API</h3>
            <ul class="text-sm space-y-1">
              <li>• ref, computed kullanımı</li>
              <li>• Daha esnek yapı</li>
              <li>• TypeScript ile uyumlu</li>
            </ul>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. Options API ile Store</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // State: Başlangıç verileri
  state: () => ({
    user: null,
    isLoggedIn: false,
    preferences: {
      theme: 'light',
      language: 'tr'
    }
  }),

  // Getters: Hesaplanan değerler
  getters: {
    displayName: (state) => {
      return state.user?.name || 'Misafir'
    },
    isAdmin: (state) => {
      return state.user?.role === 'admin'
    },
    themeClass() {
      return `theme-${this.preferences.theme}`
    }
  },

  // Actions: State'i değiştiren metodlar
  actions: {
    async login(email, password) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        })
        
        if (response.ok) {
          this.user = await response.json()
          this.isLoggedIn = true
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
    },

    updatePreferences(newPrefs) {
      this.preferences = { ...this.preferences, ...newPrefs }
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Composition API ile Store</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/products.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref([])
  const loading = ref(false)
  const selectedCategory = ref('all')

  // Getters
  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value
    }
    return products.value.filter(p => p.category === selectedCategory.value)
  })

  const productCount = computed(() => products.value.length)

  const categories = computed(() => {
    const cats = products.value.map(p => p.category)
    return [...new Set(cats)]
  })

  // Actions
  async function fetchProducts() {
    loading.value = true
    try {
      const response = await fetch('/api/products')
      products.value = await response.json()
    } catch (error) {
      console.error('Fetch failed:', error)
    } finally {
      loading.value = false
    }
  }

  function addProduct(product) {
    products.value.push({
      ...product,
      id: Date.now()
    })
  }

  function removeProduct(id) {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  function setCategory(category) {
    selectedCategory.value = category
  }

  return {
    products,
    loading,
    selectedCategory,
    filteredProducts,
    productCount,
    categories,
    fetchProducts,
    addProduct,
    removeProduct,
    setCategory
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. Store ID ve İsimlendirme</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Önemli Notlar:</h3>
          <ul class="space-y-2 text-yellow-700 dark:text-yellow-300">
            <li class="flex items-start space-x-2">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5 mt-0.5" />
              <span>Store ID benzersiz olmalı ve string olarak verilmeli</span>
            </li>
            <li class="flex items-start space-x-2">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5 mt-0.5" />
              <span>Store fonksiyonu ismi "use" ile başlamalı (useProductStore)</span>
            </li>
            <li class="flex items-start space-x-2">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5 mt-0.5" />
              <span>Store dosyaları stores/ klasöründe tutulmalı</span>
            </li>
          </ul>
        </div>

        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// ✅ Doğru İsimlendirme
export const useUserStore = defineStore('user', { ... })
export const useProductStore = defineStore('products', { ... })
export const useShoppingCartStore = defineStore('shopping-cart', { ... })

// ❌ Yanlış İsimlendirme
export const UserStore = defineStore('user', { ... })
export const store = defineStore('products', { ... })
export const useStore = defineStore('shopping-cart', { ... })</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Canlı Örnek: Ürün Store'u</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold">Ürünler</h3>
              <div class="flex space-x-2">
                <UButton 
                  v-for="category in ['all', ...demoStore.categories]" 
                  :key="category"
                  :variant="demoStore.selectedCategory === category ? 'solid' : 'outline'"
                  size="xs"
                  @click="demoStore.setCategory(category)"
                >
                  {{ category === 'all' ? 'Tümü' : category }}
                </UButton>
              </div>
            </div>

            <div class="text-sm text-gray-600 dark:text-gray-400">
              Toplam: {{ demoStore.productCount }} ürün | 
              Gösterilen: {{ demoStore.filteredProducts.length }} ürün
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="product in demoStore.filteredProducts" 
                :key="product.id"
                class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <h4 class="font-medium">{{ product.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ product.category }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="font-bold text-green-600">₺{{ product.price }}</span>
                  <UButton size="xs" color="red" @click="demoStore.removeProduct(product.id)">
                    Sil
                  </UButton>
                </div>
              </div>
            </div>

            <UButton @click="addRandomProduct" color="green" class="w-full">
              Rastgele Ürün Ekle
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia/basics" variant="outline" icon="i-heroicons-arrow-left">
        Temel Kullanım
      </UButton>
      <UButton to="/pinia/state" icon="i-heroicons-arrow-right" trailing>
        State Yönetimi
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default'
})

// Demo Products Store (Composition API kullanarak)
const useDemoProductsStore = defineStore('demo-products', () => {
  const products = ref([
    { id: 1, name: 'MacBook Pro', price: 25000, category: 'elektronik' },
    { id: 2, name: 'iPhone 15', price: 15000, category: 'elektronik' },
    { id: 3, name: 'Kahve Fincanı', price: 50, category: 'ev-esyasi' },
    { id: 4, name: 'Kitap: Vue.js', price: 120, category: 'kitap' },
  ])
  
  const selectedCategory = ref('all')

  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value
    }
    return products.value.filter(p => p.category === selectedCategory.value)
  })

  const productCount = computed(() => products.value.length)

  const categories = computed(() => {
    const cats = products.value.map(p => p.category)
    return [...new Set(cats)]
  })

  function addProduct(product) {
    products.value.push({
      ...product,
      id: Date.now()
    })
  }

  function removeProduct(id) {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  function setCategory(category) {
    selectedCategory.value = category
  }

  return {
    products,
    selectedCategory,
    filteredProducts,
    productCount,
    categories,
    addProduct,
    removeProduct,
    setCategory
  }
})

const demoStore = useDemoProductsStore()

const sampleProducts = [
  { name: 'Tablet', price: 3000, category: 'elektronik' },
  { name: 'Masa Lambası', price: 200, category: 'ev-esyasi' },
  { name: 'Roman Kitabı', price: 80, category: 'kitap' },
  { name: 'Bluetooth Kulaklık', price: 500, category: 'elektronik' },
  { name: 'Yastık', price: 150, category: 'ev-esyasi' }
]

function addRandomProduct() {
  const randomProduct = sampleProducts[Math.floor(Math.random() * sampleProducts.length)]
  demoStore.addProduct({
    ...randomProduct,
    name: `${randomProduct.name} ${Math.floor(Math.random() * 100)}`
  })
}
</script>