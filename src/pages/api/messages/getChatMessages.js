import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { chatId } = req.query;
            const userId = req.headers['x-user-id']; 

            if (!chatId) {
                return res.status(400).json({ error: "Chat ID is required" });
            }

            if (!userId) {
                return res.status(401).json({ error: "User ID is required" });
            }

            const { data: conversation, error: convoError } = await supabase
                .from("conversations")
                .select("*")
                .eq("convo_id", chatId)
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                .single();

            if (convoError) {
                return res.status(404).json({ error: "Conversation not found or access denied" });
            }

            const { data: messages, error: messageError } = await supabase
                .from("message")
                .select("*")
                .eq("chat_id", chatId)
                .order("sent_at", { ascending: true });

            if (messageError) {
                throw messageError;
            }

            if (messages && messages.length > 0) {
                const { error: updateError } = await supabase
                    .from("message")
                    .update({ read: 1 })
                    .eq("chat_id", chatId)
                    .eq("receiver_id", userId)
                    .eq("read", 0);

                if (updateError) {
                    console.error('Error updating message read status:', updateError);
                }
            }

            return res.status(200).json({ 
                message: "Messages retrieved successfully", 
                data: messages || [] 
            });
        } catch (error) {
            return res.status(500).json({ 
                error: error.message || "Internal server error"
            });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 