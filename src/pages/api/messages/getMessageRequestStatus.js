import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { chatId, userId } = req.query;

            if (!chatId || !userId) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            // Get the conversation to find the participants
            const { data: conversation, error: convoError } = await supabase
                .from("conversations")
                .select("*")
                .eq("convo_id", chatId)
                .single();

            if (convoError) {
                return res.status(500).json({ error: convoError.message });
            }

            // Get the message request
            const { data: messageRequest, error: requestError } = await supabase
                .from("message_request")
                .select("*")
                .or(`and(sender_id.eq.${conversation.participant1_id},receiver_id.eq.${conversation.participant2_id}),and(sender_id.eq.${conversation.participant2_id},receiver_id.eq.${conversation.participant1_id})`)
                .single();

            if (requestError && requestError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                return res.status(500).json({ error: requestError.message });
            }

            // Determine if the current user is the receiver of the message request
            const isReceiver = messageRequest ? 
                (messageRequest.receiver_id === parseInt(userId)) : 
                false;

            return res.status(200).json({ 
                status: messageRequest ? messageRequest.status : null,
                isReceiver: isReceiver,
                request_id: messageRequest ? messageRequest.request_id : null
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 