export function useSyncfusionTheme() {
  const colorMode = useColorMode()
  
  const syncfusionThemes = {
    light: [
      'https://cdn.syncfusion.com/ej2/24.1.41/tailwind.css'
    ],
    dark: [
      'https://cdn.syncfusion.com/ej2/24.1.41/tailwind-dark.css'
    ]
  }
  
  const loadTheme = (theme: 'light' | 'dark') => {
    // Eski tema linklerini kaldır
    const existingLinks = document.querySelectorAll('link[data-syncfusion-theme]')
    existingLinks.forEach(link => link.remove())
    
    // Yeni tema linklerini ekle
    syncfusionThemes[theme].forEach(href => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.setAttribute('data-syncfusion-theme', theme)
      document.head.appendChild(link)
    })
  }
  
  const updateSyncfusionTheme = () => {
    const currentTheme = colorMode.value === 'dark' ? 'dark' : 'light'
    loadTheme(currentTheme)
  }
  
  // İlk yükleme
  onMounted(() => {
    updateSyncfusionTheme()
  })
  
  // Tema değişikliklerini izle
  watch(() => colorMode.value, () => {
    updateSyncfusionTheme()
  })
  
  return {
    updateSyncfusionTheme
  }
}