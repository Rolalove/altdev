<template >
    <div class='min-h-screen '>
        <Navbar/>
        <div class="flex-grow container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class='w-full md:w-[55%] px-5 mb-8 md:mb-0'>
          <div class="text-2xl md:text-4xl font-bold text-center md:text-left">
            <h1 class="mt-4 md:mt-8">Level Up Your Cred</h1> 
            <p class="mt-2 text-center md:mt-3">&</p>
            <h1 class="mt-2 md:mt-3 md:text-right">Write Like a Pro on AltDev</h1>
          </div>
          <p class="text-lg md:text-xl mt-6 md:mt-12 text-center text-[#408a43]">
            Craft Flawless Docs, Masterful Code, and Insightful Posts<br>
            Join the Community & Elevate Your Voice
          </p>
          <button class='mt-8 md:mt-14 mx-auto px-5 py-3 border rounded-full block text-lg font-bold bg-[#408a43] '>
            <NuxtLink to="/login/signup">Sharpen Your skills Now</NuxtLink>
          </button>
        </div>
        <div class='w-full md:w-[45%] rounded-3xl'>
          <!-- Placeholder for image -->
          <div class="bg-gray-300 h-64 md:h-auto rounded-3xl"></div>
        </div>
      </div>
    </div>
    </div>
</template>
