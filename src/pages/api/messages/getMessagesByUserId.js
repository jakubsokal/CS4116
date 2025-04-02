import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query

            const { data: convo } = await supabase
                .from("conversations")
                .select("*")
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)

            const messages = await Promise.all(
                convo.map(async (conversation) => {
                    const { data: messageData } = await supabase
                        .from("message")
                        .select("message_text, read")
                        .eq("chat_id", conversation.convo_id)
                        .eq("receiver_id", userId)
                        .order("sent_at", { ascending: false });
                    return { convoId: conversation.convo_id, messages: messageData || [] };
                })
            );

            const convoDetails = convo.map((conversation) => {
                const participantId =
                    conversation.participant1_id !== userId
                        ? conversation.participant2_id
                        : conversation.participant1_id;
                        
                const convoMessages = messages.find(message => message.convoId === conversation.convo_id)?.messages || [];
                const unreadCount = convoMessages.filter(message => message.read === 0).length;
                return { 
                    convoId: conversation.convo_id,
                    unreadMessages: unreadCount,  
                    participantId 
                };
            });
            
            

            return res.status(200).json({ message: "Successful Search", data: convoDetails })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: "Invalid request" })
}