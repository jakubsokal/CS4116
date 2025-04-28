"use server"

import { createClient } from "@/utils/supabase/server"

export async function register(userData) {
  try {
    const supabase = await createClient()

    const { data: existingUser } = await supabase
      .from('users')
      .select('user_id')
      .eq('email', userData.email.trim())

    if (existingUser.length > 0) {
      return { status: 400, error: "An account with this email already exists." }
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.isBusiness ? userData.businessName : userData.firstName,
          last_name: userData.isBusiness ? '' : userData.lastName,
          is_business: userData.isBusiness,
          business_name: userData.isBusiness ? userData.businessName : null
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (authError) {
      return { status: 400, error: authError.message }
    }

    let imageUrl = null;

    try {
      if (userData.profilePicture) {
        const file = userData.profilePicture;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `business-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('business-images')
          .upload(filePath, file);

        if (uploadError) throw new Error(`Error uploading: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from('business-images')
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      } else imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
    } catch (error) {
      console.error("Error uploading image:", error)
      return { status: 400, error: error.message }
    }

    const { data: insertedUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          first_name: userData.isBusiness ? userData.businessName : userData.firstName,
          last_name: userData.isBusiness ? '' : userData.lastName,
          email: userData.email,
          permission: userData.isBusiness ? 1 : 0,
          status: userData.isBusiness ? 0 : 1,
          profile_picture: imageUrl || null,
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single()

    if (userError) {
      return { status: 400, error: userError.message }
    }


    if (userData.isBusiness) {
      const { error: businessError } = await supabase
        .from('business')
        .insert([
          {
            business_name: userData.businessName,
            location: userData.location,
            user_id: insertedUser.user_id,
            profile_picture: imageUrl,
            phone_number: userData.phoneNumber,
            close_hour: userData.closeHour,
            open_hour: userData.openHour,
            created_at: new Date().toISOString()
          }
        ])

      if (businessError) {
        await supabase.from('users').delete().eq('id', insertedUser.id)
        return { status: 400, error: businessError.message }
      }
    }

    return { status: 200, data: authData.user }
  } catch (error) {
    return { status: 500, error: error.message }
  }
} 