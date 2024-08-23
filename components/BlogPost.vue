<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { marked } from 'marked'
const loading = ref(true)


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
const posts = ref<Post[]>([])
const user = useSupabaseUser()

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


const fetchPosts = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select(`
        *,
        author:profiles(username, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    const postIds = data.map(post => post.id)
    const userInteractions = await fetchUserInteractions(postIds)

    posts.value = data.map(post => ({
      ...post,
      author_id: post.profiles?.id,
      author_username: post.author?.username || 'Anonymous',
      author_avatar: post.author?.avatar_url,
      liked: userInteractions[post.id]?.liked || false,
      bookmarked: userInteractions[post.id]?.bookmarked || false
    }))
  } catch (error) {
    console.error('Error fetching posts:', error)
  } finally {
    loading.value = false
  }
}

const updateUserInteraction = async (postId: number, action: 'liked' | 'bookmarked' | 'viewed', value: boolean) => {
  if (!user.value) return

  const { data, error } = await supabase
    .from('user_interactions')
    .upsert({
      user_id: user.value.id,
      post_id: postId,
      [action]: value
    }, {
      onConflict: 'user_id, post_id'
    })

  if (error) console.error(`Error updating user interaction (${action}):`, error)
}

const interactWithPost = async (postId: number, action: 'likes' | 'bookmarks') => {
  if (!user.value) {
    alert('Please log in to interact with posts')
    return
  }

  const postIndex = posts.value.findIndex(p => p.id === postId)
  if (postIndex === -1) return

  const post = posts.value[postIndex]
  const actionState = action === 'likes' ? 'liked' : 'bookmarked'

  const newState = !post[actionState]
  const increment = newState ? 1 : -1

  // Update user_interactions
  await updateUserInteraction(postId, actionState, newState)

  // Update blog_posts
  const { data, error } = await supabase
    .rpc('increment_post_interaction', {
      post_id: postId,
      interaction_type: action,
      increment_value: increment
    })

  if (error) {
    console.error(`Error updating post ${action}:`, error)
  } else {
    posts.value[postIndex] = {
      ...posts.value[postIndex],
      [action]: (posts.value[postIndex][action] || 0) + increment,
      [actionState]: newState
    }
  }
}

const incrementViews = async (postId: number) => {
  if (!user.value) return

  await updateUserInteraction(postId, 'viewed', true)

  const { data, error } = await supabase
    .rpc('increment_post_interaction', {
      post_id: postId,
      interaction_type: 'views',
      increment_value: 1
    })

  if (error) console.error('Error incrementing views:', error)
  else {
    const postIndex = posts.value.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      posts.value[postIndex].views = data.views
    }
  }
}
const getPreview = (content: string): string => {
  if (!content) return ''
  const html = marked(content)
  const text = html.replace(/<[^>]*>/g, '')

  const preview = text.substring(0, 200)

  return preview + (text.length > 200 ? '...' : '')
}
const likePost = (postId: number) => interactWithPost(postId, 'likes')
const bookmarkPost = (postId: number) => interactWithPost(postId, 'bookmarks')

const sharePost = async (postId: number) => {
  const post = posts.value.find(p => p.id === postId)
  if (!post) return

  const url = `${window.location.origin}/blogdetails/${post.id}`
  try {
    await navigator.clipboard.writeText(url)
    alert('Post URL copied to clipboard')

    const { data, error } = await supabase
      .rpc('increment_post_interaction', {
        post_id: postId,
        interaction_type: 'shares',
        increment_value: 1
      })

    if (error) throw error

    const postIndex = posts.value.findIndex(p => p.id === postId)
    if (postIndex !== -1) {
      posts.value[postIndex].shares = (posts.value[postIndex].shares || 0) + 1
    }
  } catch (error) {
    console.error('Failed to share post:', error)
  }
}
onMounted(() => {
  fetchPosts();

  const subscription = supabase
    .channel('public:blog_posts')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, payload => {
      const { new: newPost, old: oldPost, eventType } = payload;

      if (eventType === 'INSERT') {
        posts.value.unshift({ ...newPost, liked: false, shared: false, bookmarked: false } as Post);
      } else if (eventType === 'UPDATE') {
        const index = posts.value.findIndex(p => p.id === oldPost.id);
        if (index !== -1) {
          posts.value[index] = { ...posts.value[index], ...newPost };
        }
      } else if (eventType === 'DELETE') {
        posts.value = posts.value.filter(p => p.id !== oldPost.id);
      }
    })
    .subscribe();

  onUnmounted(() => {
    subscription.unsubscribe();
  });
});

</script>
<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#4CAF50]"></div>
    </div>
    <div v-else class="bg-white rounded-lg shadow-md p-4 mb-6 sm:p-6" v-for="post in posts" :key="post.id">
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

      <!-- <div v-html="post.content.substring(0, 200) + '...'" class="text-sm sm:text-base mb-4"></div> -->
      <div class="flex justify-between items-center mt-6">
        <button @click="likePost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8"
            :class="post.liked ? 'text-red-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24"
            :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.likes || 0 }}</span>
        </button>
        <button @click="sharePost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.shares || 0 }}</span>
        </button>
        <NuxtLink :to="`/blogdetails/${post.id}#comments`" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.comments || 0 }}</span>
        </NuxtLink>
        <button @click="bookmarkPost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8"
            :class="post.bookmarked ? 'text-blue-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24"
            :fill="post.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.bookmarks || 0 }}</span>
        </button>
        <div class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.views || 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>