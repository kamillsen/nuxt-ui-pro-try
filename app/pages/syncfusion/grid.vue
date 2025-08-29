<template>
  <div class="space-y-6">
    <!-- Sayfa Başlığı -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Employee Management Grid</h2>
        <p class="text-gray-600 dark:text-gray-300 mt-1">Advanced employee data grid with virtualization and custom templates</p>
      </div>
      
      <!-- Veri Boyutu Seçici -->
      <div class="flex items-center gap-2">
        <USelect 
          v-model="selectedDataSize" 
          :options="dataSizeOptions"
          @change="changeDataSize"
          class="w-64"
        />
      </div>
    </div>

    <!-- Grid Kartı -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Employee Overview</h3>
          <div class="flex items-center gap-2">
            <UBadge color="primary" variant="subtle">{{ gridData.length }} Employees</UBadge>
            <UBadge color="success" variant="subtle">{{ activeEmployees }} Active</UBadge>
          </div>
        </div>
      </template>

      <div class="w-full">
        <ejs-grid 
          :dataSource="gridData" 
          :allowSelection="true"
          :allowSorting="true"
          :allowFiltering="true"
          :enableVirtualization="true"
          :enableHeaderFocus="true"
          :enableHover="false"
          :pageSettings="pageSettings"
          :filterSettings="filterSettings"
          :selectionSettings="selectionSettings"
          height="600"
          :rowHeight="38"
          class="custom-grid"
        >
          <e-columns>
            <!-- Checkbox Column -->
            <e-column 
              type="CheckBox" 
              :allowFiltering="false" 
              :allowSorting="false" 
              width="60"
            ></e-column>
            
            <!-- Employee ID (Hidden Primary Key) -->
            <e-column 
              field="EmployeeID" 
              headerText="Employee ID" 
              :visible="false" 
              :isPrimaryKey="true" 
              width="130"
            ></e-column>
            
            <!-- Employee Name with Avatar -->
            <e-column 
              field="Employees" 
              headerText="Employee Name" 
              width="200" 
              clipMode="EllipsisWithTooltip"
            >
              <template #template="{ data }">
                <div class="flex items-center gap-3">
                  <div class="employee-avatar">
                    <UIcon 
                      :name="data.EmployeeImg === 'usermale' ? 'i-heroicons-user' : 'i-heroicons-user'"
                      class="h-8 w-8 text-gray-500 bg-gray-100 rounded-full p-1"
                      :class="data.EmployeeImg === 'userfemale' ? 'text-pink-500 bg-pink-100' : 'text-blue-500 bg-blue-100'"
                    />
                  </div>
                  <span class="font-medium">{{ data.Employees }}</span>
                </div>
              </template>
            </e-column>
            
            <!-- Designation -->
            <e-column 
              field="Designation" 
              headerText="Designation"
              width="170" 
              clipMode="EllipsisWithTooltip"
              :filterSettings="{ type: 'CheckBox' }"
            ></e-column>
            
            <!-- Email -->
            <e-column 
              field="Mail" 
              headerText="Email"
              width="230"
              :filterSettings="{ type: 'Menu' }"
            ></e-column>
            
            <!-- Location with Icon -->
            <e-column 
              field="Location" 
              headerText="Location"
              width="140"
              :filterSettings="{ type: 'CheckBox' }"
            >
              <template #template="{ data }">
                <div class="flex items-center gap-2">
                  <UIcon name="i-heroicons-map-pin" class="h-4 w-4 text-gray-400" />
                  <span>{{ data.Location }}</span>
                </div>
              </template>
            </e-column>
            
            <!-- Status with Badge -->
            <e-column 
              field="Status" 
              headerText="Status"
              width="150"
              :filterSettings="{ type: 'CheckBox' }"
            >
              <template #template="{ data }">
                <UBadge 
                  :color="data.Status === 'Active' ? 'success' : 'error'"
                  variant="subtle"
                  size="sm"
                >
                  {{ data.Status }}
                </UBadge>
              </template>
            </e-column>
            
            <!-- Trustworthiness with Icon -->
            <e-column 
              field="Trustworthiness" 
              headerText="Trust Level"
              width="160"
              :filterSettings="{ type: 'CheckBox' }"
            >
              <template #template="{ data }">
                <div class="flex items-center gap-2">
                  <UIcon 
                    :name="getTrustIcon(data.Trustworthiness)"
                    :class="getTrustColor(data.Trustworthiness)"
                    class="h-5 w-5"
                  />
                  <span>{{ data.Trustworthiness }}</span>
                </div>
              </template>
            </e-column>
            
            <!-- Rating with Stars -->
            <e-column 
              field="Rating" 
              headerText="Rating"
              :allowFiltering="false" 
              :allowSorting="false" 
              width="180"
            >
              <template #template="{ data }">
                <div class="flex items-center gap-1">
                  <UIcon 
                    v-for="i in 5" 
                    :key="i"
                    name="i-heroicons-star-solid"
                    :class="i <= data.Rating ? 'text-yellow-400' : 'text-gray-300'"
                    class="h-4 w-4"
                  />
                </div>
              </template>
            </e-column>
            
            <!-- Software Proficiency Progress Bar -->
            <e-column 
              field="Software" 
              headerText="Software Proficiency"
              :allowFiltering="false" 
              :allowSorting="false" 
              width="180"
            >
              <template #template="{ data }">
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                  <div 
                    class="h-2.5 rounded-full transition-all duration-300"
                    :class="data.Status === 'Active' ? 'bg-blue-600' : 'bg-gray-400'"
                    :style="`width: ${data.Software}%`"
                  ></div>
                  <div class="text-xs text-gray-600 mt-1">{{ data.Software }}%</div>
                </div>
              </template>
            </e-column>
            
            <!-- Current Salary -->
            <e-column 
              field="CurrentSalary" 
              headerText="Current Salary"
              width="160"
              format="C2"
              textAlign="Right"
              :filterSettings="{ type: 'Menu' }"
            ></e-column>
            
            <!-- Address -->
            <e-column 
              field="Address" 
              headerText="Address"
              width="240"
              clipMode="EllipsisWithTooltip"
              :filterSettings="{ type: 'Menu' }"
            ></e-column>
          </e-columns>
        </ejs-grid>
      </div>
    </UCard>

    <!-- İstatistikler -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ gridData.length }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Total Employees</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ activeEmployees }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Active</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ inactiveEmployees }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Inactive</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-yellow-600">{{ averageRating.toFixed(1) }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Avg Rating</div>
        </div>
      </UCard>
      
      <UCard>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">${{ averageSalary.toLocaleString() }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">Avg Salary</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GridComponent as EjsGrid, ColumnsDirective as EColumns, ColumnDirective as EColumn } from '@syncfusion/ej2-vue-grids'

// Employee Interface
interface EmployeeData {
  EmployeeID: number
  Employees: string
  EmployeeImg: 'usermale' | 'userfemale'
  Designation: string
  Mail: string
  Location: string
  Status: 'Active' | 'Inactive'
  Trustworthiness: 'Perfect' | 'Excellent' | 'Good' | 'Average'
  Rating: number
  Software: number
  CurrentSalary: number
  Address: string
}

// Grid ayarları
const pageSettings = { pageSize: 40 }
const filterSettings = { type: 'Menu' }
const selectionSettings = { 
  checkboxOnly: true, 
  persistSelection: true, 
  type: 'Multiple' 
}

// Veri boyutu seçenekleri
const dataSizeOptions = [
  { label: '1,000 Rows and 11 Columns', value: 1000 },
  { label: '10,000 Rows and 11 Columns', value: 10000 },
  { label: '100,000 Rows and 11 Columns', value: 100000 }
]

const selectedDataSize = ref(1000)

// Örnek çalışan verileri oluşturma fonksiyonu
function generateEmployeeData(count: number): EmployeeData[] {
  const employees: EmployeeData[] = []
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Jessica', 'James', 'Ashley', 'Christopher', 'Amanda', 'Daniel', 'Jennifer', 'Matthew', 'Michelle', 'Anthony', 'Kimberly']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
  const designations = ['Software Engineer', 'Senior Developer', 'Project Manager', 'Team Lead', 'QA Engineer', 'DevOps Engineer', 'UI/UX Designer', 'Business Analyst', 'Data Scientist', 'Product Manager']
  const locations = ['New York', 'London', 'Tokyo', 'Paris', 'Sydney', 'Toronto', 'Berlin', 'Singapore', 'Mumbai', 'São Paulo']
  const trustLevels: EmployeeData['Trustworthiness'][] = ['Perfect', 'Excellent', 'Good', 'Average']
  const streets = ['Main St', 'Oak Ave', 'Elm St', 'Park Rd', 'First Ave', 'Second St', 'Broadway', 'Washington St', 'Lincoln Ave', 'Madison St']

  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const fullName = `${firstName} ${lastName}`
    const designation = designations[Math.floor(Math.random() * designations.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]
    const isActive = Math.random() > 0.2 // 80% aktif
    const street = streets[Math.floor(Math.random() * streets.length)]

    employees.push({
      EmployeeID: i,
      Employees: fullName,
      EmployeeImg: Math.random() > 0.5 ? 'usermale' : 'userfemale',
      Designation: designation,
      Mail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      Location: location,
      Status: isActive ? 'Active' : 'Inactive',
      Trustworthiness: trustLevels[Math.floor(Math.random() * trustLevels.length)],
      Rating: Math.floor(Math.random() * 5) + 1,
      Software: Math.floor(Math.random() * 100) + 1,
      CurrentSalary: Math.floor(Math.random() * 50000) + 50000,
      Address: `${Math.floor(Math.random() * 9999) + 1} ${street}, ${location}`
    })
  }

  return employees
}

// Grid verisi
const gridData = ref<EmployeeData[]>(generateEmployeeData(selectedDataSize.value))

// Veri boyutu değiştiğinde grid'i güncelle
const changeDataSize = () => {
  gridData.value = generateEmployeeData(selectedDataSize.value)
}

// Trust level icon helper
const getTrustIcon = (trustLevel: string) => {
  switch (trustLevel) {
    case 'Perfect': return 'i-heroicons-shield-check'
    case 'Excellent': return 'i-heroicons-star'
    case 'Good': return 'i-heroicons-hand-thumb-up'
    case 'Average': return 'i-heroicons-minus-circle'
    default: return 'i-heroicons-question-mark-circle'
  }
}

// Trust level color helper
const getTrustColor = (trustLevel: string) => {
  switch (trustLevel) {
    case 'Perfect': return 'text-green-500'
    case 'Excellent': return 'text-blue-500'
    case 'Good': return 'text-yellow-500'
    case 'Average': return 'text-gray-500'
    default: return 'text-gray-400'
  }
}

// Computed istatistikler
const activeEmployees = computed(() => {
  return gridData.value.filter(emp => emp.Status === 'Active').length
})

const inactiveEmployees = computed(() => {
  return gridData.value.filter(emp => emp.Status === 'Inactive').length
})

const averageRating = computed(() => {
  if (gridData.value.length === 0) return 0
  const total = gridData.value.reduce((sum, emp) => sum + emp.Rating, 0)
  return total / gridData.value.length
})

const averageSalary = computed(() => {
  if (gridData.value.length === 0) return 0
  const total = gridData.value.reduce((sum, emp) => sum + emp.CurrentSalary, 0)
  return total / gridData.value.length
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