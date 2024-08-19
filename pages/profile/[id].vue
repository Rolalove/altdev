<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSupabaseClient } from '#imports'

const route = useRoute()
const supabase = useSupabaseClient()
const profile = ref(null)

onMounted(async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) console.error('Error fetching profile:', error)
  else profile.value = data
})
</script>

<template>
  <div v-if="profile" class="container mx-auto mt-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <img :src="profile.avatar_url" alt="Profile avatar" class="w-24 h-24 rounded-full mx-auto mb-4">
      <h1 class="text-2xl font-bold text-center mb-4">{{ profile.username }}</h1>
      <!-- Add more profile information here -->
    </div>
  </div>
</template>