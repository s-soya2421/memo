import { resolve } from 'node:path'
import { load as loadHtml } from 'cheerio'
import { ofetch } from 'ofetch'
import { describe, it, expect, beforeAll } from 'vitest'
import { setup, renderPage } from '@nuxt/test-utils'

// Helper: normalize HTML to reduce flakiness in comparisons
function normalizeHtml(input: string | null | undefined) {
  return (input || '')
    .replace(/<!--[^]*?-->/g, '') // remove HTML comments
    .replace(/\s+/g, ' ')        // collapse whitespace
    .replace(/\s*(\n|\r)\s*/g, ' ')
    .replace(/<script[^>]*>[^]*?<\/script>/gi, '') // drop scripts (e.g. __NUXT)
    .replace(/<style[^>]*>[^]*?<\/style>/gi, '')   // drop styles
    .trim()
}

function extractMeta(html: string) {
  const $ = loadHtml(html)
  const title = $('head > title').first().text() || ''
  const description = $('meta[name="description"]').attr('content') || ''
  const robots = $('meta[name="robots"]').attr('content') || ''
  const isNoIndex = /noindex/i.test(robots)
  return { title, description, robots, isNoIndex }
}

function extractBody(html: string) {
  const $ = loadHtml(html)
  return $('body').html() || ''
}

describe('Nuxt3 pages/index.vue vs Production HTML', async () => {
  // Boot a minimal Nuxt app located in nuxt3-sample
  await setup({
    rootDir: resolve(__dirname, '..', 'nuxt3-sample'),
    server: true,
    // For CI stability
    dev: false,
  })

  let localHtml = ''
  let prodHtml = ''

  beforeAll(async () => {
    // Render local Nuxt page
    const { html } = await renderPage('/')
    localHtml = html

    // Fetch production HTML (replace with your real domain)
    prodHtml = await ofetch('https://sample.com', {
      // Avoid compression issues and add UA if needed
      headers: {
        'user-agent': 'Vitest-Nuxt3-Memo/1.0',
        'accept': 'text/html,application/xhtml+xml',
      },
      responseType: 'text',
      retry: 0,
    })
  })

  it('body 部分が一致していること（正規化後）', async () => {
    const localBody = normalizeHtml(extractBody(localHtml))
    const prodBody = normalizeHtml(extractBody(prodHtml))

    // そのまま一致しない場合もあるため、まずは空でないことをチェック
    expect(localBody.length).toBeGreaterThan(0)
    expect(prodBody.length).toBeGreaterThan(0)

    // メモ例: 完全一致が難しい場合は、主要要素が含まれるかの包含比較などに切り替える
    // ここではサンプルとして厳しめに比較（必要に応じて差分許容に変更）
    expect(localBody).toBe(prodBody)
  })

  it('meta 部分の noindex（isNoIndex）判定が一致していること', async () => {
    const localMeta = extractMeta(localHtml)
    const prodMeta = extractMeta(prodHtml)

    // タイトルやディスクリプションも比較例として
    expect(localMeta.title).toBeTypeOf('string')
    expect(prodMeta.title).toBeTypeOf('string')

    // noindex 判定の一致
    expect(localMeta.isNoIndex).toBe(prodMeta.isNoIndex)

    // 必要に応じて title/description も比較
    // expect(localMeta.title).toBe(prodMeta.title)
    // expect(localMeta.description).toBe(prodMeta.description)
  })
})

