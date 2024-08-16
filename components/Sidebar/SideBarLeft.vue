<script setup lang="js">
import HomeIcon from 'vue-material-design-icons/HomeAccount.vue';

</script>


<template>
  <div class=" flex flex-col h-[100vh] bg-pink-300">
    <div class="p-2 my-2 bg-red-300 rounded-full hover:bg-blue-500 w-min " :class="transition">
    <Nuxt-link to="/">
        <div class="w-8 h-8">
        <div>AltDev</div>
    </div>
    </Nuxt-link>
    
  </div>
  <sidebartab class="flex">
   
   <HomeIcon/>
   Home

</sidebartab>
<sidebartab>
   
   <HomeIcon/>
   Home

</sidebartab>

<sidebartab>
   
   <HomeIcon/>
   Home

</sidebartab>

<sidebartab>
   
   <HomeIcon/>
   Home

</sidebartab>


 
  </div>
    
</template>