import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'
import { load } from 'cheerio'

// Boot a Nuxt server once for this suite
await setup({
  rootDir: process.cwd(),
  server: true
})

describe('E2E: Cheerio parses SSR HTML', () => {
  it('renders expected title, h1, and canonical meta', async () => {
    const html = await $fetch<string>('/')

    // No accidental debug flags
    expect(html).not.toMatch(/isNoindex/i)

    const $ = load(html)

    // Title from app.vue
    expect($('title').text()).toBe('Memo Nuxt')

    // Simple content check from pages/index.vue
    expect($('h1').first().text().trim()).toBe('Home')

    // Canonical meta configured in nuxt.config.ts
    expect($('meta[name="canonical"]').attr('content')).toBe('https://example.com/')

    // Basic body sanity
    expect($('body').length).toBe(1)
    expect($('body').children().length).toBeGreaterThan(0)
  })
})

