import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { message_text, sender_id, receiver_id, chat_id, isReview } = req.body;

            if (!message_text || !sender_id || !receiver_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Check if the conversation has been accepted
            const { data: messageRequest, error: requestError } = await supabase
                .from("message_request")
                .select("*")
                .or(`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
                .single();

            // If there's a message request and it's not accepted, prevent sending
            if (messageRequest && messageRequest.status !== 1) {
                return res.status(403).json({ 
                    error: "Cannot send messages until the conversation is accepted" 
                });
            }

            const { data: maxIdResult, error: maxIdError } = await supabase
                .from("message")
                .select("message_id")
                .order("message_id", { ascending: false })
                .limit(1)
                .single();

            if (maxIdError) {
                return res.status(500).json({ error: maxIdError.message });
            }

            const nextMessageId = (maxIdResult?.message_id || 0) + 1;

            const { data: message, error: messageError } = await supabase
                .from("message")
                .insert({
                    message_id: nextMessageId,
                    message_text,
                    sender_id,
                    receiver_id,
                    chat_id,
                    sent_at: new Date().toISOString(),
                    read: 0,
                    isReview: isReview
                })
                .select()
                .single();

            if (messageError) {
                return res.status(500).json({ error: messageError.message });
            }

            return res.status(200).json({ 
                message: "Message sent successfully", 
                data: message 
            });
        } catch (error) {
            return res.status(500).json({ 
                error: error.message || "Internal server error" 
            });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 