<script setup lang="ts">
import Hamburger from 'vue-material-design-icons/Menu.vue';

interface MenuItem {
  name: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { name: 'Home', path: '/userdashboard' },
  { name: 'Explore', path: '/explore' },
  { name: 'Notification', path: '/notification' },
  { name: 'Write', path: '/new' },
  { name: 'Profile', path: '/profilecreate' },
  { name: 'Analytics', path: '/analytic' },
  { name: 'Logout', path: '/login' },
]

const isMenuOpen = ref<boolean>(false)

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
<template>
    <div>
        <nav >
            <div class="hidden md:block md:space-x-2 mt-4">
              <button class="rounded-full px-6 py-2 bg-white text-sm font-medium">Feed</button>
              <button class="rounded-full px-6 py-2   text-sm text-[#6B7280]">Write</button>
            </div>
            
            <div class="flex px-4 justify-between items-center md:hidden w-full border-b py-2 ">
              <div>
        <NuxtLink class="text-[#4CAF50]  text-2xl font-bold md:hidden" to="/" data-testid="logo">AltDev</NuxtLink>
      </div>

              <div>
                <button @click="toggleMenu" class="md:hidden text-[#333333]">
          <Hamburger/>
        </button>
              </div>
            </div>
            <div class="flex w-full mt-3 font-normal md:font-bold items-center mdd:space-x-4">
  <NuxtLink class="hidden md:block md:text-2xl md:shrink-0 " to="/userdashboard">Your Feed</NuxtLink>
  <div class="border-b md:border-b-0 w-full py-3 space-x-3">
    <button class="md:bg-[#ffffff] px-3 py-1 rounded-md">Latest</button>
    <button class="md:bg-[#ffffff] px-3 py-1 rounded-md">Popular</button>
    <button class="md:bg-[#ffffff] px-3 py-1 rounded-md">Following</button>
  </div>
</div>
            

        </nav>
         <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 bg-white shadow-md rounded-lg w-[95%] mx-auto">
        <div class="flex text-center font-bold text-xl flex-col p-4">
          <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="py-2">{{ item.name }}</NuxtLink>
          
        </div>
    </div>

            
    </div>
   
</template>