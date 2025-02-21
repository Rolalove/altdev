<script setup lang='ts'>
// import { useSupabaseAuthClient, useSupabaseUser, navigateTo } from '#imports'
import SvgIcon from '@jamescoyle/vue-icon'
import { ref, computed } from 'vue'
import { mdiEyeOutline } from '@mdi/js'
import { mdiEyeOffOutline } from '@mdi/js'
import { useAuthStore } from '~/stores/auth' // Import the auth store

const authStore = useAuthStore() // Initialize the auth store
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

const togglePasswordVisibility = (field: 'password') => {
    if (field === 'password') {
        showPassword.value = !showPassword.value
    }
}

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.value)
})

const isPasswordValid = computed(() => {
  return password.value.length >= 8
})

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value
})

const handleSignIn = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Please correct the form errors before submitting.'
    return
  }
  isLoading.value = true

  try {
    await authStore.signInWithEmail(email.value, password.value)
    if (authStore.error) {
      errorMessage.value = authStore.error
    }
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

const signInWithGoogle = async () => {
  try {
    await authStore.signInWithGoogle()
  } catch (error) {
    errorMessage.value = error.message
  }
}

const signInWithGithub = async () => {
  try {
    await authStore.signInWithGithub()
  } catch (error) {
    errorMessage.value = error.message
  }
}

const forgotPassword = async () => {
  if (!isEmailValid.value) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  try {
    const client = useSupabaseAuthClient()
    const { error } = await client.auth.resetPasswordForEmail(email.value)
    if (error) throw error
    alert('Password reset instructions sent to your email')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class=" ">
   <div class="flex px-4 lg:px-0 justify-center items-center min-h-screen bg-gradient-to-br from-white to-green-50">
    <div class="w-full lg:max-w-3xl md:max-w-xl bg-white rounded-3xl shadow-lg gap-x-6  flex min-h-[500px]">
      <div class="w-full px-4 lg:w-1/2 lg:pl-10 py-4 lg:px-0">
       <div class="max-w-md mx-auto w-full">
        <NuxtLink class="text-[#4CAF50] text-2xl font-bold " to="/" data-testid="logo">AltDev</NuxtLink>
        <h3 class="text-3xl font-bold text-[#111111] mt-3">Welcome Back!</h3>
        <p class="text-[#666666] text-base">Sign in to continue your development journey</p>
        <form @submit.prevent="handleSignIn" class="block">
          <div>
            <input 
              type="email" 
              v-model="email" 
              class="w-[100%] h-10 rounded-md bg-[#f8f9fa] text- focus:outline-none border-[#e0e0e0] text-[#666666] border mt-5 py-3 px-3"
              placeholder="Enter your Email" 
              required
            >
            <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
          </div>

          <div class='relative w-full '>
            <input 
              v-model="password" 
              :type='showPassword ? "text" : "password"' 
              class=" bg-[#f8f9fa] border-[#e0e0e0] text-[#666666] w-full h-10 py-2 focus:outline-none rounded-md border mt-5 pl-4"
              placeholder="Enter Your Password" 
              required
            >
            <button 
              type="button" 
              class="absolute inset-y-10 right-2 flex items-center"
              @click="togglePasswordVisibility('password')"
            >
              <SvgIcon v-if="!showPassword" size="24" type="mdi" :path="mdiEyeOutline" />
              <SvgIcon v-else size="24" type="mdi" :path="mdiEyeOffOutline" />
            </button>
          </div>
          
          <p v-if="password && !isPasswordValid" class="text-red-500 text-center text-sm mt-1">
            Password must be at least 8 characters long.
          </p>
          
          <div class="mt-2 text-right">
            <a class="text-[#4CAF50] text-sm font-medium" href="#" @click.prevent="forgotPassword">
              Forgot Password?
            </a>
          </div>
         
          <button 
            type="submit" 
            class="w-full h-10 rounded-md text-white bg-[#4CAF50] py-1 text-base font-bold mt-2"
            :disabled="!isFormValid || isLoading || authStore.loading"
          >
            <span v-if="!isLoading && !authStore.loading">Sign In</span>
            <span v-else>Signing In...</span>
          </button>
          
          <p v-if="errorMessage || authStore.error" class="text-red-500 text-center mt-2">
            {{ errorMessage || authStore.error }}
          </p>
        </form>
        
        <div class="container">
          <p class="title text-center mt-3 max-md:text-[10px]">
            or continue with
          </p>
        </div>
        
        <section class="flex justify-between gap-x-6 mt-3">
          <div class="w-full rounded-md flex items-center justify-center border-[#e0e0e0] border py-2 text-sm font-semibold">
            <img src="/public/logos_google-icon.svg" alt="Google logo" />
            <button 
              @click.prevent="signInWithGoogle" 
              class="ml-2"
              :disabled="authStore.loading"
            >
              Google
            </button>
          </div>
          <div class="w-full rounded-md flex items-center justify-center border text-sm py-2 font-semibold">
            <img src="/public/icon-park_github.svg" alt="Github logo" />
            <button 
              @click.prevent="signInWithGithub" 
              class="ml-2"
              :disabled="authStore.loading"
            >
              Github
            </button>
          </div>  
        </section>
        
        <div>
          <p class="text-sm text-center mt-6">
            Not registered yet?
            <span class="text-[#4CAF50] font-medium">
              <NuxtLink to="/signup">Create an Account</NuxtLink>
            </span>
          </p>
        </div>
       </div>
      </div>
      
      <div class="hidden lg:flex lg:w-1/2 lg:bg-[#f8f9fa] lg:pr-6 lg:rounded-3xl lg:justify-center lg:items-center">
        <Motivation />
      </div>
    </div>
   </div>
  </div>
</template>

<style lang="css" scoped>
.title {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  column-gap: 0.5rem;
}

.title::before,
.title::after {
  content: "";
  height: 1px;
  background-color: black;
  display: block;
}
</style>