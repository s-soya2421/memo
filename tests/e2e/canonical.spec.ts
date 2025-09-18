import { setup, $fetch } from '@nuxt/test-utils'
import { describe, it, expect } from 'vitest'
import { JSDOM } from 'jsdom'

// Boot a Nuxt server once for this suite
await setup({
  rootDir: process.cwd(),
  server: true
})

describe('E2E: SSR output sanity', () => {
  it('does not include isNoindex and renders a sane <body>', async () => {
    const html = await $fetch<string>('/')

    // Ensure no accidental `isNoindex` flag leaked into HTML
    expect(html).not.toMatch(/isNoindex/i)

    // Basic DOM sanity checks for <body>
    const dom = new JSDOM(html)
    const { document } = dom.window
    const body = document.querySelector('body')

    expect(body).toBeTruthy()
    // Body should not be empty/garbled; require at least one element/content
    expect(body?.childNodes.length || 0).toBeGreaterThan(0)
  })
})
