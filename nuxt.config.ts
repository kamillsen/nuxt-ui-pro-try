// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/ui-pro', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  pinia: {
    storesDirs: ['./stores/**']
  },
  
  runtimeConfig: {
    // sadece server tarafından okunur (client'a sızmaz)
    crudcrudBase: process.env.NUXT_CRUDCRUD_BASE || ''
  },
})
