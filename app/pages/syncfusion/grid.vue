<template>
  <div class="space-y-6">
    <!-- Sayfa Başlığı -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Syncfusion Grid Example</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Advanced data grid with sorting, filtering, and pagination</p>
      </div>
    </div>

    <!-- Grid Kartı -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Order Management</h3>
          <UBadge color="primary" variant="subtle">{{ data.length }} Records</UBadge>
        </div>
      </template>

      <div class="w-full">
        <ejs-grid 
          :dataSource="data" 
          :allowPaging="true"
          :allowSorting="true"
          :allowFiltering="true"
          :allowExcelExport="true"
          :allowPdfExport="true"
          :pageSettings="pageSettings"
          :filterSettings="filterSettings"
          height="500"
          class="custom-grid"
        >
          <e-columns>
            <e-column field="OrderID" headerText="Order ID" width="120" textAlign="Right" isPrimaryKey="true"></e-column>
            <e-column field="CustomerID" headerText="Customer ID" width="140"></e-column>
            <e-column field="CustomerName" headerText="Customer Name" width="180"></e-column>
            <e-column field="EmployeeID" headerText="Employee ID" width="120" textAlign="Right"></e-column>
            <e-column field="OrderDate" headerText="Order Date" width="140" format="dd/MM/yyyy" type="date"></e-column>
            <e-column field="Freight" headerText="Freight" width="120" format="C2" textAlign="Right"></e-column>
            <e-column field="ShipCountry" headerText="Ship Country" width="140"></e-column>
            <e-column field="ShipCity" headerText="Ship City" width="140"></e-column>
          </e-columns>
        </ejs-grid>
      </div>
    </UCard>

    <!-- İstatistikler -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ data.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Total Orders</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ uniqueCustomers }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Customers</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ uniqueCountries }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Countries</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">${{ totalFreight.toFixed(2) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Total Freight</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GridComponent as EjsGrid, ColumnsDirective as EColumns, ColumnDirective as EColumn } from '@syncfusion/ej2-vue-grids'

// Grid ayarları
const pageSettings = { pageSize: 10 }
const filterSettings = { type: 'FilterBar' }

// Örnek veri
const data = ref([
  {
    OrderID: 10248, CustomerID: 'VINET', CustomerName: 'Vins et alcools Chevalier', 
    EmployeeID: 5, OrderDate: new Date('1996-07-04'), Freight: 32.38, 
    ShipCountry: 'France', ShipCity: 'Reims'
  },
  {
    OrderID: 10249, CustomerID: 'TOMSP', CustomerName: 'Toms Spezialitäten', 
    EmployeeID: 6, OrderDate: new Date('1996-07-05'), Freight: 11.61, 
    ShipCountry: 'Germany', ShipCity: 'Münster'
  },
  {
    OrderID: 10250, CustomerID: 'HANAR', CustomerName: 'Hanari Carnes', 
    EmployeeID: 4, OrderDate: new Date('1996-07-08'), Freight: 65.83, 
    ShipCountry: 'Brazil', ShipCity: 'Rio de Janeiro'
  },
  {
    OrderID: 10251, CustomerID: 'VICTE', CustomerName: 'Victuailles en stock', 
    EmployeeID: 3, OrderDate: new Date('1996-07-08'), Freight: 41.34, 
    ShipCountry: 'France', ShipCity: 'Lyon'
  },
  {
    OrderID: 10252, CustomerID: 'SUPRD', CustomerName: 'Suprêmes délices', 
    EmployeeID: 4, OrderDate: new Date('1996-07-09'), Freight: 51.30, 
    ShipCountry: 'Belgium', ShipCity: 'Charleroi'
  },
  {
    OrderID: 10253, CustomerID: 'HANAR', CustomerName: 'Hanari Carnes', 
    EmployeeID: 3, OrderDate: new Date('1996-07-10'), Freight: 58.17, 
    ShipCountry: 'Brazil', ShipCity: 'Rio de Janeiro'
  },
  {
    OrderID: 10254, CustomerID: 'CHOPS', CustomerName: 'Chop-suey Chinese', 
    EmployeeID: 5, OrderDate: new Date('1996-07-11'), Freight: 22.98, 
    ShipCountry: 'Switzerland', ShipCity: 'Bern'
  },
  {
    OrderID: 10255, CustomerID: 'RICSU', CustomerName: 'Richter Supermarkt', 
    EmployeeID: 9, OrderDate: new Date('1996-07-12'), Freight: 148.33, 
    ShipCountry: 'Switzerland', ShipCity: 'Genève'
  },
  {
    OrderID: 10256, CustomerID: 'WELLI', CustomerName: 'Wellington Importadora', 
    EmployeeID: 3, OrderDate: new Date('1996-07-15'), Freight: 13.97, 
    ShipCountry: 'Brazil', ShipCity: 'Resende'
  },
  {
    OrderID: 10257, CustomerID: 'HILAA', CustomerName: 'HILARION-Abastos', 
    EmployeeID: 4, OrderDate: new Date('1996-07-16'), Freight: 81.91, 
    ShipCountry: 'Venezuela', ShipCity: 'San Cristóbal'
  },
  {
    OrderID: 10258, CustomerID: 'ERNSH', CustomerName: 'Ernst Handel', 
    EmployeeID: 1, OrderDate: new Date('1996-07-17'), Freight: 140.51, 
    ShipCountry: 'Austria', ShipCity: 'Graz'
  },
  {
    OrderID: 10259, CustomerID: 'CENTC', CustomerName: 'Centro comercial Moctezuma', 
    EmployeeID: 4, OrderDate: new Date('1996-07-18'), Freight: 3.25, 
    ShipCountry: 'Mexico', ShipCity: 'México D.F.'
  },
  {
    OrderID: 10260, CustomerID: 'OTTIK', CustomerName: 'Ottilies Käseladen', 
    EmployeeID: 4, OrderDate: new Date('1996-07-19'), Freight: 55.09, 
    ShipCountry: 'Germany', ShipCity: 'Köln'
  },
  {
    OrderID: 10261, CustomerID: 'QUEDE', CustomerName: 'Que Delícia', 
    EmployeeID: 4, OrderDate: new Date('1996-07-19'), Freight: 3.05, 
    ShipCountry: 'Brazil', ShipCity: 'Rio de Janeiro'
  },
  {
    OrderID: 10262, CustomerID: 'RATTC', CustomerName: 'Rattlesnake Canyon Grocery', 
    EmployeeID: 8, OrderDate: new Date('1996-07-22'), Freight: 48.29, 
    ShipCountry: 'USA', ShipCity: 'Albuquerque'
  },
])

// Computed değerler
const uniqueCustomers = computed(() => {
  return [...new Set(data.value.map(item => item.CustomerID))].length
})

const uniqueCountries = computed(() => {
  return [...new Set(data.value.map(item => item.ShipCountry))].length
})

const totalFreight = computed(() => {
  return data.value.reduce((sum, item) => sum + item.Freight, 0)
})

// Sayfa meta bilgileri
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.custom-grid {
  font-family: inherit;
}

:deep(.e-grid .e-headercell) {
  background-color: rgb(249 250 251);
  font-weight: 600;
}

:deep(.e-grid .e-row:hover) {
  background-color: rgb(243 244 246);
}

:deep(.e-grid .e-altrow) {
  background-color: rgb(249 250 251);
}

html.dark :deep(.e-grid .e-headercell) {
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
  border-color: rgb(55 65 81);
}

html.dark :deep(.e-grid .e-row) {
  background-color: rgb(17 24 39);
  color: rgb(243 244 246);
  border-color: rgb(55 65 81);
}

html.dark :deep(.e-grid .e-row:hover) {
  background-color: rgb(31 41 55);
}

html.dark :deep(.e-grid .e-altrow) {
  background-color: rgb(31 41 55);
}
</style>