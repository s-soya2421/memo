import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { parse } from '../utils/html'

// Boot a Nuxt server once for this suite (SSR only)
await setup({ server: true })

describe('Top SSR head/body checks', () => {
  it('<body> が存在する（SSR HTMLを返している）', async () => {
    const html = await $fetch<string>('/')
    const $ = parse(html)
    expect($('html').length).toBeGreaterThan(0)
    expect($('body').length).toBeGreaterThan(0)
    expect(($('body').text() || '').length).toBeGreaterThan(0)
  })

  it('robots meta があり、noindex か index を明示している', async () => {
    const html = await $fetch<string>('/')
    const $ = parse(html)
    const robots = $('meta[name="robots"]').attr('content') || ''
    expect(robots).toBeTruthy()
    expect(robots.toLowerCase()).toMatch(/(?:noindex|index)/)
  })

  it('canonical が設定されている', async () => {
    const html = await $fetch<string>('/')
    const $ = parse(html)
    // Accept either <link rel="canonical"> or meta[name=canonical]
    const canonicalLink = $('link[rel="canonical"]').attr('href') || ''
    const canonicalMeta = $('meta[name="canonical"]').attr('content') || ''
    const canonical = canonicalLink || canonicalMeta
    expect(canonical).toBeTruthy()
    // Prefer absolute URL; relax if needed by removing this assertion
    expect(canonical).toMatch(/^https?:\/\//)
  })
})

