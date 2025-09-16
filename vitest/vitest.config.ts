import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    testTimeout: 60000,
    hookTimeout: 60000,
    globals: true,
    exclude: [
      // Standard excludes
      'node_modules/**',
      'dist/**',
      '.nuxt/**',
      '.output/**',
      '.cache/**',
      '.git/**',
      'coverage/**',
      // Project-specific
    ],
  },
})
