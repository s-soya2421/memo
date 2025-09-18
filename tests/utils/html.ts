import { load as loadHtml } from 'cheerio'

export function parse(html: string) {
  const cleaned = (html || '')
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<script[^>]*>[^]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[^]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
  return loadHtml(cleaned)
}

// Normalizer for SSR diff against production
export function normalizeHtml(html: string) {
  let s = String(html || '')
  // Drop comments, scripts, styles
  s = s
    .replace(/<!--[^]*?-->/g, '')
    .replace(/<script[^>]*>[^]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[^]*?<\/style>/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  // Remove integrity/nonces that vary
  s = s.replace(/\s(integrity|nonce)="[^"]+"/gi, '')

  // Strip query hashes like ?v=abc123 or ?id=deadbeef
  s = s.replace(/\?(?:v|id|t|hash)=[A-Za-z0-9_-]{6,}/g, '')

  // Normalize hashed asset filenames in /_nuxt/*.{js,css}
  s = s.replace(/(\/_nuxt\/[^\s"'>]+?)[.-][a-f0-9]{6,}(\.(?:js|css)\b)/gi, '$1$2')

  // Generic replace of long hex-like tokens inside filenames
  s = s.replace(/([\/\.-])[A-Fa-f0-9]{8,}(?=\.)/g, '$1')

  // Normalize self-closing variations
  s = s.replace(/\s*\/>/g, '>')

  // Remove trailing spaces inside tags
  s = s.replace(/<([^>]+)\s+>/g, '<$1>')

  return s
}

