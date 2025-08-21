import { defineStore } from 'pinia'

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
  createdAt: Date
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [
      {
        id: 1,
        name: 'Ahmet Yılmaz',
        email: 'ahmet@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Ahmet+Yılmaz&background=3B82F6&color=fff',
        role: 'admin' as const,
        createdAt: new Date('2024-01-10')
      },
      {
        id: 2,
        name: 'Fatma Kaya',
        email: 'fatma@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Fatma+Kaya&background=EF4444&color=fff',
        role: 'user' as const,
        createdAt: new Date('2024-01-12')
      },
      {
        id: 3,
        name: 'Mehmet Demir',
        email: 'mehmet@example.com',
        avatar: 'https://ui-avatars.com/api/?name=Mehmet+Demir&background=10B981&color=fff',
        role: 'user' as const,
        createdAt: new Date('2024-01-14')
      }
    ] as User[],
    loading: false,
    currentUser: null as User | null
  }),

  getters: {
    adminUsers: (state) => state.users.filter(user => user.role === 'admin'),
    regularUsers: (state) => state.users.filter(user => user.role === 'user'),
    userCount: (state) => state.users.length,
    isLoggedIn: (state) => !!state.currentUser
  },

  actions: {
    async addUser(userData: Omit<User, 'id' | 'createdAt'>) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const newUser: User = {
          ...userData,
          id: Date.now(),
          createdAt: new Date()
        }
        
        this.users.push(newUser)
      } catch (error) {
        console.error('Failed to add user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateUser(id: number, updates: Partial<User>) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 600))
        
        const userIndex = this.users.findIndex(user => user.id === id)
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.users[userIndex], ...updates }
        }
      } catch (error) {
        console.error('Failed to update user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteUser(id: number) {
      this.loading = true
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        this.users = this.users.filter(user => user.id !== id)
      } catch (error) {
        console.error('Failed to delete user:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentUser(user: User) {
      this.currentUser = user
    },

    logout() {
      this.currentUser = null
    }
  }
})