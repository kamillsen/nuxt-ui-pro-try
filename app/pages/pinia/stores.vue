Aşağıda kodunu aynı işlevi koruyarak daha okunabilir hâle getirdim: mantıksal blokları ayırdım, boşluklar ekledim, yorumları zenginleştirdim ve tutarlı bir biçimlendirme uyguladım. Tamamını tek parça olarak geri veriyorum. 👇

```vue
<template>
  <div class="space-y-8">
    <!-- =========================================================
         Sayfa Başlığı
         ---------------------------------------------------------
         Başlık ve kısa açıklama + seviye rozeti
    ========================================================== -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Store Oluşturma
        </h1>

        <p class="text-gray-600 dark:text-gray-300 mt-2">
          defineStore kullanarak farklı store yapıları oluşturmayı öğrenin
        </p>
      </div>

      <UBadge color="green" variant="subtle">Başlangıç</UBadge>
    </div>

    <!-- =========================================================
         1) Store Tanımlama Yöntemleri
         ---------------------------------------------------------
         Pinia'da iki yaklaşım: Options API ve Composition API
    ========================================================== -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Store Tanımlama Yöntemleri</h2>
      </template>

      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Pinia'da store tanımlamak için iki ana yöntem vardır: Options API ve Composition API
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Options API kutucuğu -->
          <div class="p-4 border rounded-lg">
            <h3 class="font-semibold text-green-600 dark:text-green-400 mb-2">
              Options API
            </h3>

            <ul class="text-sm space-y-1">
              <li>• Vuex'e benzer yapı</li>
              <li>• state, getters, actions ayrı</li>
              <li>• Daha yapılandırılmış</li>
            </ul>
          </div>

          <!-- Composition API kutucuğu -->
          <div class="p-4 border rounded-lg">
            <h3 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Composition API
            </h3>

            <ul class="text-sm space-y-1">
              <li>• ref, computed kullanımı</li>
              <li>• Daha esnek yapı</li>
              <li>• TypeScript ile uyumlu</li>
            </ul>
          </div>
        </div>
      </div>
    </UCard>

    <!-- =========================================================
         2) Options API ile Store Örneği
         ---------------------------------------------------------
         state / getters / actions bloklarıyla klasik kullanım
    ========================================================== -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. Options API ile Store</h2>
      </template>

      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  // ------------------------------------------------------------
  // State: Uygulama başında oluşturulan varsayılan veriler
  // ------------------------------------------------------------
  state: () => ({
    user: null,
    isLoggedIn: false,
    preferences: {
      theme: 'light',
      language: 'tr'
    }
  }),

  // ------------------------------------------------------------
  // Getters: Computed benzeri, state'ten türeyen değerler
  // - 'state' parametresini veya 'this' bağlamını kullanabilirsiniz.
  //   Tek bir stili seçip tutarlı kullanmak okunabilirliği artırır.
  // ------------------------------------------------------------
  getters: {
    displayName: (state) => state.user?.name || 'Misafir',
    isAdmin: (state) => state.user?.role === 'admin',
    themeClass() {
      return `theme-${this.preferences.theme}`
    }
  },

  // ------------------------------------------------------------
  // Actions: Asenkron işlemler ve state değişiklikleri
  // ------------------------------------------------------------
  actions: {
    async login(email, password) {
      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          // JSON gönderiyorsanız içerik tipini belirtmek önemlidir
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        })

        if (response.ok) {
          this.user = await response.json()
          this.isLoggedIn = true
        }
      } catch (error) {
        console.error('Login failed:', error)
      }
    },

    logout() {
      this.user = null
      this.isLoggedIn = false
    },

    updatePreferences(newPrefs) {
      // Tüm nesneyi güncellemek yerine tekil alan güncellemeleri de yapılabilir
      this.preferences = { ...this.preferences, ...newPrefs }
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <!-- =========================================================
         3) Composition API ile Store Örneği
         ---------------------------------------------------------
         defineStore içinde ref/computed kullanımı
    ========================================================== -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Composition API ile Store</h2>
      </template>

      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/products.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  // -----------------------------
  // State
  // -----------------------------
  const products = ref([])
  const loading = ref(false)
  const selectedCategory = ref('all')

  // -----------------------------
  // Getters (computed)
  // -----------------------------
  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value
    }
    return products.value.filter(p => p.category === selectedCategory.value)
  })

  const productCount = computed(() => products.value.length)

  const categories = computed(() => {
    const cats = products.value.map(p => p.category)
    return [...new Set(cats)]
  })

  // -----------------------------
  // Actions
  // -----------------------------
  async function fetchProducts() {
    loading.value = true
    try {
      const response = await fetch('/api/products')
      products.value = await response.json()
    } catch (error) {
      console.error('Fetch failed:', error)
    } finally {
      loading.value = false
    }
  }

  function addProduct(product) {
    products.value.push({
      ...product,
      id: Date.now()
    })
  }

  function removeProduct(id) {
    const index = products.value.findIndex(p => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  function setCategory(category) {
    selectedCategory.value = category
  }

  // Dışa aktarılan üyeler
  return {
    products,
    loading,
    selectedCategory,
    filteredProducts,
    productCount,
    categories,
    fetchProducts,
    addProduct,
    removeProduct,
    setCategory
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <!-- =========================================================
         4) Store ID ve İsimlendirme
         ---------------------------------------------------------
         Best practice: use* ile başlaması ve id benzersizliği
    ========================================================== -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. Store ID ve İsimlendirme</h2>
      </template>

      <div class="space-y-4">
        <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Önemli Notlar:
          </h3>

          <ul class="space-y-2 text-yellow-700 dark:text-yellow-300">
            <li class="flex items-start space-x-2">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5 mt-0.5" />
              <span>Store ID benzersiz olmalı ve string olarak verilmeli.</span>
            </li>

            <li class="flex items-start space-x-2">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5 mt-0.5" />
              <span>Store fonksiyonu ismi <code>use</code> ile başlamalı (ör. <code>useProductStore</code>).</span>
            </li>

            <li class="flex items-start space-x-2">
              <UIcon name="i-heroicons-light-bulb" class="h-5 w-5 mt-0.5" />
              <span>Store dosyaları <code>stores/</code> klasöründe tutulmalı.</span>
            </li>
          </ul>
        </div>

        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// ✅ Doğru İsimlendirme
export const useUserStore = defineStore('user', { ... })
export const useProductStore = defineStore('products', { ... })
export const useShoppingCartStore = defineStore('shopping-cart', { ... })

// ❌ Yanlış İsimlendirme
export const UserStore = defineStore('user', { ... })        // 'use' ile başlamıyor
export const store = defineStore('products', { ... })        // Fonksiyon adı çok genel
export const useStore = defineStore('shopping-cart', { ... })// Spesifik değil</code></pre>
        </div>
      </div>
    </UCard>

    <!-- =========================================================
         5) Canlı Örnek - Ürün Store'u
         ---------------------------------------------------------
         Aşağıdaki bölüm, sayfa içinde tanımlanan demo store'u kullanır
    ========================================================== -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Canlı Örnek: Ürün Store'u</h2>
      </template>

      <div class="space-y-4">
        <div class="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg">
          <div class="space-y-4">
            <!-- Üst şerit: başlık + kategori filtreleri -->
            <div class="flex justify-between items-center">
              <h3 class="text-xl font-semibold">Ürünler</h3>

              <div class="flex space-x-2">
                <!-- Kategori butonları: 'all' + benzersiz kategoriler -->
                <UButton
                  v-for="category in ['all', ...demoStore.categories]"
                  :key="category"
                  :variant="demoStore.selectedCategory === category ? 'solid' : 'outline'"
                  size="xs"
                  @click="demoStore.setCategory(category)"
                >
                  {{ category === 'all' ? 'Tümü' : category }}
                </UButton>
              </div>
            </div>

            <!-- Sayaçlar: toplam ve filtreye göre gösterilen ürün sayısı -->
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Toplam: {{ demoStore.productCount }} ürün |
              Gösterilen: {{ demoStore.filteredProducts.length }} ürün
            </div>

            <!-- Ürün kartları -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="product in demoStore.filteredProducts"
                :key="product.id"
                class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
              >
                <h4 class="font-medium">{{ product.name }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {{ product.category }}
                </p>

                <div class="flex justify-between items-center mt-2">
                  <span class="font-bold text-green-600">
                    ₺{{ product.price }}
                  </span>

                  <UButton
                    size="xs"
                    color="red"
                    @click="demoStore.removeProduct(product.id)"
                  >
                    Sil
                  </UButton>
                </div>
              </div>
            </div>

            <!-- Rastgele ürün ekleme butonu -->
            <UButton
              class="w-full"
              color="green"
              @click="addRandomProduct"
            >
              Rastgele Ürün Ekle
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <!-- =========================================================
         Alt Navigasyon
    ========================================================== -->
    <div class="flex justify-between">
      <UButton
        to="/pinia/basics"
        variant="outline"
        icon="i-heroicons-arrow-left"
      >
        Temel Kullanım
      </UButton>

      <UButton
        to="/pinia/state"
        icon="i-heroicons-arrow-right"
        trailing
      >
        State Yönetimi
      </UButton>
    </div>
  </div>
</template>

<script setup>
/* =======================================================================
   Script Bölümü (Nuxt 3 + Vue 3 + Pinia)
   -----------------------------------------------------------------------
   - Bu sayfada DEMO amacıyla bir store sayfa içinde oluşturuluyor.
   - Gerçek projelerde store'ları /stores klasöründe ayrı dosya olarak
     tutmak, HMR ve kod düzeni açısından daha uygundur.
======================================================================= */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/* -----------------------------------------------------------------------
   Sayfa Meta Bilgileri (Nuxt)
   - layout: Hangi layout kullanılacağını belirtir.
----------------------------------------------------------------------- */
definePageMeta({
  layout: 'default'
})

/* -----------------------------------------------------------------------
   DEMO STORE (Composition API ile)
   - Bu store yalnızca bu sayfadaki canlı örnek için tasarlanmıştır.
   - Dış dünya ile API iletişimi yoktur; tamamen local verilerle çalışır.
----------------------------------------------------------------------- */
const useDemoProductsStore = defineStore('demo-products', () => {
  /* ---------------------------------------------
     STATE: Reaktif veriler
     --------------------------------------------- */
  const products = ref([
    { id: 1, name: 'MacBook Pro',        price: 25000, category: 'elektronik' },
    { id: 2, name: 'iPhone 15',          price: 15000, category: 'elektronik' },
    { id: 3, name: 'Kahve Fincanı',      price: 50,    category: 'ev-esyasi' },
    { id: 4, name: 'Kitap: Vue.js',      price: 120,   category: 'kitap' }
  ])

  // Varsayılan kategori: 'all' (tümü)
  const selectedCategory = ref('all')

  /* ---------------------------------------------
     GETTERS: Computed alanlar
     --------------------------------------------- */

  // 1) Seçili kategoriye göre ürünleri filtreler
  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value
    }
    return products.value.filter((p) => p.category === selectedCategory.value)
  })

  // 2) Toplam ürün sayısını döndürür
  const productCount = computed(() => products.value.length)

  // 3) Ürünlerden benzersiz kategori listesini üretir
  const categories = computed(() => {
    const cats = products.value.map((p) => p.category)
    return [...new Set(cats)]
  })

  /* ---------------------------------------------
     ACTIONS: Store'u değiştiren fonksiyonlar
     --------------------------------------------- */

  // Yeni bir ürün ekler (id: timestamp tabanlı)
  function addProduct(product) {
    products.value.push({
      ...product,
      id: Date.now()
    })
  }

  // Verilen id'ye sahip ürünü siler
  function removeProduct(id) {
    const index = products.value.findIndex((p) => p.id === id)
    if (index > -1) {
      products.value.splice(index, 1)
    }
  }

  // Kategori filtresini günceller
  function setCategory(category) {
    selectedCategory.value = category
  }

  /* ---------------------------------------------
     Dışa aktarılan üyeler
     --------------------------------------------- */
  return {
    // State
    products,
    selectedCategory,

    // Getters
    filteredProducts,
    productCount,
    categories,

    // Actions
    addProduct,
    removeProduct,
    setCategory
  }
})

/* -----------------------------------------------------------------------
   STORE KULLANIMI
   - Aşağıda tanımlanan store'u component içinde kullanıma alıyoruz.
----------------------------------------------------------------------- */
const demoStore = useDemoProductsStore()

/* -----------------------------------------------------------------------
   ÖRNEK VERİLER (Rastgele ekleme için)
   - 'Rastgele Ürün Ekle' butonu bu listeden bir ürünü alır ve ekler.
----------------------------------------------------------------------- */
const sampleProducts = [
  { name: 'Tablet',              price: 3000, category: 'elektronik' },
  { name: 'Masa Lambası',        price: 200,  category: 'ev-esyasi' },
  { name: 'Roman Kitabı',        price: 80,   category: 'kitap' },
  { name: 'Bluetooth Kulaklık',  price: 500,  category: 'elektronik' },
  { name: 'Yastık',              price: 150,  category: 'ev-esyasi' }
]

/* -----------------------------------------------------------------------
   Yardımcı İşlev: Rastgele ürün ekleme
   - sampleProducts listesinden rastgele bir ürün seçer
   - İsmine 0-99 arası rastgele bir sayı ekleyerek benzersizleştirir
----------------------------------------------------------------------- */
function addRandomProduct() {
  const randomProduct =
    sampleProducts[Math.floor(Math.random() * sampleProducts.length)]

  demoStore.addProduct({
    ...randomProduct,
    name: `${randomProduct.name} ${Math.floor(Math.random() * 100)}`
  })
}
</script>
```
