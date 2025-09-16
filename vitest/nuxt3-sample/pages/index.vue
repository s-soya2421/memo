<script setup lang="ts">
useHead({
  title: 'Nuxt3 Sample Index',
  meta: [
    { name: 'description', content: 'Nuxt3 Sample Index Page' },
    { name: 'robots', content: 'noindex' },
  ],
})
const message = 'Hello from Nuxt3 Sample Index'
</script>

<template>
  <main>
    <h1 data-test="title">Nuxt3 Sample</h1>
    <p data-test="message">{{ message }}</p>
  </main>
  <footer data-test="footer">© Sample</footer>
  
</template>

<style scoped>
main { padding: 1rem; }
h1 { font-size: 1.5rem; }
</style>

