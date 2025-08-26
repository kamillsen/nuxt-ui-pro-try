<script setup lang="ts">
definePageMeta({
  title: 'Components'
})
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Components</h1>
    <p class="text-gray-600 mb-8">Explore various UI components and their usage examples.</p>
    
    <div class="grid gap-6">
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Available Components</h2>
        </template>
        
        <div class="space-y-4">
          <NuxtLink 
            to="/components/form" 
            class="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-document-text" class="text-blue-500" />
              <div>
                <h3 class="font-medium">Form Components</h3>
                <p class="text-sm text-gray-600">Comprehensive form examples with validation</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </UCard>
    </div>
  </div>
</template>