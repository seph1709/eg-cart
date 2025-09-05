import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  return { data, error };
}
