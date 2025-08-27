<template>
  <div class="space-y-6">
    <!-- Sayfa başlığı ve yeni müşteri butonu -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Customers</h2>
      <UButton color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        New Customer
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2 w-full">
          <h3 class="text-lg font-semibold">Customer List</h3>

          <!-- Sadece isim kolonunda arama -->
          <UInput
            :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string) || ''"
            placeholder="Search name…"
            class="ml-auto max-w-xs min-w-[16ch]"
            @update:model-value="onUpdateNameFilter"
          />

          <!-- Kolon görünürlüğünü aç/kapat dropdown -->
          <UDropdownMenu
            :items="table?.tableApi?.getAllColumns()
              .filter(c => c.getCanHide())
              .map(c => ({
                label: upperFirst(c.id),
                type: 'checkbox' as const,
                checked: c.getIsVisible(),
                onUpdateChecked(checked: boolean) {
                  table?.tableApi?.getColumn(c.id)?.toggleVisibility(!!checked)
                },
                onSelect(e?: Event) { e?.preventDefault() }
              }))"
            :content="{ align: 'end' }"
          >
            <UButton
              label="Columns"
              color="neutral"
              variant="outline"
              trailing-icon="i-lucide-chevron-down"
              aria-label="Columns select dropdown"
            />
          </UDropdownMenu>
        </div>
      </template>

      <!-- Veri yükleniyor -->
      <div v-if="pending" class="flex items-center justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
      </div>

      <!-- Hata durumu -->
      <div v-else-if="error" class="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading customers: {{ error }}
      </div>

      <!-- Tablo: içeride scroll, sayfa numarası yok -->
      <div v-else class="w-full">
        <UTable
          ref="table"
          v-model:sorting="sorting"
          v-model:column-visibility="columnVisibility"
          v-model:column-filters="columnFilters"
          :data="customers"
          :columns="columns"
          sticky
          class="flex-1 h-80" 
        />
      </div>
      <!-- class="flex-1 h-80"  :   sabit yükseklik ≈ 6 satır, fazlası scroll -->
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { upperFirst } from 'scule'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useClipboard } from '@vueuse/core'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const UCheckbox = resolveComponent('UCheckbox')

const toast = useToast()
const { copy } = useClipboard()

/** Customer tipi (API'den gelen) */
type Customer = {
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
}

/** API'den müşteri verilerini çekiyoruz */
const { data: customers, pending, error } = await useFetch<Customer[]>('http://localhost:3001/customers')

/** Kolon başlıklarını sıralanabilir buton haline getiren helper */
function sortableHeader(column: any, label: string) {
  const isSorted = column.getIsSorted() // asc | desc | false
  return h(UButton, {
    color: 'neutral',
    variant: 'ghost',
    label,
    class: '-mx-2.5',
    icon: isSorted
      ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
      : 'i-lucide-arrow-up-down',
    'aria-label': `Sort by ${label}`,
    onClick: () => column.toggleSorting(isSorted === 'asc')
  })
}

/** Sağdaki Actions menüsünde gösterilecek seçenekler */
function getRowActions(row: Row<Customer>) {
  return [
    { type: 'label', label: 'Actions' },
    { label: 'View' },
    { label: 'Edit' },
    { label: 'Delete', color: 'error' },
    { type: 'separator' as const },
    {
      label: 'Copy customer ID',
      icon: 'i-lucide-copy',
      onSelect() {
        copy(row.original.id)
        toast.add({ title: 'Customer ID copied!', color: 'success', icon: 'i-lucide-circle-check' })
      }
    }
  ]
}

/** Tablo kolonları */
const columns: TableColumn<Customer>[] = [
  // Seçim kutusu (sol)
  {
    id: 'select',
    header: ({ table }) =>
      h(UCheckbox, {
        modelValue: table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!v),
        'aria-label': 'Select all'
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        modelValue: row.getIsSelected(),
        'onUpdate:modelValue': (v: boolean | 'indeterminate') => row.toggleSelected(!!v),
        'aria-label': 'Select row'
      }),
    enableSorting: false,
    enableHiding: false
  },
  // Diğer kolonlar
  {
    accessorKey: 'id',
    header: ({ column }) => sortableHeader(column, '#'),
    cell: ({ row }) => `#${row.getValue('id')}`
  },
  {
    accessorKey: 'name',
    header: ({ column }) => sortableHeader(column, 'Name')
  },
  {
    accessorKey: 'email',
    header: ({ column }) => sortableHeader(column, 'Email')
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => sortableHeader(column, 'Phone')
  },
  {
    id: 'city',
    accessorFn: (row) => row.addresses?.[0]?.city ?? 'N/A',
    header: ({ column }) => sortableHeader(column, 'City')
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => sortableHeader(column, 'Created At'),
    sortingFn: (a: any, b: any) =>
      new Date(a.original.createdAt).getTime() - new Date(b.original.createdAt).getTime(),
    cell: ({ row }) =>
      new Date(row.getValue('createdAt')).toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'short', year: 'numeric'
      })
  },
  // Actions kolonu (sağ)
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) =>
      h('div', { class: 'text-right' },
        h(UDropdownMenu, {
          content: { align: 'end' },
          items: getRowActions(row),
          'aria-label': 'Actions dropdown'
        }, () =>
          h(UButton, {
            icon: 'i-lucide-ellipsis-vertical',
            color: 'neutral',
            variant: 'ghost',
            class: 'ml-auto',
            'aria-label': 'Actions dropdown'
          })
        )
      )
  }
]

/** Table referansı ve state */
const table = useTemplateRef('table') // template içinde otomatik unwrap, script içinde .value ile eriş
const sorting = ref<any[]>([])
const columnVisibility = ref<Record<string, boolean>>({})
const columnFilters = ref<any[]>([])

/** Arama inputu değiştiğinde isme göre filtre uygula */
function onUpdateNameFilter(val: string) {
  table.value?.tableApi?.getColumn('name')?.setFilterValue(val)
  // Scroll kullandığımız için sayfa resetine gerek yok
}
</script>
