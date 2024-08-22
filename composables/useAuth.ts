import { ref, onMounted } from 'vue'
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { navigateTo } from 'nuxt/app'

export const useSupabaseAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const loading = ref(true)

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      console.log("Sign-up successful, navigating to dashboard")
      navigateTo("/userdashboard")
      return data
    } catch (error) {
      console.error("Sign-up error:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in with:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      console.log("Sign in successful, navigating to dashboard")
      navigateTo("/userdashboard")
      return data
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigateTo("/")
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  const signInWithOAuth = async (provider: "google" | "github") => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
        redirectTo: `${window.location.origin}/userdasboard`
      },
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error("OAuth sign in error:", error)
      throw error
    }
  }

  const resetPasswordForEmail = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      return data
    } catch (error) {
      console.error("Reset password error:", error)
      throw error
    }
  }

  const updatePassword = async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      })
      if (error) throw error
      return data
    } catch (error) {
      console.error("Update password error:", error)
      throw error
    }
  }

  onMounted(() => {
    supabase.auth.onAuthStateChange(() => {
      loading.value = false
    })
  })

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPasswordForEmail,
    updatePassword,
  }
}
