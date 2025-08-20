<template>
  <div class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
    <div class="flex items-center space-x-4">
      <UAvatar :alt="user.name" size="md" />
      <div>
        <h4 class="font-medium text-gray-900 dark:text-white">{{ user.name }}</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <UBadge :color="user.status === 'active' ? 'success' : 'neutral'">
        {{ user.status === 'active' ? 'Aktif' : 'Pasif' }}
      </UBadge>
      <UButton variant="ghost" size="sm">
        <UIcon name="i-heroicons-pencil-square" />
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

interface Props {
  user: User
}

defineProps<Props>()
</script>