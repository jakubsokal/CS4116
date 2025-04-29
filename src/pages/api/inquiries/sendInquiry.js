import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  const { sender_id, receiver_id, service_id } = req.body

  if (!sender_id || !receiver_id || !service_id) {
    return res.status(400).json({ error: "Missing required fields." })
  }

  const { data, error } = await supabase
    .from("inquiries")
    .insert([
      {
        sender_id,
        receiver_id, 
        service_id,
        created_at: new Date().toISOString(),
        status: 0,
      },
    ])
    .select()
    .single()
    
  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({ message: "Inquiry created", inquiry: data })
}
