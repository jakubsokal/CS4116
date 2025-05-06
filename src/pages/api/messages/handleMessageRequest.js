import { supabase } from "@/utils/supabase/client"

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const { request_id, action } = req.body;

            if (!request_id || !action) {
                return res.status(400).json({ error: "Missing required fields" });
            }

            if (action !== 'accept' && action !== 'reject') {
                return res.status(400).json({ error: "Invalid action" });
            }

            // Update message request status
            const status = action === 'accept' ? 1 : 2; // 1 = accepted, 2 = rejected
            const { data: messageRequest, error: requestError } = await supabase
                .from("message_request")
                .update({ status })
                .eq("request_id", request_id)
                .select()
                .single();

            if (requestError) {
                return res.status(500).json({ error: requestError.message });
            }

            // If rejected, delete the conversation
            if (action === 'reject') {
                const { error: deleteError } = await supabase
                    .from("conversations")
                    .update({ isClosed: 2 })
                    .or(`and(participant1_id.eq.${messageRequest.sender_id},participant2_id.eq.${messageRequest.receiver_id}),and(participant1_id.eq.${messageRequest.receiver_id},participant2_id.eq.${messageRequest.sender_id})`);

                if (deleteError) {
                    return res.status(500).json({ error: deleteError.message });
                }
            }

            return res.status(200).json({ 
                message: `Message request ${action}ed successfully`,
                data: messageRequest
            });
        } catch (error) {
            return res.status(500).json({ 
                error: error.message || "Internal server error" 
            });
        }
    }

    return res.status(400).json({ error: "Invalid request method" });
} 