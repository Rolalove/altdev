<script setup lang="ts">

const {defaultTransition} = useTransition()

const props = defineProps({
    active: {
    type:  Boolean,
    default: false
    }
})
const textClass = computed (() => props.active ? 'font-semibold':'font-normal' )
</script>

<template>
    <NuxtLink  to="" class="flex items-center p-3 w-min hover:bg-gray-200 rounded-full"  :class="defaultTransition">
            <div class="w-6 h-6 " >
                <slot name="icon"></slot>
            </div>
            <div class="ml-4 text-xl hidden  xl:block" :class="textClass">
                <slot name="name"></slot>
            </div>

    </NuxtLink>
</template>