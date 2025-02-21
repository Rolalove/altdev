<script setup lang="ts">
const props = defineProps({
    title:{
        type: String,
        required: true

    }
})
// const {defaultTransition} = useTransition()
</script>

<!-- 
:class="defaultTransition" -->
<template>
    <div class="m-2 border rounded-2xl bg-white flow-hidden">
       <h1 class="p-3 text-lg font-bold text-gray-900 border-b">
        {{ props.title }}
       </h1>
       <slot></slot>
       <div class="p-3 text-sm text-[#4CAF50] cursor-pointer hover:bg-gray-100" >
        Show more

       </div>
    </div>
</template>