// DOM-level rendering test for the top page
// This runs under jsdom via environmentMatchGlobs
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import IndexPage from '../../pages/index.vue'

describe('DOM: index page', () => {
  it('renders expected text content', () => {
    const wrapper = mount(IndexPage)
    const text = wrapper.text()
    expect(text).toContain('Nuxt 3 Starter')
    expect(text).toContain('Edit pages/index.vue')
  })
})

