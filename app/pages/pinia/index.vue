<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Pinia Öğrenim Rehberi
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        Vue.js için modern, tip güvenli ve sezgisel state management kütüphanesi. 
        Temel seviyeden profesyonel kullanıma kadar her şeyi öğrenin.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="section in sections"
        :key="section.to"
        class="cursor-pointer hover:shadow-lg transition-shadow duration-200"
        @click="$router.push(section.to)"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <UIcon :name="section.icon" class="h-8 w-8" :class="section.iconColor" />
            <h3 class="text-lg font-semibold">{{ section.title }}</h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          {{ section.description }}
        </p>
        
        <div class="flex items-center justify-between">
          <UBadge :color="section.level === 'Başlangıç' ? 'green' : section.level === 'Orta' ? 'yellow' : 'red'" variant="subtle">
            {{ section.level }}
          </UBadge>
          <span class="text-sm text-gray-500">{{ section.duration }}</span>
        </div>
      </UCard>
    </div>

    <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-blue-900 dark:text-blue-100 mb-4">
        Neden Pinia?
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex items-start space-x-3">
          <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-500 mt-1" />
          <div>
            <h3 class="font-medium text-blue-900 dark:text-blue-100">TypeScript Desteği</h3>
            <p class="text-blue-700 dark:text-blue-300 text-sm">Tam tip güvenliği ve IntelliSense desteği</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-500 mt-1" />
          <div>
            <h3 class="font-medium text-blue-900 dark:text-blue-100">Basit API</h3>
            <p class="text-blue-700 dark:text-blue-300 text-sm">Öğrenmesi ve kullanması kolay</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-500 mt-1" />
          <div>
            <h3 class="font-medium text-blue-900 dark:text-blue-100">Vue Devtools</h3>
            <p class="text-blue-700 dark:text-blue-300 text-sm">Mükemmel debugging deneyimi</p>
          </div>
        </div>
        <div class="flex items-start space-x-3">
          <UIcon name="i-heroicons-check-circle" class="h-6 w-6 text-green-500 mt-1" />
          <div>
            <h3 class="font-medium text-blue-900 dark:text-blue-100">Modüler Yapı</h3>
            <p class="text-blue-700 dark:text-blue-300 text-sm">Her store bağımsız ve test edilebilir</p>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center">
      <UButton
        to="/pinia/basics"
        size="lg"
        icon="i-heroicons-arrow-right"
        trailing
      >
        Temel Kullanımı Öğrenmeye Başla
      </UButton>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const sections = [
  {
    title: 'Temel Kullanım',
    description: 'Pinia\'nın temel kavramları, kurulum ve ilk store\'unuzu oluşturma',
    icon: 'i-heroicons-play',
    iconColor: 'text-green-500',
    to: '/pinia/basics',
    level: 'Başlangıç',
    duration: '10 dk'
  },
  {
    title: 'Store Oluşturma',
    description: 'defineStore kullanarak farklı store yapıları oluşturmayı öğrenin',
    icon: 'i-heroicons-building-storefront',
    iconColor: 'text-blue-500',
    to: '/pinia/stores',
    level: 'Başlangıç',
    duration: '15 dk'
  },
  {
    title: 'State Yönetimi',
    description: 'Reaktif state\'leri tanımlama, güncelleme ve izleme teknikleri',
    icon: 'i-heroicons-variable',
    iconColor: 'text-purple-500',
    to: '/pinia/state',
    level: 'Orta',
    duration: '20 dk'
  },
  {
    title: 'Getters',
    description: 'Computed değerler oluşturma ve state\'e dayalı hesaplamalar',
    icon: 'i-heroicons-funnel',
    iconColor: 'text-indigo-500',
    to: '/pinia/getters',
    level: 'Orta',
    duration: '15 dk'
  },
  {
    title: 'Actions',
    description: 'Asenkron işlemler, API çağrıları ve karmaşık business logic',
    icon: 'i-heroicons-bolt',
    iconColor: 'text-yellow-500',
    to: '/pinia/actions',
    level: 'Orta',
    duration: '25 dk'
  },
  {
    title: 'Modülerlik',
    description: 'Store\'ları organize etme, import/export ve composition patterns',
    icon: 'i-heroicons-squares-2x2',
    iconColor: 'text-cyan-500',
    to: '/pinia/modules',
    level: 'İleri',
    duration: '30 dk'
  },
  {
    title: 'İleri Düzey',
    description: 'Plugin\'ler, SSR, persistence ve performans optimizasyonları',
    icon: 'i-heroicons-rocket-launch',
    iconColor: 'text-red-500',
    to: '/pinia/advanced',
    level: 'İleri',
    duration: '45 dk'
  }
]
</script>