<script setup lang="ts">
import Hamburger from 'vue-material-design-icons/Menu.vue';
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiClose } from '@mdi/js';

import { ref } from 'vue'

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Discover', path: '' },
  { name: 'Topics', path: '' },
  { name: 'Communities', path: '' },
  { name: 'Write', path: '' },
]

const isMenuOpen = ref<boolean>(false)

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
<template>
  <div class="w-full bg-[#ffffff] shadow-sm">
    <nav
      class="flex justify-between container px-4 md:px-10 py-3  mx-auto items-center">
      <div>
        <NuxtLink class="text-[#4CAF50] text-2xl font-bold" to="/" data-testid="logo">AltDev</NuxtLink>
      </div>

      <!-- Desktop menu -->
      <div class="hidden md:flex justify-between gap-7 text-base text-[#333333]">
        <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path">{{ item.name }}</NuxtLink>
      </div>

      <div class="hidden md:flex justify-between gap-5 items-center text-base">
        <NuxtLink to="/login">Sign In</NuxtLink>
        <NuxtLink class="border text-[#ffffff] rounded-xl px-5 py-1 bg-[#4CAF50] " to="/signup">Get Started</NuxtLink>
      </div>

      <!-- Hamburger menu button -->
      <button @click="toggleMenu" class="md:hidden text-[#333333]" data-testid="hamburger-button">
        <span v-if="isMenuOpen"> <SvgIcon size="40" type="mdi" :path="mdiClose" /></span>
        <span v-else="isMenuOpen"><Hamburger size="40" /> </span>
       
      </button>
    </nav>

    <!-- Mobile menu -->
    <div v-if="isMenuOpen" class="md:hidden mt-2 bg-white shadow-md  w-fit absolute rounded-bl-xl rounded-tr-xl right-3 mx-auto">
      <div class="flex text-center  text-xl flex-col w-fit p-4">
        <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="py-2">{{ item.name }}</NuxtLink>
        <NuxtLink to="/login" class="py-2">Sign In</NuxtLink>
        <NuxtLink to="signup" class="py-2 mt-2 text-center border px-5 rounded-full bg-[#4CAF50] text-white">Get
          Started</NuxtLink>
      </div>
    </div>
  </div>
</template>