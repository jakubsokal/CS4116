// /pages/api/conversations/createConversation.js
import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sender_id, receiver_id ,inquiry_id} = req.body;

  if (!sender_id || !receiver_id) {
    return res.status(400).json({ error: "Missing sender or receiver" });
  }

  try {
    // Check if convo already exists (optional)
    const { data: existing } = await supabase
      .from("conversations")
      .select("*")
      .or(`participant1_id.eq.${sender_id},participant2_id.eq.${receiver_id}`)
      .maybeSingle();

    if (existing) {
      return res.status(200).json({ convo_id: existing.convo_id });
    }

    // Create new convo
    const { data: convo, error: convoError } = await supabase
      .from("conversations")
      .insert([
        {
          participant1_id: sender_id,
          participant2_id: receiver_id,
          inquiry_id: inquiry_id,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (convoError) throw convoError;

    // Insert default message from business
    await supabase.from("message").insert([
      {
        sender_id: sender_id,
        receiver_id: receiver_id,
        message_text: "Your inquiry has been accepted. Do you have any questions?",
        sent_at: new Date().toISOString(),
        chat_id: convo.convo_id,
        read: 0,
      },
    ]);

    return res.status(200).json({ convo_id: convo.convo_id });
  } catch (err) {
    console.error("Conversation error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
