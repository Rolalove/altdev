<script setup lang="ts">
import Hamburger from 'vue-material-design-icons/Menu.vue';

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Home', path: '/userdashboard' },
  { name: 'Bookmarks', path: '/' },
  { name: 'Notification', path: '/' },
  { name: 'Write', path: '/new' },
  { name: 'Profile', path: '/profilecreate' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Logout', path: '/new' },
]

const isMenuOpen = ref<boolean>(false)

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
    <div>
        <div v-if="isMenuOpen" class="md:hidden mt-4 bg-white shadow-md rounded-lg w-[95%] mx-auto">
        <div class="flex text-center font-bold text-xl flex-col p-4">
          <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="py-2">{{ item.name }}</NuxtLink>
        </div>
      </div>
    </div>
</template>