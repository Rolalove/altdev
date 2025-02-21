export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  
  // List of public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/auth/callback']
  
  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login')
  }
  
  if (user.value && (to.path === '/login' || to.path === '/signup')) {
    return navigateTo('/userdashboard')
  }
})


// export default defineNuxtRouteMiddleware(async (to, from) => {
  
//     const supabase = useSupabaseClient();
//     const accessCode = to.query.code;

//     if (accessCode) {
//       try {
//         const { error } = await supabase.auth.exchangeCodeForSession(
//           accessCode as string
//         );
  
//         if (error) {
//           console.error("Error verifying access token:", error.message);
//           return navigateTo("/error");
//         }
  
//         return navigateTo("/confirm");
//       } catch (error) {
//         console.error("Unexpected error:", (error as Error).message);
//         return navigateTo("/error");
//       }
//     }
// })


