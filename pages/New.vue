<script setup lang="ts">
import { useSupabaseClient } from '#imports'

interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: number
          title: string
          content: string 
          image_path: string | null
          author_id: string
          author_username: string
          author_avatar: string
          created_at: string
          tags: string[]
        }
        Insert: {
          title: string
          content: string 
          image_path?: string | null
          author_id: string
          author_username: string
          author_avatar: string
          tags: string[]
        }
      }
    }
  }
}
const supabase = useSupabaseClient<Database>()
const title = ref<string>('')
const content = ref<string>('')
const tags = ref<string>('')
const imageFile = ref<File | null>(null)
const imageUrl = ref<string>('')
const editorRef = ref(null)


const onImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    imageFile.value = file
    imageUrl.value = URL.createObjectURL(file)
  }
}

const handlePost = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('User not authenticated')

    let image_path: string | null = null
    if (imageFile.value) {
      const fileExt = imageFile.value.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { data: storageData, error: storageError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, imageFile.value)

      if (storageError) throw storageError

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      image_path = publicUrl
    }
  
    const markdownContent = editorRef.value?.getMarkdown() || ''
    const currentDate = new Date().toISOString()
    const { data: responseData, error } = await supabase
      .from('blog_posts')
      .insert({
        title: title.value,
        content: markdownContent,
        image_path,
        tags: tags.value.split(',').map(tag => tag.trim()),
        author_id: user.id,
        author_username: user.user_metadata.username || user.email?.split('@')[0] || 'Anonymous',
        author_avatar: user.user_metadata.avatar_url,
        created_at: currentDate
      })
    if (error) throw error

    
    title.value = ''
    content.value = ''
    tags.value = ''
    imageFile.value = null
    imageUrl.value = ''
    alert('Post created successfully!')
     navigateTo('/userdashboard')
  } catch (error) {
    console.error('Error creating post: ', error)
    alert('Failed to create post. Please try again.')
  }
}
</script>

<template>
  <div>
    <nav>
      <div class="flex px-10 py-2 items-center">
        <h1 class="text-[#4CAF50] text-2xl font-bold">Altdev</h1>
        <p class="ml-10 text-lg">New Post alert</p>
      </div>
      <div></div>
    </nav>
    
    <div class="mt-1 w-[70%] mx-auto">
      <div class="flex items-center mb-2">
        <input type="file" accept="image/*" @change="onImageChange" />
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="w-20 h-10 rounded-full">
      </div>
      <div class="flex items-center mb-4">
        <input v-model="title" type="text" placeholder="Title" class="flex-1 border p-1 rounded">
      </div>
      <input v-model='tags' placeholder='Tags (comma-seperated)' class="flex-1 border mb-2 w-full p-1 rounded"/>
      <ClientOnly>
        <ToastuiEditor  ref="editorRef"
    v-model="content"
  />

  </ClientOnly>
     
      <div class="text-right mt-2">
        <button @click='handlePost' class='px-10 text-lg font-bold border text-white rounded-full py-2 bg-[#4cAF50]'>
          Post
        </button>
      </div>
    </div>
  </div>
</template>