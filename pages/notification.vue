<!-- Notifications.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabaseClient } from '#imports'
import { fetchNotifications, markNotificationAsRead } from '@/services/notificationService'

const supabase = useSupabaseClient()
const notifications = ref([])

const loadNotifications = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    notifications.value = await fetchNotifications(user.id)
  }
}

const handleMarkAsRead = async (notificationId: string) => {
  await markNotificationAsRead(notificationId)
  loadNotifications()
}

let subscription
onMounted(async () => {
  await loadNotifications()
  
  subscription = supabase
    .channel('public:notifications')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
      console.log('New notification:', payload)
      loadNotifications()
    })
    .subscribe()
})

onUnmounted(() => {
  if (subscription) supabase.removeChannel(subscription)
})
</script>

<template>
  <div class="notifications">
    <h2>Notifications</h2>
    <ul>
      <li v-for="notification in notifications" :key="notification.id">
        {{ notification.content }}
        <button v-if="!notification.read" @click="handleMarkAsRead(notification.id)">
          Mark as read
        </button>
      </li>
    </ul>
  </div>
</template>