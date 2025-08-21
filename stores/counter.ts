import { defineStore } from 'pinia'

export interface HistoryItem {
  action: string
  amount?: number
  timestamp: Date
}

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    history: [] as HistoryItem[]
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    isPositive: (state) => state.count > 0,
    lastAction: (state) => state.history[state.history.length - 1] || null
  },

  actions: {
    increment() {
      this.count++
      this.history.push({ 
        action: 'increment', 
        timestamp: new Date() 
      })
    },

    decrement() {
      this.count--
      this.history.push({ 
        action: 'decrement', 
        timestamp: new Date() 
      })
    },

    incrementBy(amount: number) {
      this.count += amount
      this.history.push({ 
        action: 'incrementBy', 
        amount, 
        timestamp: new Date() 
      })
    },

    reset() {
      this.count = 0
      this.history = []
    }
  }
})