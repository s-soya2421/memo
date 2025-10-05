import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.spec.ts'],
    exclude: ['node_modules', '.nuxt', 'dist'],
    environment: 'node',
    css: false,
    // グローバルを使いたい場合は次を有効化:
    // globals: true,
  },
  // cheerioなどの依存関係をvitestで正しく解決するための設定
  server: {
    deps: {
      inline: ['cheerio'],
    },
  },
})

