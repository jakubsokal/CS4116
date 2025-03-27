import { createClient } from "@/utils/supabase/server"
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { businessId, description, open_hour, close_hour, phone_number } = await request.json()

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID is required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { error: updateError } = await supabase
      .from('business')
      .update({
        description,
        open_hour,
        close_hour,
        phone_number
      })
      .eq('business_id', businessId)

    if (updateError) {
      console.error('Error updating business profile:', updateError)
      return NextResponse.json({ error: 'Failed to update business profile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating business profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 