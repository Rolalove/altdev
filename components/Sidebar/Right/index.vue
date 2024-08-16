<script setup lang="ts">
const whathappeningitems = ref([
    {
        title: 'React vs Vuejs',
        count: '18.5kview'
    },
    {
        title: 'Opensource',
        count: '18.5kview'
    },
    {
        title: 'Queue Data Structure',
        count: '18.5kview'
    },


])


const whotofollowitems = ref([
    {
        name: "kofoworola Shonuyi",
        handle: "@rola",
        image: "/IMG_13434.jpg",
    },
    {
        name: "kofoworola Shonuyi",
        handle: "@rola",
        image: "/IMG_13434.jpg"
    },
    {
        name: "kofoworola Shonuyi",
        handle: "@rola",
        image: "/IMG_13434.jpg"
    },


])

</script>
<template>
    <div class="flex flex-col">
        <!--Previewcard: what happening -->
        <SidebarRightCard title=" Trending Topics">

            <SidebarRightItem v-for="whathappening in whathappeningitems" :key="whathappening.title">
                <div>
                    <h2 class="font-bold text-gray-800 text-md "> {{ whathappening.title }} </h2>
                    <p class="text-sx text-gray-400">{{ whathappening.count }}</p>
                </div>

            </SidebarRightItem>

        </SidebarRightCard>
        <!--Previewcard: who to follow  -->
        <SidebarRightCard title="who to follow " >
            <SidebarRightItem v-for="whotofollow in whotofollowitems " :key="whotofollow.name ">
                <div class="flex flex-row justify-between items-center p-2">
                    <div class="flex flex-row">
                        <img class="w-10 h-10 rounded-full" :src="whotofollow.image" alt="Whotofollow.name">
                        <div class="flex flex-col ml-2">
                            <h1 class="text-sm font-bold text-gray-900">{{whotofollow.name }}</h1>
                            <p class="text-xs text-gray-400">{{whotofollow.handle }}</p>
                            
                        </div>
                    </div>
                    <div class="flex  h-full ">
                                <button  class="px-4 py-2 font-bold text-xs text-white bg-black rounded-full">Follow</button>
                            </div>
                </div>

            </SidebarRightItem>
    </SidebarRightCard>

    </div>
</template>