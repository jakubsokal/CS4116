import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { chatId } = req.query;
            const userId = req.headers['x-user-id']; // Get user ID from headers
            console.log('Received request for chat ID:', chatId);
            console.log('User ID:', userId);

            if (!chatId) {
                console.log('No chat ID provided');
                return res.status(400).json({ error: "Chat ID is required" });
            }

            if (!userId) {
                console.log('No user ID provided');
                return res.status(401).json({ error: "User ID is required" });
            }

            // First verify the conversation exists and user has access
            const { data: conversation, error: convoError } = await supabase
                .from("conversations")
                .select("*")
                .eq("convo_id", chatId)
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                .single();

            if (convoError) {
                console.error('Error fetching conversation:', convoError);
                return res.status(404).json({ error: "Conversation not found or access denied" });
            }

            console.log('Found conversation:', conversation);

            // Then fetch the messages
            const { data: messages, error: messageError } = await supabase
                .from("message")
                .select("*")
                .eq("chat_id", chatId)
                .order("sent_at", { ascending: true });

            if (messageError) {
                console.error('Error fetching messages:', messageError);
                throw messageError;
            }

            console.log('Found messages:', messages);

            // Update messages as read
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
            console.error("Error in getChatMessages:", error);
            return res.status(500).json({ 
                error: error.message || "Internal server error",
                details: error
            });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 