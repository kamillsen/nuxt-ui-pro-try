<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Modülerlik</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Store'ları organize etme, import/export ve composition patterns</p>
      </div>
      <UBadge color="red" variant="subtle">İleri</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Store Modülerliği</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Büyük uygulamalarda store'ları modüler olarak organize etmek çok önemlidir. 
          Her modül kendi sorumluluğunda olan verileri yönetir.
        </p>
        
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Modüler Yaklaşımın Faydaları:</h3>
          <ul class="space-y-2 text-yellow-800 dark:text-yellow-200">
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Kodun daha organize ve anlaşılır olması</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Farklı ekiplerin aynı anda çalışabilmesi</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Test edilebilirlik ve bakım kolaylığı</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Yeniden kullanılabilirlik</span>
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. Dosya Organizasyonu</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>src/
├── stores/
│   ├── index.js                 # Store index file
│   ├── auth/
│   │   ├── index.js            # Auth store
│   │   ├── types.js            # Auth types
│   │   └── api.js              # Auth API calls
│   ├── user/
│   │   ├── index.js            # User store
│   │   ├── profile.js          # Profile sub-store
│   │   └── preferences.js      # User preferences
│   ├── shopping/
│   │   ├── cart.js             # Shopping cart
│   │   ├── products.js         # Products
│   │   └── orders.js           # Orders
│   └── app/
│       ├── ui.js               # UI state
│       ├── notifications.js    # Notifications
│       └── settings.js         # App settings</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Store'lar Arası İletişim</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Store'lar birbirlerini import edebilir ve birbirlerinin method'larını çağırabilir.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/auth/index.js
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  actions: {
    async login(credentials) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        })
        
        const data = await response.json()
        this.user = data.user
        this.token = data.token
        this.isAuthenticated = true

        // Diğer store'ları bilgilendir
        const userStore = useUserStore()
        await userStore.loadUserData(data.user.id)
        
        const notificationStore = useNotificationStore()
        notificationStore.showSuccess('Başarıyla giriş yapıldı')
        
        return data
      } catch (error) {
        const notificationStore = useNotificationStore()
        notificationStore.showError('Giriş yapılamadı')
        throw error
      }
    },

    logout() {
      // Auth verilerini temizle
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // Diğer store'ları temizle
      const userStore = useUserStore()
      userStore.clearUserData()
      
      const cartStore = useCartStore()
      cartStore.clearCart()
    }
  }
})

// stores/user/index.js
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null,
    preferences: null,
    loading: false
  }),

  actions: {
    async loadUserData(userId) {
      this.loading = true
      
      try {
        // Auth store'dan token al
        const authStore = useAuthStore()
        
        const response = await fetch(`/api/users/${userId}`, {
          headers: {
            'Authorization': `Bearer ${authStore.token}`
          }
        })
        
        this.profile = await response.json()
      } finally {
        this.loading = false
      }
    },

    clearUserData() {
      this.profile = null
      this.preferences = null
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semiberal">4. Composable Store Pattern</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Ortak logic'i composable function'larda toplayarak store'lar arasında paylaşabilirsiniz.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// composables/useApi.js
export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  async function apiCall(url, options = {}) {
    loading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
          ...options.headers
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    apiCall
  }
}

// stores/products/index.js - Composable kullanımı
export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const { loading, error, apiCall } = useApi()

  async function fetchProducts() {
    const data = await apiCall('/api/products')
    products.value = data
  }

  async function createProduct(productData) {
    const newProduct = await apiCall('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    })
    
    products.value.push(newProduct)
    return newProduct
  }

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Store Factory Pattern</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Benzer store'ları dinamik olarak oluşturmak için factory pattern'i kullanabilirsiniz.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/factories/createCrudStore.js
export function createCrudStore(entityName, apiEndpoint) {
  return defineStore(`${entityName}Store`, () => {
    const items = ref([])
    const loading = ref(false)
    const error = ref(null)

    async function fetchItems() {
      loading.value = true
      try {
        const response = await fetch(apiEndpoint)
        items.value = await response.json()
      } catch (err) {
        error.value = err.message
      } finally {
        loading.value = false
      }
    }

    async function createItem(itemData) {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData)
        })
        
        const newItem = await response.json()
        items.value.push(newItem)
        return newItem
      } catch (err) {
        error.value = err.message
        throw err
      }
    }

    async function updateItem(id, updates) {
      try {
        const response = await fetch(`${apiEndpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        })
        
        const updatedItem = await response.json()
        const index = items.value.findIndex(item => item.id === id)
        if (index !== -1) {
          items.value[index] = updatedItem
        }
        return updatedItem
      } catch (err) {
        error.value = err.message
        throw err
      }
    }

    async function deleteItem(id) {
      try {
        await fetch(`${apiEndpoint}/${id}`, { method: 'DELETE' })
        items.value = items.value.filter(item => item.id !== id)
      } catch (err) {
        error.value = err.message
        throw err
      }
    }

    return {
      items,
      loading,
      error,
      fetchItems,
      createItem,
      updateItem,
      deleteItem
    }
  })
}

// Kullanımı:
export const usePostsStore = createCrudStore('posts', '/api/posts')
export const useCommentsStore = createCrudStore('comments', '/api/comments')
export const useCategoriesStore = createCrudStore('categories', '/api/categories')</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">6. Canlı Örnek: Modüler E-ticaret Sistemi</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
          <div class="space-y-6">
            <!-- Store Durumları -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h3 class="font-semibold mb-2 flex items-center">
                  <UIcon name="i-heroicons-user" class="h-5 w-5 mr-2" />
                  Auth Store
                </h3>
                <div class="text-sm space-y-1">
                  <p>Kullanıcı: {{ authStore.user?.name || 'Anonim' }}</p>
                  <p>Durumu: {{ authStore.isAuthenticated ? 'Giriş Yapılmış' : 'Giriş Yapılmamış' }}</p>
                </div>
                <div class="mt-2 space-x-2">
                  <UButton 
                    v-if="!authStore.isAuthenticated"
                    @click="handleLogin" 
                    size="xs"
                  >
                    Giriş Yap
                  </UButton>
                  <UButton 
                    v-else
                    @click="authStore.logout" 
                    size="xs" 
                    color="red"
                  >
                    Çıkış Yap
                  </UButton>
                </div>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h3 class="font-semibold mb-2 flex items-center">
                  <UIcon name="i-heroicons-shopping-cart" class="h-5 w-5 mr-2" />
                  Cart Store
                </h3>
                <div class="text-sm space-y-1">
                  <p>Ürün Sayısı: {{ cartStore.itemCount }}</p>
                  <p>Toplam: ₺{{ cartStore.totalPrice }}</p>
                </div>
                <UButton 
                  @click="cartStore.addRandomItem" 
                  size="xs" 
                  class="mt-2"
                  :disabled="!authStore.isAuthenticated"
                >
                  Rastgele Ürün Ekle
                </UButton>
              </div>

              <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                <h3 class="font-semibold mb-2 flex items-center">
                  <UIcon name="i-heroicons-bell" class="h-5 w-5 mr-2" />
                  Notification Store
                </h3>
                <div class="text-sm space-y-1">
                  <p>Aktif: {{ notificationStore.notifications.length }}</p>
                </div>
                <UButton 
                  @click="notificationStore.showInfo('Test bildirimi')" 
                  size="xs" 
                  class="mt-2"
                >
                  Test Bildirimi
                </UButton>
              </div>
            </div>

            <!-- Sepet İçeriği -->
            <div v-if="cartStore.items.length > 0" class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Sepet İçeriği:</h3>
              <div class="space-y-2">
                <div 
                  v-for="item in cartStore.items" 
                  :key="item.id"
                  class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span>{{ item.name }} (x{{ item.quantity }})</span>
                  <div class="flex items-center space-x-2">
                    <span class="font-medium">₺{{ item.price * item.quantity }}</span>
                    <UButton @click="cartStore.removeItem(item.id)" size="xs" color="red" variant="ghost">
                      <UIcon name="i-heroicons-x-mark" />
                    </UButton>
                  </div>
                </div>
              </div>
              <div class="mt-3 pt-3 border-t flex justify-between items-center">
                <span class="font-semibold">Toplam: ₺{{ cartStore.totalPrice }}</span>
                <UButton @click="handleCheckout" color="green">
                  Satın Al
                </UButton>
              </div>
            </div>

            <!-- Bildirimler -->
            <div v-if="notificationStore.notifications.length > 0" class="space-y-2">
              <div 
                v-for="notification in notificationStore.notifications" 
                :key="notification.id"
                class="flex items-center justify-between p-3 rounded-lg"
                :class="{
                  'bg-green-50 border border-green-200': notification.type === 'success',
                  'bg-blue-50 border border-blue-200': notification.type === 'info',
                  'bg-red-50 border border-red-200': notification.type === 'error'
                }"
              >
                <span :class="{
                  'text-green-800': notification.type === 'success',
                  'text-blue-800': notification.type === 'info',
                  'text-red-800': notification.type === 'error'
                }">
                  {{ notification.message }}
                </span>
                <UButton 
                  @click="notificationStore.removeNotification(notification.id)" 
                  size="xs" 
                  variant="ghost"
                >
                  <UIcon name="i-heroicons-x-mark" />
                </UButton>
              </div>
            </div>

            <!-- Store İletişim Gösterimi -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Store'lar Arası İletişim:</h3>
              <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <p>• Auth store login olduğunda → Cart store temizlenir</p>
                <p>• Cart store'a ürün eklenince → Notification store bildirim gösterir</p>
                <p>• Checkout yapıldığında → Tüm store'lar senkronize edilir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia/actions" variant="outline" icon="i-heroicons-arrow-left">
        Actions
      </UButton>
      <UButton to="/pinia/advanced" icon="i-heroicons-arrow-right" trailing>
        İleri Düzey
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

// Auth Store
const useDemoAuthStore = defineStore('demo-auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),

  actions: {
    async login(userData) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      this.user = userData
      this.token = 'fake-jwt-token'
      this.isAuthenticated = true

      // Notify other stores
      const cartStore = useDemoCartStore()
      cartStore.clearCart()

      const notificationStore = useDemoNotificationStore()
      notificationStore.showSuccess(`Hoş geldin ${userData.name}!`)
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false

      // Notify other stores
      const cartStore = useDemoCartStore()
      cartStore.clearCart()

      const notificationStore = useDemoNotificationStore()
      notificationStore.showInfo('Başarıyla çıkış yapıldı')
    }
  }
})

// Cart Store
const useDemoCartStore = defineStore('demo-cart', {
  state: () => ({
    items: []
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: (state) => state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  },

  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }

      const notificationStore = useDemoNotificationStore()
      notificationStore.showSuccess(`${product.name} sepete eklendi`)
    },

    removeItem(id) {
      this.items = this.items.filter(item => item.id !== id)
    },

    clearCart() {
      this.items = []
    },

    addRandomItem() {
      const products = [
        { id: 1, name: 'Laptop', price: 5000 },
        { id: 2, name: 'Mouse', price: 100 },
        { id: 3, name: 'Keyboard', price: 300 },
        { id: 4, name: 'Monitor', price: 2000 }
      ]
      
      const randomProduct = products[Math.floor(Math.random() * products.length)]
      this.addItem(randomProduct)
    }
  }
})

// Notification Store
const useDemoNotificationStore = defineStore('demo-notifications', {
  state: () => ({
    notifications: []
  }),

  actions: {
    showNotification(message, type = 'info') {
      const notification = {
        id: Date.now(),
        message,
        type,
        timestamp: new Date()
      }
      
      this.notifications.push(notification)

      // Auto remove after 5 seconds
      setTimeout(() => {
        this.removeNotification(notification.id)
      }, 5000)
    },

    showSuccess(message) {
      this.showNotification(message, 'success')
    },

    showError(message) {
      this.showNotification(message, 'error')
    },

    showInfo(message) {
      this.showNotification(message, 'info')
    },

    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    }
  }
})

// Store instances
const authStore = useDemoAuthStore()
const cartStore = useDemoCartStore()
const notificationStore = useDemoNotificationStore()

// Event handlers
async function handleLogin() {
  try {
    await authStore.login({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com'
    })
  } catch (error) {
    notificationStore.showError('Giriş yapılamadı')
  }
}

function handleCheckout() {
  if (cartStore.items.length === 0) return

  // Simulate checkout process
  const total = cartStore.totalPrice
  cartStore.clearCart()
  notificationStore.showSuccess(`₺${total} değerinde sipariş tamamlandı!`)
}
</script>