// Nuxt configuration with SSR, head meta canonical, and SCSS mocking for tests
const mockScssPlugin = {
  name: 'mock-scss-in-tests',
  enforce: 'pre',
  load(id: string) {
    if (id.endsWith('.scss') || id.endsWith('.sass')) return ''
  },
  transform(code: string, id: string) {
    const isVueStyle = id.includes('?vue') && id.includes('type=style') && /lang\.(s[ac]ss)/.test(id)
    if (isVueStyle) return { code: '', map: null }
  }
}

export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      // Use meta canonical as requested (note: canonical is commonly a <link>, but we follow the requirement)
      meta: [
        { name: 'canonical', content: 'https://example.com/' }
      ]
    }
  },
  plugins: [
    '~/plugins/test-fetch-mock'
  ],
  vite: (process.env.VITEST || process.env.NUXT_TEST)
    ? { plugins: [mockScssPlugin] }
    : {},
  runtimeConfig: {
    public: {
      isTest: Boolean(process.env.VITEST || process.env.NUXT_TEST)
    }
  }
})
