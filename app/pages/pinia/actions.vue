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
        <h2 class="text-xl font-semibold">3. Canlı Örnek: Todo Actions</h2>
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
                  @keyup.enter="addTodo"
                  class="flex-1"
                />
                <UButton 
                  @click="addTodo" 
                  :loading="loading"
                  :disabled="!newTodoText.trim()"
                >
                  Ekle
                </UButton>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-4">
              <UIcon name="i-heroicons-arrow-path" class="h-6 w-6 animate-spin mx-auto" />
              <p class="text-gray-600 dark:text-gray-400 mt-2">İşlem yapılıyor...</p>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ todos.length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Toplam Todo</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ completedTodos.length }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</div>
              </div>
            </div>

            <!-- Todo List -->
            <div class="space-y-2">
              <div 
                v-for="todo in todos" 
                :key="todo.id"
                class="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                :class="todo.completed ? 'opacity-60' : ''"
              >
                <div class="flex items-center space-x-3 flex-1">
                  <input 
                    type="checkbox"
                    :checked="todo.completed"
                    @change="toggleTodo(todo.id)"
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
                  @click="removeTodo(todo.id)"
                  color="red" 
                  variant="ghost" 
                  size="sm"
                  icon="i-heroicons-trash"
                />
              </div>
            </div>

            <!-- Bulk Actions -->
            <div class="flex gap-2 justify-center" v-if="todos.length > 0">
              <UButton 
                @click="markAllCompleted"
                variant="outline" 
                size="sm"
              >
                Hepsini Tamamla
              </UButton>
              <UButton 
                @click="clearCompleted"
                variant="outline" 
                size="sm"
                color="red"
                v-if="completedTodos.length > 0"
              >
                Tamamlananları Sil
              </UButton>
              <UButton 
                @click="clearAll"
                variant="outline" 
                size="sm"
                color="gray"
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
import { ref } from 'vue'
import { useTodosStore } from '~/stores/todos'
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'default'
})

const todosStore = useTodosStore()
const newTodoText = ref('')

// Store'dan gelen değerleri destructure ediyoruz
const { todos, completedTodos, loading } = storeToRefs(todosStore)

async function addTodo() {
  if (!newTodoText.value.trim()) return
  
  try {
    await todosStore.addTodo(newTodoText.value)
    newTodoText.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

function toggleTodo(id) {
  todosStore.toggleTodo(id)
}

function removeTodo(id) {
  todosStore.removeTodo(id)
}

function markAllCompleted() {
  todosStore.markAllCompleted()
}

function clearCompleted() {
  todosStore.clearCompleted()
}

function clearAll() {
  todosStore.clearAll()
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('tr-TR')
}
</script>