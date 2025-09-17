import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'

// Boot a Nuxt server once for this suite
await setup({
  rootDir: process.cwd(),
  server: true
})

describe('E2E: canonical meta', () => {
  it('includes <meta name="canonical"> in <head>', async () => {
    const html = await $fetch<string>('/')
    // Simple check for <meta name="canonical" ...>
    expect(html).toMatch(/<meta[^>]*name=["']canonical["'][^>]*>/i)
  })
})
