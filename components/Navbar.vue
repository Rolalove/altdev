<template>
    <div>
        <nav
            class="flex justify-between  px-10 py-4  rounded-full w-[95%] mx-auto mt-3 border-black font-bold items-center">
            <div>
                <NuxtLink class="text-[#408a43] text-2xl" to="/">AltDev</NuxtLink>
            </div>
            <div class="flex justify-between gap-7 text-lg">
                <NuxtLink to="/ourstory">Our Story</NuxtLink>
                <NuxtLink to="/">Features</NuxtLink>
                <NuxtLink to="/">Trending</NuxtLink>
                <NuxtLink to="/new">Write</NuxtLink>
            </div>
            <div class="flex justify-between gap-5 items-center text-lg">
                <NuxtLink to="/login">Sign In</NuxtLink>
                <NuxtLink class="border px-5 py-2 rounded-full bg-[#408a43] " to="/login/signup">Get Started</NuxtLink>
            </div>

        </nav>
    </div>
</template>