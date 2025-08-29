export default defineNuxtPlugin(() => {
  // Syncfusion theme sisteminin başlatılması
  if (process.client) {
    console.log('🎨 Syncfusion theme system initialized')
    
    // Tema değişikliklerini dinle
    const colorMode = useColorMode()
    
    // İlk yükleme için tema sınıfını kontrol et
    const applyThemeClass = () => {
      const html = document.documentElement
      if (colorMode.value === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
    
    // İlk çalıştırma
    applyThemeClass()
    
    // Tema değişikliklerini izle
    watch(() => colorMode.value, () => {
      applyThemeClass()
    })
  }
})