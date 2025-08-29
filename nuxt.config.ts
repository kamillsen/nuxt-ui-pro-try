// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui-pro', '@pinia/nuxt'],
  css: [
    '~/assets/css/main.css',
    '@syncfusion/ej2-base/styles/material.css',
    '@syncfusion/ej2-buttons/styles/material.css',
    '@syncfusion/ej2-calendars/styles/material.css',
    '@syncfusion/ej2-dropdowns/styles/material.css',
    '@syncfusion/ej2-inputs/styles/material.css',
    '@syncfusion/ej2-navigations/styles/material.css',
    '@syncfusion/ej2-popups/styles/material.css',
    '@syncfusion/ej2-splitbuttons/styles/material.css',
    '@syncfusion/ej2-vue-grids/styles/material.css'
  ],
  pinia: {
    storesDirs: ['./stores/**']
  },
  
  runtimeConfig: {
    // sadece server tarafından okunur (client'a sızmaz)
    crudcrudBase: process.env.NUXT_CRUDCRUD_BASE || ''
  },
})
