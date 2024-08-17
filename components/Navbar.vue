<script setup lang="ts">
import Hamburger from 'vue-material-design-icons/Menu.vue';

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Our Story', path: '/ourstory' },
  { name: 'Features', path: '/' },
  { name: 'Trending', path: '/' },
  { name: 'Write', path: '/new' },
]

const isMenuOpen = ref<boolean>(false)

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
<template>
    <div>
      <nav class="flex justify-between px-4 md:px-10 py-3 border border-slate-800 rounded-full w-[95%] mx-auto mt-3 border-black font-bold items-center">
        <div>
          <NuxtLink class="text-[#408a43] text-2xl" to="/">AltDev</NuxtLink>
        </div>
        
        <!-- Desktop menu -->
        <div class="hidden md:flex justify-between gap-7 text-lg">
          <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path">{{ item.name }}</NuxtLink>
        </div>
        
        <div class="hidden md:flex justify-between gap-5 items-center text-lg">
          <NuxtLink to="/login">Sign In</NuxtLink>
          <NuxtLink class="border px-5 py-2 rounded-full bg-[#408a43] " to="/login/signup">Get Started</NuxtLink>
        </div>
        
        <!-- Hamburger menu button -->
        <button @click="toggleMenu" class="md:hidden text-[#408a43]">
          <Hamburger/>
        </button>
      </nav>
  
      <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 bg-white shadow-md rounded-lg w-[95%] mx-auto">
        <div class="flex text-center font-bold text-xl flex-col p-4">
          <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="py-2">{{ item.name }}</NuxtLink>
          <NuxtLink to="/login" class="py-2">Sign In</NuxtLink>
          <NuxtLink to="/login/signup" class="py-2 mt-2 text-center border px-5 rounded-full bg-[#408a43] text-white">Get Started</NuxtLink>
        </div>
      </div>
    </div>
  </template>
  
 