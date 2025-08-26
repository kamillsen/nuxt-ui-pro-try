<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Todo App</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Pinia ile gerçek zamanlı todo uygulaması</p>
      </div>
      <div class="flex items-center space-x-3">
        <UBadge color="success" variant="subtle">{{ todoApp.doneCount }} tamamlandı</UBadge>
        <UButton 
          @click="refreshTodos" 
          variant="outline" 
          size="sm"
          :loading="todoApp.loading"
          icon="i-heroicons-arrow-path"
        >
          Yenile
        </UButton>
      </div>
    </div>

    <!-- Error State -->
    <UAlert
      v-if="todoApp.error"
      color="error"
      variant="subtle"
      :title="todoApp.error"
      @close="todoApp.error = null"
    />

    <div class="space-y-6">
      <!-- Add Todo Form -->
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">Yeni Görev Ekle</h2>
        </template>
        <UFormGroup label="Görev Başlığı" name="title">
          <div class="flex gap-2">
            <UInput 
              v-model="title" 
              placeholder="Ne yapacaksın?"
              @keyup.enter="addTodo"
              class="flex-1"
            />
            <UButton 
              @click="addTodo" 
              :disabled="!title.trim() || todoApp.loading"
              :loading="todoApp.loading"
            >
              Ekle
            </UButton>
          </div>
        </UFormGroup>
      </UCard>

      <!-- Loading Skeleton -->
      <div v-if="todoApp.loading && todoApp.items.length === 0" class="space-y-3">
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-3/4" />
        <USkeleton class="h-4 w-1/2" />
      </div>

      <!-- Todo List -->
      <UCard v-else-if="todoApp.items.length > 0">
        <template #header>
          <h2 class="text-lg font-semibold">Görevler ({{ todoApp.items.length }})</h2>
        </template>
        <div class="space-y-3">
          <div 
            v-for="todo in todoApp.items" 
            :key="todo._id"
            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div class="flex items-center space-x-3 flex-1">
              <UCheckbox 
                :checked="todo.done"
                @change="toggleTodo(todo._id!)"
              />
              <span 
                :class="todo.done ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'"
                class="flex-1"
              >
                {{ todo.title }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(todo.createdAt!) }}
              </span>
            </div>
            <UButton 
              @click="removeTodo(todo._id!)"
              color="error" 
              variant="ghost" 
              size="sm"
              icon="i-heroicons-trash"
            />
          </div>
        </div>
      </UCard>

      <!-- Empty State -->
      <UCard v-else>
        <div class="text-center py-8">
          <UIcon name="i-heroicons-clipboard-document-list" class="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Henüz görev yok</h3>
          <p class="text-gray-600 dark:text-gray-400">Yukarıdaki formdan ilk görevinizi ekleyin!</p>
        </div>
      </UCard>
    </div>

    <div class="flex justify-between">
      <UButton to="/pinia/advanced" variant="outline" icon="i-heroicons-arrow-left">
        İleri Düzey
      </UButton>
      <UButton to="/pinia" icon="i-heroicons-arrow-right" trailing>
        Ana
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoApp } from '~~/stores/todo-app'

definePageMeta({
  layout: 'default'
})

const todoApp = useTodoApp()
const title = ref<string>('')

onMounted(() => {
  todoApp.fetchAll()
})

async function addTodo() {
  if (!title.value.trim()) return
  
  try {
    await todoApp.add(title.value.trim())
    title.value = ''
  } catch (error) {
    console.error('Failed to add todo:', error)
  }
}

async function toggleTodo(id: string) {
  try {
    await todoApp.toggle(id)
  } catch (error) {
    console.error('Failed to toggle todo:', error)
  }
}

async function removeTodo(id: string) {
  try {
    await todoApp.remove(id)
  } catch (error) {
    console.error('Failed to remove todo:', error)
  }
}

async function refreshTodos() {
  await todoApp.fetchAll()
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('tr-TR')
}
</script>