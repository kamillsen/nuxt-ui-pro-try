import { defineStore } from 'pinia'

export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export const useTodosStore = defineStore('todos', {
  state: () => ({
    todos: [
      { id: 1, text: 'Pinia öğren', completed: false, createdAt: new Date('2024-01-15') },
      { id: 2, text: 'Vue.js projesi yap', completed: true, createdAt: new Date('2024-01-14') },
      { id: 3, text: 'Dokümantasyon oku', completed: false, createdAt: new Date('2024-01-16') }
    ] as Todo[],
    loading: false
  }),

  getters: {
    completedTodos: (state) => state.todos.filter(todo => todo.completed),
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    totalCount: (state) => state.todos.length,
    completedCount: (state) => state.todos.filter(todo => todo.completed).length
  },

  actions: {
    async addTodo(text: string) {
      if (!text.trim()) return

      this.loading = true
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const newTodo: Todo = {
          id: Date.now(),
          text: text.trim(),
          completed: false,
          createdAt: new Date()
        }
        
        this.todos.push(newTodo)
      } catch (error) {
        console.error('Failed to add todo:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    toggleTodo(id: number) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    },

    removeTodo(id: number) {
      this.todos = this.todos.filter(todo => todo.id !== id)
    },

    markAllCompleted() {
      this.todos.forEach(todo => {
        todo.completed = true
      })
    },

    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    },

    clearAll() {
      this.todos = []
    },

    async fetchTodos() {
      this.loading = true
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        // In real app, you would fetch from API here
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})