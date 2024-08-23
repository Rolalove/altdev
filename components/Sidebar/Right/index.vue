<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient,  useSupabaseUser  } from '#imports'


const supabase = useSupabaseClient()
const user = useSupabaseUser()

const trendingTopics = ref([])
const usersToFollow = ref([])
const followedUsers = ref(new Set())

const fetchTrendingTopics = async () => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, title, likes, bookmarks, shares, comments')
    .order('likes', { ascending: false })
    .order('bookmarks', { ascending: false })
    .order('shares', { ascending: false })
    .order('comments', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching trending topics:', error)
  } else {
    trendingTopics.value = data.map(post => ({
      id: post.id,
      title: post.title,
      count: `${post.likes + post.bookmarks + post.shares + post.comments} interactions`
    }))
  }
}

const fetchUsersToFollow = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url')
    .limit(4)

  if (error) {
    console.error('Error fetching users to follow:', error)
  } else {
    usersToFollow.value = data.map(user => ({
      name: user.username || 'Anonymous',
  handle: `@${(user.username || '').toLowerCase().replace(/\s+/g, '')}`,
  image: user.avatar_url || '/default-avatar.png',
  id: user.id
    }))
  }
}
const fetchFollowedUsers = async () => {
  if (user.value) {
    const { data, error } = await supabase
      .from('follows')
      .select('followed_id')
      .eq('follower_id', user.value.id)

    if (!error && data) {
      followedUsers.value = new Set(data.map(follow => follow.followed_id))
    } else {
      console.error('Error fetching followed users:', error)
    }
  }
}

onMounted(() => {
  fetchTrendingTopics()
  fetchUsersToFollow()
  fetchFollowedUsers()
})

const followUser = async (userId) => {
  console.log('Current user:', user.value);
  console.log('User to follow/unfollow:', userId);

  const { data, error } = await supabase
    .from('follows')
    .select('*')
    .eq('follower_id', user.value.id)
    .eq('followed_id', userId);

  if (error) {
    console.error('Error checking follow status:', error);
    return;
  }

  const existingFollow = data && data.length > 0 ? data[0] : null;

  if (!existingFollow) {
    const { error: createFollowError } = await supabase.from('follows').insert({
      follower_id: user.value.id,
      followed_id: userId,
    });

    if (createFollowError) {
      console.error('Error creating follow:', createFollowError);
    } else {
      console.log('Followed user:', userId);
      followedUsers.value.add(userId);
    }
  } else {
    const { error: deleteFollowError } = await supabase
      .from('follows')
      .delete()
      .eq('id', existingFollow.id);

    if (deleteFollowError) {
      console.error('Error deleting follow:', deleteFollowError);
    } else {
      console.log('Unfollowed user:', userId);
      followedUsers.value.delete(userId);
    }
  }
};
</script>

<template>
  <div class="flex flex-col">
    <!--Previewcard: Trending Topics -->
    <SidebarRightCard title="Trending Topics">
      <SidebarRightItem v-for="topic in trendingTopics" :key="topic.title">
        <NuxtLink :to="`/blogdetails/${topic.id}`">
        <div>
          <h2 class="font-bold text-gray-800 text-md">{{ topic.title }}</h2>
          <p class="text-xs text-gray-400">{{ topic.count }}</p>
        </div>
      </NuxtLink>
      </SidebarRightItem>
    </SidebarRightCard>

    <!--Previewcard: Who to follow -->
    <SidebarRightCard title="Altdever to follow">
      <SidebarRightItem v-for="user in usersToFollow" :key="user.id">
        <div class="flex flex-row justify-between items-center p-2">
          <div class="flex flex-row">
            <img class="w-10 h-10 rounded-full" :src="user.image" :alt="user.name">
            <div class="flex flex-col ml-2">
              <h1 class="text-sm font-bold text-gray-900">{{ user.name }}</h1>
              <p class="text-xs text-gray-400">{{ user.handle }}</p>
            </div>
          </div>
          <div class="flex h-full">
            <button @click="followUser(user.id)" 
                    :class="[
                      followedUsers.has(user.id) ? 'bg-[#4CAF50] text-grey-50' : 'bg-[#4CAF50] text-white',
                      'px-4 py-2 font-bold text-xs  rounded-full'
                    ]">
              {{ followedUsers.has(user.id) ? 'Unfollow' : 'Follow' }}
            </button>
          </div>
        </div>
      </SidebarRightItem>
    </SidebarRightCard>
  </div>
</template>