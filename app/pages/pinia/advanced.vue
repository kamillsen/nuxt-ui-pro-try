<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">İleri Düzey Pinia</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Plugin'ler, SSR, persistence ve performans optimizasyonları</p>
      </div>
      <UBadge color="red" variant="subtle">İleri</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Pinia Plugins</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Plugin'ler Pinia'nın işlevselliğini genişletir. Global olarak tüm store'lara yeni özellikler ekleyebilirsiniz.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// plugins/persistPlugin.js
export function persistPlugin(context) {
  const { store, options } = context

  // Store adını al
  const storeId = store.$id

  // Persist özelliği varsa localStorage'dan yükle
  if (options.persist) {
    const saved = localStorage.getItem(`pinia-${storeId}`)
    if (saved) {
      store.$patch(JSON.parse(saved))
    }

    // Store değişikliklerini dinle ve kaydet
    store.$subscribe((mutation, state) => {
      localStorage.setItem(`pinia-${storeId}`, JSON.stringify(state))
    })
  }

  // Store'a yeni metodlar ekle
  store.$reset = function() {
    if (typeof this.$state === 'object') {
      Object.keys(this.$state).forEach(key => {
        this.$state[key] = undefined
      })
    }
    localStorage.removeItem(`pinia-${storeId}`)
  }
}

// main.js veya plugins/pinia.js
import { createPinia } from 'pinia'
import { persistPlugin } from './plugins/persistPlugin'

const pinia = createPinia()
pinia.use(persistPlugin)

// Store'da kullanım
export const useSettingsStore = defineStore('settings', {
  persist: true, // Plugin'e bilgi ver
  
  state: () => ({
    theme: 'light',
    language: 'tr'
  })
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. State Persistence</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Store verilerini localStorage, sessionStorage veya IndexedDB'de kalıcı hale getirme.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// composables/usePersistentStore.js
export function usePersistentStore(key, defaultValue) {
  const state = ref(defaultValue)

  // localStorage'dan yükle
  const saved = localStorage.getItem(key)
  if (saved) {
    try {
      state.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to parse saved state:', error)
    }
  }

  // State değişikliklerini kaydet
  watch(state, (newState) => {
    localStorage.setItem(key, JSON.stringify(newState))
  }, { deep: true })

  return state
}

// Kullanımı
export const useUserPreferencesStore = defineStore('userPreferences', () => {
  const preferences = usePersistentStore('user-preferences', {
    theme: 'light',
    language: 'tr',
    notifications: true
  })

  function updateTheme(newTheme) {
    preferences.value.theme = newTheme
  }

  function toggleNotifications() {
    preferences.value.notifications = !preferences.value.notifications
  }

  return {
    preferences: readonly(preferences),
    updateTheme,
    toggleNotifications
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Server-Side Rendering (SSR)</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Nuxt.js ile Pinia kullanırken dikkat edilmesi gereken SSR konuları.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/posts.js - SSR uyumlu store
export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)

  async function fetchPosts() {
    // Server-side'da zaten yüklendiyse tekrar yükleme
    if (posts.value.length > 0) return

    loading.value = true
    try {
      const { data } = await $fetch('/api/posts')
      posts.value = data
    } finally {
      loading.value = false
    }
  }

  // SSR sırasında veri yükleme
  async function hydrate() {
    if (process.server) {
      await fetchPosts()
    }
  }

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    fetchPosts,
    hydrate
  }
})

// pages/blog.vue
&lt;script setup&gt;
const postsStore = usePostsStore()

// Server-side'da veriyi yükle
await postsStore.hydrate()

// Client-side'da da yükle (eğer server-side yüklenmemişse)
onMounted(() => {
  if (postsStore.posts.length === 0) {
    postsStore.fetchPosts()
  }
})
&lt;/script&gt;</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. Performans Optimizasyonları</h2>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-3">
            <h3 class="font-semibold">Lazy Loading</h3>
            <div class="bg-gray-900 rounded-lg p-3 text-xs overflow-x-auto">
              <pre class="text-green-400"><code>// Lazy store loading
const useHeavyStore = () => {
  return import('@/stores/heavy').then(
    module => module.useHeavyStore()
  )
}</code></pre>
            </div>
          </div>
          
          <div class="space-y-3">
            <h3 class="font-semibold">Memoization</h3>
            <div class="bg-gray-900 rounded-lg p-3 text-xs overflow-x-auto">
              <pre class="text-green-400"><code>// Expensive computations cache
const expensiveGetter = computed(() => {
  return memoize(
    () => heavyCalculation(state.data)
  )
})</code></pre>
            </div>
          </div>
        </div>

        <div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-orange-900 dark:text-orange-100 mb-2">Performans İpuçları:</h3>
          <ul class="space-y-2 text-orange-800 dark:text-orange-200 text-sm">
            <li>• Büyük listeleri sayfalama ile yönetin</li>
            <li>• Gereksiz reactive data'dan kaçının</li>
            <li>• Store subscription'larını temizleyin</li>
            <li>• Lazy loading kullanın</li>
          </ul>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Testing Strategies</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/counter.test.js
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCounterStore } from './counter'

describe('Counter Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('increments count', () => {
    const store = useCounterStore()
    expect(store.count).toBe(0)
    
    store.increment()
    expect(store.count).toBe(1)
  })

  it('resets count', () => {
    const store = useCounterStore()
    store.increment()
    store.increment()
    
    store.reset()
    expect(store.count).toBe(0)
  })
})

// Component testing with store
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(MyComponent, {
  global: {
    plugins: [createTestingPinia({
      createSpy: vi.fn, // Vitest için
      stubActions: false
    })]
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">6. Canlı Örnek: Advanced Store Features</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-lg">
          <div class="space-y-6">
            <!-- Persistence Demo -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3 flex items-center">
                <UIcon name="i-heroicons-archive-box" class="h-5 w-5 mr-2" />
                Persistent Store Demo
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span>Theme: {{ advancedStore.theme }}</span>
                  <div class="space-x-2">
                    <UButton 
                      @click="advancedStore.setTheme('light')" 
                      size="xs" 
                      :variant="advancedStore.theme === 'light' ? 'solid' : 'outline'"
                    >
                      Light
                    </UButton>
                    <UButton 
                      @click="advancedStore.setTheme('dark')" 
                      size="xs"
                      :variant="advancedStore.theme === 'dark' ? 'solid' : 'outline'"
                    >
                      Dark
                    </UButton>
                  </div>
                </div>
                
                <div class="flex items-center justify-between">
                  <span>Notifications: {{ advancedStore.notifications ? 'Enabled' : 'Disabled' }}</span>
                  <UButton 
                    @click="advancedStore.toggleNotifications" 
                    size="xs"
                    :color="advancedStore.notifications ? 'green' : 'red'"
                  >
                    {{ advancedStore.notifications ? 'Disable' : 'Enable' }}
                  </UButton>
                </div>

                <div class="text-xs text-gray-500 mt-3">
                  Bu ayarlar localStorage'a kaydedilir ve sayfa yenilendikten sonra korunur.
                </div>
              </div>
            </div>

            <!-- Performance Demo -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3 flex items-center">
                <UIcon name="i-heroicons-bolt" class="h-5 w-5 mr-2" />
                Performance Optimizations
              </h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span>Heavy Calculation Result: {{ advancedStore.expensiveComputation }}</span>
                  <UButton @click="advancedStore.triggerExpensiveOperation" size="xs">
                    Recalculate
                  </UButton>
                </div>
                
                <div class="text-xs text-gray-500">
                  Bu hesaplama memoize edilmiştir - aynı input için cache'den döner.
                </div>

                <div class="flex items-center justify-between">
                  <span>Lazy Data Loaded: {{ advancedStore.lazyDataLoaded ? 'Yes' : 'No' }}</span>
                  <UButton 
                    @click="advancedStore.loadLazyData" 
                    size="xs"
                    :loading="advancedStore.lazyLoading"
                  >
                    Load Lazy Data
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Plugin Demo -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3 flex items-center">
                <UIcon name="i-heroicons-puzzle-piece" class="h-5 w-5 mr-2" />
                Plugin Features
              </h3>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Store ID:</strong> {{ advancedStore.$id }}
                  </div>
                  <div>
                    <strong>Created At:</strong> {{ advancedStore.$createdAt }}
                  </div>
                </div>

                <div class="space-x-2">
                  <UButton @click="advancedStore.$reset" size="xs" color="red">
                    Reset Store
                  </UButton>
                  <UButton @click="showStoreState" size="xs" variant="outline">
                    Log State
                  </UButton>
                </div>

                <div class="text-xs text-gray-500">
                  Bu özellikler custom plugin ile eklendi.
                </div>
              </div>
            </div>

            <!-- DevTools Integration -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3 flex items-center">
                <UIcon name="i-heroicons-bug-ant" class="h-5 w-5 mr-2" />
                DevTools Integration
              </h3>
              <div class="space-y-3">
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  Vue DevTools'u açarak Pinia tab'inde store state'lerini, 
                  mutation'ları ve time travel debugging'i görebilirsiniz.
                </p>

                <div class="flex space-x-2">
                  <UButton @click="performTrackedAction" size="xs">
                    Tracked Action
                  </UButton>
                  <UButton @click="performBatchUpdate" size="xs" variant="outline">
                    Batch Update
                  </UButton>
                </div>

                <div class="text-xs text-gray-500">
                  Bu aksiyonlar DevTools'da görünecek.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">7. Best Practices</h2>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-3">
            <h3 class="font-semibold text-green-600 dark:text-green-400">✅ Yapılması Gerekenler</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="h-4 w-4 mt-0.5 text-green-500" />
                <span>Store'ları mantıklı şekilde bölün</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="h-4 w-4 mt-0.5 text-green-500" />
                <span>TypeScript kullanın</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="h-4 w-4 mt-0.5 text-green-500" />
                <span>Action'larda error handling yapın</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="h-4 w-4 mt-0.5 text-green-500" />
                <span>Store'ları test edin</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-check" class="h-4 w-4 mt-0.5 text-green-500" />
                <span>DevTools kullanın</span>
              </li>
            </ul>
          </div>
          
          <div class="space-y-3">
            <h3 class="font-semibold text-red-600 dark:text-red-400">❌ Yapılmaması Gerekenler</h3>
            <ul class="space-y-2 text-sm">
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-x-mark" class="h-4 w-4 mt-0.5 text-red-500" />
                <span>State'i component'te direkt mutate etmeyin</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-x-mark" class="h-4 w-4 mt-0.5 text-red-500" />
                <span>Çok büyük store'lar oluşturmayın</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-x-mark" class="h-4 w-4 mt-0.5 text-red-500" />
                <span>Action'larda senkron API çağrısı yapmayın</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-x-mark" class="h-4 w-4 mt-0.5 text-red-500" />
                <span>Store'larda DOM manipülasyonu yapmayın</span>
              </li>
              <li class="flex items-start space-x-2">
                <UIcon name="i-heroicons-x-mark" class="h-4 w-4 mt-0.5 text-red-500" />
                <span>Gereksiz reaktif data oluşturmayın</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia/modules" variant="outline" icon="i-heroicons-arrow-left">
        Modülerlik
      </UButton>
      <UButton to="/pinia" icon="i-heroicons-home" trailing>
        Ana Sayfa
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

// Advanced Demo Store with Plugin Features
const useAdvancedDemoStore = defineStore('advanced-demo', () => {
  // Persistent state (simulated)
  const theme = ref(localStorage.getItem('demo-theme') || 'light')
  const notifications = ref(localStorage.getItem('demo-notifications') !== 'false')
  
  // Performance demo
  const heavyData = ref(Math.random())
  const lazyDataLoaded = ref(false)
  const lazyLoading = ref(false)
  const lazyData = ref(null)

  // Plugin demo - simulated plugin features
  const $id = 'advanced-demo'
  const $createdAt = new Date().toISOString()

  // Memoized expensive computation
  const expensiveComputation = computed(() => {
    // Simulate heavy calculation
    let result = 0
    for (let i = 0; i < 1000; i++) {
      result += Math.sin(heavyData.value * i) * Math.cos(i)
    }
    return Math.round(result * 1000) / 1000
  })

  // Actions
  function setTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('demo-theme', newTheme)
  }

  function toggleNotifications() {
    notifications.value = !notifications.value
    localStorage.setItem('demo-notifications', notifications.value.toString())
  }

  function triggerExpensiveOperation() {
    heavyData.value = Math.random()
  }

  async function loadLazyData() {
    if (lazyDataLoaded.value) return

    lazyLoading.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      lazyData.value = {
        message: 'Lazy loaded data',
        timestamp: new Date().toISOString(),
        randomValue: Math.random()
      }
      lazyDataLoaded.value = true
    } finally {
      lazyLoading.value = false
    }
  }

  // Plugin-like features
  function $reset() {
    theme.value = 'light'
    notifications.value = true
    heavyData.value = Math.random()
    lazyDataLoaded.value = false
    lazyData.value = null
    
    // Clear localStorage
    localStorage.removeItem('demo-theme')
    localStorage.removeItem('demo-notifications')
  }

  return {
    // State
    theme,
    notifications,
    heavyData,
    lazyDataLoaded,
    lazyLoading,
    lazyData,
    
    // Getters
    expensiveComputation,
    
    // Actions
    setTheme,
    toggleNotifications,
    triggerExpensiveOperation,
    loadLazyData,
    
    // Plugin features
    $id,
    $createdAt,
    $reset
  }
})

const advancedStore = useAdvancedDemoStore()

// Demo functions
function showStoreState() {
  console.log('Store State:', {
    theme: advancedStore.theme,
    notifications: advancedStore.notifications,
    expensiveComputation: advancedStore.expensiveComputation,
    lazyDataLoaded: advancedStore.lazyDataLoaded
  })
}

function performTrackedAction() {
  advancedStore.setTheme(advancedStore.theme === 'light' ? 'dark' : 'light')
  console.log('Tracked action performed - check DevTools')
}

function performBatchUpdate() {
  advancedStore.$patch({
    theme: 'dark',
    notifications: true
  })
  console.log('Batch update performed - check DevTools')
}
</script>