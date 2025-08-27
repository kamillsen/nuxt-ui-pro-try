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
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Customer List</h3>
          <UInput 
            v-model="searchQuery"
            placeholder="Search customers..."
            icon="i-heroicons-magnifying-glass"
            class="w-64"
          />
        </div>
      </template>
      
      <div v-if="pending" class="flex items-center justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
      </div>
      
      <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading customers: {{ error }}
      </div>
      
      <UTable 
        v-else
        v-model:sorting="sorting" 
        :data="filteredCustomers" 
        :columns="columns" 
        class="flex-1" 
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

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

const searchQuery = ref('')
const sorting = ref([
  {
    id: 'id',
    desc: false
  }
])

const { data: customers, pending, error } = await useFetch<Customer[]>('http://localhost:3001/customers', {
  transform: (data: Customer[]) => {
    return data.map(customer => ({
      ...customer,
      city: customer.addresses?.[0]?.city || 'N/A',
      createdAt: new Date(customer.createdAt).toLocaleDateString('tr-TR')
    }))
  }
})

const filteredCustomers = computed(() => {
  if (!customers.value) return []
  if (!searchQuery.value) return customers.value
  
  const query = searchQuery.value.toLowerCase()
  return customers.value.filter(customer => 
    customer.id.toLowerCase().includes(query) ||
    customer.name.toLowerCase().includes(query) ||
    customer.email.toLowerCase().includes(query) ||
    customer.phone.toLowerCase().includes(query) ||
    customer.city.toLowerCase().includes(query)
  )
})

const columns: TableColumn<Customer>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => getHeader(column, 'ID'),
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: ({ column }) => getHeader(column, 'Name'),
    cell: ({ row }) => row.getValue('name')
  },
  {
    accessorKey: 'email',
    header: ({ column }) => getHeader(column, 'Email'),
    cell: ({ row }) => row.getValue('email')
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => getHeader(column, 'Phone'),
    cell: ({ row }) => row.getValue('phone')
  },
  {
    accessorKey: 'city',
    header: ({ column }) => getHeader(column, 'City'),
    cell: ({ row }) => row.getValue('city')
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => getHeader(column, 'Created At'),
    cell: ({ row }) => row.getValue('createdAt')
  }
]

function getHeader(column: Column<Customer>, label: string) {
  const isSorted = column.getIsSorted()

  return h(
    UDropdownMenu,
    {
      content: {
        align: 'start'
      },
      'aria-label': 'Actions dropdown',
      items: [
        {
          label: 'Asc',
          type: 'checkbox',
          icon: 'i-lucide-arrow-up-narrow-wide',
          checked: isSorted === 'asc',
          onSelect: () => {
            if (isSorted === 'asc') {
              column.clearSorting()
            } else {
              column.toggleSorting(false)
            }
          }
        },
        {
          label: 'Desc',
          icon: 'i-lucide-arrow-down-wide-narrow',
          type: 'checkbox',
          checked: isSorted === 'desc',
          onSelect: () => {
            if (isSorted === 'desc') {
              column.clearSorting()
            } else {
              column.toggleSorting(true)
            }
          }
        }
      ]
    },
    () =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        label,
        icon: isSorted
          ? isSorted === 'asc'
            ? 'i-lucide-arrow-up-narrow-wide'
            : 'i-lucide-arrow-down-wide-narrow'
          : 'i-lucide-arrow-up-down',
        class: '-mx-2.5 data-[state=open]:bg-elevated',
        'aria-label': `Sort by ${isSorted === 'asc' ? 'descending' : 'ascending'}`
      })
  )
}
</script>