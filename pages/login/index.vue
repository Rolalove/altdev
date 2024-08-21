<script setup lang='ts'>
import { useSupabaseAuth } from '@/composables/useAuth'
import {ref, computed} from 'vue'
const { signIn, signInWithOAuth, resetPasswordForEmail } = useSupabaseAuth()

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
    await signIn(email.value, password.value)
  } catch (error) {
    errorMessage.value = error.message
  }finally {
    isLoading.value = false
  }
}

const signInWithGoogle = () => signInWithOAuth('google')
const signInWithGithub = () => signInWithOAuth('github')

const forgotPassword = async () => {
  if (!isEmailValid.value) {
    errorMessage.value = 'Please enter a valid email address.'
    return
  }

  try {
    await resetPasswordForEmail(email.value)
    alert('Password reset instructions sent to your email')
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

<template>
  <div class="flex w-[100%] h-[80vh] px-10 mt-5 max-lg:flex-col">
    <div class="w-[55%] max-lg:w-[100%] max-lg:mx-auto max-lg:my-auto">
      <div class="h-fit bg-white mx-auto  shadow-2xl px-6 py-10">
        <h3 class="text-3xl text-center font-bold py-2">Hello <span>Altdevers</span>!</h3>
        <h3 class="text-xl text-center font-bold">Welcome Back</h3>
        <form @submit.prevent="handleSignIn" class="block">
          <div>
            <input type="email" v-model="email" class="w-[100%] focus:outline-none h-[5vh] border mt-5 py-3 px-1"
              placeholder="Enter Email" required>
            <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
          </div>

          <div class='relative'>
            <input v-model="password" :type='showPassword ? "text" : "password"' class="w-[100%] h-[5vh] focus:outline-none border mt-5 pr-10 py-2 px-1" type="password"
              placeholder="Enter Your Password" required>
              <button type="button" class="absolute right-3 mt-2.5 top-1/2 transform -translate-y-1/2"
                            @click="togglePasswordVisibility('password')">
                            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24">
                                </path>
                                <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                        </button>
            <p v-if="password && !isPasswordValid" class="text-red-500 text-center text-sm mt-1">Password must be at least 8
              characters long.</p>
          </div>
           <div class="text-right"><a class=" mt-6 text-[#4CAF50] text-sm font-medium" href="#" @click.prevent="forgotPassword">Forgot
            Password?</a></div>
         
          <button type="submit" class="w-full rounded text-white bg-[#4CAF50] py-1 text-lg font-semibold mt-2"
            :disabled="!isFormValid || isLoading">
            <span v-if="!isLoading">Sign In</span>
  <span v-else>Signing In...</span>
            </button>
          <p v-if="errorMessage" class="text-red-500 text-center mt-2">{{ errorMessage }}</p>
        </form>
        <div class="container">
          <p class="title text-center mt-3 max-md:text-[10px]">
            or continue with
          </p>
        </div>
        <div class="w-full flex items-center justify-center rounded border py-2 mt-3 text-sm font-semibold">
          <img src="/public/logos_google-icon.svg" alt="Google logo" />
          <button @click.prevent="signInWithGoogle" class="ml-2">
            Sign in with Google
          </button>
        </div>
        <div class="w-full flex items-center justify-center rounded border mt-3 text-sm py-2 font-semibold">
          <img src="/public/icon-park_github.svg" alt="Github logo" />
          <button @click.prevent="signInWithGithub" class="ml-2">
            Sign in with Github
          </button>
        </div>
        <div>
          <p class="text-sm text-center mt-3">
            Not registered yet?
            <span class="text-[#4CAF50] font-medium">
              <NuxtLink to="/login/signup">Create an Account</NuxtLink>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div class="w-[45%] my-auto px-10 max-lg:hidden">
      <Motivation />
    </div>
  </div>
</template>

<style scoped>
.body {
  background-color: pink;
}

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