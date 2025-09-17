// Expose a global `$isTest` flag for app code to toggle behaviors in tests
export default defineNuxtPlugin(() => {
  const runtime = useRuntimeConfig()
  const envIsTest = Boolean((process as any)?.env?.VITEST || (import.meta as any)?.env?.VITEST || (process as any)?.env?.NUXT_TEST)
  const resolved = typeof runtime.public?.isTest === 'boolean' ? runtime.public.isTest : envIsTest
  return {
    provide: {
      isTest: resolved,
    }
  }
})

