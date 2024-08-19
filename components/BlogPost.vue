<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabaseClient } from '#imports'



interface Post {
  id: number;
  title: string;
  image_path: string;
  content: string;
  likes: number;
  shares: number;
  comments: number;
  bookmarks: number;
  created_at: string;
  author_username: string;
  author_avatar: string;
  liked: boolean;
  shared: boolean;
  bookmarked: boolean;
}

const supabase = useSupabaseClient()
const posts = ref<Post[]>([])

const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      *,
      author:profiles(username, avatar_url)
    `)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching posts:', error)
  else {
    posts.value = data.map(post => ({
      ...post,
      author_id: post.profiles?.id,
      author_username: post.author?.username || 'Anonymous',
      author_avatar: post.author?.avatar_url,
      liked: false,
      shared: false,
      bookmarked: false
    }))
  }
}

const interactWithPost = async (postId: number, action: 'likes' | 'shares' | 'bookmarks') => {
  const post = posts.value.find(p => p.id === postId)!
  const newValue = post[action] + 1
  const actionState = action.slice(0, -1) + 'ed' as 'liked' | 'shared' | 'bookmarked'

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ [action]: newValue })
    .eq('id', postId)

  if (error) console.error(`Error ${action} post:`, error)
  else {
    post[action] = newValue
    post[actionState] = true
  }
}

const likePost = (postId: number) => interactWithPost(postId, 'likes')
const sharePost = (postId: number) => interactWithPost(postId, 'shares')
const bookmarkPost = (postId: number) => interactWithPost(postId, 'bookmarks')

onMounted(() => {
  fetchPosts()

  const subscription = supabase
    .channel('public:blog_posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, payload => {
      const { new: newPost, old: oldPost, eventType } = payload

      if (eventType === 'INSERT') {
        posts.value.unshift({...newPost, liked: false, shared: false, bookmarked: false} as Post)
      } else if (eventType === 'UPDATE') {
        const index = posts.value.findIndex(p => p.id === oldPost.id)
        if (index !== -1) {
          posts.value[index] = { ...posts.value[index], ...newPost }
        }
      } else if (eventType === 'DELETE') {
        posts.value = posts.value.filter(p => p.id !== oldPost.id)
      }
    })
    .subscribe()

  onUnmounted(() => {
    subscription.unsubscribe()
  })
})
</script>

<template>
  <div>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6" v-for="post in posts" :key="post.id">
      <div class="flex items-center mb-4">
        <img :src="post.author_avatar" alt="Author avatar" class="w-10 h-10 rounded-full mr-4">
        <div>
          <NuxtLink :to="`/profile/${post.author_id}`" class="font-bold hover:underline">
            {{ post.author_username }}
          </NuxtLink>
          <p class="text-sm text-gray-500">{{ new Date(post.created_at).toLocaleString() }}</p>
        </div>
      </div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        <NuxtLink :to="`/blogdetails/${post.id}`">{{ post.title }}</NuxtLink>
      </h2>
      <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="mb-4 w-full h-64 object-cover">
      <div v-html="post.content.substring(0, 200) + '...'"></div>
      <div class="flex justify-between items-center mt-6">
        <button @click="likePost(post.id)" class="flex items-center space-x-1 px-4 py-2 rounded" :class="post.liked ? 'bg-blue-500 text-white' : 'bg-gray-200'">
          <!-- <svg-icon :path="mdiThumbUp" :size="24" /> -->
          <span>{{ post.likes || 0 }}</span>
        </button>
        <button @click="sharePost(post.id)" class="flex items-center space-x-1 px-4 py-2 rounded" :class="post.shared ? 'bg-green-500 text-white' : 'bg-gray-200'">
          <!-- <svg-icon :path="mdiShare" :size="24" /> -->
          <span>{{ post.shares || 0 }}</span>
        </button>
        <button @click="bookmarkPost(post.id)" class="flex items-center space-x-1 px-4 py-2 rounded" :class="post.bookmarked ? 'bg-purple-500 text-white' : 'bg-gray-200'">
          <!-- <svg-icon :path="mdiBookmark" :size="24" /> -->
          <span>{{ post.bookmarks || 0 }}</span>
        </button>
        <NuxtLink :to="`/blogdetails/${post.id}#comments`" class="flex items-center space-x-1 px-4 py-2 rounded bg-yellow-500 text-white">
          <!-- <svg-icon :path="mdiComment" :size="24" /> -->
          <span>{{ post.comments || 0 }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
