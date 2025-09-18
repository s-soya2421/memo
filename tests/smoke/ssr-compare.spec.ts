import { describe, it, expect } from 'vitest'
import { setup, $fetch, url } from '@nuxt/test-utils/e2e'
import { normalizeHtml } from '../utils/html'

// Boot Nuxt SSR server
await setup({ server: true })

// Configure production base via env when running: PROD_BASE=https://your-site.com vitest run
const PROD_BASE = process.env.PROD_BASE || ''

// Routes to compare (extend as needed)
const routes = ['/', /* '/news', '/privacy' */]

const fetchText = async (absoluteUrl: string): Promise<string> => {
  const res = await fetch(absoluteUrl, { redirect: 'manual' })
  // Some CDNs return 200-399 for SSR HTML; still read the body
  return await res.text()
}

// Only run when PROD_BASE is provided to avoid false failures
const maybeIt: typeof it = PROD_BASE ? it : it.skip

describe('SSR: local vs production (normalized diff)', () => {
  routes.forEach((path) => {
    maybeIt(`matches normalized HTML for ${path}`, async () => {
      const localHtml = await $fetch<string>(url(path))
      const prodUrl = new URL(path, PROD_BASE).toString()
      const prodHtml = await fetchText(prodUrl)

      const localNorm = normalizeHtml(localHtml)
      const prodNorm = normalizeHtml(prodHtml)

      expect(localNorm).toBe(prodNorm)
    })
  })
})

