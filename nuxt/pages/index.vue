<template>
  <section>
    <h1>Nuxt 3 Starter</h1>
    <p>
      This is a minimal Nuxt 3 app scaffolded for the memo repo.
    </p>
    <ul>
      <li>Dev: <code>pnpm dev</code> or <code>npm run dev</code></li>
      <li>Build: <code>pnpm build</code></li>
      <li>Preview: <code>pnpm preview</code></li>
      <li>Static generate: <code>pnpm generate</code></li>
    </ul>
    <p>
      Edit <code>pages/index.vue</code> and <code>app.vue</code> to get started.
    </p>
    <p data-test="external-mock">
      External mocked: {{ ext?.mocked ? 'yes' : 'no' }}
    </p>
  </section>
</template>

<script setup lang="ts">
// Example external fetch to demonstrate SSR/test mocking
const { data: ext } = await useFetch<{ mocked: boolean; url: string }>(
  'https://example.com/api/mock'
)
</script>

<style scoped>
h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
ul { margin: 0.5rem 0 0; padding-left: 1.25rem; }
code { background: #f3f4f6; padding: 0 0.25rem; border-radius: 4px; }
</style>
