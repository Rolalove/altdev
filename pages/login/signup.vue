<script setup lang='ts'>
import { useSupabaseAuth } from '@/composables/useAuth'
import {ref, computed} from 'vue'

const { signUp, signInWithOAuth } = useSupabaseAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const togglePasswordVisibility = (field: 'password' | 'confirmPassword') => {
    if (field === 'password') {
        showPassword.value = !showPassword.value
    } else {
        showConfirmPassword.value = !showConfirmPassword.value
    }
}

const isEmailValid = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email.value)
})

const isPasswordValid = computed(() => {
    return password.value.length >= 8
})

const doPasswordsMatch = computed(() => {
    return password.value === confirmPassword.value
})

const isFormValid = computed(() => {
    return isEmailValid.value && isPasswordValid.value && doPasswordsMatch.value
})

const handleSignUp = async () => {
    if (!isFormValid.value) {
        errorMessage.value = 'Please correct the form errors before submitting.'
        return
    }

    try {
        await signUp(email.value, password.value)
    } catch (error) {
        errorMessage.value = error.message
    }
}

const signInWithGoogle = () => signInWithOAuth('google')
const signInWithGithub = () => signInWithOAuth('github')
</script>

<template>
    <div class="flex w-[100%] h-[80vh] px-10 mt-5 max-lg:flex-col max-lg:flex">
        <div class="w-[55%] max-md:w-[100%] max-lg:mx-auto max-lg:my-auto ">
            <div class=" h-fit bg-white  mx-auto text-center shadow-2xl px-6 py-6 ">
                <h3 class="text-3xl font-bold py-2 ">Become an <span>Altdevers</span>!</h3>
                <h3 class="text-lg font-bold ">Create your account to start exploring. </h3>
                <form @submit.prevent="handleSignUp" class="block">
                    <div>
                        <input v-model="email" class="w-[100%] h-[5vh] focus:outline-none border mt-5  py-3 px-1"
                            type="email" placeholder="Enter Email" required>
                        <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">Please enter a valid email
                            address.</p>
                    </div>

                    <div class="relative">
                        <input v-model="password" :type="showPassword ? 'text' : 'password'"
                            class="w-[100%] h-[5vh] focus:outline-none border mt-5 pr-10 py-3 px-1"
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


                        <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">Password must be at
                            least 8 characters long.</p>
                    </div>

                    <div class="relative">
                        <input v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                            class="w-[100%] h-[5vh] focus:outline-none border pr-10 mt-5 py-3 px-1"
                            placeholder="Confirm Password" required>
                        <button type="button" class="absolute right-3 mt-2.5 top-1/2 transform -translate-y-1/2"
                            @click="togglePasswordVisibility('confirmPassword')">
                            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="24"
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
                        <p v-if="confirmPassword && !doPasswordsMatch" class="text-red-500 text-sm mt-1">Passwords do
                            not match.</p>
                    </div>

                    <button type="submit" class="w-full rounded bg-[#4CAF50] py-1 text-white text-lg font-semibold mt-5"
                        :disabled="!isFormValid">Sign Up</button>
                    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
                </form>
                <div class="container ">
                    <p class="title text-center mt-3 max-md:text-[10px]">or continue with </p>
                </div>
                <div class="w-full flex items-center justify-center rounded border py-2 mt-3 text-sm font-semibold">
                    <img src="/public/logos_google-icon.svg" alt="Github logo" />
                    <button @click="signInWithGoogle" class="ml-2">
                        Sign Up with Google
                    </button>
                </div>
                <div class="w-full flex items-center justify-center rounded border mt-3 text-sm py-2 font-semibold">
                    <img src="/public/icon-park_github.svg" alt="Github logo" />
                    <button @click="signInWithGithub" class="ml-2">
                        Sign up with Github
                    </button>
                </div>
                <div>
                    <p class="text-sm mt-3">Already have an account? <span class="text-[#4CAF50] font-medium">
                            <NuxtLink to="/login">Sign In</NuxtLink>
                        </span></p>
                </div>
            </div>

        </div>
        <div class="w-[45%] my-auto px-10  max-md:hidden">
            <Motivation />
        </div>
    </div>


</template>

<style scoped>
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