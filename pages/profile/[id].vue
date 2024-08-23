
<template>
  <div v-if="profile" class="container mx-auto mt-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <img :src="profile.avatar_url" alt="Profile avatar" class="w-24 h-24 rounded-full mx-auto mb-4">
      <h1 class="text-2xl font-bold text-center mb-4">{{ profile.username }}</h1>
    </div>
  </div>
</template>