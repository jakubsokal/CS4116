'use server'

import { createClient } from "@/utils/supabase/server"

export async function register(userData) {
  try {
    const supabase = await createClient()
    
    // First create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          is_business: userData.isBusiness,
          business_name: userData.isBusiness ? userData.businessName : null
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (authError) {
      return { status: 400, error: authError.message }
    }

    // Then insert into users table
    const { data: insertedUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          first_name: userData.isBusiness ? userData.businessName : userData.firstName,
          last_name: userData.isBusiness ? '' : userData.lastName,
          email: userData.email,
          permission: userData.isBusiness ? 2 : 1, // 2 for business, 1 for customer
          status: userData.isBusiness ? 0 : 1, // 0 for pending business, 1 for active customer
          uuid: authData.user.id,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (userError) {
      // If user insert fails, we should clean up the auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { status: 400, error: userError.message }
    }

    // If it's a business account, insert into business table
    if (userData.isBusiness) {
      const { error: businessError } = await supabase
        .from('business')
        .insert([
          {
            business_name: userData.businessName,
            location: userData.location,
            user_id: insertedUser.user_id,
            created_at: new Date().toISOString()
          }
        ])

      if (businessError) {
        // If business insert fails, clean up both auth and user records
        await supabase.auth.admin.deleteUser(authData.user.id)
        await supabase.from('users').delete().eq('user_id', insertedUser.user_id)
        return { status: 400, error: businessError.message }
      }
    }

    return { status: 200, data: authData.user }
  } catch (error) {
    return { status: 500, error: error.message }
  }
} 