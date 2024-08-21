<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';


const props = defineProps<{
  posts?: Post[];
}>();

const searchText = ref('');
const filteredPosts = ref<Post[]>([]);

watchEffect(() => {
  if (props.posts) {
    filteredPosts.value = props.posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
        post.author_username.toLowerCase().includes(searchText.value.toLowerCase())
        // Add more conditions to search through tags or other fields
      );
    });
  }
});
</script>

<template>
    <div>
  <div class="flex items-center w-full max-w-md mx-auto mb-6">
    <input
      type="text"
      v-model="searchText"
      placeholder="Search posts or users..."
      class="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <button
      class=" hover:bg-blue-600 text-white font-bold"
    >
      Search
    </button>
  </div>

  <div v-if="filteredPosts.length === 0" class="text-center text-gray-500">
    No results found.
  </div>

  <div v-else>
    <div
      v-for="post in filteredPosts"
      :key="post.id"
      class="bg-white rounded-lg shadow-md p-6 mb-6"
    >
      <!-- Render the post component here -->
    </div>
  </div>
</div>
</template>