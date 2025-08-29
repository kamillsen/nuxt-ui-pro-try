// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui-pro', '@pinia/nuxt'],
  css: [
    '~/assets/css/main.css',
    '@syncfusion/ej2-base/styles/tailwind.css',
    '@syncfusion/ej2-buttons/styles/tailwind.css',
    '@syncfusion/ej2-calendars/styles/tailwind.css',
    '@syncfusion/ej2-dropdowns/styles/tailwind.css',
    '@syncfusion/ej2-inputs/styles/tailwind.css',
    '@syncfusion/ej2-navigations/styles/tailwind.css',
    '@syncfusion/ej2-popups/styles/tailwind.css',
    '@syncfusion/ej2-splitbuttons/styles/tailwind.css',
    '@syncfusion/ej2-vue-grids/styles/tailwind.css',
    '@syncfusion/ej2-vue-dropdowns/styles/tailwind.css',
    '@syncfusion/ej2-vue-popups/styles/tailwind.css'
  ],
  pinia: {
    storesDirs: ['./stores/**']
  },
  
  runtimeConfig: {
    // sadece server tarafından okunur (client'a sızmaz)
    crudcrudBase: process.env.NUXT_CRUDCRUD_BASE || ''
  },
})
