import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.spec.ts'],
    // Use jsdom only for DOM tests
    environmentMatchGlobs: [
      ['tests/dom/**/*.spec.ts', 'jsdom']
    ]
  }
})
