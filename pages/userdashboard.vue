<template>
    <div class='min-h-full'>
        <div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-8xl lg:px-8 lg:gap-5">
            <!--leftsidebar-->
            <div class="hidden md:block xs-col-span-1 xl:col-span-2">
                <div class="sticky top-0">
                    <SidebarLeft />
                </div>
            </div>
            <!--maincontent-->
            <main class="col-span-12 px-2 md:col-span-8 xl:col-span-6 ">
              <div class="mb-3"><Home/></div>
                  <BlogPost  />

            </main>

            <!--rightsidebar-->

            <div class=" col-span-12 hidden md:block xl:col-span-4 md:col-span-3 ">
                <div class="sticky top-0">
                    <SidebarRight/>
                </div>
            </div>
        </div>
    </div>
</template>


