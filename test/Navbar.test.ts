import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavBar from '../components/Navbar.vue'
import { config } from '@vue/test-utils'

config.global.stubs = {
  NuxtLink: {
    template: '<a><slot /></a>'
  }
}
describe('NavBar', () => {
    it('renders the logo', () => {
      const wrapper = mount(NavBar)
      expect(wrapper.find('[data-testid="logo"]').text()).toBe('AltDev')
    })

  it('renders desktop menu items', () => {
    const wrapper = mount(NavBar)
    const desktopMenu = wrapper.find('.hidden.md\\:flex')
    expect(desktopMenu.exists()).toBe(true)
    
    const menuItems = desktopMenu.findAll('a')
    expect(menuItems).toHaveLength(4)
    
    const expectedItems = [
      { name: 'Our Story', path: '/ourstory' },
      { name: 'Features', path: '/' },
      { name: 'Trending', path: '/' },
      { name: 'Write', path: '/new' },
    ]
    
    menuItems.forEach((item, index) => {
      expect(item.text()).toBe(expectedItems[index].name)
      expect(item.attributes('to')).toBe(expectedItems[index].path)
    })
  })

  it('renders sign in and get started buttons on desktop', () => {
    const wrapper = mount(NavBar)
    const buttons = wrapper.findAll('.hidden.md\\:flex a')
    
    expect(buttons[4].text()).toBe('Sign In')
    expect(buttons[4].attributes('to')).toBe('/login')
    
    expect(buttons[5].text()).toBe('Get Started')
    expect(buttons[5].attributes('to')).toBe('/login/signup')
    expect(buttons[5].classes()).toContain('bg-[#4CAF50]')
  })

  it('renders hamburger menu on mobile', () => {
    const wrapper = mount(NavBar)
    const hamburger = wrapper.find('button.md\\:hidden')
    expect(hamburger.exists()).toBe(true)
  })

  it('toggles mobile menu when hamburger is clicked', async () => {
    const wrapper = mount(NavBar)
    const hamburger = wrapper.find('button.md\\:hidden')
    
    expect(wrapper.find('.md\\:hidden.mt-4').exists()).toBe(false)
    
    await hamburger.trigger('click')
    expect(wrapper.find('.md\\:hidden.mt-4').exists()).toBe(true)
    
    await hamburger.trigger('click')
    expect(wrapper.find('.md\\:hidden.mt-4').exists()).toBe(false)
  })

  it('renders correct items in mobile menu', async () => {
    const wrapper = mount(NavBar)
    await wrapper.find('button.md\\:hidden').trigger('click')
    
    const mobileMenu = wrapper.find('.md\\:hidden.mt-4')
    const menuItems = mobileMenu.findAll('a')
    
    expect(menuItems).toHaveLength(6)
    
    const expectedItems = [
      { name: 'Our Story', path: '/ourstory' },
      { name: 'Features', path: '/' },
      { name: 'Trending', path: '/' },
      { name: 'Write', path: '/new' },
      { name: 'Sign In', path: '/login' },
      { name: 'Get Started', path: '/login/signup' },
    ]
    
    menuItems.forEach((item, index) => {
      expect(item.text()).toBe(expectedItems[index].name)
      expect(item.attributes('to')).toBe(expectedItems[index].path)
    })
    
    expect(menuItems[5].classes()).toContain('bg-[#4CAF50]')
  })
})