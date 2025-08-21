<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">State Yönetimi</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Reaktif state'leri tanımlama, güncelleme ve izleme teknikleri</p>
      </div>
      <UBadge color="yellow" variant="subtle">Orta</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. State Tanımlama</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Pinia'da state, uygulamanın reaktif verilerini tutar. Her değişiklik otomatik olarak UI'da yansır.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// store/app.js
export const useAppStore = defineStore('app', {
  state: () => ({
    // Basit değerler
    title: 'My App',
    version: '1.0.0',
    isLoading: false,
    
    // Sayılar
    userCount: 0,
    maxUsers: 100,
    
    // Diziler
    notifications: [],
    menuItems: ['Home', 'About', 'Contact'],
    
    // Objeler
    user: {
      name: '',
      email: '',
      role: 'user'
    },
    
    // İç içe objeler
    settings: {
      theme: {
        mode: 'light',
        primaryColor: '#3b82f6'
      },
      layout: {
        sidebar: true,
        header: true
      }
    }
  })
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. State'i Güncelleme</h2>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold mb-2">Component İçinde</h3>
            <div class="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
              <pre class="text-green-400"><code>&lt;script setup&gt;
const store = useAppStore()

// Direkt atama
store.title = 'New Title'
store.userCount++

// Obje güncelleme
store.user.name = 'John'
store.settings.theme.mode = 'dark'
&lt;/script&gt;</code></pre>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">Action İçinde</h3>
            <div class="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
              <pre class="text-green-400"><code>// store içinde
actions: {
  updateUser(userData) {
    // this ile erişim
    this.user = { ...this.user, ...userData }
  },
  
  addNotification(message) {
    this.notifications.push({
      id: Date.now(),
      message,
      timestamp: new Date()
    })
  }
}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. $patch Kullanımı</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          $patch ile birden fazla state değerini tek seferde güncelleyebilirsiniz.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// Obje ile patch
store.$patch({
  title: 'Updated Title',
  userCount: 50,
  user: {
    name: 'Jane Doe',
    email: 'jane@example.com'
  }
})

// Fonksiyon ile patch (daha performanslı)
store.$patch((state) => {
  state.title = 'Updated Title'
  state.userCount = 50
  state.notifications.push({
    id: Date.now(),
    message: 'Batch update completed'
  })
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. State İzleme ve Reaktivite</h2>
      </template>
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold mb-2">Watch ile İzleme</h3>
            <div class="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
              <pre class="text-green-400"><code>&lt;script setup&gt;
import { watch } from 'vue'
const store = useAppStore()

// Tek bir değeri izle
watch(
  () => store.userCount,
  (newVal, oldVal) => {
    console.log(`User count: ${oldVal} → ${newVal}`)
  }
)

// Tüm store'u izle
watch(
  store,
  (newState) => {
    console.log('Store updated:', newState)
  },
  { deep: true }
)
&lt;/script&gt;</code></pre>
            </div>
          </div>
          
          <div>
            <h3 class="font-semibold mb-2">$subscribe ile İzleme</h3>
            <div class="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
              <pre class="text-green-400"><code>&lt;script setup&gt;
const store = useAppStore()

// Store değişikliklerini izle
store.$subscribe((mutation, state) => {
  console.log('Mutation type:', mutation.type)
  console.log('New state:', state)
  
  // Local storage'a kaydet
  localStorage.setItem('app-state', JSON.stringify(state))
})
&lt;/script&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Canlı Örnek: Tema ve Ayarlar Store'u</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-lg">
          <div class="space-y-6">
            <!-- State Gösterimi -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Mevcut State:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <code class="block bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    theme: "{{ demoStore.theme }}"
                  </code>
                </div>
                <div>
                  <code class="block bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    language: "{{ demoStore.language }}"
                  </code>
                </div>
                <div>
                  <code class="block bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    notifications: {{ demoStore.notificationsEnabled }}
                  </code>
                </div>
                <div>
                  <code class="block bg-gray-100 dark:bg-gray-700 p-2 rounded">
                    fontSize: {{ demoStore.fontSize }}px
                  </code>
                </div>
              </div>
            </div>

            <!-- Kontroller -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h4 class="font-semibold">Tek Değer Güncelleme:</h4>
                <div class="space-y-2">
                  <UButton @click="demoStore.theme = 'dark'" :color="demoStore.theme === 'dark' ? 'green' : 'gray'" variant="outline" size="sm">
                    Dark Theme
                  </UButton>
                  <UButton @click="demoStore.theme = 'light'" :color="demoStore.theme === 'light' ? 'green' : 'gray'" variant="outline" size="sm">
                    Light Theme
                  </UButton>
                  <UButton @click="demoStore.toggleNotifications()" :color="demoStore.notificationsEnabled ? 'green' : 'red'" variant="outline" size="sm">
                    {{ demoStore.notificationsEnabled ? 'Disable' : 'Enable' }} Notifications
                  </UButton>
                </div>
              </div>

              <div class="space-y-4">
                <h4 class="font-semibold">Batch Güncelleme ($patch):</h4>
                <div class="space-y-2">
                  <UButton @click="applyDarkMode" color="gray" variant="outline" size="sm">
                    Dark Mode Preset
                  </UButton>
                  <UButton @click="applyLightMode" color="blue" variant="outline" size="sm">
                    Light Mode Preset
                  </UButton>
                  <UButton @click="resetSettings" color="red" variant="outline" size="sm">
                    Reset All Settings
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Font Size Slider -->
            <div class="space-y-2">
              <label class="block font-semibold">Font Size: {{ demoStore.fontSize }}px</label>
              <input 
                type="range" 
                :value="demoStore.fontSize" 
                @input="demoStore.fontSize = parseInt($event.target.value)"
                min="12" 
                max="24" 
                class="w-full"
              />
            </div>

            <!-- State Geçmişi -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 class="font-semibold mb-3">Son Değişiklikler:</h4>
              <div class="space-y-1 text-xs max-h-32 overflow-y-auto">
                <div v-for="(change, index) in stateHistory" :key="index" class="text-gray-600 dark:text-gray-400">
                  {{ change }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia/stores" variant="outline" icon="i-heroicons-arrow-left">
        Store Oluşturma
      </UButton>
      <UButton to="/pinia/getters" icon="i-heroicons-arrow-right" trailing>
        Getters
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '~/stores/settings'

definePageMeta({
  layout: 'default'
})

const demoStore = useSettingsStore()
const stateHistory = ref([])

// State değişikliklerini izle
demoStore.$subscribe((mutation, state) => {
  const timestamp = new Date().toLocaleTimeString()
  stateHistory.value.unshift(`${timestamp}: ${mutation.type} - ${JSON.stringify(mutation.payload)}`)
  
  // Sadece son 10 değişikliği tut
  if (stateHistory.value.length > 10) {
    stateHistory.value = stateHistory.value.slice(0, 10)
  }
})

// Preset fonksiyonları
function applyDarkMode() {
  demoStore.applyDarkPreset()
}

function applyLightMode() {
  demoStore.applyLightPreset()
}

function resetSettings() {
  demoStore.resetSettings()
}
</script>