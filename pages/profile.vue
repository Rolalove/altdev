<script setup>
import { ref, reactive } from 'vue'


const user = useSupabaseUser()
const supabase = useSupabaseClient()

const loading = ref(true)
const profile = ref(null)
const editMode = ref(false)
const editedProfile = reactive({})
const newProfile = reactive({
  username: '',
  bio:'',
  website:'',
  avatar_url:''
})

const fetchProfile = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .single()

  if (error) {
    if(error.code === 'PGRST116'){
      //no profile found 
      profile.value = null
    }else{
       console.error('Error fetching profile:', error)
    }
  } else {
    profile.value = data
    Object.assign(editedProfile, data)
  }
  loading.value = false
}

const updateProfile = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .update(editedProfile)
    .eq('id', user.value.id)

  if (error) {
    console.error('Error updating profile:', error)
  } else {
    profile.value = data
    editMode.value = false
  }
  loading.value = false
}

const createProfile = async () => {
  loading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .insert({...newProfile, id:user.value.id})
    .select()
    if (error) {
    console.error('Error updating profile:', error)
    alert('Failed to create profile. Please try again')
  } else if (data && data.length > 0) {
    profile.value = data[0]
    alert('Profile created successfully!')
    }else {
    console.error('No data returned after insert')
    alert('An unexpected error occurred. Please try again.')
   
  }
  loading.value = false
}

// Fetch profile when component mounts
fetchProfile()
</script>




<template>
  <div>
    <h1 class="text-center font-bold text-xl mt-5">AltDelver Profile</h1>
    <div v-if="loading">Loading...</div>
    <div class=' bg-white w-6/12 h-3/6 mt-5 mx-auto text-center shadow-2xl px-6 py-6' v-else-if="profile">
      <img :src="profile.avatar_url" alt="Avatar" />
      <div class="flex justify-center gap-3 items-center ">
      <label class="text-xl font-bold">Username: </label>
      <h2 class="text-lg font-medium italic"> {{ profile.username }}</h2>
      </div>
      <div class="flex justify-center gap-3 mt-5 items-center ">
      <label class="text-xl font-bold">Bio: </label>
      <h2 class="text-lg font-medium italic"> {{ profile.bio }}</h2>
      </div>
      <div class="flex justify-center gap-3 mt-5 items-center ">
      <label class="text-xl font-bold">Website: </label>
      <p class="text-lg font-medium italic"> <a :href="profile.website">{{ profile.website }}</a></p>
      </div>
      <button class="w-full rounded bg-[#058C42] text-[#EFEFEF] py-1  text-lg font-semibold mt-5 " @click="editMode = !editMode">
        {{ editMode ? 'Cancel' : 'Edit Profile' }}
      </button>
      
      <form class=' bg-white w-6/12 h-3/6 mt-5 mx-auto text-center shadow-2xl px-6 py-6' v-if="editMode" @submit.prevent="updateProfile">
        <div class="flex justify-center gap-3 items-center">
          <label class="text-base font-bold items-left">Username: </label>
          <input v-model="editedProfile.username" placeholder="Username" />
        </div>
        <div class="flex justify-center gap-3 items-center">
          <label class="text-base font-bold items-left">Bio:</label>
          <input v-model="editedProfile.bio" placeholder="Bio" />
        </div>
        <div class="flex justify-center gap-3 items-center">
          <label class="text-base font-bold">Website</label>
          <input v-model="editedProfile.website" placeholder="Website" />
        </div>
        <div class="flex justify-center gap-3 items-center">
          <label class="text-base font-bold">Avatar URL</label>
          <input v-model="editedProfile.avatar_url" placeholder="Avatar URL" />
        </div>
        <button class="w-full rounded bg-[#058C42] text-[#EFEFEF] py-1  text-lg font-semibold mt-5"  type="submit">Save Changes</button>
      </form>
    </div>
    <div v-else>
      <p class="text-base mt-3 text-center font-medium">No profile found. Please create one.</p>
      <form @submit.prevent='createProfile' class=' bg-white w-6/12 h-3/6 mt-5 mx-auto text-center shadow-2xl px-6 py-6'>
        <input class="w-[100%] focus:outline-none  h-[5vh] border mt-5 py-3 px-1"  v-model='newProfile.username' placeholder='username' required/> <br>
        <input class="w-[100%] focus:outline-none  h-[5vh] border mt-5 py-3 px-1" v-model='newProfile.bio' placeholder='Bio' required/><br>
        <input class="w-[100%] focus:outline-none  h-[5vh] border mt-5 py-3 px-1" v-model='newProfile.website' placeholder='website' required/><br>
        <input class="w-[100%] focus:outline-none  h-[5vh] border mt-5 py-3 px-1"  v-model='newProfile.avatar_url' placeholder='Avatar URl' required/><br>
        <button class="w-full rounded bg-[#408a43] py-1  text-lg font-semibold mt-5 " type="submit">Create Profile</button>
      </form>
    </div>
  </div>
</template>

