import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    theme: 'light',
    language: 'tr',
    notificationsEnabled: true,
    fontSize: 16,
    lastUpdated: null as string | null
  }),

  getters: {
    isDarkMode: (state) => state.theme === 'dark',
    isLightMode: (state) => state.theme === 'light',
    fontSizeClass: (state) => {
      if (state.fontSize <= 14) return 'text-sm'
      if (state.fontSize >= 20) return 'text-xl'
      return 'text-base'
    }
  },

  actions: {
    toggleNotifications() {
      this.notificationsEnabled = !this.notificationsEnabled
      this.lastUpdated = new Date().toLocaleTimeString()
    },

    updateTheme(newTheme: 'light' | 'dark') {
      this.theme = newTheme
      this.lastUpdated = new Date().toLocaleTimeString()
    },

    updateFontSize(size: number) {
      this.fontSize = Math.max(12, Math.min(24, size))
      this.lastUpdated = new Date().toLocaleTimeString()
    },

    resetSettings() {
      this.$patch({
        theme: 'light',
        language: 'tr',
        notificationsEnabled: true,
        fontSize: 16,
        lastUpdated: new Date().toLocaleTimeString()
      })
    },

    applyDarkPreset() {
      this.$patch({
        theme: 'dark',
        fontSize: 18,
        lastUpdated: new Date().toLocaleTimeString()
      })
    },

    applyLightPreset() {
      this.$patch({
        theme: 'light',
        fontSize: 14,
        lastUpdated: new Date().toLocaleTimeString()
      })
    }
  }
})