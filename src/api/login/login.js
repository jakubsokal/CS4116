"use server"

import { createClient } from "@/utils/supabase/server"

export async function login(email, password) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    return { status: 400, error: error.message };
  }
  
  return { user: data.user, status: 200 }

}