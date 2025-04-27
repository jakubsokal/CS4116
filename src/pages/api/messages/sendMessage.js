import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { message_text, sender_id, receiver_id, chat_id, isReview } = req.body;

            if (!message_text || !sender_id || !receiver_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const { data: conversation, error: convoError } = await supabase
                .from("conversations")
                .select("inquiry_id")
                .eq("convo_id", chat_id)
                .single();

            if (convoError) {
                return res.status(500).json({ error: convoError.message });
            }

            if (!conversation.inquiry_id) {
                const { data: messageRequest, error: requestError } = await supabase
                    .from("message_request")
                    .select("*")
                    .or(`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`)
                    .single();

                if (messageRequest && messageRequest.status !== 1) {
                    return res.status(403).json({ 
                        error: "Cannot send messages until the conversation is accepted" 
                    });
                }
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
                .insert([
                    {
                        message_id: nextMessageId,
                        sender_id: sender_id,
                        receiver_id: receiver_id,
                        message_text: message_text,
                        sent_at: new Date().toISOString(),
                        chat_id: chat_id,
                        read: 0,
                        isDeleted: 0,
                        isReview: isReview || 0
                    }
                ])
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