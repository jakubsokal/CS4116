import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { sender_id, receiver_id } = req.body;

            if (!sender_id || !receiver_id) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Check if user is trying to send a message request to themselves
            if (sender_id === receiver_id) {
                return res.status(400).json({ error: "You cannot send a message request to yourself" });
            }

            // Check if a conversation already exists between these users
            const { data: existingConvo, error: convoError } = await supabase
                .from("conversations")
                .select("*")
                .or(`and(participant1_id.eq.${sender_id},participant2_id.eq.${receiver_id}),and(participant1_id.eq.${receiver_id},participant2_id.eq.${sender_id})`)
                .single();

            if (convoError && convoError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                return res.status(500).json({ error: convoError.message });
            }

            // If conversation exists, return it
            if (existingConvo) {
                return res.status(200).json({ 
                    message: "Conversation already exists",
                    data: existingConvo
                });
            }

            // Create new conversation
            const { data: conversation, error: conversationError } = await supabase
                .from("conversations")
                .insert({
                    participant1_id: sender_id,
                    participant2_id: receiver_id,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (conversationError) {
                return res.status(500).json({ error: conversationError.message });
            }

            // Create message request
            const { data: messageRequest, error: requestError } = await supabase
                .from("message_request")
                .insert({
                    sender_id: sender_id,
                    receiver_id: receiver_id,
                    status: 0, // 0 = pending
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (requestError) {
                return res.status(500).json({ error: requestError.message });
            }

            return res.status(200).json({ 
                message: "Message request sent successfully",
                data: {
                    conversation,
                    messageRequest
                }
            });
        } catch (error) {
            return res.status(500).json({ 
                error: error.message || "Internal server error" 
            });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 