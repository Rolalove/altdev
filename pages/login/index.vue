<script setup lang='ts'>
import { useSupabaseAuth } from '@/composables/useAuth'

const { signIn, signInWithOAuth, resetPasswordForEmail } = useSupabaseAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

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
      <div class="h-fit bg-white mx-auto text-center shadow-2xl px-6 py-10">
        <h3 class="text-3xl font-bold py-2">Hello <span>Altdevers</span>!</h3>
        <h3 class="text-xl font-bold">Welcome Back</h3>
        <form @submit.prevent="handleSignIn" class="block">
          <div>
            <input type="email" v-model="email" class="w-[100%] focus:outline-none h-[5vh] border mt-5 py-3 px-1"
              placeholder="Enter Email" required>
            <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">Please enter a valid email address.</p>
          </div>

          <div>
            <input v-model="password" class="w-[100%] h-[5vh] focus:outline-none border mt-5 py-2 px-1" type="password"
              placeholder="Enter Your Password" required>
            <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">Password must be at least 8
              characters long.</p>
          </div>

          <a class="text-right mt-5 text-[#408a43] text-sm font-medium" href="#" @click.prevent="forgotPassword">Forgot
            Password?</a>
          <button type="submit" class="w-full rounded bg-[#408a43] py-1 text-lg font-semibold mt-2"
            :disabled="!isFormValid || isLoading"">
            <span v-if="!isLoading">Sign In</span>
  <span v-else>Signing In...</span>
            </button>
          <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
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
          <p class="text-sm mt-3">
            Not registered yet?
            <span class="text-[#408a43] font-medium">
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