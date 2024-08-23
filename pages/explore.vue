<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useDebounceFn } from '@vueuse/core'
import { marked } from 'marked'

interface Post {
  id: number;
  title: string;
  image_path: string;
  content: string;
  likes: number;
  shares: number;
  comments: number;
  bookmarks: number;
  views: number;
  created_at: string;
  author_id: string;
  author_username: string;
  author_avatar: string;
  liked: boolean;
  bookmarked: boolean;
}

const supabase = useSupabaseClient()
const searchTerm = ref('')
const searchResults = ref<Post[]>([])
const loading = ref(false)
const user = useSupabaseUser()

const fetchSearchResults = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles(username, avatar_url)
      `)
      .or(`title.ilike.%${searchTerm.value}%,content.ilike.%${searchTerm.value}%`)
      .order('created_at', { ascending: false })

    if (error) throw error

    const postIds = data.map(post => post.id)
    const userInteractions = await fetchUserInteractions(postIds)

    searchResults.value = data.map(post => ({
      ...post,
      author_id: post.profiles?.id,
      author_username: post.author?.username || 'Anonymous',
      author_avatar: post.author?.avatar_url,
      liked: userInteractions[post.id]?.liked || false,
      bookmarked: userInteractions[post.id]?.bookmarked || false
    }))
  } catch (error) {
    console.error('Error fetching search results:', error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(fetchSearchResults, 300)

const fetchUserInteractions = async (postIds: number[]) => {
  if (!user.value) return {}

  const { data, error } = await supabase
    .from('user_interactions')
    .select('post_id, liked, bookmarked, viewed')
    .eq('user_id', user.value.id)
    .in('post_id', postIds)

  if (error) {
    console.error('Error fetching user interactions:', error)
    return {}
  }

  return data.reduce((acc, interaction) => {
    acc[interaction.post_id] = interaction
    return acc
  }, {})
}

const getPreview = (content: string): string => {
  if (!content) return ''
  const html = marked(content)
  const text = html.replace(/<[^>]*>/g, '')

  const preview = text.substring(0, 200)

  return preview + (text.length > 200 ? '...' : '')
}


</script>


<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Search Posts</h1>
    <div class="mb-6">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search posts..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
        @input="debouncedSearch"
      />
    </div>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#4CAF50]"></div>
    </div>
    <div v-else-if="searchResults.length === 0" class="text-center text-gray-500">
      No posts found matching your search.
    </div>
    <div v-else class="space-y-6">
      <div v-for="post in searchResults" :key="post.id" class="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div class="flex items-center mb-4">
          <img :src="post.author_avatar" alt="Author avatar" class="w-8 h-8 rounded-full mr-3 sm:w-10 sm:h-10 sm:mr-4">
          <div>
            <NuxtLink :to="`/profile/${post.author_id}`" class="font-bold hover:underline">
              {{ post.author_username }}
            </NuxtLink>
            <p class="text-sm text-gray-500">{{ new Date(post.created_at).toLocaleString() }}</p>
          </div>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-4 sm:text-2xl">
          <NuxtLink :to="`/blogdetails/${post.id}`" @click="incrementViews(post.id)">{{ post.title }}</NuxtLink>
        </h2>
        <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="mb-4 w-full h-48 object-cover sm:h-64">
        <div v-html="getPreview(post.content)" class="text-sm sm:text-base mb-4"></div>
      </div>
    </div>
  </div>
</template>

