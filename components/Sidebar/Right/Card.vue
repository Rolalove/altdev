<script setup lang="ts">
const props = defineProps({
    title:{
        type: String,
        required: true

    }
})
const {defaultTransition} = useTransition()
</script>



<template>
    <div class="m-2 border rounded-2xl bg-gray-50 overflow-hidden">
       <h1 class="p-3 text-xl font-bold text-gray-900 border-b">
        {{ props.title }}
       </h1>
       <slot></slot>
       <div class="p-3 text-sm text-blue-400 cursor-pointer hover:bg-gray-100" :class="defaultTransition">
        Show more

       </div>
    </div>
</template>