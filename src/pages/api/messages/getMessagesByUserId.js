import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const { userId } = req.query

            const { data: convo, error: convoError } = await supabase
                .from("conversations")
                .select(`
                    convo_id,
                    participant1_id,
                    participant2_id,
                    inquiry_id,
                    isClosed,
                    users1:participant1_id (first_name, last_name),
                    users2:participant2_id (first_name, last_name)
                `)
                .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
                .is('isClosed', null)

            if (convoError) {
                console.error("Error fetching conversations:", convoError);
                return res.status(500).json({ error: convoError.message });
            }

            const messages = await Promise.all(
                convo.map(async (conversation) => {
                    const { data: messageData, error: messageError } = await supabase
                        .from("message")
                        .select("message_text, read")
                        .eq("chat_id", conversation.convo_id)
                        .eq("receiver_id", userId)
                        .eq("read", 0)
                        .order("sent_at", { ascending: false });

                    if (messageError) {
                        console.error("Error fetching messages:", messageError);
                        return { convoId: conversation.convo_id, messages: [] };
                    }

                    return { convoId: conversation.convo_id, messages: messageData || [] };
                })
            );

            console.log("Messages:", messages);
            const convoDetails = convo.map((conversation) => {
                const isParticipant1 = parseInt(conversation.participant1_id) === parseInt(userId);
                
                const otherParticipantId = isParticipant1 
                    ? conversation.participant2_id 
                    : conversation.participant1_id;
                
                const otherParticipantName = isParticipant1
                    ? `${conversation.users2?.first_name || ''} ${conversation.users2?.last_name || ''}`.trim()
                    : `${conversation.users1?.first_name || ''} ${conversation.users1?.last_name || ''}`.trim();
                        
                const convoMessages = messages.find(message => message.convoId === conversation.convo_id)?.messages || [];
                const unreadCount = convoMessages.filter(message => message.read === 0).length;
                
                return { 
                    convo_id: conversation.convo_id,
                    inquiry_id: conversation?.inquiry_id,
                    unreadMessages: unreadCount,  
                    participantId: otherParticipantId,
                    participantName: otherParticipantName
                };
            });

            console.log("Convo Details:", convoDetails);
            return res.status(200).json({ message: "Successful Search", data: convoDetails })
        } catch (error) {
            console.error("Error in getMessagesByUserId:", error);
            return res.status(500).json({ error: error.message })
        }
    }

    return res.status(400).json({ error: "Invalid request" })
}