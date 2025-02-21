<script setup lang="ts">

</script>
    <template>
        <footer class="bg-[#FFFFFF] w-full py-3 mt-10 shadow-md">
        <div class="flex flex-col px-6 lg:px-10 gap-y-6 lg:gap-y-0 md:flex-row md:justify-between  container mx-auto   ">
            <div class="space-y-2 ">
                <NuxtLink class="text-[#4CAF50] text-lg font-bold" to="/" data-testid="logo">AltDev</NuxtLink>
                <p>Elevate your technical writing</p>
                <p>Build your developer brand</p>
                <p>Share knowledge & grow</p>
                <div class="flex items-center gap-x-3 ">
                    <p class="bg-[#f8f9fa] px-2 py-1 rounded-md font-bold text-[#333333]"> x</p>
                    <p class="bg-[#f8f9fa] px-2 py-1 rounded-md font-bold text-[#3b5998]"> f</p>
                    <p class="bg-[#f8f9fa] px-2 py-1 rounded-md font-bold text-[#0e76a8]"> in</p>
                    <p class="bg-[#f8f9fa] px-2 py-1 rounded-md font-bold text-[#333333]"> gh</p>
                </div>

            </div>
            <div class="space-y-2">
                <h3>Resources</h3>
                <p>Documentation</p>
                <p>API Reference</p>
                <p>Community Guidelines</p>
                <p>Writing Guide</p>
                
            </div>
            <div class="space-y-2">
                <h3>Company</h3>
                <p>About Us</p>
                <p>Careers</p>
                <p>Contact</p>
                <p>Blog</p>
                
            </div>
            <div class="space-y-2">
                <h3>Legal</h3>
                <p>Legal</p>
                <p>Privacy Policy</p>
                <p>Cookie Policy</p>
               
                
            </div>
        </div>
    </footer>
    </template>

    <style lang="css" >
    p{
        font-size: 14px;
        color: #666666;

    }
    h3{
        font-size: 16px;
        color: #333333;
        font-weight: bold;
    }
</style>