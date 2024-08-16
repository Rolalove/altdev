<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { useRoute } from 'vue-router'

const supabase = useSupabaseClient()
const route = useRoute()
const post = ref<{ id: number | null; content: string; title: string ; html_content:string}>(null)
const comments = ref([])
const newComment = ref('')

const fetchPost = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', route.params.id)
    .single()
  
  if (error) console.error('Error fetching post:', error)
  else post.value = data
}

const fetchComments = async () => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
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
    comments.value.push(data[0])
    newComment.value = ''
  }
}

onMounted(() => {
  fetchPost()
  fetchComments()
})
</script>

<template>
  <div v-if="post">
    <h1>{{ post.title }}</h1>
    <img v-if="post.image_path" :src="post.image_path" alt="Post image" />
    <div v-html="post.html_content"></div>
    <div class="post-actions">
      <button @click="likePost(post.id)">Like ({{ post.likes || 0 }})</button>
      <button @click="sharePost(post.id)">Share ({{ post.shares || 0 }})</button>
    </div>
    <div id="comments">
      <h2>Comments</h2>
      <div v-for="comment in comments" :key="comment.id" class="comment">
        <p>{{ comment.content }}</p>
      </div>
      <div class="add-comment">
        <textarea v-model="newComment" placeholder="Add a comment"></textarea>
        <button @click="addComment">Submit</button>
      </div>
    </div>
  </div>
</template>