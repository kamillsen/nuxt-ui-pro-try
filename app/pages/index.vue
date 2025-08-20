<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatsCard
        title="Toplam Kullanıcı"
        value="1,245"
        change="+12% bu ayda"
        color="primary"
      />
      
      <StatsCard
        title="Satışlar"
        value="₺125,430"
        change="+8% bu ayda"
        color="success"
      />
      
      <StatsCard
        title="Siparişler"
        value="342"
        change="+15% bu ayda"
        color="info"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>