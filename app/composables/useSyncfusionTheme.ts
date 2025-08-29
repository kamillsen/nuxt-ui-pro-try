import { onMounted, watch } from 'vue'
import { useColorMode } from '@vueuse/core'

// Syncfusion bileşenlerinin tema yönetimi
export function useSyncfusionTheme() {
  // SSR kontrolü
  if (!import.meta.client) {
    return {
      updateSyncfusionTheme: () => Promise.resolve()
    }
  }

  const syncfusionThemes = {
    light: 'https://cdn.syncfusion.com/ej2/24.1.41/tailwind.css',
    dark: 'https://cdn.syncfusion.com/ej2/24.1.41/tailwind-dark.css'
  }
  
  // CSS tema yükleme fonksiyonu
  const loadTheme = (theme: 'light' | 'dark') => {
    return new Promise<void>((resolve) => {
      // Eski CSS linklerini temizle
      const existingLinks = document.querySelectorAll('link[data-syncfusion-theme]')
      existingLinks.forEach(link => link.remove())
      
      // Yeni CSS link oluştur
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = syncfusionThemes[theme]
      link.setAttribute('data-syncfusion-theme', theme)
      
      link.onload = () => {
        console.log(`🎨 Syncfusion ${theme} theme loaded`)
        resolve()
      }
      
      link.onerror = () => {
        console.warn(`⚠️ Failed to load Syncfusion ${theme} theme`)
        resolve()
      }
      
      document.head.appendChild(link)
    })
  }
  
  const colorMode = useColorMode()
  
  const updateSyncfusionTheme = async () => {
    await loadTheme(colorMode.value as 'light' | 'dark')
  }
  
  // Component mount olduğunda tema sistemini aktifleştir
  onMounted(() => {
    updateSyncfusionTheme()
    
    // Tema değişikliklerini izle
    watch(() => colorMode.value, () => {
      console.log(`🔄 Theme changed to: ${colorMode.value}`)
      updateSyncfusionTheme()
    })
  })
  
  return {
    updateSyncfusionTheme
  }
}