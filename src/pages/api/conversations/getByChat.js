// /pages/api/messages/sendMessage.js
import { supabase } from "@/utils/supabase/client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message_text, sender_id, receiver_id, chat_id, sent_at, read } = req.body;

  if (!message_text || !sender_id || !chat_id || !sent_at) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        message_text,
        sender_id,
        receiver_id,
        chat_id,
        sent_at,
        read: read ?? 0,
      },
    ])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  return res.status(200).json(data);
}
