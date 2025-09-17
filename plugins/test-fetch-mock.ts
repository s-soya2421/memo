// Mock external network calls during Vitest runs
export default defineNuxtPlugin(() => {
  if (!process.env.VITEST && !process.env.NUXT_TEST) return

  const origFetch: typeof fetch | undefined = globalThis.fetch?.bind(globalThis)
  if (!origFetch) return

  const debug = Boolean(process.env.DEBUG_FETCH_MOCK)

  function isLocalHost(hostname: string): boolean {
    const h = hostname.replace(/^\[|\]$/g, '') // strip IPv6 brackets
    if (
      h === 'localhost' ||
      h === '0.0.0.0' ||
      h === '::' ||
      h === '::1' ||
      h.startsWith('127.') ||
      h.startsWith('10.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(h) ||
      h.startsWith('192.168.')
    ) return true
    return false
  }

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    let urlStr = ''
    if (typeof input === 'string') urlStr = input
    else if (input instanceof URL) urlStr = input.toString()
    else if (typeof (input as any)?.url === 'string') urlStr = (input as any).url
    else urlStr = String(input)

    try {
      const u = new URL(urlStr)
      const isHttp = u.protocol === 'http:' || u.protocol === 'https:'
      const local = isLocalHost(u.hostname)
      if (debug) console.log('[fetch-mock]', { url: u.toString(), isHttp, local })
      if (isHttp && !local) {
        const body = JSON.stringify({ mocked: true, url: u.toString() })
        return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } })
      }
    } catch {
      // Relative URL or invalid absolute -> treat as internal and pass-through
      if (debug) console.log('[fetch-mock] pass-through (relative)', { url: urlStr })
    }

    return origFetch(input as any, init as any)
  }) as typeof fetch
})
