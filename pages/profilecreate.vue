<script setup lang='ts'>
import { useSupabaseUser, useSupabaseClient } from '#imports'
import { ref } from 'vue'

const user = useSupabaseUser()
const supabase = useSupabaseClient()
const profile = ref({})
const editedProfile = ref({})
const isUploading = ref(false)
const isUpdating = ref(false)
const isLoading = ref(true)
const defaultAvatarUrl = '/path/to/default/avatar.png'

const fetchProfile = async () => {
  isLoading.value = true
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.value.id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
  } else {
    profile.value = data || {}
    editedProfile.value = { ...data } || {}
  }
  isLoading.value = false
}

const updateProfile = async () => {
  isUpdating.value = true
  const { data, error } = await supabase
    .from('profiles')
    .update(editedProfile.value)
    .eq('id', user.value.id)

  if (error) {
    console.error('Error updating profile:', error)
    alert('Failed to update profile. Please try again.')
  } else {
    profile.value = data
    alert('Profile updated successfully!')
  }
  isUpdating.value = false
}

const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  isUploading.value = true

  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `${user.value.id}/${fileName}`

  let { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading avatar:', uploadError)
    alert('Failed to upload avatar. Please try again.')
    isUploading.value = false
    return
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

  editedProfile.value.avatar_url = data.publicUrl
  await updateProfile()

  isUploading.value = false
}

const profileCompletionPercentage = computed(() => {
  const fields = ['username', 'bio', 'website', 'avatar_url', 'twitter', 'linkedin', 'github',]
  const filledFields = fields.filter(field => editedProfile.value[field])
  return Math.round((filledFields.length / fields.length) * 100)
})

fetchProfile()
</script>

<template>
  <div class="profile-container">
    <div v-if="isLoading">Loading profile...</div>
    <div v-else class="profile-card">
      <div class="avatar-container">
        <img :src="profile?.avatar_url || defaultAvatarUrl" alt="Avatar" class="avatar-preview" loading='lazy' />
        <input type="file" @change="uploadAvatar" accept="image/*" :disabled="isUploading" id="avatar-upload"
          class="hidden" />
        <label for="avatar-upload" class="avatar-upload-label">
          {{ isUploading ? 'Uploading...' : 'Change Avatar' }}
        </label>
      </div>

      <form @submit.prevent="updateProfile" class="profile-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input id="username" v-model="editedProfile.username" required />
        </div>

        <div class="form-group">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="editedProfile.bio"></textarea>
        </div>

        <div class="form-group">
          <label for="website">Website</label>
          <input id="website" v-model="editedProfile.website" type="url" />
        </div>

        <div class="social-links">
          <input v-model="editedProfile.twitter" placeholder="Twitter URL" />
          <input v-model="editedProfile.linkedin" placeholder="LinkedIn URL" />
          <input v-model="editedProfile.github" placeholder="GitHub URL" />
        </div>

        <button type="submit" :disabled="isUpdating">
          {{ isUpdating ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>

      <div class="profile-completion">
        Profile Completion: {{ profileCompletionPercentage }}%
      </div>
    </div>
  </div>
</template>



<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.profile-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  position: relative;
  padding: 20px;
  padding-top: 100px;
  margin-top: 75px;
}

.avatar-container {
  position: absolute;
  top: -75px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.avatar-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 5px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar-upload-label {
  display: inline-block;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.hidden {
  display: none;
}

.profile-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.social-links input {
  margin-bottom: 10px;
}

.privacy-settings {
  margin-top: 15px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.profile-completion {
  margin-top: 20px;
  font-weight: bold;
  text-align: center;
}
</style>