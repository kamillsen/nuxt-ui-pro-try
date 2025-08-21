<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Getters</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Computed değerler oluşturma ve state'e dayalı hesaplamalar</p>
      </div>
      <UBadge color="yellow" variant="subtle">Orta</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Getters Nedir?</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Getters, store state'ine dayalı hesaplanan değerlerdir. Vue'daki computed property'lere benzerler ve cache edilirler.
        </p>
        
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Getters'ın Avantajları:</h3>
          <ul class="space-y-2 text-blue-800 dark:text-blue-200">
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Cache edilir - gereksiz hesaplamalar yapılmaz</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Reaktif - bağımlı state değişince otomatik güncellenir</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Diğer getter'larda kullanılabilir</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-check" class="h-4 w-4" />
              <span>Parametre alabilir</span>
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. Basit Getters</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/products.js
export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [
      { id: 1, name: 'Laptop', price: 5000, category: 'elektronik', inStock: true },
      { id: 2, name: 'Mouse', price: 150, category: 'elektronik', inStock: false },
      { id: 3, name: 'Kitap', price: 80, category: 'kitap', inStock: true }
    ],
    tax: 0.18
  }),

  getters: {
    // Basit hesaplama
    productCount: (state) => state.products.length,
    
    // Toplam değer hesaplama
    totalValue: (state) => {
      return state.products.reduce((sum, product) => sum + product.price, 0)
    },
    
    // Vergi dahil toplam
    totalWithTax() {
      return this.totalValue * (1 + this.tax)
    },
    
    // Stokta olan ürünler
    inStockProducts: (state) => {
      return state.products.filter(product => product.inStock)
    },
    
    // Kategorilere göre gruplandırma
    productsByCategory: (state) => {
      return state.products.reduce((groups, product) => {
        const category = product.category
        if (!groups[category]) {
          groups[category] = []
        }
        groups[category].push(product)
        return groups
      }, {})
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Parametreli Getters</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Getters fonksiyon döndürerek parametre alabilir. Bu durumda cache edilmezler.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>getters: {
  // Kategoriye göre ürünleri getir
  getProductsByCategory: (state) => (category) => {
    return state.products.filter(product => product.category === category)
  },

  // Fiyat aralığında ürünler
  getProductsByPriceRange: (state) => (minPrice, maxPrice) => {
    return state.products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    )
  },

  // ID'ye göre ürün bul
  getProductById: (state) => (id) => {
    return state.products.find(product => product.id === id)
  },

  // Arama yapan getter
  searchProducts: (state) => (searchTerm) => {
    if (!searchTerm) return state.products
    
    const term = searchTerm.toLowerCase()
    return state.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }
}

// Kullanımı:
// const electronicsProducts = store.getProductsByCategory('elektronik')
// const cheapProducts = store.getProductsByPriceRange(0, 200)
// const product = store.getProductById(1)
// const results = store.searchProducts('laptop')</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. Composition API ile Getters</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/products-composition.js
import { computed } from 'vue'

export const useProductsStore = defineStore('products', () => {
  const products = ref([...])
  const tax = ref(0.18)

  // Computed kullanarak getters
  const productCount = computed(() => products.value.length)
  
  const totalValue = computed(() => 
    products.value.reduce((sum, product) => sum + product.price, 0)
  )
  
  const totalWithTax = computed(() => 
    totalValue.value * (1 + tax.value)
  )
  
  const inStockProducts = computed(() =>
    products.value.filter(product => product.inStock)
  )

  // Parametreli getters için fonksiyonlar
  const getProductsByCategory = (category) => {
    return products.value.filter(product => product.category === category)
  }

  const searchProducts = (searchTerm) => {
    if (!searchTerm) return products.value
    
    const term = searchTerm.toLowerCase()
    return products.value.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    )
  }

  return {
    products,
    tax,
    productCount,
    totalValue,
    totalWithTax,
    inStockProducts,
    getProductsByCategory,
    searchProducts
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Canlı Örnek: E-ticaret Store Getters</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg">
          <div class="space-y-6">
            <!-- İstatistikler -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ demoStore.productCount }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Toplam Ürün</div>
              </div>
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ demoStore.inStockCount }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Stokta</div>
              </div>
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">₺{{ demoStore.totalValue }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Toplam Değer</div>
              </div>
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-red-600">₺{{ demoStore.totalWithTax }}</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Vergili Toplam</div>
              </div>
            </div>

            <!-- Kategori Filtresi -->
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <UButton 
                  v-for="category in demoStore.categories" 
                  :key="category"
                  :variant="selectedCategory === category ? 'solid' : 'outline'"
                  @click="selectedCategory = category"
                  size="sm"
                >
                  {{ category }} ({{ demoStore.getProductsByCategory(category).length }})
                </UButton>
                <UButton 
                  :variant="selectedCategory === 'all' ? 'solid' : 'outline'"
                  @click="selectedCategory = 'all'"
                  size="sm"
                >
                  Tümü ({{ demoStore.productCount }})
                </UButton>
              </div>

              <!-- Arama -->
              <div class="flex gap-2">
                <UInput 
                  v-model="searchTerm" 
                  placeholder="Ürün ara..." 
                  icon="i-heroicons-magnifying-glass"
                  class="flex-1"
                />
                <UButton @click="searchTerm = ''" variant="outline" size="sm">
                  Temizle
                </UButton>
              </div>
            </div>

            <!-- Ürün Listesi -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div 
                v-for="product in filteredProducts" 
                :key="product.id"
                class="p-4 bg-white dark:bg-gray-800 rounded-lg border"
                :class="product.inStock ? 'border-green-200' : 'border-red-200'"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold">{{ product.name }}</h4>
                  <UBadge :color="product.inStock ? 'green' : 'red'" variant="soft" size="xs">
                    {{ product.inStock ? 'Stokta' : 'Stok Yok' }}
                  </UBadge>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 capitalize">{{ product.category }}</p>
                <div class="flex justify-between items-center mt-3">
                  <span class="font-bold text-green-600">₺{{ product.price }}</span>
                  <span class="text-xs text-gray-500">
                    Vergili: ₺{{ Math.round(product.price * (1 + demoStore.tax)) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Getter Sonuçları -->
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 class="font-semibold mb-3">Getter Sonuçları:</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Kategorilere Göre Dağılım:</strong>
                  <ul class="mt-1 space-y-1">
                    <li v-for="(products, category) in demoStore.productsByCategory" :key="category">
                      {{ category }}: {{ products.length }} ürün
                    </li>
                  </ul>
                </div>
                <div>
                  <strong>Fiyat İstatistikleri:</strong>
                  <ul class="mt-1 space-y-1">
                    <li>En Ucuz: ₺{{ demoStore.cheapestPrice }}</li>
                    <li>En Pahalı: ₺{{ demoStore.mostExpensivePrice }}</li>
                    <li>Ortalama: ₺{{ demoStore.averagePrice }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia/state" variant="outline" icon="i-heroicons-arrow-left">
        State Yönetimi
      </UButton>
      <UButton to="/pinia/actions" icon="i-heroicons-arrow-right" trailing>
        Actions
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductsStore } from '~~/stores//products'

definePageMeta({
  layout: 'default'
})

const demoStore = useProductsStore()
const selectedCategory = ref('all')
const searchTerm = ref('')

// Filtreleme logic
const filteredProducts = computed(() => {
  let filtered = demoStore.products

  // Kategori filtresi
  if (selectedCategory.value !== 'all') {
    filtered = demoStore.getProductsByCategory(selectedCategory.value)
  }

  // Arama filtresi
  if (searchTerm.value) {
    filtered = demoStore.searchProducts(searchTerm.value)
    
    // Hem kategori hem de arama varsa kesişimi al
    if (selectedCategory.value !== 'all') {
      const categoryFiltered = demoStore.getProductsByCategory(selectedCategory.value)
      filtered = filtered.filter(p => categoryFiltered.some(cp => cp.id === p.id))
    }
  }

  return filtered
})
</script>