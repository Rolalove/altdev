<script setup lang="ts">
const {defaultTransition} = useTransition()
</script>
<template>
    <div class="p-3 cursor-pointer hover:bg-gray-100 border-b " :class="defaultTransition">
        <slot></slot>
    </div>
</template>