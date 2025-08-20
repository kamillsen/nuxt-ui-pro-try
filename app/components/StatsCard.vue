<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">{{ title }}</h3>
    </template>
    
    <div 
      :class="[
        'text-3xl font-bold',
        color === 'primary' ? 'text-primary-600' : '',
        color === 'success' ? 'text-green-600' : '',
        color === 'info' ? 'text-blue-600' : ''
      ]"
    >
      {{ value }}
    </div>
    <p class="text-sm text-gray-500 dark:text-gray-400">{{ change }}</p>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  value: string
  change: string
  color?: string
}

withDefaults(defineProps<Props>(), {
  color: 'primary'
})
</script>