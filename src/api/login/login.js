"use server"

import { createClient } from "@/utils/supabase/server"

export async function login(email, password) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })

  if(data.user !== null){
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', data.user.email)
      .single()

    if (userError) {
      return { status: 400, error: userError.message }
    }

    if(userData.status === 1){
      return { status: 400, error: "This account is banned" }
    }
  }

  if (error) {
    return { status: 400, error: error.message };
  }
  
  return { user: data.user, status: 200 }

}