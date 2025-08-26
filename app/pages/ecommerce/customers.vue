<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
      <UButton color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        New Customer
      </UButton>
    </div>
    
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold">Customer List</h3>
      </template>
      
      <div v-if="pending" class="flex items-center justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading customers: {{ error }}
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="customer in customers" :key="customer.id" class="p-4 border rounded-lg">
          <div class="flex justify-between items-start">
            <div class="space-y-2">
              <h4 class="font-semibold text-lg">{{ customer.name }}</h4>
              <p class="text-gray-600">{{ customer.email }}</p>
              <p class="text-gray-600">{{ customer.phone }}</p>
              <p class="text-sm text-gray-500">{{ customer.city }}</p>
            </div>
            <div class="text-sm text-gray-500">
              {{ customer.createdAt }}
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
interface Customer {
  id: string
  name: string
  email: string
  phone: string
  addresses: Array<{
    id: number
    title: string
    line1: string
    city: string
    country: string
    postalCode: string
  }>
  createdAt: string
  city: string
}

const { data: customers, pending, error } = await useFetch<Customer[]>('http://localhost:3001/customers', {
  transform: (data: Customer[]) => {
    return data.map(customer => ({
      ...customer,
      city: customer.addresses?.[0]?.city || 'N/A',
      createdAt: new Date(customer.createdAt).toLocaleDateString('tr-TR')
    }))
  }
})
</script>