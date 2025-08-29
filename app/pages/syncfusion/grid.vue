<template>
  <div class="space-y-6">
    <!-- Sayfa Başlığı -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Syncfusion Grid</h2>
      <div class="flex items-center gap-2">
        <UColorModeButton />
        <UButton color="primary">
          <UIcon name="i-heroicons-plus" class="mr-2" />
          Add New
        </UButton>
      </div>
    </div>

    <!-- Grid Tablosu Kartı -->
    <UCard>
      <!-- Kart Başlığı: Arama -->
      <template #header>
        <div class="flex items-center gap-2 w-full">
          <h3 class="text-lg font-semibold">Data Grid</h3>
          
          <!-- Arama Inputu -->
          <div class="flex items-center ml-auto">
            <UInput
              v-model="searchValue"
              placeholder="Search data..."
              class="max-w-xs min-w-[16ch]"
              @update:model-value="onSearchUpdate"
            >
              <template #trailing>
                <UButton
                  v-if="searchValue"
                  icon="i-heroicons-x-mark"
                  color="gray"
                  variant="ghost"
                  size="2xs"
                  @click="clearSearch"
                  aria-label="Clear search"
                />
              </template>
            </UInput>
          </div>
        </div>
      </template>

      <div id="app">
        <ejs-grid 
          :dataSource='filteredData' 
          :allowFiltering='true' 
          :filterSettings='filterOptions' 
          height='400px'
        >
          <e-columns>
            <e-column field='OrderID' headerText='Order ID' textAlign='Right' width=100></e-column>
            <e-column field='CustomerID' headerText='Customer ID' width=120></e-column>
            <e-column field='ShipCity' headerText='Ship City' width=100></e-column>
            <e-column field='ShipName' headerText='Ship Name' width=100></e-column>
          </e-columns>
        </ejs-grid>
      </div>
    </UCard>
  </div>
</template>
<script setup>
import { provide, ref, computed } from "vue";

import { GridComponent as EjsGrid, ColumnDirective as EColumn, ColumnsDirective as EColumns, Filter } from "@syncfusion/ej2-vue-grids";
import { data } from './datasource.js'

// Syncfusion tema yönetimi
const { updateSyncfusionTheme } = useSyncfusionTheme()

const searchValue = ref('')

const filteredData = computed(() => {
  if (!searchValue.value) {
    return data
  }
  
  const searchTerm = searchValue.value.toLowerCase()
  return data.filter(item => 
    Object.values(item).some(value => 
      String(value).toLowerCase().includes(searchTerm)
    )
  )
})

const filterOptions = {
  type:'Excel',
  columns: [
    {
      field: 'CustomerID',
      matchCase: false,
      operator: 'startswith',
      predicate: 'or',
      value: 'VINET',
    },
    {
      field: 'CustomerID',
      matchCase: false,
      operator: 'startswith',
      predicate: 'or',
      value: 'HANAR',
    },
    {
      field: 'OrderID',
      matchCase: false,
      operator: 'lessThan',
      predicate: 'or',
      value: 10250,
    },
    {
      field: 'OrderID',
      matchCase: false,
      operator: 'notEqual',
      predicate: 'or',
      value: 10262,
    },
  ]
};

function onSearchUpdate(value) {
  searchValue.value = value
}

function clearSearch() {
  searchValue.value = ''
}

provide('grid',  [Filter]);
</script>
<style>
</style>