import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, it, expect, beforeAll } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { normalizeHtml, extractMeta, extractBody } from './utils/html'

// ESM-safe __dirname
const __dirname = dirname(fileURLToPath(import.meta.url))

// Boot a minimal Nuxt app located in nuxt3-sample
await setup({
  rootDir: resolve(__dirname, '..', 'nuxt3-sample'),
  server: true,
  dev: false,
})

describe('pages/index.vue render & head checks', () => {
  let html = ''

  beforeAll(async () => {
    html = await $fetch('/', { responseType: 'text' })
    console.log("============================")
    console.log("html",html)
    console.log("============================")
  })

  it('renders successfully with non-empty body', () => {
    const body = normalizeHtml(extractBody(html))
    expect(body.length).toBeGreaterThan(0)
  })

  it('renders expected key elements', () => {
    const body = normalizeHtml(extractBody(html))
    expect(body).toContain('data-test="title"')
    expect(body).toContain('Nuxt3 Sample')
    expect(body).toContain('data-test="message"')
    expect(body).toContain('data-test="footer"')
  })

  it('has correct head meta: title/description/noindex', () => {
    const meta = extractMeta(html)
    expect(meta.title).toBe('Nuxt3 Sample Index')
    expect(meta.description).toBe('Nuxt3 Sample Index Page')
    expect(meta.isNoIndex).toBe(true)
  })

  it('canonical is either absent or absolute https URL', () => {
    const { canonical } = extractMeta(html)
    if (!canonical) {
      expect(canonical).toBe('')
    } else {
      expect(canonical.startsWith('https://')).toBe(true)
    }
  })
})
