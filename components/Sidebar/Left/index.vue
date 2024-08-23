<script setup>
import HomeIcon from 'vue-material-design-icons/HomeAccount.vue';
import Bookmark from 'vue-material-design-icons/BookmarkOutline.vue';
import Account from 'vue-material-design-icons/AccountOutline.vue';
import More from 'vue-material-design-icons/DotsHorizontalCircleOutline.vue';
import Bell from 'vue-material-design-icons/BellOutline.vue';
import Pen from 'vue-material-design-icons/PencilOutline.vue';
import Magnify from 'vue-material-design-icons/Magnify.vue';
import Analytics from 'vue-material-design-icons/ViewDashboardOutline.vue';
import Logout from 'vue-material-design-icons/Logout.vue';
import { useSupabaseAuth } from '@/composables/useAuth'
const { signOut } = useSupabaseAuth()

</script>
<template>
    <div class="h-screen  flex flex-col ">

        <div class="p-2 mt-2 rounded-full text-[#4CAF50] text-xl font-bold w-min" :class="defaultTransition">
            <Nuxt-link to="/userdashboard">
                <div class="w-8 h-8">
                    <div class='mr-5' >AltDev</div>
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
          <Nuxt-link to="/explore">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <Magnify />
                </template>
                <template v-slot:name>
                    Explore
                </template>
            </SidebarLeftTab>
              </Nuxt-link>
        </div>
        <div class="mt-2 space-y-3 ">
        <Nuxt-link to="/notification">
            <SidebarLeftTab active>
                <template v-slot:icon>
                    <Bell />
                </template>
                <template v-slot:name>
                    Notification
                </template>
               
            </SidebarLeftTab>
             </Nuxt-link>
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
                    <Analytics />
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
                    <Pen />
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
                    <Logout />
                </template>
                <template v-slot:name >
                    Logout
                   
                </template>
            </SidebarLeftTab>
            </button>
        </div>


    </div>

</template>

