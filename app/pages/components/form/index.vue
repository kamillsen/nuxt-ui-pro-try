<script setup lang="ts">
definePageMeta({
  title: 'Form Components'
})
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Form Components</h1>
    <p class="text-gray-600 mb-8">
      The Form component automatically triggers validation when an input emits an <code>input</code>, <code>change</code>, or <code>blur</code> event.
    </p>

    <div class="space-y-8">
      <UAlert
        icon="i-heroicons-light-bulb"
        color="info"
        variant="soft"
        title="Tip"
        description="The form always validates on submit."
      />

      <!-- Comprehensive Form Example -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Comprehensive Form Example</h2>
        </template>
        
        <FormExampleElements />
      </UCard>

      <!-- Login Form Example -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Login Form Example</h2>
        </template>
        
        <FormLoginExample />
      </UCard>
    </div>
  </div>
</template>