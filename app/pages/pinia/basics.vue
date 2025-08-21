<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Pinia Temel Kullanım</h1>
        <p class="text-gray-600 dark:text-gray-300 mt-2">Pinia'nın temel kavramları ve ilk store'unuzu oluşturma</p>
      </div>
      <UBadge color="green" variant="subtle">Başlangıç</UBadge>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">1. Pinia Nedir?</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Pinia, Vue.js için geliştirilmiş modern bir state management kütüphanesidir. 
          Vuex'in yerini alan bu kütüphane, daha basit API'si ve TypeScript desteği ile öne çıkar.
        </p>
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 class="font-semibold text-blue-900 dark:text-blue-100 mb-2">Temel Kavramlar:</h3>
          <ul class="space-y-2 text-blue-800 dark:text-blue-200">
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
              <span><strong>Store:</strong> Uygulama state'ini tutan konteyner</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
              <span><strong>State:</strong> Reaktif veri saklama alanı</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
              <span><strong>Getters:</strong> State'e dayalı hesaplanan değerler</span>
            </li>
            <li class="flex items-center space-x-2">
              <UIcon name="i-heroicons-arrow-right" class="h-4 w-4" />
              <span><strong>Actions:</strong> State'i değiştiren fonksiyonlar</span>
            </li>
          </ul>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">2. İlk Store'unuzu Oluşturma</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Pinia'da store oluşturmak için <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">defineStore</code> fonksiyonunu kullanırız.
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // State tanımlama
  state: () => ({
    count: 0,
    name: 'Sayaç'
  }),

  // Getters tanımlama
  getters: {
    doubleCount: (state) => state.count * 2,
    countMessage() {
      return `${this.name}: ${this.count}`
    }
  },

  // Actions tanımlama
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">3. Store'u Component'te Kullanma</h2>
      </template>
      <div class="space-y-4">
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// components/Counter.vue
&lt;template&gt;
  &lt;div class="p-4 border rounded"&gt;
    &lt;h3&gt;{{ counterStore.countMessage }}&lt;/h3&gt;
    &lt;p&gt;Normal: {{ counterStore.count }}&lt;/p&gt;
    &lt;p&gt;Double: {{ counterStore.doubleCount }}&lt;/p&gt;
    
    &lt;div class="space-x-2 mt-4"&gt;
      &lt;button @click="counterStore.increment()"&gt;+&lt;/button&gt;
      &lt;button @click="counterStore.decrement()"&gt;-&lt;/button&gt;
      &lt;button @click="counterStore.reset()"&gt;Reset&lt;/button&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { useCounterStore } from '@/stores/counter'

// Store'u kullan
const counterStore = useCounterStore()
&lt;/script&gt;</code></pre>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">4. Canlı Örnek</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Aşağıda çalışan bir counter örneği görebilirsiniz:
        </p>
        
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
          <div class="text-center space-y-4">
            <h3 class="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
              {{ counterStore.countMessage }}
            </h3>
            <div class="text-lg text-indigo-700 dark:text-indigo-300">
              <p>Normal Değer: <span class="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">{{ counterStore.count }}</span></p>
              <p>İki Katı: <span class="font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded">{{ counterStore.doubleCount }}</span></p>
            </div>
            
            <div class="flex justify-center space-x-3">
              <UButton @click="counterStore.decrement()" color="red" variant="outline">
                <UIcon name="i-heroicons-minus" />
                Azalt
              </UButton>
              <UButton @click="counterStore.reset()" color="gray" variant="outline">
                <UIcon name="i-heroicons-arrow-path" />
                Sıfırla
              </UButton>
              <UButton @click="counterStore.increment()" color="green" variant="outline">
                <UIcon name="i-heroicons-plus" />
                Artır
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </UCard>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">5. Composition API ile Alternatif Yazım</h2>
      </template>
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Pinia ayrıca Composition API tarzında store tanımlama imkanı da sunar:
        </p>
        
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-green-400"><code>// stores/counter-composition.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // State (ref kullanarak)
  const count = ref(0)
  const name = ref('Sayaç')

  // Getters (computed kullanarak)
  const doubleCount = computed(() => count.value * 2)
  const countMessage = computed(() => `${name.value}: ${count.value}`)

  // Actions (normal fonksiyonlar)
  function increment() {
    count.value++
  }
  
  function decrement() {
    count.value--
  }
  
  function reset() {
    count.value = 0
  }

  // Return etmek istediğiniz her şeyi döndürün
  return {
    count,
    name,
    doubleCount,
    countMessage,
    increment,
    decrement,
    reset
  }
})</code></pre>
        </div>
      </div>
    </UCard>

    <div class="flex justify-between">
      <UButton to="/pinia" variant="outline" icon="i-heroicons-arrow-left">
        Giriş Sayfasına Dön
      </UButton>
      <UButton to="/pinia/stores" icon="i-heroicons-arrow-right" trailing>
        Store Oluşturma
      </UButton>
    </div>
  </div>
</template>

<script setup>
import { defineStore } from 'pinia'

definePageMeta({
  layout: 'default'
})

// Demo için basit bir counter store
const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Sayaç Demo'
  }),

  getters: {
    doubleCount: (state) => state.count * 2,
    countMessage() {
      return `${this.name}: ${this.count}`
    }
  },

  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    reset() {
      this.count = 0
    }
  }
})

// Store'u kullan
const counterStore = useCounterStore()
</script>