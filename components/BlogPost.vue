<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
    .select(`*`)
    .order('created_at', { ascending: false })
    
  if (error) console.error('Error fetching posts:', error)
  else posts.value = data
}

const likePost = async (postId: number) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ likes: posts.value.find(p => p.id === postId)!.likes + 1 })
    .eq('id', postId)
  
  if (error) console.error('Error liking post:', error)
  else {
    const index = posts.value.findIndex(p => p.id === postId)
    posts.value[index].likes++
  }
}

const sharePost = async (postId: number) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .update({ shares: posts.value.find(p => p.id === postId)!.shares + 1 })
    .eq('id', postId)
  
  if (error) console.error('Error sharing post:', error)
  else {
    const index = posts.value.findIndex(p => p.id === postId)
    posts.value[index].shares++
  }
}

onMounted(() => {
  fetchPosts()
  
  // Set up real-time subscription
  const subscription = supabase
    .channel('public:blog_posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, payload => {
      const { new: newPost, old: oldPost, eventType } = payload
      
      if (eventType === 'INSERT') {
        posts.value.unshift(newPost as Post)
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

  // Unsubscribe when component is unmounted
  onUnmounted(() => {
    subscription.unsubscribe()
  })
})
</script>
<template>
  <div>
    <h1>All Posts</h1>
    <div class="bg-white rounded-lg shadow-md p-6 mb-6" v-for="post in posts" :key="post.id">
     
      <h2 class="text-2xl font-bold text-gray-800 mb-4">
        <NuxtLink :to="`/blogdetails/${post.id}`">{{ post.title }}</NuxtLink>
      </h2>
      <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="mb-4">
      <p>{{ post.content.substring(0, 100) }}...</p>
      <div class="flex justify-between items-center mt-6">
        <button @click="likePost(post.id)" class="bg-blue-500 text-white px-4 py-2 rounded">
          Like ({{ post.likes || 0 }})
        </button>
        <button @click="sharePost(post.id)" class="bg-green-500 text-white px-4 py-2 rounded">
          Share ({{ post.shares || 0 }})
        </button>
        <NuxtLink :to="`/blogdetails/${post.id}#comments`" class="bg-yellow-500 text-white px-4 py-2 rounded">
          Comments ({{ post.comments || 0 }})
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
