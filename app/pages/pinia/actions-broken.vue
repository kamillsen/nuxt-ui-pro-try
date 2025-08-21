<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Actions</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Asenkron işlemler, API çağrıları ve karmaşık business logic</p>
      </div>
      <UBadge color="yellow" variant="subtle">Orta</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Actions Nedir?</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Actions, store'daki state'i değiştiren fonksiyonlardır. Senkron ve asenkron işlemler gerçekleştirebilir.
        </p>
        
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-green-900 dark:text-green-100 mb-2">Actions Özellikleri:</h3>
          <ul class="space-y-2 text-green-800 dark:text-green-200">
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>State'i doğrudan değiştirebilir</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Asenkron işlemler yapabilir (API calls)</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Diğer action'ları çağırabilir</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Parametre alabilir</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Değer döndürebilir</span>
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. Basit Actions</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/counter.js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    history: []
  }),

  actions: {
    // Senkron action
    increment() {
      this.count++
      this.history.push({ action: 'increment', timestamp: new Date() })
    },

    // Parametre alan action
    incrementBy(amount) {
      this.count += amount
      this.history.push({ 
        action: 'incrementBy', 
        amount, 
        timestamp: new Date() 
      })
    },

    // Koşullu logic
    incrementIfEven() {
      if (this.count % 2 === 0) {
        this.increment()
        return true
      }
      return false
    },

    // State'i sıfırlama
    reset() {
      this.count = 0
      this.history = []
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Asenkron Actions ve API Çağrıları</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/users.js
export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),

  actions: {
    // API'den veri çekme
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        this.users = await response.json()
      } catch (error) {
        this.error = error.message
        console.error('Failed to fetch users:', error)
      } finally {
        this.loading = false
      }
    },

    // Kullanıcı ekleme
    async addUser(userData) {
      this.loading = true

      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })

        if (!response.ok) {
          throw new Error('Failed to add user')
        }

        const newUser = await response.json()
        this.users.push(newUser)
        
        return newUser // Action değer döndürür
      } catch (error) {
        this.error = error.message
        throw error // Component'te handle edilebilir
      } finally {
        this.loading = false
      }
    },

    // Kullanıcı güncelleme
    async updateUser(id, updates) {
      const index = this.users.findIndex(user => user.id === id)
      if (index === -1) return

      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updates)
        })

        if (!response.ok) {
          throw new Error('Failed to update user')
        }

        const updatedUser = await response.json()
        this.users[index] = updatedUser
        
        return updatedUser
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Kullanıcı silme
    async deleteUser(id) {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: 'DELETE'
        })

        if (!response.ok) {
          throw new Error('Failed to delete user')
        }

        this.users = this.users.filter(user => user.id !== id)
      } catch (error) {
        this.error = error.message
        throw error
      }
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. Composition API ile Actions</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/posts-composition.js
export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions normal fonksiyonlar olarak tanımlanır
  async function fetchPosts() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/api/posts')
      posts.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function createPost(postData) {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })
      
      const newPost = await response.json()
      posts.value.unshift(newPost) // Başa ekle
      
      return newPost
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  function deletePost(id) {
    posts.value = posts.value.filter(post => post.id !== id)
  }

  // Return'de action fonksiyonlarını da döndürmeyi unutma
  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    deletePost
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Error Handling ve Loading States</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Actions'da hata yönetimi ve yükleme durumları çok önemlidir.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// Component'te kullanım
&lt;template&gt;
  &lt;div&gt;
    &lt;div v-if="userStore.loading" class="text-center"&gt;
      Yükleniyor...
    &lt;/div&gt;
    
    &lt;div v-else-if="userStore.error" class="text-red-500"&gt;
      Hata: {{ userStore.error }}
    &lt;/div&gt;
    
    &lt;div v-else&gt;
      &lt;button @click="handleAddUser"&gt;Kullanıcı Ekle&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
const userStore = useUsersStore()

async function handleAddUser() {
  try {
    const newUser = await userStore.addUser({
      name: 'John Doe',
      email: 'john@example.com'
    })
    
    // Success handling
    console.log('User added:', newUser)
  } catch (error) {
    // Error handling
    console.error('Failed to add user:', error)
  }
}

// Component mount olduğunda verileri yükle
onMounted(() => {
  userStore.fetchUsers()
})
&lt;/script&gt;</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">6. Canlı Örnek: Todo List Actions</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg">
          <div class="space-y-6">
            <!-- Todo Ekleme Formu -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 class="font-semibold mb-3">Yeni Todo Ekle</h3>
              <div class="flex gap-2">
                <UInput 
                  v-model="newTodoText" 
                  placeholder="Todo metni..."
                  @keyup.enter="handleAddTodo"
                  class="flex-1"
                />
                <UButton 
                  @click="handleAddTodo" 
                  :loading="todoStore?.loading || false"
                  :disabled="!newTodoText?.trim()"
                >
                  Ekle
                </UButton>
              </div>
            </div>

            <!-- Loading ve Error States -->
            <div v-if="todoStore && todoStore.loading" class="text-center py-4">
              <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin mx-auto" />
              <p class="text-gray-600 dark:text-gray-400 mt-2">İşlem yapılıyor...</p>
            </div>

            <div v-if="todoStore && todoStore.error" class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
              <div class="flex items-center space-x-2 text-red-800 dark:text-red-200">
                <UIcon name="i-heroicons-exclamation-triangle" class="h-5 w-5" />
                <span>{{ todoStore.error }}</span>
              </div>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-xl font-bold text-blue-600">{{ todoStore?.totalCount || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Toplam</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-xl font-bold text-green-600">{{ todoStore?.completedCount || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-xl font-bold text-orange-600">{{ todoStore?.pendingCount || 0 }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Bekleyen</div>
              </div>
            </div>

            <!-- Todo List -->
            <div class="space-y-2">
              <div 
                v-for="todo in todoStore?.todos || []" 
                :key="todo.id"
                class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                :class="todo.completed ? 'opacity-60' : ''"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <input 
                    type="checkbox"
                    :checked="todo.completed"
                    @change="todoStore?.toggleTodo?.(todo.id)"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span 
                    :class="todo.completed ? 'line-through text-gray-500' : ''"
                    class="flex-1"
                  >
                    {{ todo.text }}
                  </span>
                  <span class="text-xs text-gray-400">
                    {{ formatDate(todo.createdAt) }}
                  </span>
                </div>
                <UButton 
                  @click="todoStore?.removeTodo?.(todo.id)"
                  color="red" 
                  variant="ghost" 
                  size="sm"
                  icon="i-heroicons-trash"
                />
              </div>
            </div>

            <!-- Bulk Actions -->
            <div class="flex gap-2 justify-center">
              <UButton 
                @click="todoStore?.markAllCompleted?.()"
                variant="outline" 
                size="sm"
                :disabled="(todoStore?.totalCount || 0) === 0"
              >
                Hepsini Tamamla
              </UButton>
              <UButton 
                @click="todoStore?.clearCompleted?.()"
                variant="outline" 
                size="sm"
                color="red"
                :disabled="(todoStore?.completedCount || 0) === 0"
              >
                Tamamlananları Sil
              </UButton>
              <UButton 
                @click="todoStore?.clearAll?.()"
                variant="outline" 
                size="sm"
                color="gray"
                :disabled="(todoStore?.totalCount || 0) === 0"
              >
                Hepsini Sil
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia/getters" variant="outline" icon="i-heroicons-arrow-left">
        Getters
      </UButton>
      <UButton to="/pinia/modules" icon="i-heroicons-arrow-right" trailing>
        Modülerlik
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

// Demo Todo Store
const useDemoTodoStore = defineStore('demo-todos', () => {
  const todos = ref([
    { id: 1, text: 'Pinia öğren', completed: false, createdAt: new Date('2024-01-15') },
    { id: 2, text: 'Vue.js projesi yap', completed: true, createdAt: new Date('2024-01-14') },
    { id: 3, text: 'Dokümantasyon oku', completed: false, createdAt: new Date('2024-01-16') }
  ])
  
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const totalCount = computed(() => todos.value.length)
  const completedCount = computed(() => todos.value.filter(todo => todo.completed).length)
  const pendingCount = computed(() => todos.value.filter(todo => !todo.completed).length)

  // Actions
  async function addTodo(text) {
    if (!text.trim()) return

    loading.value = true
    error.value = null

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const newTodo = {
        id: Date.now(),
        text: text.trim(),
        completed: false,
        createdAt: new Date()
      }
      
      todos.value.push(newTodo)
      return newTodo
    } catch (err) {
      error.value = 'Todo eklenirken hata oluştu'
      throw err
    } finally {
      loading.value = false
    }
  }

  function toggleTodo(id) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  function removeTodo(id) {
    todos.value = todos.value.filter(todo => todo.id !== id)
  }

  function markAllCompleted() {
    todos.value.forEach(todo => {
      todo.completed = true
    })
  }

  function clearCompleted() {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  function clearAll() {
    todos.value = []
  }

  return {
    todos,
    loading,
    error,
    totalCount,
    completedCount,
    pendingCount,
    addTodo,
    toggleTodo,
    removeTodo,
    markAllCompleted,
    clearCompleted,
    clearAll
  }
})

const todoStore = useDemoTodoStore()
const newTodoText = ref('')

async function handleAddTodo() {
  try {
    await todoStore.addTodo(newTodoText.value)
    newTodoText.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR')
}
</script>