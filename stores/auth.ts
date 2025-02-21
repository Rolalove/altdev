import { defineStore } from 'pinia'
import { User } from '@supabase/supabase-js'
import type { navigateTo } from 'nuxt/app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async signInWithEmail(email: string, password: string) {
      try {
        this.loading = true
        const client = useSupabaseClient()
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password
        })
        
        if (error) throw error
        this.user = data.user
        navigateTo('/userdashboard')
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async signInWithGithub() {
      try {
        this.loading = true
        const client = useSupabaseClient()
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'github',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) throw error
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async signInWithGoogle() {
      try {
        this.loading = true
        const client = useSupabaseClient()
        const { data, error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        })
        
        if (error) throw error
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async signUp(email: string, password: string) {
      try {
        this.loading = true
        const client = useSupabaseClient()
        const { data, error } = await client.auth.signUp({
          email,
          password
        })
        
        if (error) throw error
        this.user = data.user
        navigateTo('/userdashboard')
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      try {
        const client = useSupabaseClient()
        const { error } = await client.auth.signOut()
        if (error) throw error
        this.user = null
        navigateTo('/login')
      } catch (error: any) {
        this.error = error.message
      }
    }
  }
})

function useSupabaseClient() {
    throw new Error('Function not implemented.')
}
