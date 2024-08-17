<script setup lang='ts'>
import { useSupabaseAuth } from '@/composables/useAuth'

const { signUp, signInWithOAuth } = useSupabaseAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

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
                        <input v-model="email" class="w-[100%] h-[5vh] focus:outline-none border mt-5 py-3 px-1"
                            type="email" placeholder="Enter Email" required>
                        <p v-if="email && !isEmailValid" class="text-red-500 text-sm mt-1">Please enter a valid email
                            address.</p>
                    </div>

                    <div>
                        <input v-model="password" class="w-[100%] h-[5vh] focus:outline-none border mt-5 py-2 px-1"
                            type="password" placeholder="Enter Your Password" required>
                        <p v-if="password && !isPasswordValid" class="text-red-500 text-sm mt-1">Password must be at
                            least 8 characters long.</p>
                    </div>

                    <div>
                        <input v-model="confirmPassword"
                            class="w-[100%] h-[5vh] focus:outline-none border mt-5 py-2 px-1" type="password"
                            placeholder="Confirm Password" required>
                        <p v-if="confirmPassword && !doPasswordsMatch" class="text-red-500 text-sm mt-1">Passwords do
                            not match.</p>
                    </div>

                    <button type="submit" class="w-full rounded bg-[#408a43] py-1 text-lg font-semibold mt-5"
                        :disabled="!isFormValid">Sign Up</button>
                    <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
                </form>
                <div class="container ">
                    <p class="title text-center mt-3 max-md:text-[10px]">or continue with me</p>
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
                    <p class="text-sm mt-3">Already have an account? <span class="text-[#408a43] font-medium">
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