<script setup lang="ts">
import { ref } from 'vue'
import { useSupabaseClient } from '#imports'

interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: number
          title: string
          content: string
          html_content: string
          image_path: string | null
          author_id: string
          created_at: string
        }
        Insert: {
          title: string
          content: string
          html_content: string
          image_path?: string | null
          author_id: string
        }
      }
    }
  }
}

const supabase = useSupabaseClient<Database>()
const title = ref<string>('')
const content = ref<string>('')
const htmlContent = ref<string>('')
const imageFile = ref<File | null>(null)
const imageUrl = ref<string>('')

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

    const { data: responseData, error } = await supabase
      .from('blog_posts')
      .insert({
        title: title.value,
        content: content.value,
        html_content: htmlContent.value,
        image_path,
        author_id: user.id,
      })

    if (error) throw error

    title.value = ''
    content.value = ''
    htmlContent.value = ''
    imageFile.value = null
    imageUrl.value = ''
    alert('Post created successfully!')
    await navigateTo('/userdashboard')
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
        <h1 class="text-[#408a43] text-2xl font-bold">Altdev</h1>
        <p class="ml-5 text-lg">New Post alert</p>
      </div>
      <div></div>
    </nav>
    
    <div class="mt-2 w-[70%] mx-auto">
      <div class="flex items-center mb-2">
        <input type="file" accept="image/*" @change="onImageChange" />
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="w-20 h-10 rounded-full">
      </div>
      <div class="flex items-center mb-4">
        <input v-model="title" type="text" placeholder="Title" class="flex-1 border p-1 rounded">
      </div>
      <ClientOnly>
        <ToastuiEditor
          v-model="content"
          @htmlContent="htmlContent = $event"
        />
      </ClientOnly>
      <div class="text-right mt-2">
        <button @click='handlePost' class='px-10 text-lg font-bold border rounded-full py-2 bg-[#408a43]'>
          Post
        </button>
      </div>
    </div>
  </div>
</template>