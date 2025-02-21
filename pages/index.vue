<script setup lang="ts">
import SvgIcon from '@jamescoyle/vue-icon';
import { mdiArrowRight } from '@mdi/js';
import { mdiLinkedin } from '@mdi/js';
import { mdiGoogle } from '@mdi/js';
import { mdiAlphaX } from '@mdi/js';
import { mdiFacebook } from '@mdi/js';
</script>
<template>
  <section class="min-h-screen bg-gradient-to-b from-white to-gray-50">
    <Navbar />
    <div class=" container mx-auto w-[90%]">
      <div class="py-8 mt-8   flex justify-around   bg-[#ffffff] rounded-lg shadow-md">
        <div class='px-4 lg:px-0 '>
            <h1 class=" font-bold text-3xl lg:text-4xl text-[#333333] mb-4">Level Up Your Developer Cred</h1>
          <div class="text-[#666666] space-y-2">
          <p class="text-base lg:text-xl">Join a community of 200K+ developers crafting</p>
          <p class="text-base lg:text-xl">flawless docs, sharing code, and publishing</p>
          <p class="text-base lg:text-xl">insightful articles.</p>
          </div>
          <button class='mt-8 md:mt-4 px-4 py-1 border flex items-center justify-center gap-x-1 rounded-full text-[#ffffff] text-base lg:text-lg font-bold bg-[#4CAF50] '>
            <NuxtLink to="/signup">Start Writing  </NuxtLink>
            <SvgIcon type="mdi" :path="mdiArrowRight" />
          </button>
          <div>
            <p class="text-sm mt-6 mb-3 text-[#888888]">Trusted by developers from</p>
            <div class="mt-1 flex items-center gap-x-2">
              <SvgIcon size="24" type="mdi" :path="mdiLinkedin" />
              <SvgIcon size="20" type="mdi" :path="mdiGoogle" />
              <SvgIcon size="24" type="mdi" :path="mdiFacebook" />
            </div>
          </div>
        </div>
          <Terminal/>
        </div>
      </div>
      <SharedComponentsTrending/>
      <SharedComponentsFooter/>
  </section>
  
   
</template>
<style lang="css">
body{
  font-family: "Roboto", serif;
}
</style>
