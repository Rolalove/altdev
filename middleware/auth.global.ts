export default defineNuxtRouteMiddleware(async (to, from) => {
    const supabase = useSupabaseClient();
    const accessCode = to.query.code;

    if (accessCode) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(
          accessCode as string
        );
  
        if (error) {
          console.error("Error verifying access token:", error.message);
          return navigateTo("/error");
        }
  
        return navigateTo("/confirm");
      } catch (error) {
        console.error("Unexpected error:", (error as Error).message);
        return navigateTo("/error");
      }
    }
})


