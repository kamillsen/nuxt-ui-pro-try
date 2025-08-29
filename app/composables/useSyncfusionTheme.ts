import { onMounted, watch } from 'vue'
import { useColorMode } from '@vueuse/core'

/**
 * Syncfusion Bileşenleri İçin Tema Yönetimi Composable
 * 
 * Bu composable, Syncfusion bileşenlerinin tema değişikliklerini yönetir.
 * Nuxt UI'ın tema sistemiyle senkronize çalışır ve dinamik CSS yükleme yapar.
 * 
 * Kullanım: Syncfusion bileşeni içeren her Vue sayfasında çağırın
 * Örnek: useSyncfusionTheme()
 */
export function useSyncfusionTheme() {
  // SSR (Server-Side Rendering) kontrolü
  // Sunucu tarafında çalışıyorsa boş fonksiyon döndür
  if (!import.meta.client) {
    return {
      updateSyncfusionTheme: () => Promise.resolve()
    }
  }

  // Syncfusion için CDN tema dosyaları
  // Her tema için ayrı CSS dosyası gerekli
  const syncfusionThemes = {
    light: 'https://cdn.syncfusion.com/ej2/24.1.41/tailwind.css',
    dark: 'https://cdn.syncfusion.com/ej2/24.1.41/tailwind-dark.css'
  }
  
  /**
   * Dinamik CSS Tema Yükleme Fonksiyonu
   * 
   * Bu fonksiyon:
   * 1. Eski Syncfusion CSS linklerini temizler
   * 2. Yeni tema CSS'ini CDN'den yükler
   * 3. Yükleme durumunu Promise ile yönetir
   * 
   * @param theme - 'light' veya 'dark' tema türü
   * @returns Promise - CSS yükleme tamamlandığında resolve olur
   */
  const loadTheme = (theme: 'light' | 'dark') => {
    return new Promise<void>((resolve) => {
      // ADIM 1: Eski tema CSS linklerini DOM'dan temizle
      // data-syncfusion-theme attribute'u ile işaretli linkleri bul ve kaldır
      const existingLinks = document.querySelectorAll('link[data-syncfusion-theme]')
      existingLinks.forEach(link => link.remove())
      
      // ADIM 2: Yeni CSS link elementi oluştur
      const link = document.createElement('link')
      link.rel = 'stylesheet'  // CSS dosyası olduğunu belirt
      link.href = syncfusionThemes[theme]  // CDN URL'sini ata
      link.setAttribute('data-syncfusion-theme', theme)  // Tema işaretleyicisi ekle
      
      // ADIM 3: CSS yükleme başarılı olduğunda
      link.onload = () => {
        console.log(`🎨 Syncfusion ${theme} theme loaded`)
        resolve()  // Promise'i başarıyla sonlandır
      }
      
      // ADIM 4: CSS yükleme başarısız olduğunda
      link.onerror = () => {
        console.warn(`⚠️ Failed to load Syncfusion ${theme} theme`)
        resolve()  // Hata olsa da Promise'i sonlandır (blocking önlenmesi için)
      }
      
      // ADIM 5: Link elementini DOM head'ine ekle (CSS yüklemeyi başlat)
      document.head.appendChild(link)
    })
  }
  
  // Nuxt UI'ın tema durumunu al (@vueuse/core ile sağlanır)
  // Bu, UColorModeButton ile senkronize çalışır
  const colorMode = useColorMode()
  
  /**
   * Ana Tema Güncelleme Fonksiyonu
   * 
   * Mevcut colorMode değerini kontrol eder ve uygun Syncfusion CSS'ini yükler.
   * Bu fonksiyon hem manual hem de otomatik çağrılabilir.
   */
  const updateSyncfusionTheme = async () => {
    // colorMode.value: 'light', 'dark', veya 'system' olabilir
    // 'system' durumunda TypeScript uyarısını önlemek için cast yapıyoruz
    await loadTheme(colorMode.value as 'light' | 'dark')
  }
  
  // TEMA SİSTEMİ AKTİVASYONU
  // Bu bölüm composable çağrıldığında (Vue component mount olduğunda) çalışır
  onMounted(() => {
    // İlk yükleme: Sayfaya girildiğinde mevcut temayı yükle
    updateSyncfusionTheme()
    
    // TEMA DEĞİŞİKLİK İZLEYİCİSİ
    // useColorMode()'un reactive value'sunu izle
    // UColorModeButton'a tıklandığında bu tetiklenir
    watch(() => colorMode.value, () => {
      console.log(`🔄 Theme changed to: ${colorMode.value}`)
      updateSyncfusionTheme()  // Yeni temaya uygun CSS'i yükle
    })
  })
  
  // Composable'ın dış dünyaya açtığı API
  // Manuel tema güncelleme için kullanılabilir
  return {
    updateSyncfusionTheme
  }
}