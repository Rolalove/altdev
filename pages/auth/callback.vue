<script setup lang="ts">
const user = useSupabaseUser()
const route = useRoute()

watchEffect(() => {
  if (user.value) {
    navigateTo('/dashboard')
  }
})
</script>

<template>
  <div>
    <p>Processing authentication...</p>
  </div>
</template>