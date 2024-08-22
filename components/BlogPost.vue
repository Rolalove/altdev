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
  const postIndex = posts.value.findIndex(p => p.id === postId);
  if (postIndex === -1) return;

  const post = posts.value[postIndex];
  const actionState = action.slice(0, -1) + 'ed' as 'liked' | 'shared' | 'bookmarked';

  if (action === 'likes' || action === 'bookmarks') {
    const newValue = post[actionState] ? post[action] - 1 : post[action] + 1;
    const newState = !post[actionState];

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ [action]: newValue })
      .eq('id', postId)
      .single();

    if (error) console.error(`Error ${action} post:`, error);
    else {
      posts.value[postIndex] = {
        ...posts.value[postIndex],
        [action]: newValue,
        [actionState]: newState
      };
    }
  } else if (action === 'shares') {
    const newValue = post[action] + 1;
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ [action]: newValue })
      .eq('id', postId)
      .single();

    if (error) console.error(`Error ${action} post:`, error);
    else {
      posts.value[postIndex] = {
        ...posts.value[postIndex],
        [action]: newValue,
        [actionState]: true
      };
    }
  }
}

const bookmarkPost = async (postId: number) => {
  const postIndex = posts.value.findIndex(p => p.id === postId);
  if (postIndex === -1) return;

  const post = posts.value[postIndex];
  const newBookmarkedState = !post.bookmarked;

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ bookmarks: newBookmarkedState ? post.bookmarks + 1 : post.bookmarks - 1 })
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error updating bookmark state:', error);
  } else {
    posts.value[postIndex] = {
      ...posts.value[postIndex],
      bookmarked: newBookmarkedState,
      bookmarks: data.bookmarks
    };
  }
};
const sharePost = (postId: number) => {
  const post = posts.value.find(p => p.id === postId);
  if (!post) return;

  const url = `${window.location.origin}/blogdetails/${post.id}`;
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('Post URL copied to clipboard');
      interactWithPost(postId, 'shares');
    })
    .catch((error) => {
      console.error('Failed to copy post URL to clipboard:', error);
    });
};
const likePost = (postId: number) => interactWithPost(postId, 'likes')


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
    <div class="bg-white  rounded-lg shadow-md p-4 mb-6 sm:p-6" v-for="post in posts" :key="post.id">
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
        <NuxtLink :to="`/blogdetails/${post.id}`">{{ post.title }}</NuxtLink>
      </h2>
      <img v-if="post.image_path" :src="post.image_path" alt="Post image" class="mb-4 w-full h-48 object-fit sm:h-64">
      <div v-html="post.content.substring(0, 200) + '...'" class="text-sm sm:text-base"></div>
      <div class="flex justify-between items-center mt-6">
        <button @click="likePost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" :class="post.liked ? 'text-red-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" :fill="post.liked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.likes || 0 }}</span>
        </button>
        <button @click="sharePost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.shares || 0 }}</span>
        </button>
        <NuxtLink :to="`/blogdetails/${post.id}#comments`" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.comments || 0 }}</span>
        </NuxtLink>
        <button @click="bookmarkPost(post.id)" class="flex items-center space-x-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8" :class="post.bookmarked ? 'text-blue-500 fill-current' : 'text-gray-400'" viewBox="0 0 24 24" :fill="post.bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span class="text-sm text-gray-500 sm:text-base">{{ post.bookmarks || 0 }}</span>
        </button>
      </div>
    </div>
  </div>
</template>