<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSupabaseClient, useSupabaseUser } from '#imports'
import Chart from 'chart.js/auto'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const analytics = ref({
  followers: 0,
  following: 0,
  likes: 0,
  bookmarks: 0,
  posts: 0,
  comments: 0,
  shares: 0
})

const fetchUserStats = async () => {
  if (!user.value) {
    console.error('No user is signed in')
    return
  }

  const userId = user.value.id

  // Fetch followers
  const { count: followers, error: followersError } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('followed_id', userId)
  
  if (followersError) console.error('Error fetching followers:', followersError)
  else analytics.value.followers = followers || 0

  // Fetch following
  const { count: following, error: followingError } = await supabase
    .from('followers')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)
  
  if (followingError) console.error('Error fetching following:', followingError)
  else analytics.value.following = following || 0

  // Fetch likes, posts, comments, shares
  let { data: userStats, error: userStatsError } = await supabase
    .from('user_stats')
    .select('likes, posts, comments, shares')
    .eq('user_id', userId)
    .single()
  
  if (userStatsError) {
    if (userStatsError.code === 'PGRST116') {
      // No data found, insert default values
      const { data: insertData, error: insertError } = await supabase
        .from('user_stats')
        .insert({ user_id: userId, likes: 0, posts: 0, comments: 0, shares: 0 })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting user stats:', insertError)
        userStats = { likes: 0, posts: 0, comments: 0, shares: 0 }
      } else {
        userStats = insertData
      }
    } else {
      console.error('Error fetching user stats:', userStatsError)
      userStats = { likes: 0, posts: 0, comments: 0, shares: 0 }
    }
  }

  analytics.value.likes = userStats.likes
  analytics.value.posts = userStats.posts
  analytics.value.comments = userStats.comments
  analytics.value.shares = userStats.shares

  // Fetch bookmarks
  const { count: bookmarks, error: bookmarksError } = await supabase
    .from('bookmarks')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
  
  if (bookmarksError) console.error('Error fetching bookmarks:', bookmarksError)
  else analytics.value.bookmarks = bookmarks || 0
}

const createChart = () => {
  const ctx = document.getElementById('analyticsChart')
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(analytics.value),
      datasets: [{
        label: 'User Analytics',
        data: Object.values(analytics.value),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(199, 199, 199, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(199, 199, 199, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

onMounted(async () => {
  if (user.value) {
    await fetchUserStats()
    createChart()
  } else {
    console.error('No user is signed in')
  }
})
</script>
<template>
  <div>
  <div class="flex w-[100%] px-5 h-screen">
    <div><SidebarLeft /></div>
    <div class="bg-yellow ml-16 w-[80%]">
      <h1 class="mt-5 text-3xl font-medium">Your Analytics</h1>
      <div v-if="user" class='grid bg-yellow grid-cols-3 mt-5 mx-auto grid-row-3 gap-4 max-md:flex max-md:flex-col'>
        <div v-for="(value, key) in analytics" :key="key" class="bg-white w-full h-[22vh] rounded-md shadow-lg p-4">
          <h2 class="text-xl font-bold capitalize">{{ key }}</h2>
          <p class="text-3xl mt-2">{{ value }}</p>
        </div>
      </div>
      <div v-else class="mt-5 text-xl">
        Please sign in to view your analytics.
      </div>
      <div v-if="user" class="mt-8 bg-white p-4 rounded-md shadow-lg">
        <canvas id="analyticsChart"></canvas>
      </div>
    </div>
  </div>
</div>
</template>