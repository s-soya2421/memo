import type { NuxtApp } from '#app'

declare module '#app' {
  interface NuxtApp {
    $isTest: boolean
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $isTest: boolean
  }
}

export {}

