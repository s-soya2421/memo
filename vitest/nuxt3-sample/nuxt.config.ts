// Minimal Nuxt 3 config for testing
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nuxt3 Sample Index',
      meta: [
        { name: 'description', content: 'Nuxt3 Sample Index Page' },
        // robots: noindex for testing meta check
        { name: 'robots', content: 'noindex' },
      ],
    },
  },
})

