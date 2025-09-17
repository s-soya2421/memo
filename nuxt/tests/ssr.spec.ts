import { setup, $fetch } from '@nuxt/test-utils'

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
