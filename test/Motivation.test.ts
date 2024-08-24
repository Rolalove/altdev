import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TestimonialComponent from '../components/Motivation.vue'

describe('MotivationComponent', () => {
  it('renders the motivation correctly', () => {
    const wrapper = mount(TestimonialComponent)

    // Test the quote text
    expect(wrapper.text()).toContain("Altdev isn't just a platform, it's your launchpad")

    // Test the CEO name
    expect(wrapper.text()).toContain('Kofoworola shonuyi')

    // Test the CEO title
    expect(wrapper.text()).toContain('CEO, AltDev')

    // Test if the image is present
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/public/IMG_13434.jpg')
    expect(img.attributes('alt')).toBe('CEO Headshot')

    // Test if the image has the correct width
    expect(img.attributes('width')).toBe('65px')
    

    // Test if the component has the correct text color class
    expect(wrapper.classes()).toContain('text-[#64748B]')
  })
})