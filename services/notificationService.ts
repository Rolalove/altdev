// services/notificationService.ts
import { useSupabaseClient } from '#imports'

const supabase = useSupabaseClient()

export const createNotification = async (userId: string, content: string) => {
  const { error } = await supabase
    .from('notifications')
    .insert({ user_id: userId, content })
  if (error) console.error('Error creating notification:', error)
}

export const fetchNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) console.error('Error fetching notifications:', error)
  return data || []
}

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
  if (error) console.error('Error marking notification as read:', error)
}