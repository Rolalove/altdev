<script setup lang="ts">
  const storyItems = [
    {
      title: 'The Altdev Vision',
    image: '/images/vision.jpg',
      description:
        `Altdev was created to provide a text-focused, community-driven platform for authors and readers to connect, discover, and engage with high-quality content.`,
    },
    {
      title: 'Meet the Founders',
       image: '/public/IMG_13434.jpg',
      description:
        `The Altdev team is a group of passionate writers, technologists, and community builders who believe in the power of the written word.`,
    },
    {
      title: `Altdev's Journey`,
      image: '/images/journey.jpg',
      description:
        `From the initial idea to the platform's launch and growth, Altdev has evolved to become a thriving hub for literary enthusiasts.`,
    },
    {
      title: 'Our Values',
     image: '/images/values.jpg',
      description:
        `Altdev's core values of fostering a welcoming community, empowering authors, and prioritizing content quality guide everything we do.`,
    },
  ];
  </script>

<template>
    <div>
        <Navbar/>

    <div class=" mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="space-y-4">
        <div>
          <p class="mt-4 text-xl text-gray-500">
            Discover the vision and journey behind the creation of Altdev.
          </p>
        </div>
  
        <div class="space-y-8 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
          <div v-for="item in storyItems" :key="item.title">
            <div>
              <div class="flex items-center justify-start space-x-3">
                <div class="flex-shrink-0">
                   <img :src="item.image" alt="" class="h-12 w-12 rounded-full" />
                </div>
                <div class="text-lg font-medium leading-6 text-gray-900">
                  {{ item.title }}
                </div>
              </div>
              <div class="mt-4 text-base text-gray-500">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</div>
  </template>
  
  