// DOM-level rendering test (Nuxt-agnostic component)
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import Hello from '../../components/Hello.vue'

describe('DOM: simple component', () => {
  it('renders component text', () => {
    const wrapper = mount(Hello)
    expect(wrapper.text()).toContain('Hello Component')
  })
})
