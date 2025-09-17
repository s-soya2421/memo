// Minimal Nuxt 3 configuration for the memo repo
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: [],
  plugins: [
    '~/plugins/test-fetch-mock'
  ],
  runtimeConfig: {
    // Private keys are only available on the server
    // apiSecret: process.env.API_SECRET,
    public: {
      appName: 'Memo Nuxt'
    }
  },
})
