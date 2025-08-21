import { defineStore } from 'pinia'
import { $fetch } from 'ofetch'


export type Todo = {
  _id?: string
  title: string
  done: boolean
  createdAt?: string
}

export const useTodoApp = defineStore('todo-app', {
  state: () => ({
    items: [] as Todo[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    // örnek getter (opsiyonel)
    doneCount: (state) => state.items.filter(t => t.done).length,
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const data = await $fetch<Todo[]>('/api/todos')
        // en yeniler üstte dursun
        this.items =  data.slice().reverse()
      } catch (e: any) {
        this.error = e?.data?.message || e?.message || 'Fetch failed'
      } finally {
        this.loading = false
      }
    },

    // Optimistic create
    async add(title: string) {
      const payload: Todo = { title, done: false, createdAt: new Date().toISOString() }
      const tempId = `temp-${crypto.randomUUID()}`
      this.items.unshift({ ...payload, _id: tempId })

      try {
        const created = await $fetch<Todo>('/api/todos', { method: 'POST', body: payload })
        const i = this.items.findIndex(t => t._id === tempId)
        if (i !== -1) this.items[i] = created
      } catch (e: any) {
        // rollback
        this.items = this.items.filter(t => t._id !== tempId)
        this.error = e?.data?.message || e?.message || 'Add failed'
        throw e
      }
    },

    // Toggle (optimistic)
    async toggle(id: string) {
      const i = this.items.findIndex(t => t._id === id)
      if (i === -1) return
      const prev = { ...this.items[i] }
      this.items[i]!.done = !this.items[i]!.done

      try {
        await $fetch(`/api/todos/${id}`, {
          method: 'PUT',
          body: {
            title: this.items[i]!.title,
            done: this.items[i]!.done,
            createdAt: this.items[i]!.createdAt,
          },
        })
      } catch (e: any) {
        this.items[i] = prev as Todo // rollback
        this.error = e?.data?.message || e?.message || 'Toggle failed'
      }
    },

    // Delete (optimistic)
    async remove(id: string) {
      const prev = [...this.items]
      this.items = this.items.filter(t => t._id !== id)
      try {
        await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
      } catch (e: any) {
        this.items = prev // rollback
        this.error = e?.data?.message || e?.message || 'Delete failed'
      }
    },
  },
})
