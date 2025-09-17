<template>
  <div class="min-h-screen flex flex-col">
    <header class="p-4 border-b">
      <strong>{{ runtime.public.appName }}</strong>
    </header>
    <main class="flex-1 p-6">
      <NuxtPage />
    </main>
    <footer class="p-4 border-t text-sm text-gray-500">
      Nuxt starter for memo repo
    </footer>
  </div>
  
</template>

<script setup lang="ts">
const runtime = useRuntimeConfig()
</script>

<style>
/* Minimal resets; add Tailwind or CSS as needed */
html, body, #__nuxt { height: 100%; }
body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
.text-gray-500 { color: #6b7280; }
.border-b { border-bottom: 1px solid #e5e7eb; }
.border-t { border-top: 1px solid #e5e7eb; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.min-h-screen { min-height: 100vh; }
.flex { display: flex; }
.flex-1 { flex: 1 1 auto; }
.flex-col { flex-direction: column; }
.text-sm { font-size: 0.875rem; }
</style>

