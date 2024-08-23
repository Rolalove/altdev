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
  { name: 'Logout', path: '/index' },
]

const isMenuOpen = ref<boolean>(false)

const toggleMenu = (): void => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>
<template>
    <div>
        <nav 
        
            class="flex justify-between  px-5 py-2 border rounded-full w-[95%] mx-auto mt-3 border-black font-bold items-center">
           
            <div>
             
                <NuxtLink class=" text-xl" to="/userdashboard">Feed</NuxtLink>
               
            </div>
            
            <NuxtLink class='hidden md:flex justify-between gap-7 text-lg' to="/new">Write</NuxtLink>
            <button @click="toggleMenu" class="md:hidden text-[#4CAF50]">
          <Hamburger/>
        </button>

        </nav>
         <!-- Mobile menu -->
      <div v-if="isMenuOpen" class="md:hidden mt-4 bg-white shadow-md rounded-lg w-[95%] mx-auto">
        <div class="flex text-center font-bold text-xl flex-col p-4">
          <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="py-2">{{ item.name }}</NuxtLink>
          
        </div>
    </div>

            
    </div>
   
</template>