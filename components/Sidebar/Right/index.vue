<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()

const trendingTopics = ref([])
const usersToFollow = ref([])

const fetchTrendingTopics = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, likes, bookmarks, shares, comments')
    .order('likes', { ascending: false })
    .order('bookmarks', { ascending: false })
    .order('shares', { ascending: false })
    .order('comments', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching trending topics:', error)
  } else {
    trendingTopics.value = data.map(post => ({
      title: post.title,
      count: `${post.likes + post.bookmarks + post.shares + post.comments} interactions`
    }))
  }
}

const fetchUsersToFollow = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .limit(5)

  if (error) {
    console.error('Error fetching users to follow:', error)
  } else {
    usersToFollow.value = data.map(user => ({
      name: user.username,
      handle: `@${user.username.toLowerCase().replace(/\s+/g, '')}`,
      image: user.avatar_url || '/default-avatar.png',
      id: user.id
    }))
  }
}

onMounted(() => {
  fetchTrendingTopics()
  fetchUsersToFollow()
})

const followUser = async (userId) => {
  // Implement follow logic here
  console.log('Following user:', userId)
}
</script>

<template>
  <div class="flex flex-col">
    <!--Previewcard: Trending Topics -->
    <SidebarRightCard title="Trending Topics">
      <SidebarRightItem v-for="topic in trendingTopics" :key="topic.title">
        <div>
          <h2 class="font-bold text-gray-800 text-md">{{ topic.title }}</h2>
          <p class="text-xs text-gray-400">{{ topic.count }}</p>
        </div>
      </SidebarRightItem>
    </SidebarRightCard>

    <!--Previewcard: Who to follow -->
    <SidebarRightCard title="Who to follow">
      <SidebarRightItem v-for="user in usersToFollow" :key="user.id">
        <div class="flex flex-row justify-between items-center p-2">
          <div class="flex flex-row">
            <img class="w-10 h-10 rounded-full" :src="user.image" :alt="user.name">
            <div class="flex flex-col ml-2">
              <h1 class="text-sm font-bold text-gray-900">{{ user.name }}</h1>
              <p class="text-xs text-gray-400">{{ user.handle }}</p>
            </div>
          </div>
          <div class="flex h-full">
            <button @click="followUser(user.id)" class="px-4 py-2 font-bold text-xs text-white bg-black rounded-full">
              Follow
            </button>
          </div>
        </div>
      </SidebarRightItem>
    </SidebarRightCard>
  </div>
</template>