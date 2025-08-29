export function useSyncfusionTheme() {
  if (!import.meta.client) {
    return {
      updateSyncfusionTheme: () => Promise.resolve()
    }
  }

  const syncfusionThemes = {
    light: 'https://cdn.syncfusion.com/ej2/24.1.41/tailwind.css',
    dark: 'https://cdn.syncfusion.com/ej2/24.1.41/tailwind-dark.css'
  }
  
  const loadTheme = (theme: 'light' | 'dark') => {
    return new Promise<void>((resolve) => {
      // Eski tema linklerini kaldır
      const existingLinks = document.querySelectorAll('link[data-syncfusion-theme]')
      existingLinks.forEach(link => link.remove())
      
      // Yeni tema linkini ekle
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
  
  const updateSyncfusionTheme = async () => {
    const isDark = document.documentElement.classList.contains('dark')
    const currentTheme = isDark ? 'dark' : 'light'
    await loadTheme(currentTheme)
  }
  
  // İlk yükleme
  onMounted(() => {
    updateSyncfusionTheme()
    
    // DOM değişikliklerini izle (dark class değişimi)
    const observer = new MutationObserver(() => {
      updateSyncfusionTheme()
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    // Cleanup
    onUnmounted(() => {
      observer.disconnect()
    })
  })
  
  return {
    updateSyncfusionTheme
  }
}