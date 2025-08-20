<template>
  <UDropdown :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" 
    :popper="{ strategy: 'fixed', placement: collapsed ? 'top' : 'top-start' }">
    
    <UButton color="neutral" variant="ghost" 
      :class="collapsed ? 'w-full justify-center p-0' : 'w-full justify-start'"
      :padded="!collapsed">
      
      <UAvatar :src="user.avatar" :alt="user.name" size="xs" />
      
      <div v-if="!collapsed" class="text-left rtl:text-right">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
          {{ user.name }}
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
          {{ user.email }}
        </p>
      </div>
      
      <UIcon name="i-heroicons-ellipsis-vertical" 
        :class="collapsed ? 'hidden' : 'w-5 h-5 text-gray-400 dark:text-gray-500 ml-auto'" />
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const user = {
  name: 'Ahmet Yılmaz',
  email: 'admin@example.com',
  avatar: undefined
}

const items = [
  [{
    label: user.email,
    slot: 'account',
    disabled: true
  }],
  [{
    label: 'Ayarlar',
    icon: 'i-heroicons-cog-8-tooth'
  }],
  [{
    label: 'Çıkış Yap',
    icon: 'i-heroicons-arrow-left-on-rectangle'
  }]
]
</script>