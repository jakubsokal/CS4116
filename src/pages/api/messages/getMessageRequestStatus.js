import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { chatId, userId } = req.query;

            if (!chatId || !userId) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            const { data: conversation, error: convoError } = await supabase
                .from("conversations")
                .select("*")
                .eq("convo_id", chatId)
                .single();

            if (convoError) {
                return res.status(500).json({ error: convoError.message });
            }

            if (conversation.inquiry_id) {
                return res.status(200).json({ 
                    status: 1, // 1 = accepted
                    isReceiver: false,
                    request_id: null
                });
            }

            const { data: messageRequest, error: requestError } = await supabase
                .from("message_request")
                .select("*")
                .eq('convo_id', chatId)
                .single();

            if (requestError && requestError.code === 'PGRST116') { 
                console.error("No message request found:", requestError);
                return res.status(400).json({ error: requestError.message });
            }

            if (requestError) {
                return res.status(500).json({ error: requestError.message });
            }

            const isReceiver = messageRequest ? 
                (messageRequest.receiver_id === parseInt(userId)) : 
                false;

            return res.status(200).json({ 
                receiver_id: conversation.participant1_id === parseInt(userId) ? conversation.participant2_id : conversation.participant1_id,
                status: messageRequest ? messageRequest.status : 1,
                isReceiver: isReceiver,
                request_id: messageRequest ? messageRequest.request_id : null
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 