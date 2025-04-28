"use server"

import { createClient } from "@/utils/supabase/server"

export async function login(email, password) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

    if(userData.status === 0) return { status: 400, error: "Your account has been suspended. Please contact support." }

  if (error) {
    return { status: 400, error: error.message };
  }
  
  return { user: data.user, status: 200 }

}