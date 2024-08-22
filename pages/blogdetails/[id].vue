<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
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
// const viewerRef = ref(null)
const renderedContent = ref('')

const fetchPost = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) console.error('Error fetching post:', error)
  else {
    post.value = data
    renderedContent.value = DOMPurify.sanitize(md.render(post.value.content))
    incrementViews()
  
  }
}

const incrementViews = async () => {
  const { error } = await supabase
    .from('blog_posts')
    .update({ views: (post.value?.views || 0) + 1 })
    .eq('id', route.params.id)

  if (error) console.error('Error incrementing views:', error)
}

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*, user:profiles(username, avatar_url)')
    .eq('post_id', route.params.id)
    .order('created_at', { ascending: true })

  if (error) console.error('Error fetching comments:', error)
  else comments.value = data
}

const addComment = async () => {
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: route.params.id, content: newComment.value })

  if (error) console.error('Error adding comment:', error)
  else {
    await fetchComments()
    newComment.value = ''
  }
}

const interactWithPost = async (action: 'likes' | 'shares' | 'bookmarks') => {
  if (!post.value) return

  const newValue = (post.value[action] || 0) + 1
  const { error } = await supabase
    .from('blog_posts')
    .update({ [action]: newValue })
    .eq('id', post.value.id)

  if (error) console.error(`Error ${action} post:`, error)
  else post.value[action] = newValue
}

const likePost = () => interactWithPost('likes')
const sharePost = () => interactWithPost('shares')
const bookmarkPost = () => interactWithPost('bookmarks')

onMounted(() => {
  fetchPost()
  fetchComments()
})
</script>

<template>
  <div v-if="post" class="max-w-4xl mx-auto p-6">
    <h1 class="text-3xl font-bold mb-5">{{ post.title }}</h1>
    <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="w-full h-64 object-cover rounded mb-6">
    <div v-html="renderedContent" class="mb-6"></div>
    
    <div class="flex justify-between items-center mb-6">
      <button @click="likePost(post.id)" class="flex items-center space-x-1">
  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="post.liked ? 'text-red-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
  <span class="text-sm text-gray-500">{{ post.likes || 0 }}</span>
</button>
<button @click="sharePost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span class="text-sm text-gray-500">{{ post.shares || 0 }}</span>
        </button>
      <button @click="bookmarkPost" class="bg-purple-500 text-white px-4 py-2 rounded">
        Bookmark ({{ post.bookmarks || 0 }})
      </button>
      <span class="text-gray-600">Views: {{ post.views || 0 }}</span>
    </div>

    <div id="comments" class="mt-8">
      <h2 class="text-2xl font-bold mb-4">Comments ({{ comments.length }})</h2>
      <div v-for="comment in comments" :key="comment.id" class="bg-gray-100 p-4 rounded mb-4">
        <div class="flex items-center mb-2">
          <img :src="comment.user.avatar_url" alt="User avatar" class="w-8 h-8 rounded-full mr-2">
          <span class="font-bold">{{ comment.user.username }}</span>
        </div>
        <p>{{ comment.content }}</p>
      </div>
      <div class="add-comment mt-6">
        <textarea v-model="newComment" placeholder="Add a comment" class="w-full p-2 border rounded"></textarea>
        <button @click="addComment" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </div>
    </div>
  </div>
</template>
