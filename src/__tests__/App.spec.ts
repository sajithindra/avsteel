import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'
import router from '../router'

describe('App', () => {
  it('mounts renders properly', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    router.push('/')
    await router.isReady()
    const wrapper = mount(App, {
      global: {
        plugins: [pinia, router]
      }
    })
    expect(wrapper.text()).toContain('AVA SSDS')
  })
})
