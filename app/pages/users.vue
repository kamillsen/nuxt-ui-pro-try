<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Kullanıcılar</h2>
      <UButton color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Yeni Kullanıcı
      </UButton>
    </div>
    
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Kullanıcı Listesi</h3>
      </template>
      
      <div class="space-y-4">
        <UserCard
          v-for="user in users"
          :key="user.id"
          :user="user"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const users = [
  {
    id: 1,
    name: 'Ahmet Yılmaz',
    email: 'ahmet@example.com',
    status: 'active'
  },
  {
    id: 2,
    name: 'Ayşe Demir',
    email: 'ayse@example.com',
    status: 'active'
  },
  {
    id: 3,
    name: 'Mehmet Kaya',
    email: 'mehmet@example.com',
    status: 'inactive'
  }
]
</script>