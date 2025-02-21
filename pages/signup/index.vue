<script setup lang='ts'>
import { useSupabaseAuthClient, navigateTo } from '#imports'
import { ref, computed } from 'vue'
import { mdiEyeOutline } from '@mdi/js'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiEyeOffOutline } from '@mdi/js'
import { useAuthStore } from '~/stores/auth' // Import auth store

const authStore = useAuthStore() // Initialize auth store
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)

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

    isLoading.value = true
    try {
        await authStore.signUp(email.value, password.value)
        if (authStore.error) {
            errorMessage.value = authStore.error
        }
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isLoading.value = false
    }
}

const signUpWithGoogle = async () => {
    try {
        await authStore.signInWithGoogle()
    } catch (error) {
        errorMessage.value = error.message
    }
}

const signUpWithGitHub = async () => {
    try {
        await authStore.signInWithGithub()
    } catch (error) {
        errorMessage.value = error.message
    }
}
</script>

<template>
     <div class="flex px-4 lg:px-0 justify-center items-center min-h-screen bg-gradient-to-br from-white to-green-50">
        <div class="w-full lg:max-w-3xl md:max-w-xl bg-white rounded-3xl shadow-lg gap-x-6  flex min-h-[500px]">
            <div class="w-full px-4 lg:w-1/2 lg:pl-10 py-4 lg:px-0">
                <div class="max-w-md mx-auto w-full">
                    <NuxtLink class="text-[#4CAF50] text-2xl font-bold " to="/" data-testid="logo">AltDev</NuxtLink>
                    <h3 class="text-3xl font-bold text-[#111111] mt-3">Become an <span>Altdevers</span>!</h3>
                    <p class="text-[#666666] text-base">Create your account to start exploring. </p>
                    <form @submit.prevent="handleSignUp" class="block">
                        <div>
                            <input 
                                v-model="email" 
                                class="w-[100%] h-10 rounded-md bg-[#f8f9fa] text- focus:outline-none border-[#e0e0e0] text-[#666666] border mt-5 py-3 px-3"
                                type="email" 
                                placeholder="Enter Your Email" 
                                required
                            >
                            <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">
                                Please enter a valid email address.
                            </p>
                        </div>

                        <div class="relative w-full">
                            <input 
                                v-model="password" 
                                :type="showPassword ? 'text' : 'password'"
                                class="bg-[#f8f9fa] border-[#e0e0e0] text-[#666666] w-full h-10 py-2 focus:outline-none rounded-md border mt-5 pl-4"
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
                        <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">
                            Password must be at least 8 characters long.
                        </p>

                        <div class="relative w-full">
                            <input 
                                v-model="confirmPassword" 
                                :type="showConfirmPassword ? 'text' : 'password'"
                                class="bg-[#f8f9fa] border-[#e0e0e0] text-[#666666] w-full h-10 py-2 focus:outline-none rounded-md border mt-5 pl-4"
                                placeholder="Confirm Password" 
                                required
                            >
                            <button 
                                type="button" 
                                class="absolute border-none inset-y-10 right-2 flex items-center"
                                @click="togglePasswordVisibility('confirmPassword')"
                            >   
                                <SvgIcon v-if="!showConfirmPassword" size="24" type="mdi" :path="mdiEyeOutline" />
                                <SvgIcon v-else size="24" type="mdi" :path="mdiEyeOffOutline" />
                            </button>
                        </div>
                        <p v-if="confirmPassword && !doPasswordsMatch" class="text-red-500 text-sm mt-1">
                            Passwords do not match.
                        </p>

                        <button 
                            type="submit" 
                            class="w-full h-10 rounded-md text-white bg-[#4CAF50] py-1 text-base font-bold mt-2"
                            :disabled="!isFormValid || isLoading || authStore.loading"
                        >
                            <span v-if="!isLoading && !authStore.loading">Sign Up</span>
                            <span v-else>Signing Up...</span>
                        </button>
                        <p v-if="errorMessage || authStore.error" class="text-red-500 mt-2">
                            {{ errorMessage || authStore.error }}
                        </p>
                    </form>

                    <div class="container">
                        <p class="title text-center mt-3 max-md:text-[10px]">or continue with </p>
                    </div>

                    <section class="flex justify-between gap-x-6 mt-3">
                        <div class="w-full rounded-md flex items-center justify-center border-[#e0e0e0] border py-2 text-sm font-semibold">
                            <img src="/public/logos_google-icon.svg" alt="Google logo" />
                            <button 
                                @click="signUpWithGoogle" 
                                class="ml-2"
                                :disabled="authStore.loading"
                            >
                                Google
                            </button>
                        </div>
                        <div class="w-full rounded-md flex items-center justify-center border-[#e0e0e0] border py-2 text-sm font-semibold">
                            <img src="/icon-park_github.svg" alt="Github logo" />
                            <button 
                                @click="signUpWithGitHub" 
                                class="ml-2"
                                :disabled="authStore.loading"
                            >
                                Github
                            </button>
                        </div>
                    </section>

                    <div>
                        <p class="text-sm text-center mt-6">
                            Already have an account? 
                            <span class="text-[#4CAF50] font-medium">
                                <NuxtLink to="/login">Sign In</NuxtLink>
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