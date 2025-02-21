<script lang="ts">
</script>
<template>
    <section class="hidden lg:block lg:bg-gray-800  lg:rounded-md  lg:w-[41%] ">
        <div class="flex gap-x-2 mb-4 bg-gray-900  w-full px-4 py-2 h-fit rounded-md">
            <div class="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
            <div class="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
            <div class="h-3 w-3 rounded-full bg-[#27c93f]"></div>
        </div>
        <div class="text-xs px-4 mb-4">
            <p class="text-[#abb2bf]">function writeArticle () <span class="ml-6">{</span> </p><br/>
        <p class="text-[#abb2bf]"> <span class="text-[#e5c07b]"> const</span> topic = <span class="#98c379">'Building Better Documentation'</span></p><br/>
        <p class="text-[#abb2bf]">  <span class="text-[#e5c07b]" >const</span> audience = <span class="#98c379"> 'Developers'</span></p><br/>
        <p class="text-[#c678dd]">  return <span class="text-[#abb2bf]">impact(topic, audience)</span></p><br/>
        <p class="text-[#abb2bf] mb-2">}</p>
        <p class="text-[#c678dd] mb-2">// Level up your dev cred by sharing your knowledge</p>
        <p class="text-[#abb2bf] mb-2">writeArticle()</p>
        <p class="text-[#61afef]">> Success! Your article reached 10,000 developers</p>
        </div>
        

    </section>
</template>
<style lang="css" scoped>
p{
    font-family: "Source Code Pro", serif;
}
</style>