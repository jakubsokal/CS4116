import { createClient } from "@/utils/supabase/server"
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const businessId = searchParams.get('businessId')

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('business')
      .select('description, open_hour, close_hour, phone_number, profile_picture')
      .eq('business_id', businessId)
      .single()

    if (error) {
      console.error('Error checking business profile:', error)
      return NextResponse.json({ error: 'Failed to fetch business data' }, { status: 500 })
    }

    const isIncomplete = !data.description || 
                        !data.open_hour || 
                        !data.close_hour || 
                        !data.phone_number

    return NextResponse.json({ isIncomplete })
  } catch (error) {
    console.error('Error checking business profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 