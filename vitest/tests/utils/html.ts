import { load as loadHtml } from 'cheerio'

export function normalizeHtml(input: string | null | undefined): string {
  return (input || '')
    .replace(/<!--[^]*?-->/g, '') // remove HTML comments
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/\s*(\n|\r)\s*/g, ' ')
    .replace(/<script[^>]*>[^]*?<\/script>/gi, '') // drop scripts
    .replace(/<style[^>]*>[^]*?<\/style>/gi, '') // drop styles
    .trim()
}

export function extractMeta(html: string) {
  const $ = loadHtml(html)
  const title = $('head > title').first().text() || ''
  const description = $('meta[name="description"]').attr('content') || ''
  const robots = $('meta[name="robots"]').attr('content') || ''
  const isNoIndex = /noindex/i.test(robots)
  const canonical = $('link[rel="canonical"]').attr('href') || ''
  return { title, description, robots, isNoIndex, canonical }
}

export function extractBody(html: string): string {
  const $ = loadHtml(html)
  return $('body').html() || ''
}
