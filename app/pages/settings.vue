<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Ayarlar</h2>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Genel Ayarlar</h3>
        </template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Adı</label>
            <UInput placeholder="Site adınızı girin" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site Açıklaması</label>
            <UTextarea placeholder="Site açıklamanızı girin" />
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">E-posta Bildirimleri</span>
            <UToggle />
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Karanlık Tema</span>
            <UToggle />
          </div>
        </div>
        
        <template #footer>
          <UButton color="primary">Kaydet</UButton>
        </template>
      </UCard>
      
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Güvenlik</h3>
        </template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mevcut Şifre</label>
            <UInput type="password" placeholder="Mevcut şifrenizi girin" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Yeni Şifre</label>
            <UInput type="password" placeholder="Yeni şifrenizi girin" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Şifre Tekrar</label>
            <UInput type="password" placeholder="Şifrenizi tekrar girin" />
          </div>
          
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">İki Faktörlü Kimlik Doğrulama</span>
            <UToggle />
          </div>
        </div>
        
        <template #footer>
          <UButton color="primary">Şifreyi Güncelle</UButton>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>