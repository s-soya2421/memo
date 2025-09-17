// Mock external network calls during Vitest runs
// This plugin is always registered, but only activates when VITEST is set
export default defineNuxtPlugin(() => {
  if (!process.env.VITEST) return

  const origFetch: typeof fetch | undefined = globalThis.fetch?.bind(globalThis)

  if (!origFetch) return

  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    let urlStr = ''
    if (typeof input === 'string') urlStr = input
    else if (input instanceof URL) urlStr = input.toString()
    else if (typeof (input as any)?.url === 'string') urlStr = (input as any).url
    else urlStr = String(input)

    try {
      const u = new URL(urlStr)
      const isLocal = ['localhost', '127.0.0.1', '::1'].includes(u.hostname)
      const isHttp = u.protocol === 'http:' || u.protocol === 'https:'
      if (isHttp && !isLocal) {
        const body = JSON.stringify({ mocked: true, url: u.toString() })
        return new Response(body, { status: 200, headers: { 'content-type': 'application/json' } })
      }
    } catch {
      // Non-absolute URL -> treat as internal and pass-through
    }

    return origFetch(input as any, init as any)
  }) as typeof fetch
})

