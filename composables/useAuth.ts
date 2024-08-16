import { useSupabaseUser, useSupabaseClient } from "#imports";

export const useAuth = () => {
  const user = useSupabaseUser();
  const supabase = useSupabaseClient();

  const getUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  };

  const signUp = async (email: string, password: string) => {
    console.log("Attempting to sign up with:", email);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    console.log("Sign-up successful, navigating to dashboard");

    return data;
  };

  const signIn = async (email: string, password: string) => {
    console.log("signIn function called in useAuth");
    try {
      console.log("Attempting to sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("Sign in response:", data, error);
      if (error) throw error;
      console.log("Sign in successful, navigating to callback");
      await navigateTo("/userdashboard");
      return data;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    await navigateTo("/");
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/userdashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signInWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/userdashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signUpWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/userdashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signUpWithGithub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/userdashboard`,
      },
    });
    if (error) throw error;
    return data;
  };

  const forgotPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  return {
    getUser,
    signUp,
    signIn,
    signOut,
    signInWithGoogle,
    signInWithGithub,
    forgotPassword,
    signUpWithGoogle,
    signUpWithGithub,

  };
};
