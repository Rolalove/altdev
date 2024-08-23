<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient,  useSupabaseUser  } from '#imports'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
const user = useSupabaseUser()
const route = useRoute()
const supabase = useSupabaseClient()
const md = new MarkdownIt()



interface Post {
  id: number;
  title: string;
  content: string;
  html_content: string;
  image_path: string;
  likes: number;
  shares: number;
  comments: number;
  bookmarks: number;
  views: number;
  liked: boolean;
  bookmarked: boolean;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

const post = ref<Post | null>(null)
const comments = ref<Comment[]>([])
const newComment = ref('')
const renderedContent = ref('')
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPost = async () => {
  loading.value = true
  error.value = null
  try {
    const { data, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (fetchError) throw fetchError

    // Fetch user interactions
    if (user.value) {
      const { data: interactionData, error: interactionError } = await supabase
        .from('user_interactions')
        .select('liked, bookmarked')
        .eq('post_id', route.params.id)
        .eq('user_id', user.value.id)
        .single()

      if (interactionError && interactionError.code !== 'PGRST116') {
        console.error('Error fetching user interactions:', interactionError)
      }

      post.value = {
        ...data,
        liked: interactionData?.liked || false,
        bookmarked: interactionData?.bookmarked || false
      }
    } else {
      post.value = {
        ...data,
        liked: false,
        bookmarked: false
      }
    }

    renderedContent.value = DOMPurify.sanitize(md.render(post.value.content))
    incrementViews()
  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = err.message || 'An error occurred while fetching the post'
  } finally {
    loading.value = false
  }
}

const incrementViews = async () => {
  if (!post.value) return

  const { error } = await supabase
    .rpc('increment_post_interaction', {
      post_id: post.value.id,
      interaction_type: 'views',
      increment_value: 1
    })

  if (error) console.error('Error incrementing views:', error)
  else {
    post.value.views = (post.value.views || 0) + 1
  }
}
const interactWithPost = async (action: 'likes' | 'shares' | 'bookmarks') => {
  if (!post.value || !user.value) return

  const actionState = action === 'likes' ? 'liked' : action === 'bookmarks' ? 'bookmarked' : null
  const newState = actionState ? !post.value[actionState] : true
  const increment = newState ? 1 : -1

  // Update user_interactions
  if (actionState) {
    await supabase
      .from('user_interactions')
      .upsert({
        user_id: user.value.id,
        post_id: post.value.id,
        [actionState]: newState
      }, {
        onConflict: 'user_id, post_id'
      })
  }

  // Update blog_posts
  const { data, error } = await supabase
    .rpc('increment_post_interaction', {
      post_id: post.value.id,
      interaction_type: action,
      increment_value: increment
    })

  if (error) {
    console.error(`Error ${action} post:`, error)
  } else {
    post.value[action] = data[action]
    if (actionState) {
      post.value[actionState] = newState
    }
  }
}
const likePost = () => interactWithPost('likes')
const sharePost = () => interactWithPost('shares')
const bookmarkPost = () => interactWithPost('bookmarks')

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      id,
      content,
      created_at,
      user_id,
      profiles (username, avatar_url)
    `)
    .eq('post_id', route.params.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
  } else {
    comments.value = data.map(comment => ({
      ...comment,
      user: comment.profiles
    }))
  }
}

const addComment = async () => {
  if (!user.value) {
    console.error('User must be logged in to comment')
    return
  }

  const { data, error } = await supabase
    .from('comments')
    .insert({ 
      post_id: route.params.id, 
      user_id: user.value.id,
      content: newComment.value 
    })

  if (error) {
    console.error('Error adding comment:', error)
  } else {
    await fetchComments()
    newComment.value = ''
  }
}


onMounted(() => {
  fetchPost()
  fetchComments()
})
</script>

<template>
  <div>
    <div v-if="loading" class="max-w-4xl text-center my-auto p-6">
    <p>Loading post...</p>
  </div>
  <div v-else-if="error" class="max-w-4xl mx-auto p-6">
    <p>Error loading post: {{ error }}</p>
  </div>
  <div v-else-if="post" class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-5">{{ post.title }}</h1>
    <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="w-full h-64 object-cover rounded mb-6">
    <div v-html="renderedContent" class="mb-6"></div>
    
    <div class="flex justify-between items-center mb-6">
      <button @click="likePost" class="flex items-center space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="post.liked ? 'text-red-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="text-sm text-gray-500">{{ post.likes || 0 }}</span>
      </button>
      <button @click="sharePost" class="flex items-center space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        <span class="text-sm text-gray-500">{{ post.shares || 0 }}</span>
      </button>
      <button @click="bookmarkPost" class="flex items-center space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="post.bookmarked ? 'text-blue-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" :fill="post.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span class="text-sm text-gray-500">{{ post.bookmarks || 0 }}</span>
      </button>
      <div class="flex items-center space-x-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <span class="text-sm text-gray-500">{{ post.views || 0 }}</span>
      </div>
    </div>

    <div id="comments" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Comments ({{ comments.length }})</h2>
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-100 p-4 rounded mb-4">
  <div class="flex items-center mb-2">
    <img :src="comment.user?.avatar_url || '/default-avatar.png'" alt="User avatar" class="w-8 h-8 rounded-full mr-2">
    <span class="font-bold">{{ comment.user?.username || 'Anonymous' }}</span>
  </div>
  <p>{{ comment.content }}</p>
</div>
      <div class="add-comment mt-6">
        <textarea v-model="newComment" placeholder="Add a comment" class="w-full p-2 border rounded"></textarea>
        <button @click="addComment" class="mt-2 bg-[#4CAF50] text-white px-4 py-2 rounded">Submit</button>
      </div>
    </div>
  </div>
  </div>
</template>