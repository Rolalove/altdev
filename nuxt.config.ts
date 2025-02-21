// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase','@nuxt/test-utils/module','@pinia/nuxt'],
  supabase: {
    redirect: false
  },
  build: {
    transpile: ['@toast-ui/editor']
  },
  vite: {
    optimizeDeps: {
      include: ['@toast-ui/editor']
    },
    ssr: {
      noExternal: ['@toast-ui/editor']
    }
  },
})