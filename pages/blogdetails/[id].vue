<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useRoute } from 'vue-router'
import { Viewer } from '@toast-ui/editor'
const supabase = useSupabaseClient()
const route = useRoute()

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
const viewerRef = ref(null)

const fetchPost = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', route.params.id)
    .single()

  if (error) console.error('Error fetching post:', error)
  else {
    post.value = data
    incrementViews()
    nextTick(() => {
      if (viewerRef.value) {
        viewerRef.value.invoke('setMarkdown', post.value.content)
      }
    })
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
    <h1 class="text-3xl font-bold mb-4">{{ post.title }}</h1>
    <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="w-full h-64 object-cover mb-6">
    <Viewer ref="viewerRef" class="mb-6" />
    
    <div class="flex justify-between items-center mb-6">
      <button @click="likePost" class="bg-blue-500 text-white px-4 py-2 rounded">
        Like ({{ post.likes || 0 }})
      </button>
      <button @click="sharePost" class="bg-green-500 text-white px-4 py-2 rounded">
        Share ({{ post.shares || 0 }})
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