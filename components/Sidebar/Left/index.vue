<script setup>
import HomeIcon from 'vue-material-design-icons/HomeAccount.vue';
import Bookmark from 'vue-material-design-icons/BookmarkOutline.vue';
import Account from 'vue-material-design-icons/AccountOutline.vue';
import More from 'vue-material-design-icons/DotsHorizontalCircleOutline.vue';
import Bell from 'vue-material-design-icons/BellOutline.vue';
const { defaultTransition } = useTransition()
// const props = defineProps({
//     user:{
//         type: Object,
//         required: true
//     }
// })
import { useSupabaseAuth } from '@/composables/useAuth'
const { signOut } = useSupabaseAuth()

</script>
<template>
    <div class="h-screen  flex flex-col ">

        <div class="p-2 my-2 rounded-full hover:bg-emerald-300 w-min" :class="defaultTransition">
            <Nuxt-link to="/">
                <div class="w-8 h-8">
                    <div>AltDev</div>
                </div>
            </Nuxt-link>
        </div>
        <div class="mt-2 space-y-3 ">
            <Nuxt-link to="/userdashboard">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <HomeIcon />
                </template>
                <template v-slot:name>
                    Home
                </template>
            </SidebarLeftTab>
        </Nuxt-link>
        </div>

        <div class="mt-2 space-y-3 ">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <Bookmark />
                </template>
                <template v-slot:name>
                    Bookmarks
                </template>
            </SidebarLeftTab>
        </div>
        <div class="mt-2 space-y-3 ">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <Bell />
                </template>
                <template v-slot:name>
                    Notification
                </template>
            </SidebarLeftTab>
        </div>

        
        <div class="mt-2 space-y-3">
      <NuxtLink to="/profilecreate">
        <SidebarLeftTab active  >
          <template v-slot:icon>
            <Account />
          </template>
          <template v-slot:name>
            Profile
          </template>
        </SidebarLeftTab>
      </NuxtLink>
    </div>
        <div class="mt-2 space-y-3 ">
             <NuxtLink to="/analytic">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <More />
                </template>
                <template v-slot:name>
                    Analytics
                </template>
            </SidebarLeftTab>
        </NuxtLink>
        </div>
        <div class="mt-2 space-y-3 ">
            <NuxtLink to='/new'>
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <More />
                </template>
                <template v-slot:name>
                    Write
                </template>
            </SidebarLeftTab>
        </NuxtLink>
        </div>
        <div class="mt-2 space-y-3 ">
            <button  @click="signOut">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <More />
                </template>
                <template v-slot:name >
                    Logout
                   
                </template>
            </SidebarLeftTab>
            </button>
        </div>



        <div classs="flex flex row items-center justify-center px-2 py-2 mx-auto mt-auto mb-5 rounded-full cursor-pointer w-14 xl:w-full hover:bg-gray-100 "
            :class="defaultTransition">
            <div class="flex flex-row">
                <img  class="w-10 h-10 rounded-full"  alt="userprofilepicture">

            </div>
        </div>


    </div>

</template>

// const {defaultTransition } = UseTailwindConfig()