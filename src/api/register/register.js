"use server"

import { createClient } from "@/utils/supabase/server"

export async function register(userData) {
  const supabase = await createClient()
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        is_business: userData.isBusiness,
        business_name: userData.isBusiness ? userData.businessName : null
      }
    }
  })

  if (authError) {
    return { status: 400, error: authError.message }
  }

  const { data: insertedUser, error: userError } = await supabase
    .from('users')
    .insert([
      {
        first_name: userData.isBusiness ? userData.businessName : userData.firstName,
        last_name: userData.isBusiness ? '' : userData.lastName,
        email: userData.email,
        permission: userData.isBusiness ? 2 : 1, 
        status: userData.isBusiness ? 0 : 1, 
        uuid: authData.user.id
      }
    ])
    .select()
    .single()

  if (userError) {
    return { status: 400, error: userError.message }
  }

  if (userData.isBusiness) {
    const userId = insertedUser.user_id

    const { error: businessError } = await supabase
      .from('business')
      .insert([
        {
          business_name: userData.businessName,
          location: userData.location,
          user_id: userId 
        }
      ])

    if (businessError) {
      return { status: 400, error: businessError.message }
    }
  }

  return { status: 200, data: authData.user }
} 