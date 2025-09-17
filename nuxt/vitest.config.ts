import { defineVitestConfig } from '@nuxt/test-utils/config'
import type { Plugin } from 'vite'

// Simple style mock plugin for Vitest
// - Mocks direct imports of .scss/.sass/.css/etc as an object proxy (identity-obj-proxy like)
// - No-ops Vue SFC virtual style modules (e.g. ?vue&type=style&lang.scss)
function styleMockPlugin(): Plugin {
  const styleRE = /\.(css|scss|sass|less|styl|stylus)(\?.*)?$/
  return {
    name: 'vitest:mock-styles',
    enforce: 'pre',
    resolveId(id) {
      // Let Vite handle resolution; we just want to intercept loads
      return null
    },
    load(id) {
      // Mock Vue SFC virtual style blocks
      if (id.includes('?vue') && id.includes('type=style')) {
        // Provide empty CSS to avoid preprocessor work
        return ''
      }
      if (styleRE.test(id)) {
        // Export a proxy so `styles.className` returns 'className' (handy for CSS Modules)
        return `export default new Proxy({}, { get: (t, p) => String(p) })`
      }
      return null
    },
  }
}

export default defineVitestConfig({
  test: {
    globals: true,
    // Use projects to split environments
    projects: [
      {
        name: 'node',
        environment: 'node',
        include: ['tests/**/*.spec.ts'],
        exclude: ['tests/dom/**/*.spec.ts']
      },
      {
        name: 'dom',
        environment: 'jsdom',
        include: ['tests/dom/**/*.spec.ts']
      }
    ]
  },
  plugins: [styleMockPlugin()]
})
