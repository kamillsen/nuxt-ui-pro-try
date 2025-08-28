<template>
  <div class="space-y-6">
    <!-- Sayfa başlığı ve yeni ürün butonu -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
      <UButton color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        New Product
      </UButton>
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center gap-2 w-full">
          <h3 class="text-lg font-semibold">Product List</h3>
          <UInput
            :model-value="(table?.tableApi?.getColumn('name')?.getFilterValue() as string) || ''"
            placeholder="Search name…"
            class="ml-auto max-w-xs min-w-[16ch]"
            @update:model-value="onUpdateNameFilter"
          />
        </div>
      </template>

      <!-- Veri yükleniyor -->
      <div v-if="productStore.loading" class="flex items-center justify-center p-8">
        <UIcon name="i-heroicons-arrow-path" class="h-8 w-8 animate-spin" />
      </div>

      <!-- Hata durumu -->
      <div v-else-if="productStore.error" class="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading products: {{ productStore.error }}
      </div>

      <!-- Tablo -->
      <div v-else class="w-full">
        <UTable
          ref="table"
          :data="productStore.products"
          :columns="columns"
          sticky
          class="flex-1 h-80"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { useProductStore } from '~~/stores/ecommerce/product/product-pinia';
import type { Product } from '~~/types/ecommerce/product/product-types';
import type { TableColumn } from '@nuxt/ui';

const UBadge = resolveComponent('UBadge')

const productStore = useProductStore();

onMounted(() => {
  productStore.fetchProducts();
});

const table = useTemplateRef('table');

const onUpdateNameFilter = (val: string) => {
  table.value?.tableApi?.getColumn('name')?.setFilterValue(val);
};

const columns: TableColumn<Product>[] = [
  {
    accessorKey: 'sku',
    header: 'SKU',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }) => `${row.original.price} ${row.original.currency}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.isActive
      const color = status ? 'success' : 'neutral'
      const text = status ? 'Active' : 'Inactive'

      return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => text)
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('tr-TR'),
  },
];
</script>
