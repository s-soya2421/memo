import { setup, $fetch } from '@nuxt/test-utils'
import { vi } from 'vitest'

// Mock external network calls (non-localhost) at fetch level
const originalFetch: typeof fetch = globalThis.fetch.bind(globalThis)
globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  let urlStr = ''
  if (typeof input === 'string') {
    urlStr = input
  } else if (input instanceof URL) {
    urlStr = input.toString()
  } else if (typeof (input as any)?.url === 'string') {
    urlStr = (input as any).url
  } else {
    urlStr = String(input)
  }

  try {
    const u = new URL(urlStr)
    const isLocal = ['localhost', '127.0.0.1', '::1'].includes(u.hostname)
    const isHttp = u.protocol === 'http:' || u.protocol === 'https:'
    if (isHttp && !isLocal) {
      // Return a deterministic mocked JSON response for any external call
      const body = JSON.stringify({ mocked: true, url: u.toString() })
      return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } })
    }
  } catch (e) {
    // Not an absolute URL; delegate to original (likely internal fetch)
  }

  return originalFetch(input as any, init as any)
})

// Boot a Nuxt server once for this test file
await setup({
  // Use the project root (nuxt/) as rootDir; avoids import.meta.url issues across projects
  rootDir: process.cwd(),
  server: true
})

describe('SSR: index page', () => {
  it('renders expected content', async () => {
    const html = await $fetch<string>('/')
    
    expect(html).toContain('Nuxt 3 Starter')
    expect(html).toContain('Memo Nuxt')
  })
})
